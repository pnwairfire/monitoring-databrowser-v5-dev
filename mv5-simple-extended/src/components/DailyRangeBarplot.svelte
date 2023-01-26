<script>
	// Exports
	export let element_id = 'default-daily-range-barplot';
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
  // 'columnrange' requires highcharts-more
  import more from 'highcharts/highcharts-more';
  more(Highcharts);
  // Plot configuration
  import {
    // dailyRangeBarplotConfig,
    // small_dailyRangeBarplotConfig,
    pm25ToYMax, pm25_AQILines,
    pm25_addAQIStackedBar,
    pm25ToColor,
  } from "air-monitor-plots";


  import moment from "moment-timezone";

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

      // Assemble required plot data
      // const plotData = {
      const data = {
        daily_datetime: daily.datetime,
        daily_min: daily.min,
        daily_mean: daily.mean,
        daily_max: daily.max,
        daily_nowcast: undefined, // not required
        locationName: monitor.getMetadata(id, 'locationName'),
        timezone: monitor.getMetadata(id, 'timezone'),
        title: undefined // use default title
      }



  // let seriesData = [];
  // for (let i = 0; i < data.daily_average.length; i++) {
  //   seriesData[i] = {
  //     y: data.daily_average[i],
  //     color: pm25ToColor(data.daily_average[i]),
  //   };
  // }

  let days = data.daily_datetime.map((x) =>
    moment.tz(x, data.timezone).format("MMM DD")
  );

  // Default to well defined y-axis limits for visual stability
  let ymin = 0;
  let ymax = pm25ToYMax(Math.max(...daily.max));

  let title = data.title;
  if (data.title === undefined) {
    title = data.locationName;
  }

  let dailyMean = [];
  for (let i = 0; i < daily.datetime.length; i++) {
    dailyMean[i] = { y: daily.mean[i], color: pm25ToColor(daily.mean[i]) };
  }

  let dailyRange = [];
  for (let i = 0; i < daily.datetime.length; i ++) {
    dailyRange[i] = [data.daily_min[i], data.daily_max[i]]
  }

  // ----- Chart configuration --------------------------------

  // let chartConfig = {
  //   accessibility: { enabled: false },
  //   chart: {
  //     plotBorderColor: "#ddd",
  //     plotBorderWidth: 1,
  //   },
  //   plotOptions: {
  //     column: {
  //       animation: false,
  //       allowPointSelect: true,
  //       borderColor: "#666",
  //       borderWidth: 1,
  //     },
  //   },
  //   title: {
  //     text: title,
  //   },
  //   xAxis: {
  //     categories: days,
  //   },
  //   yAxis: {
  //     min: ymin,
  //     max: ymax,
  //     gridLineColor: "#ddd",
  //     gridLineDashStyle: "Dash",
  //     gridLineWidth: 1,
  //     title: {
  //       text: "PM2.5 (\u00b5g/m\u00b3)",
  //     },
  //     plotLines: pm25_AQILines(2),
  //   },
  //   legend: {
  //     enabled: true,
  //     verticalAlign: "top",
  //   },
  //   series: [
  //     {
  //       name: "Daily Average PM2.5",
  //       type: "column",
  //       data: seriesData,
  //     },
  //   ],
  // };

  let chartConfig = {
    accessibility: { enabled: false },
    chart: {
      // type: 'columnrange',
      // inverted: false
    },
    plotOptions: {
      columnrange: {
        animation: false,
        // allowPointSelect: true,
        // borderColor: "#666",
        // borderWidth: 1,
      },
    },
    title: {
      text: title
    },
      xAxis: {
      categories: days,
    },
    yAxis: {
      min: ymin,
      max: ymax,
      gridLineColor: "#ddd",
      gridLineDashStyle: "Dash",
      gridLineWidth: 1,
      title: {
        text: "PM2.5 (\u00b5g/m\u00b3)",
      },
      plotLines: pm25_AQILines(2),
    },
    legend: {
      enabled: true,
      verticalAlign: "top",
    },


    series: [
      {
        name: 'Daily Range',
        type: "columnrange",
        data: dailyRange,
        color: "#bbb"
      },
      {
        name: 'Daily Mean',
        type: "scatter",
        data: dailyMean,
        animation: false,
        marker: {
          radius: 3,
          symbol: "circle",
          lineColor: "#333",
          lineWidth: 0.5,
        },
      }
    ]
  };





      // Create the chartConfig
      if ( size === 'small' ) {
        // chartConfig = small_dailyRangeBarplotConfig(plotData);
        myChart = Highcharts.chart(context, chartConfig);
        pm25_addAQIStackedBar(myChart, 4);
      } else {
        // chartConfig = dailyRangeBarplotConfig(plotData);
        myChart = Highcharts.chart(context, chartConfig);
        pm25_addAQIStackedBar(myChart, 6);
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