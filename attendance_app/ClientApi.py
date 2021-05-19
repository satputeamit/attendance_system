import socketio
import time
import json
import pickle
import logging
import sys

class Client():
    def __init__(self,config):
        with open(config,"r") as f:
              config = json.load(f)

        self._client_config = config["client"]
        self._sio = socketio.Client()
        self._response_time_out = self._client_config["response_time_out"]
        self._output = None
        self._server_client_limit = None
        self._mode_ready = None
        self._client_disconnected = False
        self._valid_device = True
        self._loading_symb =['|', '/', '-','\\']
        logging.basicConfig(filename=self._client_config["logfile"], filemode='w',format='%(asctime)s -%(levelname)s- %(message)s')

        @self._sio.on(self._client_config["receive_data"])
        def skt_bounding_box_response(msg):
            self._output = msg

        @self._sio.event
        def connect():
            self._is_user_valid =True
            print("I'm connected!")

        @self._sio.event
        def disconnect():
            print("I'm disconnected!")
            self._client_disconnected = True

        @self._sio.on("is_port_open_response")
        def is_port_open(msg):
            self._server_client_limit = msg["status"]

        @self._sio.on("is_model_ready_response")
        def is_model_ready(msg):
            self._mode_ready = msg["status"]

        @self._sio.on("is_valid_device")
        def is_valid_device(msg):
            self._valid_device = msg["status"]
    
    def connect_to_server(self):
        while 1:
            try:
                print("Connecting...")
                self._sio.connect('http://'+self._client_config["ip"])
                self._sio.emit("is_port_open")
                time.sleep(1)
                # if not self._server_client_limit:
                #     print("\033[91m[INFO]Client connection limit reached...\033[0m")
                #     self._sio.disconnect()
                #     sys.exit(0)
                print("connected...")
                time.sleep(1)

                if not self._valid_device:
                    print("\033[91m[INFO]Server device is not valid...\033[0m")
                    self._sio.disconnect()
                    sys.exit(0)

                print("[INFO] Device is valid..")
                self._sio.emit("is_model_ready")

                # i=0
                # while not self._mode_ready:
                #     self._sio.emit("is_model_ready")
                #     sys.stdout.write("\r\033[94m[INFO] Model is not ready, Please wait...\033[0m" + self._loading_symb[i])
                #     sys.stdout.flush()
                #     time.sleep(1)
                #     if i==3:
                #         i=0
                #     else:
                #         i+=1
                #     if self._client_disconnected:
                #         break
                #
                # sys.stdout.write("\n")
                # print("\033[92m[INFO] Model is ready...\033[0m")

                break
            except Exception as e:
                logging.error(e)
                time.sleep(1)


    def send_image(self,img):
        try:
            # self._sio.emit(self._client_config["send_image"], {"img":pickle.dumps(img)})
            self._sio.emit(self._client_config["send_image"], {"img":img})
            time.sleep(0.0001)

        except Exception as e:
            logging.error(e)

        return self._output

    def disconnect(self):
        self._sio.disconnect()

    def wait(self):
        self._sio.wait()
