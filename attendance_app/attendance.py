import cv2
import numpy as np
import face_recognition as fr
import os
from datetime import datetime
import pandas as pd
from base64 import b64encode,b64decode
from ClientApi import Client
import json
# path = "/home/amit/vision_project/attendance/attendance_app/images"
# images =[]
# classNames =[]
# print(os.listdir())
# myList = os.listdir(path)

cl = Client("config.json")
cl.connect_to_server()

class Attendance:
    def __init__(self, config):
        with open(config, "r") as f:
            _config = json.load(f)
        print(_config)
        self.path = "images"
        self.images = []
        self.classNames = []
        self.myList = os.listdir(self.path)
        self.encodeListKnown = []
        self.today_file_name = self.file_name_generator()
        self.todays_name = []
        self.cl = Client(config)
        self.cam_source = _config["camera"]["cam_source"]
        self.cam_side = _config["camera"]["side"]
        self.cl.connect_to_server()
        try:
            self.df = pd.read_csv("aresult/"+self.today_file_name)
            self.todays_name = self.df["Name"].tolist()
        except:
            with open("result/" + self.today_file_name, "w") as fw:
                fw.write("Name,Time\n")
            self.df = pd.read_csv("result/" + self.today_file_name)
            self.todays_name = self.df["Name"].tolist()


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
        self.encodeListKnown = np.load(encode_path)
        name = ""
        with open(class_name_path, "r") as f:
            names = f.read()
        self.classNames = names.replace("\n","").split(",")

    def generate_class(self):
        for img in self.myList:
            curImg = cv2.imread(f"{self.path}/{img}")
            self.images.append(curImg)
            self.classNames.append(img.split(".")[0])

    def generate_encode(self):
        encodeListKnown =[]
        print("Encoding started")
        for img in self.images:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            encode = fr.face_encodings(img)[0]
            encodeListKnown.append(encode)
        print("Encoding completed")
        np.save("encode/data.npy", np.asarray(encodeListKnown))
        return encodeListKnown

    def get_time(self):
        dtime = datetime.now()
        hr = dtime.hour
        mint = dtime.minute
        sec = dtime.second
        return str(hr)+":"+str(mint)+":"+str(sec)

    def store_data(self,name):
        if name not in self.todays_name:
            self.todays_name.append(name)
            with open("result/" + self.today_file_name, "a") as fw:
                fw.write(str(name)+","+self.get_time()+"\n")
            print(self.todays_name)

    def stream_vdo(self):
        cap = cv2.VideoCapture(self.cam_source)
        while True:
            _, frame = cap.read()
            r_frame = cv2.resize(frame, (0, 0), None, 0.25, 0.25)
            r_frame = cv2.cvtColor(r_frame, cv2.COLOR_BGR2RGB)

            facesCurFrame = fr.face_locations(r_frame)
            encode_cur_frame = fr.face_encodings(r_frame, facesCurFrame)

            for encodeFace, faceLoc in zip(encode_cur_frame, facesCurFrame):
                matches = fr.compare_faces(self.encodeListKnown, encodeFace)
                faceDist = fr.face_distance(self.encodeListKnown, encodeFace)
                matchIndex = np.argmin(faceDist)
                if matches[matchIndex]:
                    if faceDist[matchIndex] < 0.45:
                        name = self.classNames[matchIndex].upper()
                        self.store_data(name)
                        y1, x2, y2, x1 = faceLoc
                        y1, x2, y2, x1 = y1 * 4, x2 * 4, y2 * 4, x1 * 4
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 1)
                        cv2.putText(frame, name, (x1 + 6, y1 - 6), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

            # resized_image = cv2.resize(img, (int(w / 4), int(h / 4)))
            strPhotoJpeg = img_to_b64(frame)
            self.cl.send_image(strPhotoJpeg)
            # cv2.imshow("vdo", frame)
            # cv2.waitKey(1)


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


