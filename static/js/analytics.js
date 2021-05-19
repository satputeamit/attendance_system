
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
    var td = document.getElementById('todate').value;

    console.log("search btn clicked :",fd,td);

    // $("#csv_tbl > tbody").html("");
    socket.emit('skt_show_graph_by_date',{fromdate:fd,todate:td});

     socket.emit('skt_show_detail_result_by_date',{fromdate:fd,todate:td});
  });

  $('#div_all').click(function(event){
    // $("#csv_tbl > tbody").html("");
     socket.emit('skt_show_all_result');
  });

  $('#btn_search_tdy').click(function(event){
    // $("#csv_tbl > tbody").html("");
    let dt = new Date()
    let cur_dt = dt.getFullYear()+"-"+(dt.getMonth()+1)+"-"+dt.getDate()
    console.log("div clicked",cur_dt);
    socket.emit('skt_show_graph_by_date',{fromdate:cur_dt,todate:cur_dt});
    socket.emit('skt_show_today_result');
  });

  function edit_row(id)
      {
      console.log(id);
      socket.emit('skt_show_detail_result',{id:id});
      }

  socket.on('skt_show_today_result_response', function(data){
      console.log("hi");
      var obj = JSON.parse(data.data)
      // console.log(obj);
      var tabl = $("#today_tbl");

      document.getElementById("t_good_count").innerHTML = data.good_count;
      document.getElementById("t_bad_count").innerHTML = data.bad_count;
      document.getElementById("t_total_count").innerHTML = data.total_count;

      $("#today_tbl > tbody").html("");
      var i;
      var j;
      var cnt=0;

      for (i = 0; i < obj.length; i++) {
            cnt=i+1;
            //added
            let id =  obj[i]._id["$oid"];

            // TIEM CONVERSION
            let obj_date = parseInt(obj[i].timestamp["$date"])
            let record_date = new Date(obj_date)
            record_date.setMinutes(record_date.getMinutes() - 330);
            // console.log("timestamp;",record_date,obj_date);
            let hours,minutes,seconds;
            if (record_date.getHours()>=10){
               hours = record_date.getHours()
            }
            else{
               hours = "0"+record_date.getHours()
            }

            if (record_date.getMinutes()>=10){
               minutes = record_date.getMinutes()
            }
            else{
               minutes = "0"+record_date.getMinutes()
            }


            if (record_date.getSeconds()>=10){
               seconds = record_date.getSeconds()
            }
            else{
               seconds = "0"+record_date.getSeconds()
            }


            let record_time = hours+":"+minutes+":"+seconds
            // --------------------------

            tabl.append(
                '<tr id="row'+cnt+'">' +
                '<td>' +cnt+ '</td>'+
                '<td id =""' +cnt+ '><a href="#" onclick="edit_row(`'+id+'`)">' +obj[i].variant_name+ '</a></td>'+
                '<td id =""'+cnt+'">'+record_time+'</td>'+
                '<td id =""'+cnt+'">'+(obj[i].status=="good" ? '<span style="color:green">Accept</span>' : '<span style="color:red">Reject</span>')+'</td>'+


                '</tr>'
              );
          }

          document.getElementById("total_cnt").innerHTML = cnt;

      });

  socket.on('skt_show_detail_result_response', function(data){
      console.log("hi");
      let data_val = data.detail[0]
      let keys = Object.keys(data_val);
      var tabl = $("#detail_tbl");

      console.log(data_val);
    $("#detail_tbl > tbody").html("");
      var i;
      var j;
      var cnt=0;


      for (i = 0; i < keys.length; i++) {
            cnt=i+1;
            //added
            // console.log(data_val[keys[i]][0]);
            tabl.append(
            '<tr id="row'+cnt+'"'+(data_val[keys[i]][2]=="good" ? 'style="background-color:rgba(0,255,0,0.5);"':'style="background-color:rgba(252,0,0,0.5);"')+'>' +
            '<td id =""'+cnt+'">'+keys[i]+'</td>'+
            '<td id =""'+cnt+'">'+data_val[keys[i]][0]+'</td>'+
            '<td id =""'+cnt+'">'+data_val[keys[i]][1]+'</td>'+
            '</tr>'
              );
          }
      });


      socket.on('skt_show_detail_result_by_date_response', function(data){
          console.log("hi");

          var obj = JSON.parse(data.data)
          console.log(data);
          var tabl = $("#date_tbl");
          document.getElementById('w_good_count').innerHTML=data.good_count;
          document.getElementById('w_bad_count').innerHTML=data.bad_count;
          document.getElementById('w_total_count').innerHTML=data.total_count;

        $("#date_tbl > tbody").html("");
          var i;
          var j;
          var cnt=0;


          for (i = 0; i < obj.length; i++) {
                cnt=i+1;
                let id =  obj[i]._id["$oid"];

                // TIEM CONVERSION
                let obj_date = parseInt(obj[i].timestamp["$date"])
                let record_date = new Date(obj_date)
                record_date.setMinutes(record_date.getMinutes() - 330);
                // console.log("timestamp;",record_date,obj_date);
                let hours,minutes,seconds;
                if (record_date.getHours()>=10){
                   hours = record_date.getHours()
                }
                else{
                   hours = "0"+record_date.getHours()
                }

                if (record_date.getMinutes()>=10){
                   minutes = record_date.getMinutes()
                }
                else{
                   minutes = "0"+record_date.getMinutes()
                }

                if (record_date.getSeconds()>=10){
                   seconds = record_date.getSeconds()
                }
                else{
                   seconds = "0"+record_date.getSeconds()
                }

                let record_time = hours+":"+minutes+":"+seconds
                let _record_date = record_date.getDate()+"-"+(parseInt(record_date.getMonth())+1).toString()+"-"+record_date.getFullYear()
                // --------------------------

                // console.log(id);

                tabl.append(
                    '<tr id="row'+cnt+'">' +
                    '<td>' +cnt+ '</td>'+
                    '<td id =""' +cnt+ '><a href="#" onclick="edit_row(`'+id+'`)">' +obj[i].variant_name+ '</a></td>'+
                    '<td id =""'+cnt+'">'+_record_date+'</td>'+
                    '<td id =""'+cnt+'">'+record_time+'</td>'+
                    '<td id =""'+cnt+'">'+(obj[i].status=="good" ? '<span style="color:green">Accept</span>' : '<span style="color:red">Reject</span>')+'</td>'+

                    '</tr>'
                  );
              }
              document.getElementById("total_cnt").innerHTML = cnt;
          });

// table

function atotbl (id) {
    var d=document.getElementById("time").innerHTML;
    var usr_nm=document.getElementById("logged_user").innerHTML;
    // var cj=document.getElementById("c_job").innerHTML;
    // var t=parseInt({{good_count}})+parseInt({{bad_count}})
    var doc = new jsPDF();
    var dt= d.split("|")[1]
    // doc.addFileToVFS("MaterialIcons-Regular.ttf", 'MaterialIcons');
    // doc.addFont('MaterialIcons-Regular.ttf', 'MaterialIcons', 'normal');
    // doc.setFont('MaterialIcons');
    // console.log("doc:",d);
    doc.setFontSize(26);
    doc.text("Report", 14, 16);
    doc.setFontSize(10);
    doc.text("Time | Date :  " +d, 140, 16);
    doc.text("User Name :  " +usr_nm, 140, 21);
    if(id=="today_tbl"){
        let good=document.getElementById("t_good_count").innerHTML;
        let bad=document.getElementById("t_bad_count").innerHTML;
        let total=document.getElementById("t_total_count").innerHTML;
        doc.text("Date  :  "+dt, 14, 30);
        doc.text("Good  :  "+good, 14, 35);
        doc.text("Bad  :  "+bad, 50, 35);
        doc.text("Total  :  "+total, 100, 35);
    }

    if(id=="date_tbl"){
      let from_date=document.getElementById("fromdate").value;
      let to_date=document.getElementById("todate").value;
      let good=document.getElementById("w_good_count").innerHTML;
      let bad=document.getElementById("w_bad_count").innerHTML;
      let total=document.getElementById("w_total_count").innerHTML;
      doc.text("Date  :  "+from_date+" To "+to_date, 14, 30);
      doc.text("Good  :  "+good, 14, 35);
      doc.text("Bad  :  "+bad, 50, 35);
      doc.text("Total  :  "+total, 100, 35);
    }

    if(id=="all_tbl"){
        let good=document.getElementById("a_good_count").innerHTML;
        let bad=document.getElementById("a_bad_count").innerHTML;
        let total=document.getElementById("a_total_count").innerHTML;
        doc.text("Date  :  All", 14, 30);
        doc.text("Good  :  "+good, 14, 35);
        doc.text("Bad  :  "+bad, 50, 35);
        doc.text("Total  :  "+total, 100, 35);
    }
    // doc.text("Part  :  "+cp, 14, 25);
    // doc.text("Job   :  "+cj, 14, 30);
    // doc.text("Good  :  "+{{good_count}}, 150, 25);
    // doc.text("Bad     :  "+{{bad_count}}, 150, 30);
    // doc.text("Total   :  "+t, 150, 35);

    var elem = document.getElementById(id);
    var res = doc.autoTableHtmlToJson(elem);
    var data=res.data;
    console.log("res",data);
    // doc.autoTable(res.columns, res.data, {startY: 35});
    doc.autoTable(res.columns,  data, {
        theme: 'grid',
        startY: 40,


    });

    console.log((dt));
    doc.save("report_"+dt+".pdf");
};
