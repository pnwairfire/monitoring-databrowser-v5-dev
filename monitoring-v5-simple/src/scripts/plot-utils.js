// moment for timezone-aware date formatting
import moment from 'moment-timezone';

/**
 * Returns a timeseries chart configuration.
 * @param {Object} data The data required to create the chart.
 */
export function timeseriesPlotConfig(
	data = {
		datetime,
		pm25,
		nowcast,
		locationName,
		timezone,
		title
	}
) {
	// ----- Data preparation --------------------------------

	let startTime = data.datetime[0];
	// let xAxis_title = 'Time (${data.timezone})';

	// Default to well defined y-axis limits for visual stability
	let ymin = 0;
	let ymax = pm25ToYMax(Math.max(...data.pm25));

	let title = data.title;
	if (data.title === undefined) {
		title = data.locationName;
	}

	// ----- Chart configuration --------------------------------

	let chartConfig = {
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
			timezone: data.timezone
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
				data: data.pm25
			},
			{
				name: 'Nowcast',
				type: 'line',
				lineWidth: 2,
				pointInterval: 3600 * 1000,
				pointStart: startTime.valueOf(), // milliseconds
				data: data.nowcast
			}
		]
	};

	return chartConfig;
}

/**
 * Returns a daily barplot chart configuration.
 * @param {Object} data The data required to create the chart.
 */
export function dailyBarplotConfig(
	data = {
		daily_datetime,
		daily_avg_pm25,
		locationName,
		timezone,
		title
	}
) {
	// ----- Data preparation --------------------------------

	// Default to well defined y-axis limits for visual stability
	let ymin = 0;
	let ymax = pm25ToYMax(Math.max(...data.daily_avg_pm25));

	let title = data.title;
	if (data.title === undefined) {
		title = data.locationName;
	}

	// Create colored series data
	// See:  https://stackoverflow.com/questions/35854947/how-do-i-change-a-specific-bar-color-in-highcharts-bar-chart
	let seriesData = [];
	for (let i = 0; i < data.daily_avg_pm25.length; i++) {
		seriesData[i] = {
			y: data.daily_avg_pm25[i],
			color: pm25ToColor(data.daily_avg_pm25[i])
		};
	}

	let days = data.daily_datetime.map((x) => moment.tz(x, data.timezone).format('MMM DD'));

	// ----- Chart configuration --------------------------------

	let chartConfig = {
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

	return chartConfig;
}

/**
 * Returns a diurnal chart configuration.
 * @param {Object} data The data required to create the chart.
 */
export function diurnalPlotConfig(
	data = {
		hour,
		hour_mean,
		yesterday,
		today,
		locationName,
		timezone,
		sunriseHour,
		sunsetHour,
		title
	}
) {
	// ----- Data preparation --------------------------------

	// Default to well defined y-axis limits for visual stability
	let ymin = 0;
	let ymax = pm25ToYMax(Math.max(...data.hour_mean, ...data.yesterday, ...data.today));

	let title = data.title;
	if (data.title === undefined) {
		title = data.locationName;
	}

	// Create colored series data
	// See:  https://stackoverflow.com/questions/35854947/how-do-i-change-a-specific-bar-color-in-highcharts-bar-chart
	let yesterdayData = [];
	for (let i = 0; i < data.yesterday.length; i++) {
		yesterdayData[i] = { y: data.yesterday[i], color: pm25ToColor(data.yesterday[i]) };
	}
	let todayData = [];
	for (let i = 0; i < data.today.length; i++) {
		todayData[i] = { y: data.today[i], color: pm25ToColor(data.today[i]) };
	}

	// ----- Chart configuration --------------------------------

	let chartConfig = {
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
				{ color: 'rgb(0,0,0,0.1)', from: 0, to: data.sunriseHour },
				{ color: 'rgb(0,0,0,0.1)', from: data.sunsetHour, to: 24 }
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
			}
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
				data: data.hour_mean,
				color: '#aaa',
				lineWidth: 10,
				marker: { radius: 1, symbol: 'square', fillColor: 'transparent' }
			},
			{
				name: 'Yesterday',
				type: 'line',
				data: yesterdayData,
				color: '#888',
				lineWidth: 1,
				marker: { radius: 4, symbol: 'circle', lineColor: '#888', lineWidth: 1 }
			},
			{
				name: 'Today',
				type: 'line',
				data: todayData,
				color: '#333',
				lineWidth: 2,
				marker: { radius: 8, symbol: 'circle', lineColor: '#333', lineWidth: 1 }
			}
		]
	};

	return chartConfig;
}

/**
 * Returns the AQI color associated with a PM2.5 level.
 * @param {number} pm25 PM2.5 value in ug/m3.
 */
export function pm25ToColor(pm25) {
	let color =
		pm25 <= 12
			? 'rgb(0,255,0)'
			: pm25 <= 35.5
			? 'rgb(255,255,0)'
			: pm25 <= 55.5
			? 'rgb(255,126,0)'
			: pm25 <= 105.5
			? 'rgb(255,0,0)'
			: pm25 <= 250
			? 'rgb(143,63,151)'
			: 'rgb(126,0,35)';

	return color;
}

/**
 * Returns the ymax value appropriate for a maximum PM2.5 level.
 * Having a finite set of ymax values prevents the y-scale from jumping around too much.
 * @param {number} pm25 Maximum PM2.5 value in ug/m3.
 */
export function pm25ToYMax(pm25) {
	// See:  https://github.com/MazamaScience/AirMonitorPlots/blob/5482843e8e0ccfe1e30ccf21509d0df01fe45bca/R/custom_pm25TimeseriesScales.R#L103
	let ymax =
		pm25 <= 50
			? 50
			: pm25 <= 100
			? 100
			: pm25 <= 200
			? 200
			: pm25 <= 400
			? 500
			: pm25 <= 600
			? 600
			: pm25 <= 1000
			? 1000
			: pm25 <= 1500
			? 1500
			: 1.05 * pm25;

	return ymax;
}
