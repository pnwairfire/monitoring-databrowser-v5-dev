<script>
	// Exports
	export let element_id = 'default-daily-barplot';
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
    dailyBarplotConfig,
    small_dailyBarplotConfig,
    pm25_addAQIStackedBar,
  } from "air-monitor-plots";



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
      const plotData = {
        daily_datetime: daily.datetime,
        daily_mean: daily.mean,
        daily_nowcast: undefined, // not required
        locationName: monitor.getMetadata(id, 'locationName'),
        timezone: monitor.getMetadata(id, 'timezone'),
        title: '' // use default title
      }

      // Create the chartConfig
      if ( size === 'small' ) {
        chartConfig = small_dailyBarplotConfig(plotData);
        myChart = Highcharts.chart(context, chartConfig);
        pm25_addAQIStackedBar(myChart, 4);
      } else {
        chartConfig = dailyBarplotConfig(plotData);
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