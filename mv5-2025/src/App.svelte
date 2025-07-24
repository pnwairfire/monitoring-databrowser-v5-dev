<script>
	import { onMount } from 'svelte';

  // Svelte stores
  import {
		VERSION,
		error_message,
		monitorCount,
		purpleairCount,
		clarityCount,
		hmsFiresCount,
	} from './stores/gui-store.js';
  import { all_monitors } from './stores/monitor-data-store.js';
  import { pas } from './stores/purpleair-data-store.js';
  import { clarity } from './stores/clarity-data-store.js';
  import { hms_fires_csv } from './stores/hms-data-store.js';

  // Svelte Components
  import NavBar from "./components/NavBar.svelte";
  import AlertBox from "./components/AlertBox.svelte";
	import LeafletMap from "./components/LeafletMap.svelte";

  // Force loading to ensure ~Count is updated
  onMount(() => {
    pas.load?.();
    clarity.load?.();
		hms_fires_csv.load?.();
  });
</script>

<main>

	<NavBar>
		<img class="logo" src="images/forestservicelogo-inverted.svg"
		     alt="US Forest Service logo">
		<span class="mv5">Monitoring v{$VERSION}</span>
	</NavBar>

	<div class="airfire-alerts" style="display: none"></div>

	{#if $error_message !== "" }
		<AlertBox level="error">
			<b>{$error_message}</b>
		</AlertBox>
	{/if}

  {#await all_monitors.load()}
		<p>Loading monitor data...</p>
	{:then}

		<!-- Current status -->
		{#if $monitorCount + $purpleairCount + $clarityCount + $hmsFiresCount > 0}
			<p class="status">
				Showing
				{#if $monitorCount > 0}
					{$monitorCount} monitors
					{#if $purpleairCount > 0 || $clarityCount > 0 || $hmsFiresCount > 0}, {/if}
				{/if}
				{#if $purpleairCount > 0}
					{$purpleairCount} PurpleAir sensors
					{#if $clarityCount > 0 || $hmsFiresCount > 0}, {/if}
				{/if}
				{#if $clarityCount > 0}
					{$clarityCount} Clarity sensors
					{#if $hmsFiresCount > 0}, {/if}
				{/if}
				{#if $hmsFiresCount > 0}
					{$hmsFiresCount} HMS fire detections
				{/if}.
			</p>
		{/if}

		{#if $monitorCount === 0 || $purpleairCount === 0 || $clarityCount === 0 || $hmsFiresCount === 0}
			<p class="status" style="font-style: italic">
				Waiting for
				{#if $monitorCount === 0}monitor data{/if}
				{#if $purpleairCount === 0}
					{#if $monitorCount === 0}, {/if}PurpleAir data
				{/if}
				{#if $clarityCount === 0}
					{#if $monitorCount === 0 || $purpleairCount === 0}, {/if}Clarity data
				{/if}
				{#if $hmsFiresCount === 0}
					{#if $monitorCount === 0 || $purpleairCount === 0 || $clarityCount === 0}, {/if}HMS fire data
				{/if}...
			</p>
		{/if}

		<!-- Leaflet Map -->
		<div >
			<LeafletMap width="1200px" height="400px"/>
		</div>

  {:catch}
		<p style="color: red">An error occurred</p>
	{/await}

</main>

<style>
	  img.logo {
		vertical-align: middle;
		height: 35px;
		width: 35px;
	}

  span.mv5 {
    color: white;
		font-size: 24px;
		font-family: "Source Sans Pro", "Helvetica", sans-serif;
		padding-left: 10px;
		vertical-align: text-top;
  }

	p.status {
		text-align: left;
		margin: 10px 0 0 10px;
		font-size: 0.8rem;
	}

	span.selected-devices {
		font-size: 1.0rem;
		font-weight: bold;
		padding-left: 65px;
		padding-right: 20px;
	}

	span.selected-devices-count {
		font-style: italic;
	}

  .flex-row {
    display: flex;
  }

</style>
