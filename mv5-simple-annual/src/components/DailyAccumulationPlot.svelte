<script>
	// Exports
	export let element_id = 'default-daily-accumulation-plot';
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
  // Plot configuration
  import {
    // dailyBarplotConfig,
    // small_dailyBarplotConfig,
    pm25_addAQIStackedBar,
  } from "air-monitor-plots";
  import { circle } from 'leaflet';



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
      const daily = monitor.getDailyStats(id);

      // https://stackoverflow.com/questions/20477177/creating-an-array-of-cumulative-sum-in-javascript
      // NOTE:  This even works when some values are null as null is interpreted as zero
      // const daily_cumsum = daily.mean.map((sum => value => sum += value)(0));

      let daily_cumsum = [];
      let daily_GOOD = [];
      let daily_MOD = [];
      daily_cumsum[0] = daily.mean[0];
      daily_GOOD[0] = 12;
      daily_MOD[0] = 35.5;
      for (let i = 1; i < daily.mean.length; i++) {
        daily_cumsum[i] = daily_cumsum[i-1] + daily.mean[i];
        daily_GOOD[i] = daily_GOOD[i-1] + 12;
        daily_MOD[i] = daily_MOD[i-1] + 35.5
      }

      // Assemble required plot data
      const plotData = {
        daily_datetime: daily.datetime,
        daily_cumsum: daily_cumsum,
        locationName: monitor.getMetadata(id, 'locationName'),
        timezone: monitor.getMetadata(id, 'timezone'),
        title: '' // use default title
      }



// =============================================================================

  let startTime = plotData.daily_datetime[0];

  let title = plotData.title;
  if (plotData.title === undefined) {
    title = plotData.locationName;
  }

  let chartConfig = {
    accessibility: { enabled: false },
    chart: {
      animation: false,
      plotBorderColor: "#ddd",
      plotBorderWidth: 1,
    },
    plotOptions: {
      series: {
        animation: false,
      },

      line: {
        animation: false,
        color: "#000",
        lineWidth: 1,
        marker: { radius: 1, symbol: "square", fillColor: "transparent" },
      },
    },
    title: {
      text: title,
    },
    time: {
      timezone: plotData.timezone,
      useUTC: false,
    },
    xAxis: {
      type: "datetime",
      // title: {margin: 20, style: { "color": "#333", "fontSize": "16px" }, text: xAxis_title},
      // gridLineColor: "#ddd",
      // gridLineDashStyle: "Dash",
      // gridLineWidth: 1,
      // minorTicks: true,
      // minorTickInterval: 3 * 3600 * 1000, // every 3 hrs
      // minorGridLineColor: "#eee",
      // minorGridLineDashStyle: "Dot",
      // minorGridLineWidth: 1,
    },
    yAxis: {
      // min: ymin,
      // max: ymax,
      // gridLineColor: "#ddd",
      // gridLineDashStyle: "Dash",
      // gridLineWidth: 1,
      title: {
        text: "Y_AXIS_LABEL",
      },
      // plotLines: pm25_AQILines(2),
    },
    legend: {
      enabled: true,
      verticalAlign: "top",
    },
    series: [
      {
        name: "Cumulative PM2.5",
        type: "line",
        lineWidth: 2,
        pointInterval: 1000 * 3600 * 1000 * 24,
        pointStart: startTime.valueOf(), // milliseconds
        data: plotData.daily_cumsum,
      },
      {
        name: "GOOD",
        type: "line",
        color: "green",
        lineWidth: 1,
        pointInterval: 1000 * 3600 * 1000 * 24,
        pointStart: startTime.valueOf(), // milliseconds
        data: daily_GOOD,
      },
      {
        name: "MOD",
        type: "line",
        color: "yellow",
        lineWidth: 1,
        pointInterval: 1000 * 3600 * 1000 * 24,
        pointStart: startTime.valueOf(), // milliseconds
        data: daily_MOD,
      },
    ],
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