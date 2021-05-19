
  $(document).ready(function() {
    var h_min=0;
    var s_min=0;
    var v_min=0;
    var h_max=0;
    var s_max=0;
    var v_max=0;
    var x1 = 0;
    var y1 = 0;
    var x2 = 0;
    var y2 = 0;

    $("div#sw_config").hide();

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

    let varlen = document.getElementById("variantlen").value;
    console.log("varlen",varlen);
    if(varlen != ""){
        $("div#sw_config").show();
    }
    socket.emit("skt_show_file");
    socket.on('skt_ooi_response', function(data){
    var dataURL="data:image/jpeg;base64,"+data.ooi_img;
    document.getElementById("ooi_img").src = dataURL;
    h_min=data.h_min;
    s_min=data.s_min;
    v_min=data.v_min;
    h_max=data.h_max;
    s_max=data.s_max;
    v_max=data.v_max;
    $( function() {
            $( "#slider-horizontal" ).slider({
                    orientation: "horizontal",
                    range: true,
                    min: 0,
                    max: 255,
                    values: [data.h_min,data.h_max],
                    slide: function( event, ui ) {
                      // console.log(ui);
                       $( "#amount" ).val( "H_min : " + ui.values[ 0 ]+"," + " H_max : " + ui.values[ 1 ] );
                        h_min=ui.values[0];
                        h_max=ui.values[1];
                        socket.emit('skt_hsv_slider', {h_min:h_min,s_min:s_min,v_min:v_min,h_max:h_max,s_max:s_max,v_max:v_max,camera_type:"color"});

                      }
                    });


            $( "#amount" ).val( "H_min : " + $( "#slider-horizontal" ).slider( "values", 0 ) +"," +
             "  H_max : " + $( "#slider-horizontal" ).slider( "values", 1 ) );

    } );


    $( function() {
            $( "#slider-horizontal2" ).slider({
                  orientation: "horizontal2",
                  range: true,
                  min: 0,
                  max: 255,
                  values: [data.s_min,data.s_max],
                  slide: function( event, ui ) {
                    // console.log(ui);

                     $( "#amount2" ).val( "S_min : " + ui.values[ 0 ]+"," + " S_max : " + ui.values[ 1 ] );
                      s_min=ui.values[0];
                      s_max=ui.values[1];
                      socket.emit('skt_hsv_slider', {h_min:h_min,s_min:s_min,v_min:v_min,h_max:h_max,s_max:s_max,v_max:v_max,camera_type:"color"});

                    }
                  });


          $( "#amount2" ).val( "S_min : " + $( "#slider-horizontal2" ).slider( "values", 0 ) +"," +
          "  S_max : " + $( "#slider-horizontal2" ).slider( "values", 1 ) );

    } );




    $( function() {
            $( "#slider-horizontal3" ).slider({
                  orientation: "horizontal3",
                  range: true,
                  min: 0,
                  max: 255,
                  values: [data.v_min,data.v_max],
                  slide: function( event, ui ) {
                    // console.log(ui);

                     $( "#amount3" ).val( "V_min : " + ui.values[ 0 ]+"," + " V_max : " + ui.values[ 1 ] );
                      v_min=ui.values[0];
                      v_max=ui.values[1];
                      socket.emit('skt_hsv_slider', {h_min:h_min,s_min:s_min,v_min:v_min,h_max:h_max,s_max:s_max,v_max:v_max,camera_type:"color"});

                    }
                  });


          $( "#amount3" ).val( "V_min : " + $( "#slider-horizontal3" ).slider( "values", 0 ) +"," +
          "  V_max : " + $( "#slider-horizontal3" ).slider( "values", 1 ) );

    } );
    });
  // socketio
  socket.on('skt_roi_response', function(data){

      // console.log(data.s)
      var dataURL="data:image/jpeg;base64,"+data.roi_img;
      document.getElementById("roi_img").src = dataURL;
      // console.log(data.area);

      });

  socket.on('skt_hsv_slider_response', function(data){
        var dataURL="data:image/jpeg;base64,"+data.thresh_img;
        document.getElementById("ooi_img").src = dataURL;
        });

  socket.on('skt_capture_img_for_config_response', function(data){
        var dataURL="data:image/jpeg;base64,"+data.img;
        document.getElementById("org_image").src = dataURL;
        });

socket.on('skt_show_file_response', function(data){
  // console.log('in file data',data.img);
  var dataURL="data:image/jpeg;base64,"+data.img;
  document.getElementById("org_image").src = dataURL;
  var tabl = $("#csv_tbl");
  $("#csv_tbl td").remove();
  $("#csv_tbl > tbody").html("");
  var i;
  var j;
  var cnt=0;

  // var ul = document.createElement ("ul");
  // for (var i = 0; i < 4; i++) {
  //              var li = document.createElement ("li");
  //              li.appendChild (i);
  //              ul.appendChild (li);
  //          }

  for (i = 0; i < data.ldata.length; i++) {
        cnt=i+1;
        //added

        tabl.append(
        '<tr id="row'+cnt+'">' +
        '<td id =""'+cnt+'">'+cnt+'</td>'+
        '<td id ="label'+cnt+'">' + data.ldata[i][0]+'</td>'+
        '<td id ="roi'+cnt+'">' + data.ldata[i][1]+',  '+data.ldata[i][2]+',  '+data.ldata[i][3] + ',  '+data.ldata[i][4] +'</td>' +
        '<td id ="area'+cnt+'">' + data.ldata[i][5]+'</td>' +
        '<td id ="hsv_min'+cnt+'">' + data.ldata[i][6]+',  '+data.ldata[i][7]+',  '+data.ldata[i][8] + '</td>' +
        '<td id ="hsv_max'+cnt+'">' + data.ldata[i][9]+',  '+data.ldata[i][10]+',  '+data.ldata[i][11] + '</td>' +

        '<td><button type="button" name="button" class="btn-small orange darken-3 waves-effect waves-light" id="edit_button'+cnt+'" onclick="edit_row('+cnt+')" data-toggle="tooltip" data-placement="bottom" title="Edit Configuration" ><i class="material-icons white-text">edit</i></button><button type="button" name="button1" class="btn-small green darken-3 waves-effect waves-light" id="save_button'+cnt+'" onclick="save_row('+cnt+')" data-toggle="tooltip" data-placement="bottom" title="Save Configuration" style="display:none" ><i class="material-icons white-text">save</i></button><button type="button" name="button2" class="btn-small red darken-3 waves-effect waves-light" id="delete_button'+cnt+'" onclick="delete_row('+cnt+')" data-toggle="tooltip" data-placement="bottom" title="Delete Configuration" ><i class="material-icons white-text">delete</i></button></td>' +

        '</tr>'
          );
      }
  // console.log(data.s)

  });


  $('#btn_save').click(function(event){
    $("#csv_tbl > tbody").html("");
    socket.emit('skt_save_configuration',{x1:x1,y1:y1,x2:x2,y2:y2,h_min:h_min,s_min:s_min,v_min:v_min,h_max:h_max,s_max:s_max,v_max:v_max});

  });

  $('#btn_capture').click(function(event){
    $("#btn_capture").attr("disabled", true);
    socket.emit('skt_capture_img_for_config');
  });

  $('#btn_next').click(function(event){
    $("#csv_tbl > tbody").html("");
    socket.emit('skt_select_next_img_for_config');
    socket.emit("skt_show_file");
  });

  $('#btn_previous').click(function(event){
    $("#csv_tbl > tbody").html("");
    socket.emit('skt_select_previous_img_for_config');
    socket.emit("skt_show_file");
  });

  $('#btn_clear').click(function(event){

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value)
        {
        Swal.fire('Deleted!','Your file has been deleted.','success')
        socket.emit("skt_clear_configuration");
      }

    });
  });


  socket.on('skt_capture_done_response', function(data){
    if (data.status=="1"){
      $("#btn_capture").attr("disabled", false);
      Swal.fire("Images captured..");
    }
  });

  socket.on('plc_response', function(data){
    if (data.msg=="1"){
      Swal.fire("plc not connected;..");
    }
  });


  $('#btn_confirm').click(function(event){

    $("div#sw_config").hide();
    let len = document.getElementById("variantlen").value;
    let trgr_first = document.getElementById("trgr_first").value;
    let trgr_second = document.getElementById("trgr_second").value;
    let printer_len = document.getElementById("printer_length").value;
    let clamping_len = document.getElementById("clamping_length").value;
    console.log("len",len,printer_len,clamping_len);
    if (len==""){
        Swal.fire("please enter length");
    }
    else{
      // $("div#sw_config").show();
      socket.emit("skt_set_variant_length",{len:len,trgr_first:trgr_first,trgr_second:trgr_second,printer_len:printer_len,clamping_len:clamping_len});
      socket.on('skt_set_config_response', function(data){
        if (data.status=="1"){
          Swal.fire("Hardware setting done. Now capture images..");
          $("div#sw_config").show();
        }
      });
      socket.emit("skt_show_file");

    }


  });


  $('#btn_update').click(function(event) {

    var array=[];
    var myTab = document.getElementById('csv_tbl');

    // LOOP THROUGH EACH ROW OF THE TABLE AFTER HEADER.
    for (i = 1; i < myTab.rows.length; i++) {

        // GET THE CELLS COLLECTION OF THE CURRENT ROW.
        var objCells = myTab.rows.item(i).cells;
        console.log(objCells);
        // console.log("No. of rows :"+  objCells.lenght);
        // console.log(objCells[1].innerText,objCells[2].innerText,objCells[3].innerText,objCells[4].innerText);
        var label  = objCells[1].innerText;
        var roi_arr= (objCells[2].innerText).split(",");
        var area   = objCells[3].innerText;


        var u_x1 = roi_arr[0];
        var u_x2 = roi_arr[1];
        var u_y1 = roi_arr[2];
        var u_y2 = roi_arr[3];


         var hsv_min_arr = (objCells[4].innerText).split(",");
         var hsv_max_arr = (objCells[5].innerText).split(",");

         var u_h_min=hsv_min_arr[0];
         var u_s_min=hsv_min_arr[1];
         var u_v_min=hsv_min_arr[2];

         var u_h_max=hsv_max_arr[0];
         var u_s_max=hsv_max_arr[1];
         var u_v_max=hsv_max_arr[2];

         array.push([label,u_x1,u_x2,u_y1,u_y2,area,u_h_min,u_s_min,u_v_min,u_h_max,u_s_max,u_v_max]);

    }

    // console.log(array);
    $("#csv_tbl > tbody").html("");
    socket.emit('skt_file_update', {img_data:array});
      Swal.fire('Updated!','Your file has been Updated.','success');
  });

  function updateCoords_roi(im ,obj){

      x1=obj.x1;
      x2=obj.x2;
      y1=obj.y1;
      y2=obj.y2;
      socket.emit('skt_roi_select', {x1:x1,y1:y1,x2:x2,y2:y2});
      console.log(x1,x2,y1,y2);
    }

   // $('#ooi_img').imgAreaSelect({
   //      onSelectEnd: updateCoords
   //       });

    $('#btn_crop').click(function(event){


        $('#roi_img').imgAreaSelect({
            x1: 50, y1: 50, x2: 100, y2: 100,
            onSelectEnd: updateCoords_ooi,
            parent: 'div#img_div'
          });

          $('#org_image').imgAreaSelect({
              x1: 50, y1: 50, x2: 100, y2: 100,
              onSelectEnd: updateCoords_roi,
              // parent: 'div#img_div'
            });
    });

    function updateCoords_ooi(im ,obj){

        ox1=obj.x1;
        ox2=obj.x2;
        oy1=obj.y1;
        oy2=obj.y2;
        socket.emit('skt_ooi_select', {x1:ox1,y1:oy1,x2:ox2,y2:oy2});
        console.log(x1,x2,y1,y2);
      }



  });

function edit_row(no)
    {
      document.getElementById("edit_button"+no).style.display="none";
      document.getElementById("save_button"+no).style.display="block";

      var label=document.getElementById("label"+no);
      var hsv_min=document.getElementById("hsv_min"+no);
      var hsv_max=document.getElementById("hsv_max"+no);
      var roi=document.getElementById("roi"+no);
      var area=document.getElementById("area"+no);


      var label_data=label.innerHTML;
      var hsv_min_data=hsv_min.innerHTML;
      var hsv_max_data=hsv_max.innerHTML;
      var roi_data=roi.innerHTML;
      var area_data=area.innerHTML;

      // label.innerHTML='<select value="'+label_data+'"> <option value="Druck">Druck</option> <option value="Zahl">Zahl</option> </select>'
      label.innerHTML="<input style='width:100px' type='text' id='label_text"+no+"' value='"+label_data+"'>";
      // hsv_min.innerHTML="<input style='width:100px' type='text' id='hsv_min_text"+no+"' value='"+hsv_min_data+"'>";
      // hsv_max.innerHTML="<input style='width:100px' type='text' id='hsv_max_text"+no+"' value='"+hsv_max_data+"'>";
      // roi.innerHTML="<input style='width:200px' type='text' id='roi_text"+no+"' value='"+roi_data+"'>";
      area.innerHTML="<input style='width:100px' type='number' id='area_text"+no+"' value='"+area_data+"'>";

      // document.getElementById("label_text"+no).focus();

    }

    function save_row(no)
    {
    var label_val=document.getElementById("label_text"+no).value;
    // var hsv_min_val=document.getElementById("hsv_min_text"+no).value;
    // var hsv_max_val=document.getElementById("hsv_max_text"+no).value;
    // var roi_val=document.getElementById("roi_text"+no).value;
    var area_val=document.getElementById("area_text"+no).value;


    document.getElementById("label"+no).innerHTML=label_val;
    // document.getElementById("hsv_min"+no).innerHTML=hsv_min_val;
    // document.getElementById("hsv_max"+no).innerHTML=hsv_max_val;
    // document.getElementById("roi"+no).innerHTML=roi_val;
    document.getElementById("area"+no).innerHTML=area_val;



    document.getElementById("edit_button"+no).style.display="block";
    document.getElementById("save_button"+no).style.display="none";
    }
    function delete_row(no)
    {
    document.getElementById("row"+no+"").outerHTML="";
    }
