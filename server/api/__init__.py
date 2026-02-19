import os
from flask import Flask
from flask_cors import CORS
from api.config import flask_key, jwt_key, create_jwt, access_expire, refresh_expire

def api():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = flask_key
    app.config["JWT_SECRET_KEY"] = jwt_key
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = access_expire
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = refresh_expire
    CORS(app)
    create_jwt(app)
    from .endpoints import endpoints

    app.register_blueprint(endpoints, url_prefix="/")

    return app