from utils.game_funcs import determine_winner
import random
from datetime import datetime
from api.config import user_col, bcrypt, revoked_col, rooms_col
from flask import Blueprint, jsonify, request
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_required,
                                get_jwt_identity,
                                get_jwt, set_access_cookies,
                                set_refresh_cookies, unset_jwt_cookies)

endpoints = Blueprint("endpoints", __name__)
player_score = 0
bot_score = 0


@endpoints.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username", "")
    password = data.get("password", "")

    if not username or not password:
        return jsonify({"success": False,
                        "message": "Please enter both username and password",
                        "data": data})

    doc = user_col.find_one({"username": username})

    if not doc:
        return jsonify({"success": False, "message": "User does not exist",
                        "data": data})
    if bcrypt.check_password_hash(doc["password"], password):
        access_token = create_access_token(identity=username)
        refresh_token = create_refresh_token(identity=username)
        res = jsonify({"success": True, "message": "Logged in"})
        set_access_cookies(res, access_token)
        set_refresh_cookies(res, refresh_token)
        return res
    else:
        return jsonify({"success": False, "message": "Incorrect password",
                        "data": data})


@endpoints.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username", "")
    password = data.get("password", "")

    if not username or not password:
        return jsonify({"success": False,
                        "message": "Enter username and password",
                        "data": data})
    if user_col.find_one({"username": username}):
        return jsonify({"success": False, "message": "User already exists",
                        "data": data})

    hashed_pass = bcrypt.generate_password_hash(password).decode("UTF-8")
    user_col.insert_one(
        {"username": username, "password": hashed_pass,
         "createdAt": datetime.now()})

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

    revoked_col.insert_one(
        {"jti": jti, "expires_at": datetime.fromtimestamp(exp)})
    res = jsonify({"success": True, "message": "Access token revoked"})
    unset_jwt_cookies(res)
    return res


@endpoints.route("/api/get-identity", methods=["POST"])
@jwt_required()
def get_id():
    return jsonify({"success": True, "message": "User found",
                    "data": get_jwt_identity()})


@endpoints.route("/api/bot-match", methods=["POST"])
def bot_match():
    global player_score, bot_score
    data = request.get_json()
    player = data.get("playerChoice", "")
    if not player:
        return jsonify({"success": False, "message": "Please choose an item",
                        "data": data})
    bot_choice = random.choice(["Rock", "Paper", "Scissor"])
    if determine_winner(player, bot_choice):
        player_score += 1
        if player_score == 3:
            player_score = 0
            return jsonify({"success": True, "message": "Thats Game!",
                            "data": {"winner": "Player", "score": 3,
                                     "final": True}})
        return jsonify({"success": True, "message": "Winner found",
                        "data": {"winner": "Player", "score": player_score}})
    else:
        bot_score += 1
        if bot_score == 3:
            bot_score = 0
            return jsonify({"success": True, "message": "Thats Game!",
                            "data": {"winner": "Bot", "score": 3,
                                     "final": True}})
        return jsonify({"success": True, "message": "Winner found",
                        "data": {"winner": "Bot", "score": bot_score}})


@endpoints.route("/api/ready-player", methods=["POST"])
@jwt_required()
def ready_player():
    current_user = get_jwt_identity()
    room = rooms_col.find_one({"players": current_user})
    if room is not None and isinstance(room.get("players"), list) and len(room["players"]) == 1:
        return jsonify({"success": True,
                        "message": "Player already waiting",
                        "data": {"players": room["players"]}})
    if room is not None and isinstance(room.get("players"), list) and len(room["players"]) == 2:
        return jsonify({"success": True,
                        "message": "Player already in a full room",
                        "data": {"players": room["players"]}})
    available_room = rooms_col.find_one({
        "$and": [
            {"players": {"$size": 1}},
            {"players": {"$ne": current_user}}
        ]
    })
    if available_room:
        rooms_col.update_one({"_id": available_room["_id"]},
                             {"$push": {"players": current_user}})
        return jsonify({"success": True, "message": "Player added",
                        "data": {"players": available_room["players"] + [current_user]}})
    rooms_col.insert_one({"players": [current_user],
                          "createdAt": datetime.now()})
    return jsonify({"success": True, "message": "Player ready",
                    "data": {"players": [current_user]}})
    