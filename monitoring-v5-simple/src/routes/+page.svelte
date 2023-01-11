<script>
  // Svelte tores
  import { all_monitors } from "../stores/monitor-data-store.js";
  import { selected_id, selected_plot_type } from "../stores/gui-store.js";
  // Svelte Components
  import SelectRandomButton from "../components/SelectRandomButton.svelte";
  import PlotTypeButton from "../components/PlotTypeButton.svelte";
	import TimeseriesPlot from "../components/TimeseriesPlot.svelte";
	import DailyBarplot from "../components/DailyBarplot.svelte";
	import DiurnalPlot from "../components/DiurnalPlot.svelte";
</script>

<!----------------------------------------------------------------------------->

<h1>Monitoring v5 Simple Interface</h1>

{#await all_monitors}
  <p>...loading all_monitors data</p>
{:then}
<div>
  <SelectRandomButton />
  <PlotTypeButton text = "Time series" type = "timeseries" />
  <PlotTypeButton text = "Daily" type = "daily" />
  <PlotTypeButton text = "Time of day" type = "diurnal" />
</div>

{#if $selected_id !== undefined }
  <p>We just created a Monitor. It has {$all_monitors.meta.numRows()} time series;</p>
  <p>The <code>selected_id</code> is {$selected_id}.</p>
  <p>The <code>selected_plot_type</code> is {$selected_plot_type}.</p>
  {#if $selected_plot_type === "timeseries"}
    <TimeseriesPlot /> 
  {:else if $selected_plot_type === "daily"}
    <DailyBarplot /> 
  {:else if $selected_plot_type === "diurnal"}
    <DiurnalPlot /> 
  {/if}
{/if}

<!-- And another one

{#if $selected_id !== undefined }
  <DailyBarplot />  
{/if} -->

{:catch}
  <p style="color: red">An error occurred</p>
{/await}


<!----------------------------------------------------------------------------->

<style>
  h1 {
    color: coral;
  }
</style>