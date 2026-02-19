import os
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from datetime import datetime

def create_jwt(flask_app):
    jwt = JWTManager(flask_app)
    return jwt

load_dotenv()

bcrypt = Bcrypt()
jwt_key = os.getenv("JWT_KEY")
flask_key = os.getenv("FLASK_KEY")
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["rps"]
user_col = db["users"]