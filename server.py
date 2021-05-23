import eventlet
eventlet.monkey_patch()
from flask import Flask,request,render_template,redirect,url_for,Response,session
from flask_socketio import SocketIO, emit
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager,UserMixin,login_user,login_required,logout_user
from engineio.payload import Payload
Payload.max_decode_packets = 50

import json
import logging
import config_db

class Server():
    def __init__(self, __name__):
        self.app = Flask(__name__)
        self.app.config.from_object(config_db)
        self.socketio = SocketIO(self.app, async_mode="eventlet",async_handlers=True, cookie=None)
        # self.db = SQLAlchemy(self.app)
        # self.login_manager = LoginManager()
        # self.login_manager.init_app(self.app)
        # self.login_manager.login_view = "/login"
        with open('server.json',"r") as f:
              config = json.load(f)

        self.server_config = config["server"]
        self.mongodb_confg = config["mongodb"]

    def start(self):
        # self.app.threaded = True
        print("[INFO] Server started at : http://",self.server_config["host"]+":"+str(self.server_config["port"]))
        self.socketio.run(self.app, host=self.server_config["host"], port=self.server_config["port"],use_reloader=False, debug=self.server_config["debug"])


server = Server(__name__)
print("[INFO] Sever initialized")
