from server import *
from pymongo import MongoClient
from werkzeug.security import generate_password_hash
import datetime
class MyMongoDatabase:

    def __init__(self):
        self.client = MongoClient(server.mongodb_confg["host"],server.mongodb_confg["port"])
        self.mydb = self.client[server.mongodb_confg["database"]]
        self.mycol = self.mydb[server.mongodb_confg["table"]]
        # self.users = self.mydb['user']

    # def insert_user(self,*mydict):
    #     password = generate_password_hash(mydict[1], method='pbkdf2:sha256')
    #     id=self.users.insert_one({"_id":mydict[0],"password":password,"role":mydict[2]})
    #
    # def delete_user(self,user_name):
    #     self.users.remove({"_id":user_name})
    #
    # def update_user(self,*mydict):
    #     password = generate_password_hash(mydict[1],method='pbkdf2:sha256')
    #     self.users.update({'_id':'mydict[0]'},{'$set':{'password':password,"role":mydic[2]}})

    def insert_main_record(self,*mydict):
        print("MONGO MYDICT::::::::::::::::::",mydict)
        # time_stamp=datetime.datetime.now().strftime('%H:%M:%S')
        id=self.mycol.insert_one({"variant_name":mydict[0],"timestamp":mydict[1],"status":mydict[2],"detail":mydict[3]})


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
        return self.mycol.find({"timestamp":{'$gte':date}})

    def find_record_between_date(self,from_date,to_date):
        # print("FROM TO DAte::::::::::::::::::::::::::::;",from_date,to_date)
        return self.mycol.find({"timestamp":{'$gte':from_date,'$lte':to_date}})

    def get_count_by_status(self,status):
        return self.mycol.find({"status":status}).count()

    def get_count_by_date(self,var_name,from_date,to_date):
        return self.mycol.find({"variant_name":var_name,"timestamp":{'$gte':from_date,'$lte':to_date}}).count()

    def get_count_between_date(self,status,from_date,to_date):
        return self.mycol.find({"status":status,"timestamp":{'$gte':from_date,'$lte':to_date}}).count()

    def get_variant_count_between_date(self,var_name,status,from_date,to_date):
        return self.mycol.find({"variant_name":var_name,"status":status,"timestamp":{'$gte':from_date,'$lte':to_date}}).count()

    def get_count_by_status_date(self,status,date):
        return self.mycol.find({"status":status,"timestamp":{'$gte':date}}).count()

    def get_count_by_status_date_label(self,status,date,label):
        return self.mycol.find({"status":status,"date":str(date),"lable":label}).count()

    def get_count_by_status_label(self,status,label):
        return self.mycol.find({"status":status,"lable":label}).count()
