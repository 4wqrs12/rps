from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.config import user_col, bcrypt, datetime

endpoints = Blueprint("endpoints", __name__)

#decrypt passwords before checking login info
@endpoints.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username", "")
    password = data.get("password", "")
    if not username or not password:
        return jsonify({"success": False, "message": "Enter both username and password", "data": [username, password]})
    if not user_col.find_one({"username": username, "password": password}):
        return jsonify({"success": False, "message": "Incorrect username or password", "data": [username, password]})
    access_token = create_access_token(identity=username)
    return jsonify({"success": True, "message": "Logged in", "data": {"accessToken": access_token}})

@endpoints.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username", "")
    password = data.get("password", "")
    if not username or not password:
        return jsonify({"success": False, "message": "Enter username and password", "data": [username, password]})
    if user_col.find_one({"username": username}):
        return jsonify({"success": False, "message": "User already exists", "data": [username, password]})
    hashed_pass = bcrypt.generate_password_hash(password).decode("UTF-8")
    user_col.insert_one({"username": username, "password": hashed_pass, "createdAt": datetime.now()})
    access_token = create_access_token(identity=username)
    return jsonify({"success": True, "message": "Account creatd", "data": {"accessToken": access_token}})