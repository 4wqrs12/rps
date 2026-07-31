import api

app = api.api()

if __name__ == "__main__":
    api.socketio.run(app, host="0.0.0.0", debug=True)
