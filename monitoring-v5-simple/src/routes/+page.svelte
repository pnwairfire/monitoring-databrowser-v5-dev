<script>
  // Svelte tores
  import { all_monitors } from "../stores/monitor-data-store.js";
  import { selected_id } from "../stores/gui-store.js";
  // Svelte Components
  import SelectRandomButton from "../components/SelectRandomButton.svelte";
  // import PlotTypeButton from "../components/PlotTypeButton.svelte";
	import TimeseriesPlot from "../components/TimeseriesPlot.svelte";
	import LeafletMap from "../components/LeafletMap.svelte";
</script>

<!----------------------------------------------------------------------------->

<h1>Monitoring v5 Development Interface</h1>

{#await all_monitors}
  <p>...loading all_monitors data</p>
{:then}
<div>
  <SelectRandomButton />

</div>

{#if $selected_id !== undefined }
  <p>The <code>selected_id</code> is {$selected_id}.</p>

  <div>
    <LeafletMap />
    <TimeseriesPlot element_id="ts-row1" width="400px"/>
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