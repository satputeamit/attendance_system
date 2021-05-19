var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port );
if (window.performance) {
   console.info("window.performance works fine on this browser");
 }

 if (performance.navigation.type == 1) {
   console.info( "This page is reloaded" );
   socket.emit('skt_process_status_flag',{"flag":0});

 } else {
   console.info( "This page is not reloaded");
  socket.emit('skt_process_status_flag',{"flag":0});

 }

var ajax_call = function() {
  socket.emit("skt_read_reg")
  console.log("called");
}

var interval =1000;
setInterval(ajax_call, interval);

socket.on("skt_diagnosis_response",function(result){
    console.log(result);
    if (result["flag"]){
      var s1_error = result['s1_error']
      var s2_error = result['s2_error']
      var s3_error = result['s3_error']
      var vfd_error = result['vfd_error']
      var conv_status = result['conv_status']
      var top_clamp_status = result['top_clamp_status']
      var guide_clamp_status = result['guide_clamp_status']
      var tower_lamp_status = result['tower_lamp_status']
      var encoder_error = result['encoder_error']
      var auto_cycle = result['auto_cycle']
      var emergency = result['emergency']
      var cam_status = result['cam_status']

      if (s1_error==1){
            document.getElementById("s1_error").innerHTML = "Yes";
          }
          else{
            document.getElementById("s1_error").innerHTML = "No ";
          }

          if (s2_error==1){
            document.getElementById("s2_error").innerHTML = "Yes";
          }
          else{
            document.getElementById("s2_error").innerHTML = "No";
          }

          if (s3_error==1){
            document.getElementById("s3_error").innerHTML = "Yes";
          }
          else{
            document.getElementById("s3_error").innerHTML = "No";
          }

          if (vfd_error==1){
            document.getElementById("vfd_error").innerHTML = "Yes";
          }
          else{
            document.getElementById("vfd_error").innerHTML = "No";
          }

          if (conv_status==1){
            document.getElementById("conv_status").innerHTML = "Running";
          }
          else{
            document.getElementById("conv_status").innerHTML = "Not Running";
          }

          if (top_clamp_status==1){
            document.getElementById("top_clamp_status").innerHTML = "Forword";
          }
          else{
            document.getElementById("top_clamp_status").innerHTML = "Home";
          }

          if (guide_clamp_status==1){
            document.getElementById("guide_clamp_status").innerHTML = "Clamp";
          }
          else{
            document.getElementById("guide_clamp_status").innerHTML = "Declamp";
          }

          if (tower_lamp_status==1){
            document.getElementById("tower_lamp_status").innerHTML = "Not Ok";
          }
          else{
            document.getElementById("tower_lamp_status").innerHTML = "Ok";
          }

          if (encoder_error==1){
            document.getElementById("encoder_error").innerHTML = "Yes";
          }
          else{
            document.getElementById("encoder_error").innerHTML = "No";
          }

          if (auto_cycle==1){
            document.getElementById("auto_cycle").innerHTML = "Auto";
          }
          else{
            document.getElementById("auto_cycle").innerHTML = "Manual";
          }

          if (emergency==1){
            document.getElementById("emergency").innerHTML = "Pressed";
          }
          else{
            document.getElementById("emergency").innerHTML = "Released";
          }


          document.getElementById("cam_status").innerHTML = cam_status;
          console.log(cam_status)
    }
    else{
      document.getElementById("plc_status").innerHTML = "PLC not connected..."
    }


});


// socket.on("diagnostic_response",function(data)
// {
//   // console.log(data);
//   if (data.reg_list["s1_error"]==1){
//     document.getElementById("s1_error").innerHTML = "Yes";
//   }
//   else{
//     document.getElementById("s1_error").innerHTML = "No ";
//   }

//   if (data.reg_list["s2_error"]==1){
//     document.getElementById("s2_error").innerHTML = "Yes";
//   }
//   else{
//     document.getElementById("s2_error").innerHTML = "No";
//   }

//   if (data.reg_list["s3_error"]==1){
//     document.getElementById("s3_error").innerHTML = "Yes";
//   }
//   else{
//     document.getElementById("s3_error").innerHTML = "No";
//   }

//   if (data.reg_list["vfd_error"]==1){
//     document.getElementById("vfd_error").innerHTML = "Yes";
//   }
//   else{
//     document.getElementById("vfd_error").innerHTML = "No";
//   }

//   if (data.reg_list["conv_status"]==1){
//     document.getElementById("conv_status").innerHTML = "Running";
//   }
//   else{
//     document.getElementById("conv_status").innerHTML = "Not Running";
//   }

//   if (data.reg_list["top_clamp_status"]==1){
//     document.getElementById("top_clamp_status").innerHTML = "Forword";
//   }
//   else{
//     document.getElementById("top_clamp_status").innerHTML = "Home";
//   }

//   if (data.reg_list["guide_clamp_status"]==1){
//     document.getElementById("guide_clamp_status").innerHTML = "Clamp";
//   }
//   else{
//     document.getElementById("guide_clamp_status").innerHTML = "Declamp";
//   }

//   if (data.reg_list["tower_lamp_status"]==1){
//     document.getElementById("tower_lamp_status").innerHTML = "Not Ok";
//   }
//   else{
//     document.getElementById("tower_lamp_status").innerHTML = "Ok";
//   }

//   if (data.reg_list["encoder_error"]==1){
//     document.getElementById("encoder_error").innerHTML = "Yes";
//   }
//   else{
//     document.getElementById("encoder_error").innerHTML = "No";
//   }

//   if (data.reg_list["auto_cycle"]==1){
//     document.getElementById("auto_cycle").innerHTML = "Auto";
//   }
//   else{
//     document.getElementById("auto_cycle").innerHTML = "Manual";
//   }

//   if (data.reg_list["emergency"]==1){
//     document.getElementById("emergency").innerHTML = "Pressed";
//   }
//   else{
//     document.getElementById("emergency").innerHTML = "Released";
//   }


//   document.getElementById("cam_status").innerHTML = data.reg_list["cam_status"];

//   console.log("awds",data.reg_list);
// });

$('#btn_start').click(function(event){
  var variant = document.getElementById("select_variant").value;
  console.log(variant);
  socket.emit('skt_error_proofing',{"var_name":variant});
});

$('#error_log').click(function(event){
  socket.emit('skt_show_error');
});


socket.on('plc_response', function(data){
    if(data.msg=="1"){
        Swal.fire('PLC not connected..!')
    }

  });

socket.on("skt_error_response",function(data){
  var div_error_log = $("#log_detail");
  console.log(data);
  div_error_log.html("");
  var html ="";
  for (i = 0; i < data.err.length; i++) {
            html +='<p style="color:green;margin-left:20px">'+data.err[i]+'</p>'
              }
  div_error_log.append("<pre>"+html+"</pre>");
});

socket.on('skt_error_proofing_response', function(data){
  console.log("data :",data);
  var dataURL="data:image/jpeg;base64,"+data.image;
  document.getElementById("cam_img").src = dataURL;
  // document.getElementById("txt_variant_name").innerHTML = data.variant_name;
  var coll = $("#collection_id");
  var i;
  var j;
  var html =""
  var tabl = $("#result_tbl");

  $("#result_tbl > tbody").html("");
  $("#collection_id li").remove();
  // var cnt=0;
  for (i = 0; i < data.output_list.length; i++) {
          cnt=i+1;
          tabl.append(
          '<tr id="row'+cnt+'"'+(data.output_list[i][3]=="good" ? 'style="background-color:rgba(0,255,0,0.5);font-size:20px"':'style="background-color:rgba(252,0,0,0.5);font-size:20px"')+'>' +
          '<td class="white-text" id ="'+cnt+'">'+data.output_list[i][0]+'</td>'+
          '<td class="white-text" id ="'+cnt+'">'+data.output_list[i][1]+'</td>'+
          '<td class="white-text" id ="'+cnt+'">'+data.output_list[i][2]+'</td>'+
          '</tr>'
            );
      }
  coll.append(html);
  });
