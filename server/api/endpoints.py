import random
from bson import ObjectId
from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
)
from flask_socketio import emit, join_room

from api import socketio
from api.config import bcrypt, revoked_col, rooms_col, user_col
from utils.game_funcs import determine_winner, evaluate_round, get_game_result

endpoints = Blueprint("endpoints", __name__)
player_score = 0
bot_score = 0


def _build_room_payload(room):
    players = room.get("players", [])
    return {
        "players": players,
        "roomId": str(room.get("_id")),
        "roundsPlayed": room.get("rounds_played", 0),
        "scores": room.get("scores", {}),
        "status": room.get("status", "waiting"),
    }


def _get_or_create_room(current_user):
    room = rooms_col.find_one({"players": current_user})
    if room is not None and isinstance(room.get("players"), list):
        return room

    available_room = rooms_col.find_one({
        "$and": [
            {"players": {"$size": 1}},
            {"players": {"$ne": current_user}},
        ]
    })
    if available_room:
        rooms_col.update_one(
            {"_id": available_room["_id"]},
            {"$push": {"players": current_user}},
        )
        return rooms_col.find_one({"_id": available_room["_id"]})

    room_id = rooms_col.insert_one({
        "players": [current_user],
        "createdAt": datetime.now(),
        "scores": {},
        "rounds_played": 0,
        "status": "waiting",
        "choices": {},
    }).inserted_id
    return rooms_col.find_one({"_id": room_id})


def _ensure_room_scores(room):
    scores = room.get("scores", {}) or {}
    for player in room.get("players", []):
        scores.setdefault(player, 0)
    room["scores"] = scores
    return room


@endpoints.route("/api/test", methods=["GET"])
def test():
    return "<h1>API is working</h1>"


@endpoints.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username", "")
    password = data.get("password", "")

    if not username or not password:
        return jsonify({
            "success": False,
            "message": "Please enter both username and password",
            "data": data,
        })

    doc = user_col.find_one({"username": username})

    if not doc:
        return jsonify({"success": False, "message": "User does not exist", "data": data})
    if bcrypt.check_password_hash(doc["password"], password):
        access_token = create_access_token(identity=username)
        refresh_token = create_refresh_token(identity=username)
        res = jsonify({"success": True, "message": "Logged in"})
        set_access_cookies(res, access_token)
        set_refresh_cookies(res, refresh_token)
        return res
    return jsonify({"success": False, "message": "Incorrect password", "data": data})


@endpoints.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username", "")
    password = data.get("password", "")

    if not username or not password:
        return jsonify({"success": False, "message": "Enter username and password", "data": data})
    if user_col.find_one({"username": username}):
        return jsonify({"success": False, "message": "User already exists", "data": data})

    hashed_pass = bcrypt.generate_password_hash(password).decode("UTF-8")
    user_col.insert_one({"username": username, "password": hashed_pass, "createdAt": datetime.now()})

    access_token = create_access_token(identity=username)
    refresh_token = create_refresh_token(identity=username)
    res = jsonify({"success": True, "message": "Account created"})

    set_access_cookies(res, access_token)
    set_refresh_cookies(res, refresh_token)

    return res


@endpoints.route("/api/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    res = jsonify({"success": True, "message": "New token created"})
    set_access_cookies(res, new_access_token)
    return res


@endpoints.route("/api/logout", methods=["POST"])
@jwt_required(refresh=True)
def logout():
    token = get_jwt()
    jti = token["jti"]
    exp = token["exp"]

    revoked_col.insert_one({"jti": jti, "expires_at": datetime.fromtimestamp(exp)})
    res = jsonify({"success": True, "message": "Access token revoked"})
    unset_jwt_cookies(res)
    return res


@endpoints.route("/api/get-identity", methods=["POST"])
@jwt_required()
def get_id():
    return jsonify({"success": True, "message": "User found", "data": get_jwt_identity()})


@endpoints.route("/api/bot-match", methods=["POST"])
def bot_match():
    global player_score, bot_score
    data = request.get_json()
    player = data.get("playerChoice", "")
    if not player:
        return jsonify({"success": False, "message": "Please choose an item", "data": data})
    bot_choice = random.choice(["Rock", "Paper", "Scissor"])
    if determine_winner(player, bot_choice):
        player_score += 1
        if player_score == 3:
            player_score = 0
            return jsonify({"success": True, "message": "Thats Game!", "data": {"winner": "Player", "score": 3, "final": True}})
        return jsonify({"success": True, "message": "Winner found", "data": {"winner": "Player", "score": player_score}})

    bot_score += 1
    if bot_score == 3:
        bot_score = 0
        return jsonify({"success": True, "message": "Thats Game!", "data": {"winner": "Bot", "score": 3, "final": True}})
    return jsonify({"success": True, "message": "Winner found", "data": {"winner": "Bot", "score": bot_score}})


@endpoints.route("/api/ready-player", methods=["POST"])
@jwt_required()
def ready_player():
    current_user = get_jwt_identity()
    room = _get_or_create_room(current_user)
    room = _ensure_room_scores(room)
    rooms_col.update_one(
        {"_id": room["_id"]},
        {"$set": {"scores": room["scores"], "rounds_played": room.get("rounds_played", 0), "status": room.get("status", "waiting")}},
    )
    return jsonify({"success": True, "message": "Player ready", "data": _build_room_payload(room)})


@socketio.on("join-room")
def handle_join_room(data):
    room_id = data.get("roomId")
    username = data.get("username")
    if not room_id or not username:
        return

    join_room(room_id)
    emit("joined-room", {"roomId": room_id, "username": username}, to=request.sid)


@socketio.on("player-ready")
def handle_player_ready(data):
    room_id = data.get("roomId")
    username = data.get("username")
    choice = data.get("choice")

    if not room_id or not username or not choice:
        return

    try:
        room_obj_id = ObjectId(room_id)
    except Exception:
        emit("game-error", {"message": "Invalid room id"}, to=request.sid)
        return

    room = rooms_col.find_one({"_id": room_obj_id})
    if not room:
        emit("game-error", {"message": "Room not found"}, to=request.sid)
        return

    if username not in room.get("players", []):
        emit("game-error", {"message": "You are not part of this room"}, to=request.sid)
        return

    room = _ensure_room_scores(room)
    room_choices = room.get("choices", {}) or {}
    room_choices[username] = choice
    room["choices"] = room_choices

    rooms_col.update_one(
        {"_id": room["_id"]},
        {"$set": {"choices": room["choices"], "scores": room["scores"], "status": room.get("status", "waiting")}},
    )

    opponent = next((player for player in room.get("players", []) if player != username), None)
    if opponent:
        emit(
            "opponent-ready",
            {"message": f"{username} is ready", "username": username},
            room=room_id,
            skip_sid=request.sid,
        )

    if len(room_choices) < len(room.get("players", [])):
        emit("ready-confirmed", {"message": "Your move is locked in", "username": username}, to=request.sid)
        return

    player_names = room.get("players", [])
    round_result = evaluate_round(room_choices.get(player_names[0]), room_choices.get(player_names[1]))
    scores = room.get("scores", {}) or {}

    if not round_result.get("is_tie"):
        winner_name = player_names[0] if round_result.get("winner") == "player1" else player_names[1]
        scores[winner_name] = scores.get(winner_name, 0) + 1
        room["rounds_played"] = room.get("rounds_played", 0) + 1
    room["scores"] = scores
    room["choices"] = {}

    rooms_col.update_one(
        {"_id": room["_id"]},
        {"$set": {"choices": {}, "scores": room["scores"], "rounds_played": room.get("rounds_played", 0), "status": room.get("status", "waiting")}},
    )

    final_result = None
    final_result_message = None
    winner_name = None
    if room.get("rounds_played", 0) >= 3:
        score_summary = {"player1": scores.get(player_names[0], 0), "player2": scores.get(player_names[1], 0)}
        final_result = get_game_result(score_summary, player_names=player_names)
        final_result_message = final_result.get("message")
        winner_name = player_names[0] if final_result.get("winner") == "player1" else player_names[1] if final_result.get("winner") == "player2" else None
        room["status"] = "finished"
        rooms_col.update_one({"_id": room["_id"]}, {"$set": {"status": "finished"}})
        rooms_col.delete_one({"_id": room["_id"]})

    payload = {
        "roundResult": round_result,
        "scores": room.get("scores", {}),
        "roundsPlayed": room.get("rounds_played", 0),
        "gameOver": room.get("status") == "finished",
        "message": round_result.get("message"),
        "yourResult": None,
        "finalResult": None,
        "players": player_names,
    }

    if final_result:
        payload["finalResult"] = {
            **final_result,
            "message": final_result_message,
            "winnerName": winner_name,
        }
        payload["yourResult"] = final_result_message

    emit("round-result", payload, room=room_id)
    emit("ready-confirmed", {"message": "Round complete", "username": username}, to=request.sid)
    