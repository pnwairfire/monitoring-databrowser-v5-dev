<script>
  // Svelte stores
  import { all_monitors, airnowLoadTime } from './stores/monitor-data-store.js';
  import { selected_id } from './stores/gui-store.js';
  // Svelte Components
  // import PlotTypeButton from "./components/PlotTypeButton.svelte";
	import AlertBox from "./components/AlertBox.svelte";
	import DailyBarplot from "./components/DailyBarplot.svelte";
	import DailyRangeBarplot from "./components/DailyRangeBarplot.svelte";
	// import DiurnalPlot from "./components/DiurnalPlot.svelte";
  import LeafletMap from "./components/LeafletMap.svelte";
  import MonitorInfoBox from "./components/MonitorInfoBox.svelte";
	// import TimeseriesPlot from "./components/TimeseriesPlot.svelte";
</script>

<main>

	<AlertBox>
		<b>This proof-of-concept example is temporary -- for evaluation purposes only.</b>
	</AlertBox>

	<h1>Mv5 Extended (45 days)</h1>

	{#await all_monitors.load()}
		<p>Loading monitoring data...</p>
	{:then}

	<p>
			<!-- Showing {$all_monitors.count()} monitoring locations. -->
			Loaded 45 days of hourly data for {$all_monitors.count()} monitors in {$airnowLoadTime} seconds.
			&nbsp;&nbsp;
			Hover over a location to generate plots.
		</p>

		<div>
			<LeafletMap width="1200px" height="400px"/>
		</div>

		{#if $selected_id !== "" }
			<div class="plot-row">
				<MonitorInfoBox />
				<DailyRangeBarplot element_id="r1_daily_range" width="400px"/>
				<DailyBarplot element_id="r1_daily" width="400px"/>
				<!-- <DiurnalPlot element_id="r1_diurnal" width="400px"/> -->
			</div>
		{/if}

	{:catch}
		<p style="color: red">An error occurred</p>
	{/await}

</main>

<style>
  h1 {
    color: coral;
  }
  .plot-row {
    display: flex;
  }
</style>
