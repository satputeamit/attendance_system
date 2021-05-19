from server import *
from flask import Flask,request,render_template,redirect,url_for,Response,session

import requests,json
import os
import cv2
import json
from bson import json_util
import numpy as np
import time
import datetime
import shutil
import webbrowser
import base64
from db_operations.mongo_operation import MyMongoDatabase

mongo = MyMongoDatabase()

var_feature_dict = {}
checks_seats=[]
cur_variant=""


def get_date_obj(date,time="00:00:00"):
    dt = date +" "+time
    dt_obj = datetime.datetime.strptime(dt,'%d-%m-%Y %H:%M:%S')
    return dt_obj


@server.app.after_request
def add_header(req):
    '''
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    '''
    print("IN after_request")
    req.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    req.headers["Pragma"] = "no-cache"
    req.headers["Expires"] = "0"
    req.headers['Cache-Control'] = 'public, max-age=0'
    return req


@server.app.route("/")
def welcome_screen():
    return render_template("inspect.html", home="active")


@server.app.route("/help")
def help():
    # r.set("loop","stop")
    return render_template("home.html", active="help")


@server.app.route("/report_graph")
def report_graph():
    if session['role']=="admin" or session['role']=="superadmin":
        return render_template("report_graph.html", active="report_graph")
    return render_template('permission.html')


@server.socketio.on('skt_img_request')
def skt_infer_result(data):
    try:
        server.socketio.emit('skt_show_infer_result', {"image":data["img"]}, broadcast=True)
    except Exception as e:
        pass

if __name__ == "__main__":
    webbrowser.open_new_tab('http://127.0.0.1:5000')
    server.start()
