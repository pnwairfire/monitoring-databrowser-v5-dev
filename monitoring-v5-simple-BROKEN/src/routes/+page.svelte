<script>
  // Svelte tores
  import { all_monitors } from "../stores/monitor-data-store.js";
  import { selected_id } from "../stores/gui-store.js";
  // Svelte Components
  import SelectRandomButton from "../components/SelectRandomButton.svelte";
  // import PlotTypeButton from "../components/PlotTypeButton.svelte";
	import TimeseriesPlot from "../components/TimeseriesPlot.svelte";
	// import LeafletMap from "../components/LeafletMap.svelte";
</script>


<svelte:head>
  <!-- Use simple bootstrap styling for grid layout -->
    <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
      integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
      crossorigin="anonymous">

</svelte:head>

<!----------------------------------------------------------------------------->

<h1>Monitoring v5 Development Interface</h1>

{#await all_monitors}
  <p>...loading all_monitors data</p>
{:then}

  {#if $selected_id !== undefined }

    <div class="row">

      <div class="col-sm-4">
        <SelectRandomButton />
      </div>

      <div class="col-sm-8">
        <TimeseriesPlot element_id="row1_TimeseriesPlot" width="400px"/>
      </div>

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