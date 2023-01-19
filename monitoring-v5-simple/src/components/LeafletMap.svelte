<!--
  Started by following https://dev.to/khromov/using-leaflet-with-sveltekit-3jn1
-->
<script>
  	// Exports
	export let element_id = 'default-map';
  export let width = '400px';
  export let height = '300px';

  // import { onMount, onDestroy } from 'svelte';
  // import { browser } from '$app/environment';

  // let mapElement;
  // let map;

  // onMount(async () => {
  //   if(browser) {
  //   const leaflet = await import('leaflet');

  //   map = leaflet.map(mapElement).setView([51.505, -0.09], 13);

  //   leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //   }).addTo(map);

  //   leaflet.marker([51.5, -0.09]).addTo(map)
  //     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
  //     .openPopup();
  //   }
  // });

  // onDestroy(async () => {
  //   if(map) {
  //     console.log('Unloading Leaflet map.');
  //     map.remove();
  //   }
  // });
</script>


<div class="map-wrapper">
	<div id="{element_id}" class="map-container"
	     style="width: {width}; height: {height};">
  </div>
</div>

<style>
	.map-wrapper {
		display: inline-block;
	}
  .map-container {
		display: inline-block;
		border: 2px solid black;
	}
</style>

<!-- <main>
  <div bind:this={mapElement}></div>
</main> -->

<!-- <style>
  @import 'leaflet/dist/leaflet.css';
  main div {
    height: 400px;
  }
</style> -->