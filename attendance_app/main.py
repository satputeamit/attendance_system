import cv2
import numpy as np
import face_recognition as fr

imgN = fr.load_image_file("img/n1.jpg")
imgN = cv2.cvtColor(imgN, cv2.COLOR_BGR2RGB)

imgTest = fr.load_image_file("img/n2.jpg")
imgTest = cv2.cvtColor(imgTest, cv2.COLOR_BGR2RGB)

faceLoc = fr.face_locations(imgN)
encodeN = fr.face_encodings(imgN)[0]

faceLocT = fr.face_locations(imgTest)
encodeT = fr.face_encodings(imgTest)[0]
print(encodeN)
for fl in faceLoc:
    cv2.rectangle(imgN,(fl[3], fl[0]), (fl[1], fl[2]), (255, 0, 0), 2)

for fl in faceLocT:
    cv2.rectangle(imgTest, (fl[3], fl[0]), (fl[1], fl[2]), (255, 0, 0), 2)

result = fr.compare_faces([encodeN],encodeT)
faceDist = fr.face_distance([encodeN],encodeT)
print(result)
print(faceDist)
cv2.imshow("Nora", imgN)
cv2.imshow("Sh", imgTest)
cv2.waitKey(0)