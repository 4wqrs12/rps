import os
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from datetime import timedelta

jwt = JWTManager()
bcrypt = Bcrypt()

jwt_key = os.getenv("JWT_KEY")
flask_key = os.getenv("FLASK_KEY")
access_expire = timedelta(minutes=15)
refresh_expire = timedelta(days=7)
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["rps"]
user_col = db["users"]
revoked_col = db["revoked"]