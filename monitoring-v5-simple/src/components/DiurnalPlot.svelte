<script>
	// Exports
	export let div_id = 'default-daily-barplot';

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
  // arquero for 'dplyr' style data manipulation
  import * as aq from 'arquero';
  // SunCalc for day-night shading
  import SunCalc from 'suncalc';
  // Other functions
  import { pm25ToColor, pm25ToYMax } from "../scripts/plot-utils.js";
  import { diurnalPlotConfig } from "../scripts/plot-utils.js";

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

    // Get yesterday/today start/end
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

    // Default to well defined y-axis limits for visual stability
		const ymin = 0;
		const ymax = pm25ToYMax(Math.max(...yesterday, ...today));

    const title = locationName;

    // Create colored series data
    // See:  https://stackoverflow.com/questions/35854947/how-do-i-change-a-specific-bar-color-in-highcharts-bar-chart
    let yesterdayData = [];
    for ( let i = 0; i < yesterday.length; i++ ) {
      yesterdayData[i] = {y: yesterday[i], color: pm25ToColor(yesterday[i])};
    } 
    let todayData = [];
    for ( let i = 0; i < today.length; i++ ) {
      todayData[i] = {y: today[i], color: pm25ToColor(today[i])};
    } 


		const plotData = {
			hour: hour,
			hour_mean: hour_mean,
			yesterday: yesterday,
			today: today,
			locationName: monitor.getMetadata(id, 'locationName'),
			timezone: monitor.getMetadata(id, 'timezone'),
			sunriseHour: sunriseHour,
			sunsetHour: sunsetHour,
			title: undefined  // use default title
		}

		// Create the chartConfig
		chartConfig = diurnalPlotConfig(plotData);

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
		/* width: 300px;
		height: 300px; */
	}
  .chart-container {
		display: inline-block;
    border: 2px solid black;
  }
</style>