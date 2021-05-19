
from server import *
from models.sql_table import User


def db_add_user(username,password,email,designation):
    user_obj=User(username=username,password=password,email=email,designation=designation)
    server.db.session.add(user_obj)
    server.db.session.commit()
    print("User added")

def db_user_delete(pk):
    obj=User.query.filter_by(id=pk).one()
    server.db.session.delete(obj)
    server.db.session.commit()
    print("user deleted")

def db_update_user(id,unm,pwd,email,desig):
    obj=User.query.filter_by(id=id).one()
    obj.username =  unm
    obj.password = pwd
    obj.email = email
    obj.designation = desig
    server.db.session.commit()
    print("user updated")

def db_add_training(region1,region2,value):
    train_obj=TrainingDB(region_first=region1,region_second=region2,value=value)
    server.db.session.add(train_obj)
    server.db.session.commit()
    print("Training added")

def db_training_delete(pk):
    obj=Trainingserver.db.query.filter_by(id=pk).one()
    server.db.session.delete(obj)
    server.db.session.commit()
    print("Training deleted")
