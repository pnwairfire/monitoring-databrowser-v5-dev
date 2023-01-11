<script>
  import Highcharts from 'highcharts';
  import { afterUpdate } from 'svelte';
  // stores
  import { all_monitors } from '../stores/monitor-data-store.js';
  import { selected_id } from "../stores/gui-store.js";

  // Code to pull out data from all_monitors

  // Good examples to learn from:
  //   https://www.youtube.com/watch?v=s7rk2b1ioVE
  //   https://svelte.dev/repl/d283589caa554badb16644ad40682802?version=3.38.2
  let config = {
		title: {
        text: 'Solar Employment Growth by Sector, 2010-2016'
    },

    subtitle: {
        text: 'Source: thesolarfoundation.com'
    },

    yAxis: {
        title: {
            text: 'Number of Employees'
        }
    },

    xAxis: {
        accessibility: {
            rangeDescription: 'Range: 2010 to 2017'
        }
    },

    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 2010
        }
    },

    series: [{
        name: 'Installation',
        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
    }, {
        name: 'Manufacturing',
        data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
    }, {
        name: 'Sales & Distribution',
        data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
    }, {
        name: 'Project Development',
        data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
    }, {
        name: 'Other',
        data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }
	};

  let context;
  let myChart;

  function createChart() {

    context = document.getElementById('timeseries-plot');
    if (myChart) myChart.destroy();

    $: if ( $selected_id !== undefined ) {

          // get a copy of the reactive data and id
    let monitor = $all_monitors;
    let id = $selected_id;

    const locationName = monitor.getMetadata(id, 'locationName');
    const timezone = monitor.getMetadata(id, 'timezone');
    const datetime = monitor.getDatetime();
    // const pm25 = $all_monitors.getPM25($selected_id, 'pm25'););
    let pm25 = $all_monitors.data
      .array($selected_id)
      .map((x) =>
        x === undefined || x === null || isNaN(x)
          ? null
          : Math.round(10 * x) / 10
      );

    const nowcast = monitor.getNowcast(id);

    config.title.text = locationName + ' (' + timezone + ')';


    myChart = Highcharts.chart(context, config)
    }


  }

  afterUpdate(createChart);
</script>

<div id="timeseries-plot" class="chart-container"></div>
