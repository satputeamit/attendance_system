var canvas = document.getElementById("canv_clock");
var ctx1 = canvas.getContext("2d");
var radius = canvas.height / 2;
ctx1.translate(radius, radius);
radius = radius * 0.90
setInterval(drawClock, 1000);

function drawClock() {
  drawFace(ctx1, radius);
  drawNumbers(ctx1, radius);
  drawTime(ctx1, radius);
}

function drawFace(ctx1, radius) {
  var grad;
  ctx1.beginPath();
  ctx1.arc(0, 0, radius, 0, 2*Math.PI);
  ctx1.fillStyle = 'white';
  ctx1.fill();
  grad = ctx1.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
  grad.addColorStop(0, '#333');
  grad.addColorStop(0.5, 'white');
  grad.addColorStop(1, '#333');
  ctx1.strokeStyle = grad;
  ctx1.lineWidth = radius*0.1;
  ctx1.stroke();
  ctx1.beginPath();
  ctx1.arc(0, 0, radius*0.1, 0, 2*Math.PI);
  ctx1.fillStyle = '#333';
  ctx1.fill();
}

function drawNumbers(ctx1, radius) {
  var ang;
  var num;
  ctx1.font = radius*0.15 + "px arial";
  ctx1.textBaseline="middle";
  ctx1.textAlign="center";
  for(num = 1; num < 13; num++){
    ang = num * Math.PI / 6;
    ctx1.rotate(ang);
    ctx1.translate(0, -radius*0.85);
    ctx1.rotate(-ang);
    ctx1.fillText(num.toString(), 0, 0);
    ctx1.rotate(ang);
    ctx1.translate(0, radius*0.85);
    ctx1.rotate(-ang);
  }
}

function drawTime(ctx1, radius){
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    //hour
    hour=hour%12;
    hour=(hour*Math.PI/6)+
    (minute*Math.PI/(6*60))+
    (second*Math.PI/(360*60));
    drawHand(ctx1, hour, radius*0.5, radius*0.07);
    //minute
    minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
    drawHand(ctx1, minute, radius*0.8, radius*0.07);
    // second
    second=(second*Math.PI/30);
    drawHand(ctx1, second, radius*0.9, radius*0.02);
}

function drawHand(ctx1, pos, length, width) {
    ctx1.beginPath();
    ctx1.lineWidth = width;
    ctx1.lineCap = "round";
    ctx1.moveTo(0,0);
    ctx1.rotate(pos);
    ctx1.lineTo(0, -length);
    ctx1.stroke();
    ctx1.rotate(-pos);
}
