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
from register import register_face

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

@server.app.route("/register")
def register():
    return render_template("register.html", active="register")

@server.app.route("/register_person", methods=["POST"])
def register_person():
    if request.method == "POST":
        uploaded_file = request.files['image']
        person_name = request.form.get("person_name")
        frame = cv2.imdecode(np.fromstring(uploaded_file.read(), np.uint8), cv2.IMREAD_COLOR)
        register_face(frame,person_name)
        return render_template("register.html", msg="Face registered successfully..",active="register")
    return render_template("register.html", msg="", active="register")

@server.app.route("/report")
def report():
    # r.set("loop","stop")
    mongo.mycol = mongo.mydb["persons"]
    result_dict = {}
    _d = datetime.datetime.now()
    dt_string = str(_d.year)+"-"+str(_d.month)+"-"+str(_d.day)
    f_date = datetime.datetime.strptime(dt_string+" 00:00:00", '%Y-%m-%d %H:%M:%S')
    t_date = datetime.datetime.strptime(dt_string + " 23:59:59", '%Y-%m-%d %H:%M:%S')
    print(f_date,t_date)
    _data = mongo.find_all()
    for _d in _data:
        name = _d.get("name", "").lower()
        if name not in result_dict:
            result_dict[name] = {"status": 0, "date": "", "in_time": "", "out_time": ""}

    mongo.mycol = mongo.mydb["result"]
    data = mongo.find_record_between_date(f_date, t_date)

    for i in data:
        _name = i.get("name", "").lower()
        if _name in result_dict:
            try:
                _d = i.get("emp_in_time").date()
                date = str(_d.day) + "-" + str(_d.month) + "-" + str(_d.year)
                print(date)
            except:
                date = ""
            try:
                in_t = i.get("emp_in_time").time()
                in_time = str(in_t.hour) + ":" + str(in_t.minute) + ":" + str(in_t.second)
                print(in_time)
            except:
                in_time = ""

            try:
                out_t = i.get("emp_out_time").time()
                out_time = str(out_t.hour) + ":" + str(out_t.minute) + ":" + str(out_t.second)
                print(out_time)
            except:
                out_time = ""

            result_dict[_name] = {"status": 1,
                                  "date": date,
                                  "in_time": in_time,
                                  "out_time": out_time
                                  }

    # reformat
    result_data = []
    for _dct in result_dict.keys():
        result_data.append(
            {"name": _dct.capitalize(), "value": result_dict[_dct]["status"], "date": result_dict[_dct]["date"],
             "in_time": result_dict[_dct]["in_time"], "out_time": result_dict[_dct]["out_time"]})


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


@server.socketio.on('skt_show_detail_result_by_date')
def skt_show_detail_result_by_date(msg):
    try:
        val_data = []
        print("---->",msg)
        mongo.mycol = mongo.mydb["persons"]
        f_date = datetime.datetime.strptime(msg["fromdate"]+" 00:00:00", '%Y-%m-%d %H:%M:%S')
        t_date = datetime.datetime.strptime(msg["fromdate"]+" 23:59:59", '%Y-%m-%d %H:%M:%S')
        print(f_date,t_date)
        result_dict = {}
        _data = mongo.find_all()
        for _d in _data:
            name = _d.get("name", "").lower()
            if name not in result_dict:
                result_dict[name] = {"status":0,"date":"","in_time":"","out_time":""}

        mongo.mycol = mongo.mydb["result"]
        data = mongo.find_record_between_date(f_date, t_date)

        for i in data:
            _name = i.get("name", "").lower()
            if _name in result_dict:
                try:
                    _d = i.get("emp_in_time").date()
                    date = str(_d.day) + "-" + str(_d.month) + "-" + str(_d.year)
                    print(date)
                except:
                    date = ""
                try:
                    in_t = i.get("emp_in_time").time()
                    in_time = str(in_t.hour)+":"+str(in_t.minute)+":"+str(in_t.second)
                    print(in_time)
                except:
                    in_time=""

                try:
                    out_t = i.get("emp_out_time").time()
                    out_time = str(out_t.hour) + ":" + str(out_t.minute) + ":" + str(out_t.second)
                    print(out_time)
                except:
                    out_time =""


                result_dict[_name] = {"status":1,
                                      "date":date,
                                      "in_time":in_time,
                                      "out_time":out_time
                                      }


        # reformat
        result_data = []
        for _dct in result_dict.keys():
            result_data.append({"name": _dct.capitalize(), "value": result_dict[_dct]["status"],"date":result_dict[_dct]["date"],"in_time":result_dict[_dct]["in_time"],"out_time":result_dict[_dct]["out_time"]})

        server.socketio.emit('skt_show_detail_result_by_date_response',
                      {'result': result_data}, broadcast=True)

        print(result_data)
    except Exception as e:
        print(e)


if __name__ == "__main__":
    # webbrowser.open_new_tab('http://127.0.0.1:5000')
    server.start()
