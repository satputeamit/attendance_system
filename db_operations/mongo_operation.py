from pymongo import MongoClient
from werkzeug.security import generate_password_hash
import datetime
import json

class MyMongoDatabase:

    def __init__(self,config):
        with open(config, "r") as f:
            _config = json.load(f)
        _config= _config["mongodb"]
        self.client = MongoClient(_config["host"],_config["port"])
        self.mydb = self.client[_config["database"]]
        self.mycol = self.mydb[_config["table"]]
        # self.users = self.mydb['user']

    def insert_main_record(self, mydict):
        print("MONGO MYDICT::::::::::::::::::", mydict)
        # time_stamp=datetime.datetime.now().strftime('%H:%M:%S')
        id = self.mycol.insert_one(mydict)

    def update_record(self, mydict):
        print("Update dict :",mydict)
        self.mycol.update_one(mydict["find_Q"], {"$set": mydict["update_Q"]})

    def get_result(self, mydict):
        return self.mycol.find_one(mydict["find_Q"])

    def insert_detail_record(self,*mydict):
        print("MONGO MYDICT::::::::::::::::::",mydict[3])

        idd=self.mycol.insert_one({"item":mydict[0],"lable":mydict[1],"count":mydict[2],"status":mydict[3],"date":str(mydict[4])})
        return idd.inserted_id

    def find_all(self):
        return self.mycol.find()

    def find_by_name(self,key,value):
        print("KEY VALUES======================",key,value)
        return self.mycol.find({key:value})

    def find_record_by_date(self,date):
        return self.mycol.find({"emp_in_time":{'$gte':date}})

    def find_record_between_date(self,from_date,to_date):
        # print("FROM TO DAte::::::::::::::::::::::::::::;",from_date,to_date)
        return self.mycol.find({"emp_in_time":{'$gte':from_date,'$lte':to_date}})

