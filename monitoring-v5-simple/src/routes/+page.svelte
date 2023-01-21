<script>
  // Svelte tores
  import { all_monitors } from '../stores/monitor-data-store.js';
  import { selected_id } from '../stores/gui-store.js';
  // Svelte Components
  import SelectRandomButton from "../components/SelectRandomButton.svelte";
  // import PlotTypeButton from "../components/PlotTypeButton.svelte";
	import TimeseriesPlot from "../components/TimeseriesPlot.svelte";
	import DailyBarplot from "../components/DailyBarplot.svelte";
	import DiurnalPlot from "../components/DiurnalPlot.svelte";
  import LeafletMap from "../components/LeafletMap.svelte";
</script>

<!----------------------------------------------------------------------------->

<h1>Monitoring v5 Development Interface</h1>

<!-- {#await all_monitors}
  <p>...loading all_monitors data</p>
{:then}


  <p>The <code>selected_id</code> is {$selected_id}.</p> -->

  {#await all_monitors.load()}
    <p>Currently loading...</p>
  {:then}
    <p>Your loaded data has {$all_monitors.count()} time series.</p>
    <div>
      <LeafletMap width="1200px" height="400px"/>
    </div>
    {#if selected_id !== "" }
    <div>
      <TimeseriesPlot element_id="r1_timeseries" width="400px"/>
      <DailyBarplot element_id="r1_daily" width="400px"/>
      <DiurnalPlot element_id="r1_diurnal" width="400px"/>
    </div>
    {/if}
  {/await}

<!-- {:catch}
  <p style="color: red">An error occurred</p>
{/await} -->


<!----------------------------------------------------------------------------->

<style>
  h1 {
    color: coral;
  }
</style>