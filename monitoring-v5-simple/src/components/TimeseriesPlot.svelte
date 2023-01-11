<script>
  import Highcharts from 'highcharts';
  import { afterUpdate } from 'svelte';
  // Stores
  import { all_monitors } from '../stores/monitor-data-store.js';
  import { selected_id } from "../stores/gui-store.js";
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

    context = document.getElementById('timeseries-plot');

    // See https://www.youtube.com/watch?v=s7rk2b1ioVE @ 6:30
    if (myChart) myChart.destroy();

    // Get a copy of the reactive data and id
    let monitor = $all_monitors;
    let id = $selected_id;

    // Get required data
    let locationName = monitor.getMetadata(id, 'locationName');
    let timezone = monitor.getMetadata(id, 'timezone');
    let datetime = monitor.getDatetime();
    let pm25 = monitor.getPM25(id);
    let nowcast = monitor.getNowcast(id);
    let startTime = datetime[0];
		let xAxis_title = 'Time (' + timezone + ')';

		// Default to well defined y-axis limits for visual stability
		let ymin = 0;
		let ymax = pm25ToYMax(Math.max(...pm25));

    let title = locationName;

    // Here is the Highcharts 
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

<div id="timeseries-plot" class="chart-container"></div>

<style>
  .chart-container {
    border: 2px solid black;
  }
</style>