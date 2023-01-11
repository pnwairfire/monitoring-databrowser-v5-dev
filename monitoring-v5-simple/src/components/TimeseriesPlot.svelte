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
  import { pm25ToYMax } from "../scripts/plot-utils.js";

  // Good examples to learn from:
  //   https://www.youtube.com/watch?v=s7rk2b1ioVE
  //   https://svelte.dev/repl/d283589caa554badb16644ad40682802?version=3.38.2

  // We need these variables to live on after an individual chart is destroyed
  let config;
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

    // Get required data
    const locationName = monitor.getMetadata(id, 'locationName');
    const timezone = monitor.getMetadata(id, 'timezone');
    const datetime = monitor.getDatetime();
    const pm25 = monitor.getPM25(id);
    const nowcast = monitor.getNowcast(id);
    const startTime = datetime[0];
		const xAxis_title = 'Time (' + timezone + ')';

		// Default to well defined y-axis limits for visual stability
		const ymin = 0;
		const ymax = pm25ToYMax(Math.max(...pm25));

    const title = locationName;

    // Here is the chart construction
    config = {
			accessibility: { enabled: false },
			chart: {
				animation: false,
				plotBorderColor: '#ddd',
				plotBorderWidth: 1
			},
			plotOptions: {
				series: {
					animation: false
				},
				scatter: {
					animation: false,
					marker: { radius: 3, symbol: 'circle', fillColor: '#bbbbbb' }
				},
				line: {
					animation: false,
					color: '#000',
					lineWidth: 1,
					marker: { radius: 1, symbol: 'square', fillColor: 'transparent' }
				}
			},
			title: {
				text: title
			},
			time: {
				timezone: timezone
			},
			xAxis: {
				type: 'datetime',
				// title: {margin: 20, style: { "color": "#333", "fontSize": "16px" }, text: xAxis_title},
				gridLineColor: '#ddd',
				gridLineDashStyle: 'Dash',
				gridLineWidth: 1,
				minorTicks: true,
				minorTickInterval: 3 * 3600 * 1000, // every 3 hrs
				minorGridLineColor: '#eee',
				minorGridLineDashStyle: 'Dot',
				minorGridLineWidth: 1
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
					name: 'Hourly PM2.5 Values',
					type: 'scatter',
					pointInterval: 3600 * 1000,
					pointStart: startTime.valueOf(), // milliseconds
					data: pm25
				},
				{
					name: 'Nowcast',
					type: 'line',
					lineWidth: 2,
					pointInterval: 3600 * 1000,
					pointStart: startTime.valueOf(), // milliseconds
					data: nowcast
				}
			]
		};

    myChart = Highcharts.chart(context, config)

  }

  // Regenerate the chart after any update
  afterUpdate(createChart);
</script>

<div id="{div_id}" class="chart-container"></div>

<style>
  .chart-container {
    border: 2px solid black;
  }
</style>