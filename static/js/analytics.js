
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


  $('#btn_search').click(function(event){
    var fd = document.getElementById('fromdate').value;
//    var td = document.getElementById('todate').value;

     console.log("search btn clicked :",fd);

     socket.emit('skt_show_detail_result_by_date',{fromdate:fd});
  });


  socket.on('skt_show_detail_result_by_date_response', function(data){
      console.log("hi");
//      var obj = JSON.parse(data.data)
      var obj = data.result
       console.log(obj);
      var tabl = $("#today_tbl");


      $("#today_tbl > tbody").html("");
      var i;
      var j;
      var cnt=0;

      for (i = 0; i < obj.length; i++) {
            cnt=i+1;

            tabl.append(
                '<tr id="row'+cnt+'">' +
                '<td>' +cnt+ '</td>'+
                '<td id =""'+cnt+'">'+obj[i].name+'</td>'+
                '<td id =""'+cnt+'">'+obj[i].date+'</td>'+
                '<td id =""'+cnt+'">'+obj[i].in_time+'</td>'+
                '<td id =""'+cnt+'">'+obj[i].out_time+'</td>'+
                '<td id =""'+cnt+'">'+(obj[i].value==0?'<span style="color:red">Absent</span>':'<span style="color:green">Present</span>')+'</td>'+
                '</tr>'
              );
          }



      });



// table

function atotbl (id) {

    var doc = new jsPDF();
//    var dt= d.split("|")[1]
    doc.setFontSize(26);
    doc.text("Report", 14, 16);
    doc.setFontSize(10);
//    doc.text("Date :  " +"", 140, 16);


    var elem = document.getElementById(id);
    var res = doc.autoTableHtmlToJson(elem);
    var data=res.data;
    console.log("res",data);
    // doc.autoTable(res.columns, res.data, {startY: 35});
    doc.autoTable(res.columns,  data, {
        theme: 'grid',
        startY: 40,


    });

    doc.save("report_"+".pdf");
};
