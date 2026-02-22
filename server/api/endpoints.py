from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt, set_access_cookies, set_refresh_cookies, unset_jwt_cookies
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
        res = jsonify({"success": True, "message": "Logged in"})
        set_access_cookies(res, access_token)
        set_refresh_cookies(res, refresh_token)
        return res    
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

@endpoints.route("/api/get-identity", methods=["GET"])
@jwt_required()
def get_id():
    user = get_jwt_identity()
    return jsonify({"success": True, "message": "Id found", "data": user})