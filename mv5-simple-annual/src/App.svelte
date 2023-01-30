<script>
  // Svelte stores
  import { all_monitors, airnowLoadTime } from './stores/monitor-data-store.js';
  import { selected_id } from './stores/gui-store.js';
  // Svelte Components
  // import SelectRandomButton from "./components/SelectRandomButton.svelte";
  // import PlotTypeButton from "./components/PlotTypeButton.svelte";
	import AlertBox from "./components/AlertBox.svelte";
	import CalendarPlot from "./components/CalendarPlot.svelte";
	import AnnualHeatmap from "./components/AnnualHeatmap.svelte";
	import DailyAccumulationPlot from "./components/DailyAccumulationPlot.svelte";
	import DailyBarplot from "./components/DailyBarplot.svelte";
	import DailyRangeBarplot from "./components/DailyRangeBarplot.svelte";
	import DiurnalPlot from "./components/DiurnalPlot.svelte";
  import LeafletMap from "./components/LeafletMap.svelte";
  import MonitorInfoBox from "./components/MonitorInfoBox.svelte";
	import TimeseriesPlot from "./components/TimeseriesPlot.svelte";
</script>

<main>

	<AlertBox>
		<b>This working prototype is temporary -- for evaluation purposes only.</b>
	</AlertBox>

	<h1>Mv5 Annual</h1>

	{#await all_monitors.load()}
		<p>Loading monitoring data...</p>
	{:then}

	<p>
			Loaded 1 year of hourly data for {$all_monitors.count()} monitors in
			{$airnowLoadTime} seconds.
			&nbsp;&nbsp;
			Hover over a location to generate plots.
		</p>

		<div class="plot-row">
			<LeafletMap width="500px" height="350px"/>

			{#if $selected_id !== "" }

				<div class="plot-row">
					<CalendarPlot  element_id="r2_calendar" width="700px" height="350px"/>
				</div>
			{/if}

		</div>

		{#if $selected_id !== "" }
			<div class="plot-row">
				<MonitorInfoBox width="380px"/>
				<DailyRangeBarplot element_id="r1_daily_range" width="400px"/>
				<DailyAccumulationPlot element_id="r1_daily_accumulation" width="400px"/>
			</div>
			<div class="plot-row">
				<AnnualHeatmap element_id="r2_annual_heatmap" width="1200px"/>
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
