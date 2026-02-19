import os
from flask import Flask
from flask_cors import CORS
from api.config import flask_key, jwt_key, create_jwt

def api():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = flask_key
    app.config["JWT_SECRET_KEY"] = jwt_key
    CORS(app)
    create_jwt(app)
    from .endpoints import endpoints

    app.register_blueprint(endpoints, url_prefix="/")

    return app