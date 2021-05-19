$(document).ready(function(){
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port );
    var seat_list;
    socket.emit("skt_get_all_seats");
    var var_nm = document.getElementById("hidden_var").value;
    socket.emit("skt_update",{variant : var_nm});

    socket.on("skt_get_all_seats_response",data=>{
      console.log("hi");
      seat_list = data.data
      console.log(seat_list);

      });


      socket.on("skt_update_response",data=>{
          console.log("hi");
          data_f = data.data
          var feature = Object.keys(data_f['feature']);
          document.getElementById("id_varnm").value = var_nm;
          console.log(feature);
          // set feature
          feature.forEach(function(element) {
              document.getElementById("id_"+element).value =  data_f["feature"][element];
          });

          // set trgr

            document.getElementById("id_trgr").value =  data_f["setting"]["trigger_len"];
            document.getElementById("id_clamp_trgr").value =  data_f["setting"]["clamp_trigger_len"];
            document.getElementById("id_print_trgr").value =  data_f["setting"]["printer_trigger_len"];

            var dataURL="data:image/jpeg;base64,"+data.image;
            document.getElementById("prev_img").src = dataURL;

      });

    $("#btn_upload").click(function(){
        var varnm = document.getElementById("id_varnm").value;
        var fd = new FormData();
        var files = $('#file')[0].files[0];
        fd.append('file',files,varnm);
        console.log(varnm,seat_list);
        var var_nm = document.getElementById("hidden_var").value;

        if(seat_list.includes(varnm) && var_nm=="_new_seat"){
          Swal.fire("Variant name already present");
        }
        else{
          if(varnm !=""){
            $.ajax({
                url: '/uploader',
                type: 'post',
                data: fd,
                contentType: false,
                processData: false,
                success: function(response){
                    if(response != "False"){
                      var dataURL="data:image/jpeg;base64,"+response;
                      document.getElementById("prev_img").src = dataURL;
                    }else{
                        alert('file not uploaded');
                    }
                },
            });
          }
          else{
            Swal.fire("please enter variant name.");
          }

        }

    });


});
