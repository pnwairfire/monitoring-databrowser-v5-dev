// // https://svelte.dev/repl/d283589caa554badb16644ad40682802?version=3.38.2
// import Highcharts from 'highcharts';
// import AirQualityPlots from './DELETEME_AirQualityPlots';

// export default (node, config) => {
// 	let AQP = new AirQualityPlots;
// 	const redraw = true;
// 	const oneToOne = true;
// 	const chart = Highcharts.chart(node, config);

// 	AQP.addAQIStackedBar(chart);

// 	return {
// 		update(config) {
// 			chart.update(config, redraw, oneToOne);
// 		},
// 		destroy() {
// 			chart.destroy();
// 		}
// 	};
// }
