from werkzeug.security import generate_password_hash,check_password_hash
import sqlite3

conn = sqlite3.connect('database.db')
c = conn.cursor()
try:
    c.execute("DROP TABLE IF EXISTS User")
    c.execute("CREATE TABLE User (id INTEGER NOT NULL,username VARCHAR(255) UNIQUE, password VARCHAR(255),email VARCHAR(255) UNIQUE,designation VARCHAR(255), PRIMARY KEY(id))")
except:
    print("done")

conn.commit()

su=str(input("Enter Super User Password :"))
if su=="superadmin":
    unm=str(input("User Name : "))
    pwd=str(input("password : "))
    password = generate_password_hash(pwd)
    em=str(input("Email : "))
    c.execute("INSERT INTO User (username,password,email,designation) VALUES (?,?,?,?)", (unm,password,em,'superadmin'))
    conn.commit()
    print("database created")
else:
    print("User invalid")

conn.commit()
