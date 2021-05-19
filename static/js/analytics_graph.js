
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
     $.LoadingOverlay("show");
     var fd = document.getElementById('selected_date').value;


     console.log("search btn clicked :",fd);

     socket.emit('skt_show_analytics_graph',{selected_date:fd});
   });

  socket.on('skt_show_analytics_graph_response', function(data){
    console.log(data)
    var seat_list = ["CT100","CT125","CT100X","NIGERIA","CT100B","100D","D2011JZ","B104-D","NEW_PLATINA_110"]



          var ser_data =[{
                            name: seat_list[0],
                            data: data.data[0]
                        }, {
                          name: seat_list[1],
                          data: data.data[1]
                        }, {
                          name: seat_list[2],
                          data: data.data[2]
                        },{
                          name: seat_list[3],
                          data: data.data[3]
                        },
                        {
                          name: seat_list[4],
                          data: data.data[4]
                        },
                        {
                          name: seat_list[5],
                          data: data.data[5]
                        },
                        {
                          name: seat_list[6],
                          data: data.data[6]
                        },
                        {
                          name: seat_list[7],
                          data: data.data[7]
                        },
                        {
                          name: seat_list[8],
                          data: data.data[8]
                        },
                      ]

          Highcharts.chart('graph', {
                  chart: {
                      type: 'column'
                  },
                  title: {
                      text: 'Performance chart'
                  },
                  xAxis: {
                    categories: ['0-1', '1-2', '2-3', '3-4', '4-5','5-6','6-7','7-8','8-9','9-10','10-11','11-12','12-13','13-14','14-15','15-16','16-17','17-18','18-19','19-20','20-21','21-22','22-23','23-24'],
                    title: {
                        text: 'Hours'
                    },

                  },

                   credits : {
                      enabled: false},
                  yAxis: {
                      min: 0,
                      title: {
                          text: 'Total Seats'
                      },
                      stackLabels: {
                          enabled: true,
                          style: {
                              fontWeight: 'bold',
                              color: ( // theme
                                  Highcharts.defaultOptions.title.style &&
                                  Highcharts.defaultOptions.title.style.color
                              ) || 'gray'
                          }
                      }
                  },
                  legend: {
                      align: 'right',
                      x: -30,
                      verticalAlign: 'top',
                      y: 25,
                      floating: true,
                      backgroundColor:
                          Highcharts.defaultOptions.legend.backgroundColor || 'white',
                      borderColor: '#CCC',
                      borderWidth: 1,
                      shadow: false
                  },
                  tooltip: {
                      headerFormat: '<b>{point.x}</b><br/>',
                      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                  },
                  plotOptions: {
                      column: {
                          stacking: 'normal',
                          dataLabels: {
                              enabled: true
                          }
                      },
                      series: {
                          dataLabels:{
                              enabled:true,
                              formatter:function(){
                                  if(this.y > 0)
                                      return this.y;
                              }
                          },
                          pointWidth: 40
                      }
                  },


                  series: ser_data
              });

              $.LoadingOverlay("hide");


        });
