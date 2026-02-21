import os
from flask import Flask
from flask_cors import CORS
from api.config import flask_key, jwt_key, access_expire, refresh_expire, jwt, bcrypt, revoked_col

def api():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = flask_key
    app.config["JWT_SECRET_KEY"] = jwt_key
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = access_expire
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = refresh_expire
    CORS(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    @jwt.token_in_blocklist_loader
    def token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        token = revoked_col.find_one({"jti": jti})
        return token is not None
    
    revoked_col.create_index("expires_at", expireAfterSeconds=0)
    
    from .endpoints import endpoints

    app.register_blueprint(endpoints, url_prefix="/")

    return app