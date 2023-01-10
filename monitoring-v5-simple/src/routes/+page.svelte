<script>
  // stores
  import { all_monitors } from "../stores/monitor-data-store.js";
  import { selected_id, selected_plot_type } from "../stores/gui-store.js";
  // components
  import SelectRandomButton from "../components/SelectRandomButton.svelte";
  import PlotTypeButton from "../components/PlotTypeButton.svelte";
	import TimeseriesPlot from "../components/TimeseriesPlot.svelte";
</script>

<!----------------------------------------------------------------------------->

<h1>Welcome to SvelteKit</h1>

{#await all_monitors}
  <p>...loading all_monitors data</p>
{:then}
  <div>
    <PlotTypeButton text = "Time series" type = "timeseries" />
    <PlotTypeButton text = "Daily" type = "daily" />
    <PlotTypeButton text = "Time of day" type = "diurnal" />
  </div>

  <p>We just created a Monitor. It has {$all_monitors.meta.numRows()} time series;</p>
  <p>The <code>selected_id</code> is {$selected_id}.</p>
{:catch}
  <p style="color: red">An error occurred</p>
{/await}

<div>
  Howdy howdy! The selected plot type is {$selected_plot_type}.
</div>

<SelectRandomButton />

<TimeseriesPlot />

<!----------------------------------------------------------------------------->

<style>
  h1 {
    color: coral;
  }
</style>