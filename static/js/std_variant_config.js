
  $(document).ready(function() {
  var x1 = 0;
  var y1 = 0;
  var x2 = 0;
  var y2 = 0;
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port );

  socket.emit("skt_std_show_file");
  socket.on('skt_roi_response', function(data){
      // console.log(data.s)
      var dataURL="data:image/jpeg;base64,"+data.roi_img;
      document.getElementById("roi_img").src = dataURL;
      // console.log(data.area);
      });

  socket.on('skt_img_not_select', function(data){
    console.log("data")
      if(data.msg=="0")
      {
        swal("Please select image first...");
      }
      });

      socket.on('skt_std_show_file_response', function(data){
        // console.log('in file data',data);
        var tabl = $("#csv_tbl");
        $("#csv_tbl td").remove();
        // $("#csv_tbl > tbody").html("");
        var i;
        var j;
        var cnt=0;

        for (i = 0; i < data.ldata.length; i++) {
              cnt=i+1;
              //added

              tabl.append(
              '<tr id="row'+cnt+'">' +
              '<td id =""'+cnt+'">'+cnt+'</td>'+
              '<td id ="label'+cnt+'">'+data.ldata[i][0]+'</td>'+
              '<td id ="roi'+cnt+'">' + data.ldata[i][1]+',  '+data.ldata[i][2]+',  '+data.ldata[i][3] + ',  '+data.ldata[i][4] +'</td>' +

              '<td><button type="button" name="button" class="btn-small orange darken-3 waves-effect waves-light" id="edit_button'+cnt+'" onclick="edit_row('+cnt+')" data-toggle="tooltip" data-placement="bottom" title="Edit Configuration" ><i class="material-icons white-text">edit</i></button><button type="button" name="button1" class="btn-small green darken-3 waves-effect waves-light" id="save_button'+cnt+'" onclick="save_row('+cnt+')" data-toggle="tooltip" data-placement="bottom" title="Save Configuration" style="display:none" ><i class="material-icons white-text">save</i></button><button type="button" name="button2" class="btn-small red darken-3 waves-effect waves-light" id="delete_button'+cnt+'" onclick="delete_row('+cnt+')" data-toggle="tooltip" data-placement="bottom" title="Delete Configuration" ><i class="material-icons white-text">delete</i></button></td>' +

              '</tr>'
                );
            }
        // console.log(data.s)

        });

  $('#btn_save').click(function(event){
    $("#csv_tbl > tbody").html("");
    socket.emit('skt_std_save_configuration',{x1:x1,y1:y1,x2:x2,y2:y2});

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
        socket.emit("skt_std_clear_configuration");
      }

    });
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


        var u_x1 = roi_arr[0];
        var u_x2 = roi_arr[1];
        var u_y1 = roi_arr[2];
        var u_y2 = roi_arr[3];

         array.push([label,u_x1,u_x2,u_y1,u_y2]);

    }

    // console.log(array);
    $("#csv_tbl > tbody").html("");
    Swal.fire('Updated!','Your file has been Updated.','success');
    socket.emit('skt_std_file_update', {img_data:array});


  });


  function updateCoords_roi(im ,obj){

      x1=obj.x1;
      x2=obj.x2;
      y1=obj.y1;
      y2=obj.y2;
      // socket.emit('skt_std_roi_select', {x1:x1,y1:y1,x2:x2,y2:y2});
      // console.log(x1,x2,y1,y2);
    }

    $('#btn_crop').click(function(event){


          $('#org_image').imgAreaSelect({
              x1: 50, y1: 50, x2: 100, y2: 100,
              onSelectEnd: updateCoords_roi,
              // parent: 'div#img_div'
            });
    });



  });


  function edit_row(no)
      {
        document.getElementById("edit_button"+no).style.display="none";
        document.getElementById("save_button"+no).style.display="block";

        var label=document.getElementById("label"+no);
        var roi=document.getElementById("roi"+no);

        var label_data=label.innerHTML;
        var roi_data=roi.innerHTML;



        label.innerHTML="<input style='width:100px' type='text' id='label_text"+no+"' value='"+label_data+"'>";

        document.getElementById("label_text"+no).focus();

      }

      function save_row(no)
      {
      var label_val=document.getElementById("label_text"+no).value;
      document.getElementById("label"+no).innerHTML=label_val;


      document.getElementById("edit_button"+no).style.display="block";
      document.getElementById("save_button"+no).style.display="none";
      }
      function delete_row(no)
      {
      document.getElementById("row"+no+"").outerHTML="";
      }

  // function getData() {
  //         $.ajax({
  //             url : "{{url_for('uploader')}}",
  //             type : "post",
  //             success : function(data) {
  //                 alert("success");
  //             }
  //         });
  //     }
