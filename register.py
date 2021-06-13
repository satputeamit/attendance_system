import cv2
import numpy as np
import face_recognition as fr
import redis
from db_operations.mongo_operation import MyMongoDatabase

mongo = MyMongoDatabase("server.json")

rds = redis.Redis(host='localhost', port=6379, db=0)


def register_face(img, name):
    data_path = "dataset/encode/data.npy"
    className_path = "dataset/encode/className.txt"
    encodeListKnown =[]
    print("Encoding started")
    # img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    encode = fr.face_encodings(img)[0]
    encodeListKnown.append(encode)

    old_list = np.load(data_path)
    if len(old_list)>0:
        print(type(old_list))
        new_list = np.append(old_list, np.asarray(encodeListKnown), axis=0)
        print("Encoding completed")
        np.save("dataset/encode/data.npy", new_list)
    else:
        np.save("dataset/encode/data.npy", np.asarray(encodeListKnown))

    with open(className_path, "a") as f:
        f.write(str(name) + ",\n")
    cv2.imwrite("dataset/images/"+name+".jpg", img)
    rds.set("reload",1)

    mongo.mycol = mongo.mydb["persons"]
    mongo.insert_main_record({"name":name})
    return encodeListKnown