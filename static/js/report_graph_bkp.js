
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

     socket.emit('skt_show_graph_by_date',{fromdate:fd,todate:td});
   });

   socket.on('skt_show_graph_by_date_response', function(data){
    var recv_data = data.data;
    console.log("data :",data.data);
    for(var c = 0;c < recv_data.length;c++){
            console.log("index",recv_data[3],typeof(recv_data[3]));
            var iDiv = document.createElement('div');
            iDiv.id = recv_data[c][0];
            iDiv.className = 'col l4';

            document.getElementById('graph').appendChild(iDiv);

             var var_name =recv_data[c][0];
             var tbl= "<table>"+
                     "<tr><th>Good</th>"+
                     "<th>Bad</th>"+
                     "<th>Total</th></tr>"+
                     "<tr><td>"+recv_data[c][1]+"</td>"+
                     "<td>"+recv_data[c][2]+"</td>"+
                     "<td>"+recv_data[c][3]+"</td></tr></table>";


              if (recv_data[c][3]!=0){
                let g_per = (recv_data[c][1]/recv_data[c][3])*100;
                let b_per = (recv_data[c][2]/recv_data[c][3])*100;
                console.log("per :",g_per,b_per);
                var percent="<b style='color:green;font-size:30px'>"+Math.round(g_per)+" %</b> <b style='color:blue;font-size:30px'>|</b> <b style='color:red;font-size:30px'>"+Math.round(b_per)+" %</b>";

                var ser_data =[
                    {name:"Good",y: g_per, color: 'green'},
                    {name:"Bad",y: b_per, color: 'red' },

                ]
              }
              else{
                var percent="<b style='color:green;font-size:30px'>0 %</b> <b style='color:blue;font-size:30px'>|</b> <b style='color:red;font-size:30px'>0 %</b>";

                var ser_data =[
                    {name:"No Data",y: 100, color: 'gray'}
                ]
              }




             Highcharts.chart(recv_data[c][0], {
               chart: {
                   plotBackgroundColor: null,
                   plotBorderWidth: 0,
                   plotShadow: false,
                   animation: false,
                   events: {
                     load: function() {

                       var chart = this;
                       chart.renderer.text(tbl, 30, 65,'useHTML')
                            .css({
                                color: '#4572A7',
                                fontSize: '16px'
                            })
                            .add();

                        chart.renderer.text(percent, 200, 110,'useHTML')
                             .css({
                                 color: '#4572A7',
                                 fontSize: '16px'
                             })
                             .add();

                     }
                   }

               },
               title: {
                       text: var_name,
                       style: {
                        fontSize: '30px',

                     }
                 },
                 exporting: { enabled: false },

                 credits : {
                    enabled: false},

               tooltip: {
                   pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
               },
               accessibility: {
                   point: {
                       valueSuffix: '%'
                   }
               },
               plotOptions: {
                   pie: {
                       dataLabels: {
                           enabled: true,
                           distance: -50,
                           style: {
                               fontWeight: 'bold',
                               color: 'white'
                           }
                       },
                       startAngle: -90,
                       endAngle: 90,
                       center: ['50%', '90%'],
                       size: '110%'
                   }
               },
               // series: [{
               //     type: 'pie',
               //     name: 'Percent',
               //     innerSize: '50%',
               //     data: [
               //         ['Good', 80],
               //         ['Bad',20],
               //
               //     ]
               // }]

               series: [{
                   type: 'pie',
                   name: 'Percent',
                   innerSize: '40%',
                   data: ser_data
                  }]
           });
}
});
