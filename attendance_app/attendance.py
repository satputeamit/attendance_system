import cv2
import numpy as np
import face_recognition as fr
import os
from datetime import datetime
import pandas as pd
from base64 import b64encode,b64decode
# from ClientApi import Client
import json
from engineio.payload import Payload
import sys
import time
import redis
import pickle


# appending a path
sys.path.append('..')
from db_operations.mongo_operation import MyMongoDatabase


Payload.max_decode_packets = 50
rds = redis.Redis(host='localhost', port=6379, db=0)
# path = "/home/amit/vision_project/attendance/attendance_app/images"
# images =[]
# classNames =[]
# print(os.listdir())
# myList = os.listdir(path)

# cl = Client("config.json")
# cl.connect_to_server()

class Attendance:
    def __init__(self, config):

        rds.set("todays_name_list",pickle.dumps([]))
        with open(config, "r") as f:
            _config = json.load(f)
        print(_config)
        self.path = "../dataset/images"
        self.images = []
        self.classNames = []
        self.myList = os.listdir(self.path)
        self.encodeListKnown = []
        self.today_file_name = self.file_name_generator()
        self.todays_name = []
        self.resize_by = _config["camera"].get("resize_by", 1)
        self.divide_by = _config["camera"].get("divide_by", 4)
        self.cam_source = _config["camera"]["cam_source"]
        self.cam_side = _config["camera"]["side"]
        self.use_socket = _config["socket"]
        # if self.use_socket:
        #     self.cl = Client(config)
        #     self.cl.connect_to_server()
        try:
            self.df = pd.read_csv("result/"+self.today_file_name)
            self.todays_name = self.df["Name"].tolist()
            rds.set("todays_name_list", pickle.dumps(self.df["Name"].tolist()))
        except:
            with open("result/" + self.today_file_name, "w") as fw:
                fw.write("Name,Time\n")
            self.df = pd.read_csv("result/" + self.today_file_name)
            self.todays_name = self.df["Name"].tolist()
            rds.set("todays_name_list", pickle.dumps(self.df["Name"].tolist()))

        self.mongo = MyMongoDatabase("../server.json")
        rds.set("reload",0)
        print("==>",self.todays_name)

    def file_name_generator(self):
        dt = datetime.now()
        day = dt.day
        month = dt.month
        year = dt.year
        return str(day)+"_"+str(month)+"_"+str(year)+".csv"

    def set_classname(self, class_name_path):
        name = ""
        with open(class_name_path,"r") as f:
            names = f.read()
        return names.replace("\n","").split(",")

    def set_dataset(self,encode_path,class_name_path):
        try:
            self.encodeListKnown = np.load(encode_path)
            name = ""
            with open(class_name_path, "r") as f:
                names = f.read()
            self.classNames = names.replace("\n","").split(",")
        except:
            self.encodeListKnown = []
            self.classNames = []


    def generate_class(self):
        for img in self.myList:
            curImg = cv2.imread(f"{self.path}/{img}")
            self.images.append(curImg)
            self.classNames.append(img.split(".")[0])

    def generate_encode(self):
        encodeListKnown =[]
        print("Encoding started")
        for img in self.images:
            # img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            encode = fr.face_encodings(img)[0]
            encodeListKnown.append(encode)
        print("Encoding completed")
        np.save("../dataset/encode/data.npy", np.asarray(encodeListKnown))
        return encodeListKnown

    def get_time(self):
        dtime = datetime.now()
        hr = dtime.hour
        mint = dtime.minute
        sec = dtime.second
        return str(hr)+":"+str(mint)+":"+str(sec)

    def store_data(self, name):
        name_list = pickle.loads(rds.get("todays_name_list"))
        if name not in name_list:
            # self.todays_name.append(name)
            name_list.append(name)
            name_list_dump = pickle.dumps(name_list)
            rds.set("todays_name_list",name_list_dump)

            with open("result/" + self.today_file_name, "a") as fw:
                fw.write(str(name)+","+self.get_time()+"\n")

            info_dict = {
                "name": name
            }

            if self.cam_side.lower() == "in":
                info_dict["emp_in_time"] = datetime.now()
                info_dict["emp_out_time"] = None
            if self.cam_side.lower() == "out":
                info_dict["emp_out_time"] = datetime.now()
                info_dict["emp_in_time"] = None

            self.mongo.insert_main_record(info_dict)
            print(self.todays_name)

    def update_reocord(self, name):
        info_dict = {}
        info_dict["find_Q"] = {"name": name}
        result = self.mongo.get_result(info_dict)

        if self.cam_side.lower() == "in":
            if result["emp_in_time"] is None:
                info_dict["update_Q"] = {"emp_in_time": datetime.now()}
                self.mongo.update_record(info_dict)
        if self.cam_side.lower() == "out":
            if result["emp_out_time"] is None:
                info_dict["update_Q"] = {"emp_out_time": datetime.now()}
                self.mongo.update_record(info_dict)
            else:
                if result["emp_out_time"] < datetime.now():
                    info_dict["update_Q"] = {"emp_out_time": datetime.now()}
                    self.mongo.update_record(info_dict)


    def stream_vdo(self):
        cap = cv2.VideoCapture(self.cam_source)
        while True:
            _, frame = cap.read()
            _size = round(1/self.resize_by,2)
            _dvd_by = round(1/self.divide_by,2)
            frame = cv2.resize(frame, (0, 0), None, _size, _size)
            r_frame = cv2.resize(frame, (0, 0), None, _dvd_by, _dvd_by)
            # r_frame = cv2.cvtColor(r_frame, cv2.COLOR_BGR2RGB)

            facesCurFrame = fr.face_locations(r_frame)
            encode_cur_frame = fr.face_encodings(r_frame, facesCurFrame)

            for encodeFace, faceLoc in zip(encode_cur_frame, facesCurFrame):
                matches = fr.compare_faces(self.encodeListKnown, encodeFace)
                faceDist = fr.face_distance(self.encodeListKnown, encodeFace)
                print(faceDist)
                try:
                    matchIndex = np.argmin(faceDist)
                except:
                    matchIndex=None

                if matches[matchIndex]:
                    if faceDist[matchIndex] < 0.45:
                        name = self.classNames[matchIndex].upper()
                        self.store_data(name)
                        y1, x2, y2, x1 = faceLoc
                        y1, x2, y2, x1 = y1 * self.divide_by, x2 * self.divide_by, y2 * self.divide_by, x1 * self.divide_by
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 1)
                        cv2.putText(frame, name, (x1 + 6, y1 - 6), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

            # resized_image = cv2.resize(img, (int(w / 4), int(h / 4)))
            strPhotoJpeg = img_to_b64(frame)
            # if self.use_socket:
            #     self.cl.send_image(strPhotoJpeg)
            # cv2.imshow("vdo", frame)
            # cv2.waitKey(1)
        return frame

    def process_image(self, frame):
        _size = round(1 / self.resize_by, 2)
        _dvd_by = round(1 / self.divide_by, 2)
        frame = cv2.resize(frame, (0, 0), None, _size, _size)
        r_frame = cv2.resize(frame, (0, 0), None, _dvd_by, _dvd_by)
        # r_frame = cv2.cvtColor(r_frame, cv2.COLOR_BGR2RGB)

        facesCurFrame = fr.face_locations(r_frame)
        encode_cur_frame = fr.face_encodings(r_frame, facesCurFrame)

        for encodeFace, faceLoc in zip(encode_cur_frame, facesCurFrame):
            matches = fr.compare_faces(self.encodeListKnown, encodeFace)
            faceDist = fr.face_distance(self.encodeListKnown, encodeFace)
            if len(faceDist) >0:
                matchIndex = np.argmin(faceDist)
                if matches[matchIndex]:
                    if faceDist[matchIndex] < 0.45:
                        name = self.classNames[matchIndex].upper()
                        self.store_data(name)
                        self.update_reocord(name)
                        y1, x2, y2, x1 = faceLoc
                        y1, x2, y2, x1 = y1 * self.divide_by, x2 * self.divide_by, y2 * self.divide_by, x1 * self.divide_by
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 1)
                        cv2.putText(frame, name, (x1 + 6, y1 - 6), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

        return frame


def img2_to_str(img):
        imgencode = cv2.imencode('.jpg', img)[1]
        stringData = imgencode.tostring()
        return stringData

def img_to_b64(img):
    _, photoJpeg = cv2.imencode('.jpg', img)
    strPhotoJpeg = b64encode(photoJpeg).decode('utf-8')
    return strPhotoJpeg

##Test code
# for img in myList:
#     curImg = cv2.imread(f"{path}/{img}")
#     images.append(curImg)
#     classNames.append(img.split(".")[0])
#
# def findEncoding(img_obj_list):
#     encodeList = []
#     for img in img_obj_list:
#         img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#         encode = fr.face_encodings(img)[0]
#         encodeList.append(encode)
#     return encodeList
#
# print("Encoding started")
# encodeListKnown = findEncoding(images)
# print("Encoding completed")
#
# cap = cv2.VideoCapture(0)
# while True:
#     _, frame = cap.read()
#     r_frame = cv2.resize(frame,(0, 0), None, 0.5, 0.5)
#     r_frame = cv2.cvtColor(r_frame, cv2.COLOR_BGR2RGB)
#
#     facesCurFrame = fr.face_locations(r_frame)
#     encode_cur_frame = fr.face_encodings(r_frame, facesCurFrame)
#
#     for encodeFace, faceLoc in zip(encode_cur_frame, facesCurFrame):
#         matches = fr.compare_faces(encodeListKnown, encodeFace)
#         faceDist = fr.face_distance(encodeListKnown, encodeFace)
#         matchIndex = np.argmin(faceDist)
#         if matches[matchIndex]:
#             if faceDist[matchIndex] < 0.45:
#                 name = classNames[matchIndex].upper()
#                 y1,x2,y2,x1 = faceLoc
#                 y1, x2, y2, x1 = y1*2,x2*2,y2*2,x1*2
#                 cv2.rectangle(frame,(x1,y1),(x2,y2),(255,0,0),1)
#                 cv2.putText(frame,name,(x1+6,y1-6),cv2.FONT_HERSHEY_SIMPLEX,1,(255,0,0),2)
#
#
#     cv2.imshow("vdo",frame)
#     cv2.waitKey(1)


