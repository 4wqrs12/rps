import os
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from datetime import timedelta

load_dotenv()

jwt = JWTManager()
bcrypt = Bcrypt()

jwt_key = os.getenv("JWT_KEY")
flask_key = os.getenv("FLASK_KEY")
mongo_uri = os.getenv("MONGO_URI")
frontend_url = os.getenv("FRONTEND_URL")

access_expire = timedelta(minutes=1)
refresh_expire = timedelta(days=7)
client = MongoClient(mongo_uri)
db = client["rps"]
user_col = db["users"]
revoked_col = db["revoked"]
rooms_col = db["rooms"]