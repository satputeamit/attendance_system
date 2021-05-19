Highcharts.chart('container', {
    chart: {
        type: 'bar',
         events: {
                     load: function() {

                       var chart = this;
                       chart.renderer.text('Total : 722', 10, 50,'useHTML')
                            .css({
                                color: '#4572A7',
                                fontSize: '20px'
                            })
                            .add();

                        chart.renderer.text("80 % | 20 %", 200, 50,'useHTML')
                             .css({
                                 color: '#4572A7',
                                 fontSize: '20px'
                             })
                             .add();

                     }
                   }
    },

    title: {
        text: '<b style="font-size:20px" underline;>CT100</b> ',
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
        categories: ['Apples'],
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
    series: [{
     showInLegend: false,
        data: [{name:"Good",y: 522, color: 'red'}],
    }, {
     showInLegend: false,
        data: [{name:"Good",y: 200, color: 'green'}]
    }]
});
