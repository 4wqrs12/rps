from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from api.config import user_col, bcrypt, revoked_col
from datetime import datetime

endpoints = Blueprint("endpoints", __name__)

@endpoints.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username", "")
    password = data.get("password", "")

    if not username or not password:
        return jsonify({"success": False, "message": "Please enter both username and password", "data": data})

    doc = user_col.find_one({"username": username})

    if not doc:
        return jsonify({"success": False, "message": "User does not exist", "data": data})
    if bcrypt.check_password_hash(doc["password"], password):
        access_token = create_access_token(identity=username)
        refresh_token = create_refresh_token(identity=username)
        return jsonify({"success": True, "message": "Logged in", "data": {"accessToken": access_token, "refreshToken": refresh_token}})
    else:
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

    return jsonify({"success": True, "message": "Account creatd", "data": {"accessToken": access_token, "refreshToken": refresh_token}})

@endpoints.route("/api/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)

    return jsonify({"success": True, "message": "New token created", "data": {"accessToken": new_access_token}})

@endpoints.route("/api/logout", methods=["POST"])
@jwt_required()
def logout():
    token = get_jwt()
    jti = token["jti"]
    exp = token["exp"]

    revoked_col.insert_one({"jti": jti, "expires_at": datetime.fromtimestamp(exp)})

    return jsonify({"success": True, "message": "Access token revoked", "data": token})

@endpoints.route("/api/logout-refresh", methods=["POST"])
@jwt_required(refresh=True)
def logout_refresh():
    token = get_jwt()
    jti = token["jti"]
    exp = token["exp"]

    revoked_col.insert_one({"jti": jti, "expires_at": datetime.fromtimestamp(exp)})

    return jsonify({"success": True, "message": "Refresh token revoked", "data": token})