<script>
  // Svelte methods
  import { afterUpdate } from 'svelte';
  // Highcharts for plotting
  import Highcharts from 'highcharts';
  // arquero for data manipulation
  import * as aq from 'arquero';
  // moment for timezone-aware date formatting
  import moment from 'moment-timezone';
  // SunCalc for day-night shading
  import SunCalc from 'suncalc';
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

    context = document.getElementById('diurnal-plot');

    // See https://www.youtube.com/watch?v=s7rk2b1ioVE @ 6:30
    if (myChart) myChart.destroy();

    // Get a copy of the reactive data and id
    const monitor = $all_monitors;
    const id = $selected_id;

    // Get required data
    const locationName = monitor.getMetadata(id, 'locationName');
    const timezone = monitor.getMetadata(id, 'timezone');
    const longitude = monitor.getMetadata(id, 'longitude');
    const latitude = monitor.getMetadata(id, 'latitude');
    const datetime = monitor.getDatetime();
    const pm25 = monitor.getPM25(id);
    const nowcast = monitor.getNowcast(id);
    const localHours = datetime.map(o => moment.tz(o, timezone).hours());

    // Day/Night shading
    const middleDatetime = datetime[Math.round(datetime.length/2)];
    const times = SunCalc.getTimes(middleDatetime.valueOf(), latitude, longitude);
    const sunriseHour = 
        moment.tz(times.sunrise, timezone).hour() + 
        moment.tz(times.sunrise, timezone).minute() / 60; 
    const sunsetHour = 
        moment.tz(times.sunset, timezone).hour() + 
        moment.tz(times.sunset, timezone).minute() / 60; 
        
    // Get yeserday/today start/end
    const lastHour = localHours[localHours.length - 1];
    const today_end = localHours.length;
    const today_start = localHours.length - 1 - lastHour;
    const yesterday_end = today_start;
    const yesterday_start = today_start - 24;

    const yesterday = nowcast.slice(yesterday_start, yesterday_end);
    const today = nowcast.slice(today_start, today_end);
    
    // Create the average by local_hour data table
    // NOTE:  Start by trimming to full days in the local timezone
    const dt_mean = monitor
        .trimDate(timezone).data     // full days only
        .slice(-(7*24))              // last 7 full days
        .select(['datetime', id])
        .rename(aq.names('datetime', 'pm25'))
        .derive({local_hour: aq.escape(d => moment.tz(d.datetime, timezone).hours())})
        .groupby('local_hour').rollup({hour_mean: aq.op.mean('pm25')});

    // NOTE:  Hightcharts will error out if any values are undefined. But null is OK.
    const hour = dt_mean.array('local_hour');
    const hour_mean = dt_mean.array('hour_mean').map(x => x === undefined ? null : Math.round(10 * x) / 10);

    const title = locationName;

    // Here is the chart construction
    config = {
        accessibility: { enabled: false },
			chart: {
				plotBorderColor: '#ddd',
				plotBorderWidth: 1
			},
			plotOptions: {
				line: {
					animation: false
				}
			},
			title: {
				text: title
			},
			xAxis: {
				tickInterval: 3,
				labels: {
					formatter: function () {
						var label = this.axis.defaultLabelFormatter.call(this);
						label =
							label == '0'
								? 'Midnight'
								: label == '3'
								? '3am'
								: label == '6'
								? '6am'
								: label == '9'
								? '9am'
								: label == '12'
								? 'Noon'
								: label == '15'
								? '3pm'
								: label == '18'
								? '5pm'
								: label == '21'
								? '9pm'
								: label;
						return label;
					}
				},
				plotBands: [
					{ color: 'rgb(0,0,0,0.1)', from: 0, to: sunriseHour },
					{ color: 'rgb(0,0,0,0.1)', from: sunsetHour, to: 24 }
				]
			},
			yAxis: {
				min: ymin,
				max: ymax,
				gridLineColor: '#ddd',
				gridLineDashStyle: 'Dash',
				gridLineWidth: 1,
				title: {
					text: 'PM2.5 (\u00b5g/m\u00b3)'
				},
				//plotLines: this.AQI_pm25_lines // horizontal colored lines
			},
			legend: {
				enabled: true,
				verticalAlign: 'top'
			},
			series: [
				{
					name: '7 Day Mean',
					type: 'line',
					data: hour_mean,
					color: '#aaa',
					lineWidth: 10,
					marker: { radius: 1, symbol: 'square', fillColor: 'transparent' }
				},
				{
					name: 'Yesterday',
					type: 'line',
					data: yesterday,
					color: '#888',
					lineWidth: 1,
					marker: { radius: 4, symbol: 'circle', lineColor: '#888', lineWidth: 1 }
				},
				{
					name: 'Today',
					type: 'line',
					data: today,
					color: '#333',
					lineWidth: 2,
					marker: { radius: 8, symbol: 'circle', lineColor: '#333', lineWidth: 1 }
				}
			]
		};

    myChart = Highcharts.chart(context, config)

  }

  // Regenerate the chart after any update
  afterUpdate(createChart);
</script>

<div id="diurnal-plot" class="chart-container"></div>

<style>
  .chart-container {
    border: 2px solid black;
  }
</style>