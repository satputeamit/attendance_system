
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
     $("#graph").empty();
    var recv_data = data.data;
    console.log("data :",data.data);
    for(var c = 0;c < recv_data.length;c++){
            console.log("index",recv_data[3],typeof(recv_data[3]));
            var iDiv = document.createElement('div');
            iDiv.id = recv_data[c][0];
            // iDiv.className = 'col l4';
            iDiv.style.cssText="height:120px;"



             var var_name =recv_data[c][0];
             var tbl= "<table>"+
                     "<tr><th>Good</th>"+
                     "<th>Bad</th>"+
                     "<th>Total</th></tr>"+
                     "<tr><td>"+recv_data[c][1]+"</td>"+
                     "<td>"+recv_data[c][2]+"</td>"+
                     "<td>"+recv_data[c][3]+"</td></tr></table>";
              var txt_total ='Total : '+recv_data[c][3]


              if (recv_data[c][3]!=0){

                document.getElementById('graph').appendChild(iDiv);
                 $(iDiv).append('<hr />');
                let g_per = (recv_data[c][1]/recv_data[c][3])*100;
                let b_per = (recv_data[c][2]/recv_data[c][3])*100;
                console.log("per :",g_per,b_per);
                var percent="<b style='color:green;font-size:20px'>"+Math.round(g_per)+" %</b> <b style='color:blue;font-size:20px'>|</b> <b style='color:red;font-size:20px'>"+Math.round(b_per)+" %</b>";

                // var ser_data =[
                //     {name:"Good",y: g_per, color: 'green'},
                //     {name:"Bad",y: b_per, color: 'red' },
                //
                // ]

                var ser_data =[{
                 showInLegend: false,
                    data: [{name:"bad",y: recv_data[c][2], color: 'red'}],
                }, {
                 showInLegend: false,
                    data: [{name:"Good",y: recv_data[c][1], color: 'green'}]
                }]

                Highcharts.chart(recv_data[c][0], {
                    chart: {
                        type: 'bar',
                        animation: false,
                         events: {
                                     load: function() {

                                       var chart = this;
                                       chart.renderer.text(txt_total, 10, 50,'useHTML')
                                            .css({
                                                color: '#000099',
                                                fontSize: '20px'
                                            })
                                            .add();

                                        chart.renderer.text(percent, 130, 40,'useHTML')
                                             .css({
                                                 color: '#000099',
                                                 fontSize: '20px'
                                             })
                                             .add();

                                     }
                                   }
                    },

                    title: {
                        text: '<b style="font-size:20px;font-weight: 1000" >'+var_name+'</b> ',
                        align: 'left',

                    },
                     tooltip: {
                        enabled: false
                    },
                     exporting: { enabled: false },

                   credits : {
                      enabled: false},

                    xAxis: {
                    gridLineWidth: 0,
                        categories: [],
                          labels:{
                                    enabled:false
                                  }

                    },
                    yAxis: {
                    gridLineWidth: 0,
                        min: 0,
                        title: {
                            text: ''
                        },
                          labels:{
                                        enabled:false
                                    }
                    },
                    legend: {
                        reversed: true
                    },
                    plotOptions: {
                        series: {
                          animation: {
                                    duration: 0
                                  },
                         dataLabels: {
                                enabled: true,
                                 style: {
                                    fontWeight: 'bold',
                                    fontSize: "20"
                                }
                            },
                            stacking: 'normal'
                        },

                    },
                    series: ser_data
                });
              }
              else{
                console.log("Not found");
              }




           //   Highcharts.chart(recv_data[c][0], {
           //     chart: {
           //         plotBackgroundColor: null,
           //         plotBorderWidth: 0,
           //         plotShadow: false,
           //         animation: false,
           //         events: {
           //           load: function() {
           //
           //             var chart = this;
           //             chart.renderer.text(tbl, 30, 65,'useHTML')
           //                  .css({
           //                      color: '#4572A7',
           //                      fontSize: '16px'
           //                  })
           //                  .add();
           //
           //              chart.renderer.text(percent, 200, 110,'useHTML')
           //                   .css({
           //                       color: '#4572A7',
           //                       fontSize: '16px'
           //                   })
           //                   .add();
           //
           //           }
           //         }
           //
           //     },
           //     title: {
           //             text: var_name,
           //             style: {
           //              fontSize: '30px',
           //
           //           }
           //       },
           //       exporting: { enabled: false },
           //
           //       credits : {
           //          enabled: false},
           //
           //     tooltip: {
           //         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
           //     },
           //     accessibility: {
           //         point: {
           //             valueSuffix: '%'
           //         }
           //     },
           //     plotOptions: {
           //         pie: {
           //             dataLabels: {
           //                 enabled: true,
           //                 distance: -50,
           //                 style: {
           //                     fontWeight: 'bold',
           //                     color: 'white'
           //                 }
           //             },
           //             startAngle: -90,
           //             endAngle: 90,
           //             center: ['50%', '90%'],
           //             size: '110%'
           //         }
           //     },
           //     // series: [{
           //     //     type: 'pie',
           //     //     name: 'Percent',
           //     //     innerSize: '50%',
           //     //     data: [
           //     //         ['Good', 80],
           //     //         ['Bad',20],
           //     //
           //     //     ]
           //     // }]
           //
           //     series: [{
           //         type: 'pie',
           //         name: 'Percent',
           //         innerSize: '40%',
           //         data: ser_data
           //        }]
           // });
}
});
