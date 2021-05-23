import eventlet
eventlet.monkey_patch()
import cv2
from flask import Flask, render_template, redirect, url_for, request, Response,session,json
from flask_socketio import SocketIO
from attendance import Attendance

#initialize flask application
app = Flask(__name__)
att = Attendance("config_cam_in.json")
att.set_dataset("encode/data.npy","encode/className.txt")
#Create object of SocketIO
socketio = SocketIO(app,async_mode="eventlet",async_handlers=True,cookie=None,max_http_buffer_size=300)


def get_frame():
    try:
        cap = cv2.VideoCapture(att.cam_source)
        while True:
            #_, frame = camera.read()
            _, frame = cap.read()
            processed_image = att.process_image(frame)
            """ conv"""
            imgencode = cv2.imencode('.jpg', processed_image)[1]
            stringData = imgencode.tostring()
            yield (b'--frame\r\n'b'Content-Type: text/plain\r\n\r\n'+stringData+b'\r\n')
    except Exception as e:
        print(e)
        get_frame()

@app.route('/video_feed')
def video_feed():
    return Response(get_frame(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == "__main__":
    app.threaded=True
    # webbrowser.open_new_tab('http://127.0.0.1:5000')
    socketio.run(app,host="127.0.0.1",port=5001,use_reloader=False,debug=True)
