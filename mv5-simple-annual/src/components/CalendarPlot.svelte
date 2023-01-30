<script>
	// Exports
	export let element_id = 'default-calendar-plot';
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
  // 'heatmap' requires the heatmap module
  // https://www.highcharts.com/forum/viewtopic.php?t=46714
  import HighchartsHeatmap from "highcharts/modules/heatmap";
  HighchartsHeatmap(Highcharts);
  // Plot configuration
  import {
    // dailyBarplotConfig,
    // small_dailyBarplotConfig,
    pm25_addAQIStackedBar,
  } from "air-monitor-plots";

  import moment from "moment-timezone";
  import { null_to_empty } from 'svelte/internal';

  // NOTE:  heatmap examples
  // - https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/heatmap-canvas/
  // - https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/heatmap/

  // This calendar example:
  // - https://jsfiddle.net/BlackLabel/zypnwq50/

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

      // // Assemble required plot data
      // const plotData = {
      //   daily_datetime: daily.datetime,
      //   daily_mean: daily.mean,
      //   locationName: monitor.getMetadata(id, 'locationName'),
      //   timezone: monitor.getMetadata(id, 'timezone'),
      //   title: '' // use default title
      // }



// =============================================================================

  let timezone = monitor.getMetadata(id, 'timezone');
  let datetime = monitor.getDatetime(id);
  let pm25 = monitor.getPM25(id);

  let seriesData = [];

  let monthStartIndex = 0;
  let monthGridIndex = 0;
  let grid_y_index;
  let grid_x_index;
  let row2_left_shift = null;
  let previous_grid_x_index = 0;
  let last_week = false;
  for (let i = 0; i < daily.datetime.length; i++) {

    let year = moment.tz(daily.datetime[i], timezone).year();
    if ( year !== 2021) { continue; }; // TODO:  Remove hardcoded HACK

    let dayOfWeek = moment.tz(daily.datetime[i], timezone).weekday();
    let week = moment.tz(daily.datetime[i], timezone).week() - 1; // or weekYear()?
    let month = moment.tz(daily.datetime[i], timezone).month();
    let dayOfMonth = moment.tz(daily.datetime[i], timezone).date() - 1;

    //  grid_y_index is easy:
    // January-June in the top half of the grid, July-December in the bottom
    if ( month <= 5) {
      grid_y_index = dayOfWeek;
    } else {
      grid_y_index = dayOfWeek + 10;
    }

    // grid_x_index is harder:
    if ( month <= 5) {
      grid_x_index = week + month; // an extra empty column after each month
    } else {
      if (row2_left_shift === null) {
        row2_left_shift = grid_x_index + 1;
      }
      grid_x_index = week - row2_left_shift + month;
      if ( grid_x_index < 0 ) { // this can happen in the last week of the year
        last_week = true;
        grid_x_index = previous_grid_x_index + 1;
      }
    }

    if ( dayOfMonth === 0 ) {
      seriesData[month] = [];
      monthStartIndex = dayOfWeek
      // Fill in the first days with null values
      for (let d = 0; d < dayOfWeek; d++) {
        seriesData[month][d] = [
          grid_x_index,
          grid_y_index, // y
          null, // value
          week, // actual week for labeling
        ];
      }
    }

    monthGridIndex = monthStartIndex + dayOfMonth;

    seriesData[month][monthGridIndex] = [
      grid_x_index,
      grid_y_index, // y
      daily.mean[i], // value
      week, // week
      // daily.datetime[i], // date
    ];

    if (last_week) {
      previous_grid_x_index = grid_x_index - 1;
    } else {
      previous_grid_x_index = grid_x_index;
    }

  }

  let chartConfig = {

    chart: {
      type: 'heatmap',
      plotBorderWidth: 0,
      height:350, // coming in as a parameter
      width: 700, // coming in as a parameter
      marginTop: 100,
      events: {
        load: function() {
          var series = this.series,
            bbox;

          series.forEach(function(s) {
            bbox = s.group.getBBox(true);
            this.renderer.text(
                s.name,
                bbox.x + this.plotLeft + bbox.width / 2,
                bbox.y + this.plotTop - 10
              )
              .attr({
                align: 'center'
              })
              .css({
                color: 'black',
                fontSize: '12px'
              })
              .add();
          }, this);
        }
      }
    },

    title: {
      text: '2021',
      align: 'left'
    },
    // subtitle: {
    //   text: 'year compact view',
    //   align: 'left'
    // },

    xAxis: {
        type: 'category',
        title: null,
        lineWidth: 0,
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        tickWidth: 0,
        opposite: true,
        labels: {
          // don't show the axis label : it's the category id
          // see plotOptions -> dataLabels to show the week number
          enabled: false
        }
    },

    yAxis: {
        type: 'category',
        categories: [
          'Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.',
          ' ', ' ', ' ',
          'Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.',
        ],
        title: null,
        reversed: true,
        lineWidth: 0,
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        minTickInterval: 1,
        labels: {
          style: {
            fontSize: '9px'
          }
        },

        // insert the month as plotline label
        // it's a workaround because the series labels are not displayed
    },

    colorAxis: {
      min: 0,
      // max: 10,
      max: 500,
      tickInterval: 1,
      tickmarkPlacement: 'on',
      // Farben
      // stops: [
      //   [0, '#aaffff'],   // weiss    : leer
      //   [0.1, '#eeeeee'], // grau     : Wochentag
      //   [0.2, '#aac5e6'], // hellblau : Samstag
      //   [0.3, '#1076b0'], //	blau 	   : Sonntag
      //   [0.4, '#ff7d1e'], //	orange   : Feiertag
      // ],
      // TODO:  Set missingValueColor to white somewhere else
      stops: [
        [0, '#00E400'],
        [12 / 500, "#FFFF00"],
        [35.5 / 500, "#FF7E00"],
        [55.5 / 500, "#FF0000"],
        [150.5 / 500, "#8F3F97"],
        [250.5 / 500, "#7E0023"],
        [1, '#7E0023']
    ],
      labels: {
        enabled: true
      }
    },

    legend: {
      enabled: false,
      verticalAlign: 'bottom',
      layout: 'horizontal',
      margin: 30,
      y: 40
    },

    credits: {
      enabled: false
    },

    // tooltip: {
    //   useHTML: true,
    //   formatter: function() {
    //     if (this.point.value == 0) return false;
    //     var s = Highcharts.dateFormat('%a %e. %B %Y', this.point.date);
    //     if (this.point.publicday != undefined) {
    //       s += '<br><div class="publicday">' + this.point.publicday + '</div>';

    //       if (this.point.fedstate != undefined)
    //         s += '<div class="fedstate">' + this.point.fedstate + '</div>';
    //       else
    //         s += '<div class="fedstate">Bundesweit</div>';
    //     }
    //     return s;
    //   }
    // },

    plotOptions: {
      series: {
        // show the week number under the calendar blocks
        // use the datas of last block row and move it down
        dataLabels: {
          enabled: true,
          y: 20,
          crop: false,
          overflow: 'allow',
          //zIndex: 20,
          formatter: function() {
            if (this.point.y == 6 || this.point.y == 16)
              return this.point.week;
            else
              return null;
          },
          style: {
            fontSize: '9px',
            color: '#999999',
            fontWeight: 'normal',
            textOutline: 'none'
          }
        },
        borderColor: '#ffffff',
        borderWidth: 3
      }
    },

    series: [{
        name: 'January',
        keys: ['x', 'y', 'value', 'week'],
        data: seriesData[0],
    }, {
        name: 'February',
        keys: ['x', 'y', 'value', 'week'],
        data: seriesData[1],
    }, {
        name: 'March',
        keys: ['x', 'y', 'value', 'week'],
        data: seriesData[2],
    }, {
        name: 'April',
        keys: ['x', 'y', 'value', 'week'],
        data: seriesData[3],
    }, {
        name: 'May',
        keys: ['x', 'y', 'value', 'week'],
        data: seriesData[4],
    }, {
        name: 'June',
        keys: ['x', 'y', 'value', 'week'],
        data: seriesData[5],

    }, {
        name: 'July',
        keys: ['x', 'y', 'value', 'week'],
        data: seriesData[6],

    }, {
        name: 'August',
        keys: ['x', 'y', 'value', 'week'],
        data: seriesData[7],

    }, {
        name: 'September',
        keys: ['x', 'y', 'value', 'week'],
        data: seriesData[8],

    }, {
        name: 'October',
        keys: ['x', 'y', 'value', 'week'],
        data: seriesData[9],
    }, {
        name: 'November',
        keys: ['x', 'y', 'value', 'week'],
        data: seriesData[10],
    }, {
        name: 'December',
        keys: ['x', 'y', 'value', 'week'],
        data: seriesData[11],
        // keys: ['x', 'y', 'value', 'week', 'date', 'publicday', 'fedstate'],
        // data: [
        //     [31, 10, 0, 48, Date.UTC(2019, 10, 25)],
        //     [31, 11, 0, 48, Date.UTC(2019, 10, 26)],
        //     [31, 12, 0, 48, Date.UTC(2019, 10, 27)],
        //     [31, 13, 0, 48, Date.UTC(2019, 10, 28)],
        //     [31, 14, 0, 48, Date.UTC(2019, 10, 29)],
        //     [31, 15, 0, 48, Date.UTC(2019, 10, 30)],
        //     [31, 16, 3, 48, Date.UTC(2019, 11, 1)],
        //     [32, 10, 1, 49, Date.UTC(2019, 11, 2)],
        //     [32, 11, 1, 49, Date.UTC(2019, 11, 3)],
        //     [32, 12, 1, 49, Date.UTC(2019, 11, 4)],
        //     [32, 13, 1, 49, Date.UTC(2019, 11, 5)],
        //     [32, 14, 1, 49, Date.UTC(2019, 11, 6)],
        //     [32, 15, 2, 49, Date.UTC(2019, 11, 7)],
        //     [32, 16, 3, 49, Date.UTC(2019, 11, 8)],
        //     [33, 10, 1, 50, Date.UTC(2019, 11, 9)],
        //     [33, 11, 1, 50, Date.UTC(2019, 11, 10)],
        //     [33, 12, 1, 50, Date.UTC(2019, 11, 11)],
        //     [33, 13, 1, 50, Date.UTC(2019, 11, 12)],
        //     [33, 14, 1, 50, Date.UTC(2019, 11, 13)],
        //     [33, 15, 2, 50, Date.UTC(2019, 11, 14)],
        //     [33, 16, 3, 50, Date.UTC(2019, 11, 15)],
        //     [34, 10, 1, 51, Date.UTC(2019, 11, 16)],
        //     [34, 11, 1, 51, Date.UTC(2019, 11, 17)],
        //     [34, 12, 1, 51, Date.UTC(2019, 11, 18)],
        //     [34, 13, 1, 51, Date.UTC(2019, 11, 19)],
        //     [34, 14, 1, 51, Date.UTC(2019, 11, 20)],
        //     [34, 15, 2, 51, Date.UTC(2019, 11, 21)],
        //     [34, 16, 3, 51, Date.UTC(2019, 11, 22)],
        //     [35, 10, 1, 52, Date.UTC(2019, 11, 23)],
        //     [35, 11, 1, 52, Date.UTC(2019, 11, 24)],
        //     [35, 12, 4, 52, Date.UTC(2019, 11, 25), '1. Weihnachtstag'],
        //     [35, 13, 4, 52, Date.UTC(2019, 11, 26), '2. Weihnachtstag'],
        //     [35, 14, 1, 52, Date.UTC(2019, 11, 27)],
        //     [35, 15, 2, 52, Date.UTC(2019, 11, 28)],
        //     [35, 16, 3, 52, Date.UTC(2019, 11, 29)],
        //     [36, 10, 1, 1, Date.UTC(2019, 11, 30)],
        //     [36, 11, 1, 1, Date.UTC(2019, 11, 31)],
        //     [36, 12, 0, 1, Date.UTC(2020, 1, 1)],
        //     [36, 13, 0, 1, Date.UTC(2020, 1, 2)],
        //     [36, 14, 0, 1, Date.UTC(2020, 1, 3)],
        //     [36, 15, 0, 1, Date.UTC(2020, 1, 4)],
        //     [36, 16, 0, 1, Date.UTC(2020, 1, 5)],
        // ]
    }]
  };

// =============================================================================





      // Create the chartConfig
      if ( size === 'small' ) {
        // chartConfig = small_dailyBarplotConfig(plotData);
        myChart = Highcharts.chart(context, chartConfig);
        // pm25_addAQIStackedBar(myChart, 4);
      } else {
        // chartConfig = dailyBarplotConfig(plotData);
        myChart = Highcharts.chart(context, chartConfig);
        // pm25_addAQIStackedBar(myChart, 6);
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