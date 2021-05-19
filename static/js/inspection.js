
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
     socket.emit("skt_handshake")
     console.log("called");
   }

   var interval =1000;
   setInterval(ajax_call, interval);

   socket.on("skt_handshake_response",data=>{
     if(data.flag){
       console.log("Connected");
     }
     else{
       console.log("NOT connected");
       $("#btn_start").show();
       $("#btn_stop").hide();
       alert('AIC not connected.')
       // $.get('/help');
   //     $.post("/allvariants",{data:''} ,function(data) {
   //     allVariants = data;
   //     console.log(allVariants);
   // }, "json");
   }

   });

   $('#btn_log_image').click(function(event){
     console.log("btn clicked");
     socket.emit('skt_log_image');
   });

  $('#btn_start').click(function(event){
    $("#btn_start").hide();
    $("#btn_stop").show();
    // $("#csv_tbl > tbody").html("");
    socket.emit('skt_process_status_flag',{"flag":1});
  });

  $('#btn_stop').click(function(event){
    $("#btn_start").show();
    $("#btn_stop").hide();
    // $("#csv_tbl > tbody").html("");
    socket.emit('skt_process_status_flag',{"flag":0});
  });

  socket.on('skt_recover_image_response', function(data){
    if(data.flag==1){
      document.getElementById("txt_status").innerHTML ="Saved"
    }
    else{
      document.getElementById("txt_status").innerHTML ="Not saved"
    }

  });

  socket.on('skt_show_infer_result', function(data){
//    console.log("data");
//    document.getElementById("id_total").innerHTML = data.count[0]
//    document.getElementById("id_good").innerHTML = data.count[1]
//    document.getElementById("id_bad").innerHTML = data.count[2]
//
//    document.getElementById("txt_status").innerHTML =""

    var dataURL="data:image/jpeg;base64,"+data.image;
    document.getElementById("cam_img").src = dataURL;
    document.getElementById("txt_variant_name").innerHTML = data.variant_name;
//    var coll = $("#collection_id");
//    var i;
//    var j;
//    var html =""
//    var tabl = $("#result_tbl");
//
//    $("#result_tbl > tbody").html("");
//    $("#collection_id li").remove();
//    // var cnt=0;
//    for (i = 0; i < data.output_list.length; i++) {
//            cnt=i+1;
//            tabl.append(
//            '<tr id="row'+cnt+'"'+(data.output_list[i][3]=="good" ? 'style="background-color:rgba(0,255,0,0.5);font-size:20px"':'style="background-color:rgba(252,0,0,0.5);font-size:20px"')+'>' +
//            '<td class="white-text" id ="'+cnt+'">'+data.output_list[i][0]+'</td>'+
//            '<td class="white-text" id ="'+cnt+'">'+data.output_list[i][1]+'</td>'+
//            '<td class="white-text" id ="'+cnt+'">'+data.output_list[i][2]+'</td>'+
//            '</tr>'
//              );
//        }
//    coll.append(html);
    });


  socket.on('process', function(data){
      if(data.status==1){
        $("#process_img").attr("width","100px");
        $("#process_img").attr("height","50px");
        document.getElementById("process_img").src="static/img/loader.gif";
        document.getElementById("process_name").innerHTML="Processing...";


      }
      else if(data.status==2){
        $("#process_img").attr("width","50px");
        $("#process_img").attr("height","50px");
        // $("#process_name").css('color', 'green');
        document.getElementById("process_img").src="static/img/check.png";
        document.getElementById("process_name").innerHTML="OK";

      }
      // else if(data.msg=="4"){
      //   $("#process_img").attr("width","0px");
      //   $("#process_img").attr("height","0px");
      //   // $("#process_name").css('color', 'green');
      //   document.getElementById("process_img").src="";
      //   document.getElementById("process_name").innerHTML="Wrong Variant...";
      //
      // }
      else{
        $("#process_img").attr("width","50px");
        $("#process_img").attr("height","50px");
        // $("#process_name").css('color', 'red');
        document.getElementById("process_img").src="static/img/wrong.png";
        document.getElementById("process_name").innerHTML="NOT OK";


      }
      console.log(data);
    });

    socket.on('plc_response', function(data){
        if(data.msg=="1"){
            Swal.fire('PLC not connected..!')
        }

      });
