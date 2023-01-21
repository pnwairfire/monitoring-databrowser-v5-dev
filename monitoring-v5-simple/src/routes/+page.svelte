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

<svelte:head>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
    crossorigin="anonymous"
  >
</svelte:head>

<!----------------------------------------------------------------------------->

<h1>Monitoring v5 Development Interface</h1>

{#await all_monitors.load()}
  <p>Loading monitoring data...</p>
{:then}

  <p>Showing monitoring data for {$all_monitors.count()} locations.</p>
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

{:catch}
<p style="color: red">An error occurred</p>
{/await}

<!----------------------------------------------------------------------------->

<style>
  h1 {
    color: coral;
  }
</style>