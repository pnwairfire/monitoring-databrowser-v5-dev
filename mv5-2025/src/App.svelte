<script>
  import Counter from './lib/Counter.svelte'

  // Svelte stores
  import {
		VERSION,
		error_message,
		monitorCount,
		purpleairCount,
		clarityCount,
		hmsFiresCount,
	} from './stores/gui-store.js';
  import { clarity } from './stores/clarity-data-store.js';
  import { hms_fires_csv } from './stores/hms-data-store.js';



  // Svelte Components
  import NavBar from "./components/NavBar.svelte";


</script>

<main>

	<NavBar>
		<img class="logo" src="images/forestservicelogo-inverted.svg"
		     alt="US Forest Service logo">
		<span class="mv5">Temporary Monitors v{$VERSION}</span>
	</NavBar>

  {#await hms_fires_csv.load()}
		<p>Loading monitoring data...</p>
	{:then}

		<p class="status">
			Showing {$hmsFiresCount} HMS fire detections.
		</p>

  {:catch}
		<p style="color: red">An error occurred</p>
	{/await}

  {#await clarity.load()}
		<p>Loading clarity data...</p>
	{:then}

		<p class="status">
			Showing {$clarityCount} Clarity sensors.
		</p>

  {:catch}
		<p style="color: red">An error occurred</p>
	{/await}


  <div class="card">
    <Counter />
  </div>

</main>

<style>
</style>
