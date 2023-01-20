<script>
  // Imports
  // Svelte methods
	import { onMount, onDestroy } from 'svelte';
  // Svelte stores
  import { all_monitors } from '../stores/monitor-data-store.js';
  import { selected_id } from "../stores/gui-store.js";
  // Leaflet (NOTE:  Don't put {} around the 'L'!)
  import L from "leaflet";
  // Custom functions
  import { createMonitorLayer } from "../scripts/map-utils.js";

  let map;

  function createMap() {

    // Get a copy of the reactive data and id
    const monitor = $all_monitors;
    const id = $selected_id;

    // Create the map
    map = L.map('map').setView([40, -100], 10);

    // Add background tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Create and add geojson created from
    let monitorGeoJSON = monitor.createGeoJSON();
    createMonitorLayer(monitorGeoJSON).addTo(map);

  }

	onMount(createMap);

	onDestroy(() => {
		if (map) map.remove();
	});
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
    integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
    crossorigin=""
  />
</svelte:head>

<div class="map-wrapper">
  <div id="map"></div>
</div>

<style>
	.map-wrapper {
		display: inline-block;
	}	#map {
		width: 400px;
    height: 350px;
	}
</style>