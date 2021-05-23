from attendance import Attendance

if __name__=="__main__":

    att = Attendance("config_cam_out.json")
    # att.generate_class().
    # f=att.generate_encode()
    # encode_list = np.load("encode/data.npy")
    # att.classNames = att.set_classname("encode/className.txt")
    # print(classNames)
    # att.encodeListKnown = encode_list
    att.set_dataset("encode/data.npy","encode/className.txt")
    print(att.classNames)
    att.stream_vdo()
