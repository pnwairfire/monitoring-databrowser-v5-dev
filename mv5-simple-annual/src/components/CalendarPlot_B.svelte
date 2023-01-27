<script>
	// Exports
	export let element_id = 'default-calendar-plot';
  export let width = '400px';
  export let height = '300px';
  export let size = 'big';

  // Imports
  // Svelte methods
  import { afterUpdate } from 'svelte';
  // Svelte stores
  import { all_monitors } from '../stores/monitor-data-store.js';
  import { selected_id } from '../stores/gui-store.js';
  // Highcharts for plotting
  import Highcharts from 'highcharts';
  // 'heatmap' requires the heatmap module
  // https://www.highcharts.com/forum/viewtopic.php?t=46714
  import HighchartsHeatmap from "highcharts/modules/heatmap";
  HighchartsHeatmap(Highcharts);
  import HighchartsBoostCanvas from "highcharts/modules/boost-canvas";
  HighchartsBoostCanvas(Highcharts);
  import HighchartsBoost from "highcharts/modules/boost";
  HighchartsBoost(Highcharts);

  import moment from "moment-timezone";


  // Plot configuration
  import {
    // dailyBarplotConfig,
    // small_dailyBarplotConfig,
    pm25_addAQIStackedBar,
  } from "air-monitor-plots";

  // NOTE:  heatmap examples
  // - https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/heatmap-canvas/
  // - https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/heatmap/


  // Good examples to learn from:
  //   https://www.youtube.com/watch?v=s7rk2b1ioVE
  //   https://svelte.dev/repl/d283589caa554badb16644ad40682802?version=3.38.2

  // We need these variables to live on after an individual chart is destroyed
  let chartConfig;
  let context;
  let myChart;

  function createChart() {

    context = document.getElementById(element_id);

    // See https://www.youtube.com/watch?v=s7rk2b1ioVE @6:30
    if (myChart) myChart.destroy();

    // Get a copy of the reactive data and id
    const monitor = $all_monitors;
    const id = $selected_id;

    if ( id !== "" ) {

      // Special method to get an object containing daily averages
      // const daily = monitor.getDailyStats(id);

      // Assemble required plot data
      // const plotData = {
      //   daily_datetime: daily.datetime,
      //   daily_mean: daily.mean,
      //   locationName: monitor.getMetadata(id, 'locationName'),
      //   timezone: monitor.getMetadata(id, 'timezone'),
      //   title: '' // use default title
      // }



// =============================================================================

  let timezone = monitor.getMetadata(id, 'timezone');
  let datetime = monitor.getDatetime(id);
  let pm25 = monitor.getPM25(id);

  let seriesData = [];
  for (let i = 0; i < datetime.length; i++) {
    seriesData[i] = [
      moment.tz(datetime[i], timezone).dayOfYear(),
      moment.tz(datetime[i], timezone).hour(),
      pm25[i]
    ]
    if ( i % 720 == 0 ) {
      console.log(seriesData[i])
    }
  }



  // let startTime = plotData.daily_datetime[0];

  // let title = plotData.title;
  // if (plotData.title === undefined) {
  //   title = plotData.locationName;
  // }

  let chartConfig = {

// data: {
//     csv: document.getElementById('csv').innerHTML
// },

chart: {
    type: 'heatmap'
},

boost: {
    useGPUTranslations: true
},

title: {
    text: 'Highcharts heat map',
    align: 'left',
    x: 40
},

xAxis: {
    // type: 'datetime',
    // min: Date.UTC(2021, 0, 1),
    // max: Date.UTC(2021, 11, 31, 23, 59, 59),
    // labels: {
    //   align: 'left',
    //   x: 5,
    //   y: 14,
    //   format: '{value:%B}' // long month
    // },
    // showLastLabel: false,
    // tickLength: 16
},

yAxis: {
    // title: {
    //   text: null
    // },
    // labels: {
    //   format: '{value}:00'
    // },
    // minPadding: 0,
    // maxPadding: 0,
    // startOnTick: false,
    // endOnTick: false,
    // tickPositions: [0, 6, 12, 18, 24],
    // tickWidth: 1,
    // min: 0,
    // max: 23,
    // reversed: true
},

colorAxis: {
    // stops: [
    //     [0, '#3060cf'],
    //     [0.5, '#fffbbc'],
    //     [0.9, '#c4463a'],
    //     [1, '#c4463a']
    // ],
    // min: 0,
    // max: 500,
    // startOnTick: false,
    // endOnTick: false,
    // labels: {
    //     format: '{value}℃'
    // }
},

series: [{
    boostThreshold: 100,
    data: seriesData,
    borderWidth: 0,
    nullColor: '#EFEFEF',
    colsize: 24, //* 36e5, // one day
    // tooltip: {
    //     headerFormat: 'Temperature<br/>',
    //     pointFormat: '{point.x:%e %b, %Y} {point.y}:00: <b>{point.value} ℃</b>'
    // },
    turboThreshold: Number.MAX_VALUE // #3404, remove after 4.0.5 release
}]

};

// =============================================================================





      // Create the chartConfig
      if ( size === 'small' ) {
        // chartConfig = small_dailyBarplotConfig(plotData);
        myChart = Highcharts.chart(context, chartConfig);
        // pm25_addAQIStackedBar(myChart, 4);
      } else {
        // chartConfig = dailyBarplotConfig(plotData);
        myChart = Highcharts.chart(context, chartConfig);
        // pm25_addAQIStackedBar(myChart, 6);
      }

    }

  }

  // Regenerate the chart after any update
  afterUpdate(createChart);
</script>


<!-- Note that sizing needs to be included as part of the element style. -->
<div id="{element_id}" class="chart-container"
      style="width: {width}; height: {height};">
</div>

<style>

</style>