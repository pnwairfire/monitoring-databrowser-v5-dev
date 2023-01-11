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
    <SelectRandomButton />
    <PlotTypeButton text = "Time series" type = "timeseries" />
    <PlotTypeButton text = "Daily" type = "daily" />
    <PlotTypeButton text = "Time of day" type = "diurnal" />
  </div>

  <p>We just created a Monitor. It has {$all_monitors.meta.numRows()} time series;</p>
  <p>The <code>selected_id</code> is {$selected_id}.</p>

  {#if selected_id !== undefined }
    <TimeseriesPlot />  
  {/if}


{:catch}
  <p style="color: red">An error occurred</p>
{/await}


<!----------------------------------------------------------------------------->

<style>
  h1 {
    color: coral;
  }
</style>