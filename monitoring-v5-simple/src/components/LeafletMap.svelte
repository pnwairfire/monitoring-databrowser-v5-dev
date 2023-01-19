<script>
	import { onMount, onDestroy } from 'svelte';
  import L from "leaflet";

  let map;

  function createMap() {

    map = L.map('map').setView([40, -100], 10);

    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

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