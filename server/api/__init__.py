import os
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from api.config import flask_key, jwt_key, access_expire, refresh_expire, jwt, bcrypt, revoked_col, frontend_url


def api():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = flask_key
    app.config["JWT_SECRET_KEY"] = jwt_key
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = access_expire
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = refresh_expire
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_COOKIE_SECURE"] = False
    app.config["JWT_COOKIE_SAMESITE"] = "Lax"
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False

    allowed_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
    if frontend_url:
        allowed_origins.append(frontend_url)

    CORS(app, supports_credentials=True, origins=allowed_origins)
    jwt.init_app(app)
    bcrypt.init_app(app)

    @jwt.token_in_blocklist_loader
    def token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        token = revoked_col.find_one({"jti": jti})
        return token is not None

    revoked_col.create_index("expires_at", expireAfterSeconds=0)

    global socketio
    socketio = SocketIO(
        app,
        cors_allowed_origins=allowed_origins,
        async_mode="threading",
        manage_session=False,
    )

    from .endpoints import endpoints

    app.register_blueprint(endpoints, url_prefix="/")

    return app


socketio = None