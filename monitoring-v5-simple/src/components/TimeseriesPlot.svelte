<script>
	// Exports
	export let div_id = 'default-timeseries-plot';

	// Imports
  // Svelte methods
  import { afterUpdate } from 'svelte';
  // Svelte stores
  import { all_monitors } from '../stores/monitor-data-store.js';
  import { selected_id } from "../stores/gui-store.js";
  // Highcharts for plotting
  import Highcharts from 'highcharts';
  // Other functions
  import { timeseriesPlotConfig } from "../scripts/plot-utils.js";

  // Good examples to learn from:
  //   https://www.youtube.com/watch?v=s7rk2b1ioVE
  //   https://svelte.dev/repl/d283589caa554badb16644ad40682802?version=3.38.2

  // We need these variables to live on after an individual chart is destroyed
  let chartConfig;
  let context;
  let myChart;
	// let div_id;

  function createChart() {

    context = document.getElementById(div_id);

    // See https://www.youtube.com/watch?v=s7rk2b1ioVE @ 6:30
    if (myChart) myChart.destroy();

    // Get a copy of the reactive data and id
    const monitor = $all_monitors;
    const id = $selected_id;

		// Get required data from the monitor object
		const plotData = {
			datetime: monitor.getDatetime(),
			pm25: monitor.getPM25(id),
			nowcast: monitor.getNowcast(id),
			locationName: monitor.getMetadata(id, 'locationName'),
			timezone: monitor.getMetadata(id, 'timezone'),
			title: undefined // use default title
		}

		// Create the chartConfig
		chartConfig = timeseriesPlotConfig(plotData);
		
    myChart = Highcharts.chart(context, chartConfig)

  }

  // Regenerate the chart after any update
  afterUpdate(createChart);
</script>

<div class="chart-wrapper">
	<span id="{div_id}" class="chart-container"></span>
</div>

<style>
	.chart-wrapper {
		display: inline-block;
		/* width: 300px;
		height: 300px; */
	}
  .chart-container {
		display: inline-block;
		border: 2px solid black;
  }
</style>