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
  // moment for timezone-aware date formatting
  import moment from 'moment-timezone';
  // Other functions
  import { pm25ToColor, pm25ToYMax } from "../scripts/plot-utils.js";

  // Good examples to learn from:
  //   https://www.youtube.com/watch?v=s7rk2b1ioVE
  //   https://svelte.dev/repl/d283589caa554badb16644ad40682802?version=3.38.2

  // We need these variables to live on after an individual chart is destroyed
  let config;
  let context;
  let myChart;

  function createChart() {

    context = document.getElementById(div_id);

    // See https://www.youtube.com/watch?v=s7rk2b1ioVE @ 6:30
    if (myChart) myChart.destroy();

    // Get a copy of the reactive data and id
    const monitor = $all_monitors;
    const id = $selected_id;

    // Get required data
    const locationName = monitor.getMetadata(id, 'locationName');
    const timezone = monitor.getMetadata(id, 'timezone');
    const {datetime, avg_pm25} = monitor.getDailyAverageObject(id);

		// Create colored series data
		// See:  https://stackoverflow.com/questions/35854947/how-do-i-change-a-specific-bar-color-in-highcharts-bar-chart
		let seriesData = [];
		for (let i = 0; i < avg_pm25.length; i++) {
			seriesData[i] = {
				y: avg_pm25[i],
				color: pm25ToColor(avg_pm25[i])
			};
		}

		let days = datetime.map((x) =>
			moment.tz(x, timezone).format('MMM DD')
		);

		// Default to well defined y-axis limits for visual stability
		const ymin = 0;
		const ymax = pm25ToYMax(Math.max(...avg_pm25));

    let title = locationName;

    // Here is the chart construction
    config = {
			accessibility: { enabled: false },
			chart: {
				plotBorderColor: '#ddd',
				plotBorderWidth: 1
			},
			plotOptions: {
				column: {
					animation: false,
					allowPointSelect: true,
					borderColor: '#666'
				}
			},
			title: {
				text: title
			},
			xAxis: {
				categories: days
			},
			yAxis: {
				min: ymin,
				max: ymax,
				gridLineColor: '#ddd',
				gridLineDashStyle: 'Dash',
				gridLineWidth: 1,
				title: {
					text: 'PM2.5 (\u00b5g/m\u00b3)'
				}
				//plotLines: this.AQI_pm25_lines // horizontal colored lines
			},
			legend: {
				enabled: true,
				verticalAlign: 'top'
			},

			series: [
				{
					name: 'Daily Avg PM2.5',
					type: 'column',
					data: seriesData
				}
			]
		};

    myChart = Highcharts.chart(context, config)

  }

  // Regenerate the chart after any update
  afterUpdate(createChart);
</script>

<div class="chart-wrapper">
	<div id="{div_id}" class="chart-container"></div>
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