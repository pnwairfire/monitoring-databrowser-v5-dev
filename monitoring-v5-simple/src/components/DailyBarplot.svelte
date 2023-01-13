<script>
	// Exports
	export let div_id = 'default-diurnal-plot';

	// Imports
  // Svelte methods
  import { afterUpdate } from 'svelte';
  // Svelte stores
  import { all_monitors } from '../stores/monitor-data-store.js';
  import { selected_id } from "../stores/gui-store.js";
  // Highcharts for plotting
  import Highcharts from 'highcharts';
  // Other functions
  import { dailyBarplotConfig } from "../scripts/plot-utils.js";

  // Good examples to learn from:
  //   https://www.youtube.com/watch?v=s7rk2b1ioVE
  //   https://svelte.dev/repl/d283589caa554badb16644ad40682802?version=3.38.2

  // We need these variables to live on after an individual chart is destroyed
  let chartConfig;
  let context;
  let myChart;

  function createChart() {

    context = document.getElementById(div_id);

    // See https://www.youtube.com/watch?v=s7rk2b1ioVE @ 6:30
    if (myChart) myChart.destroy();

    // Get a copy of the reactive data and id
    const monitor = $all_monitors;
    const id = $selected_id;

    // Special method to get daily averages
    const {datetime, avg_pm25} = monitor.getDailyAverageObject(id);

		const plotData = {
			daily_datetime: datetime,
			daily_pm25: avg_pm25,
			daily_nowcast: undefined, // not required
			locationName: monitor.getMetadata(id, 'locationName'),
			timezone: monitor.getMetadata(id, 'timezone'),
			title: undefined // use default title
		}

		// Create the chartConfig
		chartConfig = dailyBarplotConfig(plotData);
		
    myChart = Highcharts.chart(context, chartConfig)

  }

  // Regenerate the chart after any update
  afterUpdate(createChart);
</script>

<div class="chart-wrapper">
	<div id="{div_id}" class="chart-container" 
	     style="width: 400px; height: 300px;"></div>
</div>

<style>
	.chart-wrapper {
		display: inline-block;
	}
  .chart-container {
		display: inline-block;
    border: 2px solid black;
  }
</style>