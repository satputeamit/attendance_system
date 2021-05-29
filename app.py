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

mongo = MyMongoDatabase("server.json")

var_feature_dict = {}
checks_seats = []
cur_variant = ""


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
def streamer():
    return render_template("streamer.html", home="active")


@server.app.route("/help")
def help():
    # r.set("loop","stop")
    return render_template("home.html", active="help")


@server.app.route("/report")
def report():
    # r.set("loop","stop")
    mongo.mycol = mongo.mydb["persons"]
    result_dict = {}
    _data = mongo.find_all()
    for _d in _data:
        name = _d.get("name", "").lower()
        if name not in result_dict:
            result_dict[name] = 0

    mongo.mycol = mongo.mydb["result"]
    data = mongo.find_all()

    for i in data:
        _name = i.get("name", "").lower()
        if _name in result_dict:
            result_dict[_name] = 1

    # reformat
    result_data = []
    for _dct in result_dict.keys():
        result_data.append({"name":_dct,"value":result_dict[_dct]})
    print(result_data)
    return render_template("report.html", result=result_data, active="report")


@server.socketio.on('skt_img_request_cam_in')
def skt_infer_result_1(data):
    try:
        server.socketio.emit('skt_show_infer_result_1', {"image":data["img"]}, broadcast=True)
    except Exception as e:
        pass


@server.socketio.on('skt_img_request_cam_out')
def skt_infer_result_2(data):
    try:
        server.socketio.emit('skt_show_infer_result_2', {"image":data["img"]}, broadcast=True)
    except Exception as e:
        pass


if __name__ == "__main__":
    # webbrowser.open_new_tab('http://127.0.0.1:5000')
    server.start()
