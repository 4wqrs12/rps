from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.config import user_col, bcrypt

endpoints = Blueprint("endpoints", __name__)

