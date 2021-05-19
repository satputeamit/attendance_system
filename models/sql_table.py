print("in sql_table class")
from server import *
from flask_login import UserMixin

class User(server.db.Model, UserMixin):
    __tablename__ = 'User'
    id = server.db.Column(server.db.Integer, primary_key=True,autoincrement=True)
    username = server.db.Column(server.db.String(80), unique=True, nullable=False)
    password = server.db.Column(server.db.String(50),nullable=False)
    email = server.db.Column(server.db.String(100),unique=True,nullable=False)
    designation = server.db.Column(server.db.String(100),nullable=False)
