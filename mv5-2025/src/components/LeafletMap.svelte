<script>
	// Exports
  export let width = '400px';
  export let height = '400px';

  // Svelte methods
	import { onMount, onDestroy } from 'svelte';

  // Leaflet (NOTE:  Don't put {} around the 'L'!)
  import L from "leaflet";
  import 'leaflet-svg-shape-markers';
  import { basemapLayer } from 'esri-leaflet';

  import { DateTime } from 'luxon';

  // Stores
  import {
    airnow_geojson,
    airsis_geojson,
    wrcc_geojson,
  } from '../stores/monitor-data-store.js';

  import { pas, patCart } from '../stores/purpleair-data-store.js';

  import { clarity, clarity_geojson } from '../stores/clarity-data-store.js';

  import { hms_fires_csv, hms_smoke_geojson } from '../stores/hms-data-store.js';

  import { mapLastUpdated } from '../stores/gui-store.js';

  import {
    centerLat,
    centerLon,
    zoom,
    hovered_monitor_id,
    hovered_purpleair_id,
    hovered_clarity_id,
    selected_monitor_ids,
    selected_purpleair_ids,
    selected_clarity_ids,
    unselected_monitor_id,
    unselected_purpleair_id,
    unselected_clarity_id,
    use_hovered_purpleair,
    use_hovered_clarity,
    current_slide,
  } from '../stores/gui-store.js';

  // Plotting helper functions
  import {
    monitorPropertiesToIconOptions,
    purpleairCreateGeoJSON,
    purpleairPropertiesToIconOptions,
    clarityPropertiesToIconOptions,
    HMSFiresPropertiesToIconOptions,
  } from '../js/utils-map.js';

  // Utility functions
  // import { getPurpleAirData } from '../js/utils-purpleair.js';
  import { replaceWindowHistory } from '../js/utils.js';

  let map;
  let refreshInterval;

  let layers = {
    hmsSmoke: null,
    hmsFires: null,
    clarity: null,
    purpleair: null,
    airnow: null,
    airsis: null,
    wrcc: null,
  };

  onMount(() => {
    createMap();

    // Refresh store data every 10 minutes
    refreshInterval = setInterval(() => {
      airnow_geojson.reload();
      airsis_geojson.reload();
      wrcc_geojson.reload();
      pas.reload();
      clarity_geojson.reload();
      hms_smoke_geojson.reload();
      hms_fires_csv.reload();
      mapLastUpdated.set(DateTime.now());
    }, 5 * 60 * 1000); // 5 minutes
  });

  onDestroy(() => {
    if (map) map.remove();
    if (refreshInterval) clearInterval(refreshInterval);
  });

  async function createMap() {

    // Initialize the map
    map = L.map('map').setView([$centerLat, $centerLon], $zoom);
    basemapLayer('Topographic').addTo(map);

    // ----- Add Layers --------------------------------------------------------

    // Create empty Leaflet LayerGroups in this specific order
    layers.hmsSmoke = L.layerGroup().addTo(map);
    layers.hmsFires = L.layerGroup().addTo(map);   // below monitors
    layers.clarity = L.layerGroup().addTo(map);
    layers.purpleair = L.layerGroup().addTo(map);
    layers.airsis = L.layerGroup().addTo(map);
    layers.wrcc = L.layerGroup().addTo(map);
    layers.airnow = L.layerGroup().addTo(map);

    // Subscribe to HMS smoke
    hms_smoke_geojson.subscribe((geojson) => {
      layers.hmsSmoke.clearLayers();
      if (geojson) {
        const layer = createHMSSmokeLayer(geojson);
        layers.hmsSmoke.addLayer(layer);
      }
    });

    // Subscribe to HMS fire points
    hms_fires_csv.subscribe((csvData) => {
      if (csvData) {
        layers.hmsFires.clearLayers(); // clear existing points
        const layer = createHMSFiresLayer_csv(csvData);
        layers.hmsFires.addLayer(layer);
      }
    });

    // PurpleAir sensors
    // pas.load().then(function(synopticData) {
    //   let geojsonData = purpleairCreateGeoJSON(synopticData);
    //   PurpleAirLayer = createPurpleAirLayer(geojsonData);
    // });
    pas.subscribe((synopticData) => {
      if (synopticData) {
        const geojson = purpleairCreateGeoJSON(synopticData);
        const layer =createPurpleAirLayer(geojson);
        layers.purpleair.addLayer(layer);
      }
    })

    // Clarity sensors
    clarity_geojson.subscribe((geojson) => {
      if (geojson) {
        const layer =createClarityLayer(geojson)
        layers.clarity.addLayer(layer);
      }
    });

    // AIRSIS monitors
    airsis_geojson.subscribe((geojson) => {
      if (geojson) {
        const layer =createMonitorLayer(geojson)
        layers.airsis.addLayer(layer);
      }
    });

    // WRCC monitors
    wrcc_geojson.subscribe((geojson) => {
      if (geojson) {
        const layer =createMonitorLayer(geojson)
        layers.wrcc.addLayer(layer);
      }
    });

    // AirNow monitors
    airnow_geojson.subscribe((geojson) => {
      if (geojson) {
        const layer =createMonitorLayer(geojson)
        layers.airnow.addLayer(layer);
      }
    });

    // Kick off initial load of all data
    hms_smoke_geojson.reload();
    hms_fires_csv.reload();
    clarity_geojson.reload();
    airsis_geojson.reload();
    wrcc_geojson.reload();
    airnow_geojson.reload();
    mapLastUpdated.set(DateTime.now());

    // Make layers toggleable
    L.control.layers(null, {
      "HMS Fires": layers.hmsFires,
      "HMS Smoke": layers.hmsSmoke,
      "PurpleAir": layers.purpleair,
      "Clarity": layers.clarity,
      "AirNow": layers.airnow,
      "AIRSIS": layers.airsis,
      "WRCC": layers.wrcc,
    }).addTo(map);

    replaceWindowHistory($centerLat, $centerLon, $zoom, $selected_monitor_ids, $selected_clarity_ids); //, $selected_purpleair_ids);

    // ----- Add lastUpdated  custom control -----------------------------------

    let lastUpdatedDiv = L.control({ position: 'bottomright' });

    lastUpdatedDiv.onAdd = function () {
      const div = L.DomUtil.create('div', 'leaflet-control-latest-update');
      div.innerHTML = 'Last updated: ...';
      return div;
    };

    lastUpdatedDiv.addTo(map);

    // Subscribe to update time
    mapLastUpdated.subscribe((dt) => {
      if (dt && lastUpdatedDiv.getContainer()) {
        lastUpdatedDiv.getContainer().innerHTML =
          'Last updated: ' + dt.toFormat('h:mm a ZZZZ');
      }
    });

    // ----- Add event listeners to the map ------------------------------------

    // Force selected monitors/sensors to show hourly plot when interacting with the map
    map.on("mouseover", function() {
      $current_slide = "hourly";
    })

    // Update browser URL when panning
    map.on("moveend", function() {
      $centerLat = map.getCenter().lat;
      $centerLon = map.getCenter().lng;
      replaceWindowHistory($centerLat, $centerLon, $zoom, $selected_monitor_ids, $selected_clarity_ids); //, $selected_purpleair_ids);
    })

    // Update browser URL when zooming
    map.on("zoomend", function() {
      $zoom = map.getZoom();
      replaceWindowHistory($centerLat, $centerLon, $zoom, $selected_monitor_ids, $selected_clarity_ids); //, $selected_purpleair_ids);
    })

    // Ensure "hovered" plot is not shown after leaving the map
    map.on('mouseout', function () {
      $hovered_monitor_id = "";
      // $hovered_purpleair_id = "";
      $hovered_clarity_id = "";
      // $use_hovered_purpleair = false;
      $use_hovered_clarity = false;
    });

  }

	onMount(createMap);

  /* ------------------------------------------------------------------------ */
  /* -------------------------- End of Map ---------------------------------- */
  /* ------------------------------------------------------------------------ */

  /* ----- Monitor functions ------------------------------------------------ */

  /**
   * Creates a Leaflet GeoJSON layer for air quality monitors,
   * filtering out stale or excluded entries and applying interactive behavior.
   *
   * @param {Object} geojson - A GeoJSON FeatureCollection of monitor points.
   * @returns {L.GeoJSON} A Leaflet GeoJSON layer with custom markers and interactivity.
   */
  function createMonitorLayer(geojson) {
    const this_layer = L.geoJSON(geojson, {

      // Icon appearance
      pointToLayer: function (feature, latlng) {
        const props = feature.properties;

        if (
          props.deviceDeploymentID.includes('_pnwusfs') || // Skip Susan's JBLM research monitors
          parseInt(props.last_latency) >= 24 * 3           // Skip stale monitors
        ) return;

        const marker = L.shapeMarker(latlng, monitorPropertiesToIconOptions(props));
        const isSelected = $selected_monitor_ids.includes(props.deviceDeploymentID);
        marker.setStyle({ weight: isSelected ? 3 : 1 });

        return marker;
      },

      // Icon behavior
      onEachFeature: function (feature, layer) {
        layer.on('mouseover', function (e) {
          // $use_hovered_purpleair = false;
          $use_hovered_clarity = false;
          $hovered_monitor_id = feature.properties.deviceDeploymentID;
        });
        layer.on('mouseout', function (e) {
          $hovered_monitor_id = "";
        });
        layer.on('click', function (e) {
          monitorIconClick(e);
        });
      }
    });
    return this_layer;
  }

  // Monitor icon click behavior
  function monitorIconClick(e) {
    const id = e.target.feature.properties.deviceDeploymentID;
    const isSelected = $selected_monitor_ids.includes(id);

    if (isSelected) {
      // Remove it from selected_monitor_ids
      $selected_monitor_ids = $selected_monitor_ids.filter((x) => x !== id);
      e.target.setStyle({ weight: 1 });
    } else {
      // Add it to selected_monitor_ids
      $selected_monitor_ids = [id, ...$selected_monitor_ids];
      e.target.setStyle({ weight: 3 });
    }

    replaceWindowHistory($centerLat, $centerLon, $zoom, $selected_monitor_ids, $selected_clarity_ids);
  }

  /* ----- Clarity functions ------------------------------------------------ */

  /**
   * Creates a Leaflet GeoJSON layer for Clarity sensor locations,
   * filtering out stale data and applying interactive behavior.
   *
   * @param {Object} geojson - A GeoJSON FeatureCollection of Clarity sensor points.
   * @returns {L.GeoJSON} A Leaflet GeoJSON layer with custom markers and interactivity.
   */
  function createClarityLayer(geojson) {
    const this_layer = L.geoJSON(geojson, {

      // Icon appearance
      pointToLayer: function (feature, latlng) {
        const props = feature.properties;

        if (parseInt(props.last_latency) >= 24 * 3) return; // Skip stale sensors

        const marker = L.shapeMarker(latlng, clarityPropertiesToIconOptions(props));
        const isSelected = $selected_clarity_ids.includes(props.deviceDeploymentID);
        marker.setStyle({
          opacity: isSelected ? 1.0 : 0.2,
          weight: isSelected ? 2 : 1
        });

        return marker;
      },

      // Icon behavior
      onEachFeature: function (feature, layer) {
        layer.on('mouseover', function () {
          $hovered_clarity_id = feature.properties.deviceDeploymentID;
          $use_hovered_clarity = true;
        });
        layer.on('mouseout', function () {
          $hovered_clarity_id = "";
          $use_hovered_clarity = false;
        });
        layer.on('click', function (e) {
          clarityIconClick(e);
        });
      }
    });

    return this_layer;
  }

  /**
   * Handles clicking on a Clarity marker: toggles its selected state and updates the browser URL.
   *
   * @param {Object} e - Leaflet event triggered by clicking a marker.
   */
  function clarityIconClick(e) {
    const id = e.target.feature.properties.deviceDeploymentID;
    const isSelected = $selected_clarity_ids.includes(id);

    if (isSelected) {
      // Remove it from selected_clarity_ids
      $selected_clarity_ids = $selected_clarity_ids.filter((x) => x !== id);
      e.target.setStyle({ opacity: 0.2, weight: 1 });
    } else {
      // Add it to selected_clarity_ids
      $selected_clarity_ids = [id, ...$selected_clarity_ids];
      e.target.setStyle({ opacity: 1.0, weight: 2 });
    }

    replaceWindowHistory($centerLat, $centerLon, $zoom, $selected_monitor_ids, $selected_purpleair_ids, $selected_clarity_ids);
  }

  /* ----- PurpleAir functions ---------------------------------------------- */

  /**
   * Creates a Leaflet GeoJSON layer for PurpleAir sensors with latency filtering and interactivity.
   *
   * @param {Object} geojson - A GeoJSON FeatureCollection of PurpleAir sensor points.
   * @returns {L.GeoJSON} A Leaflet layer containing styled markers and interactive behavior.
   */
  function createPurpleAirLayer(geojson) {
    const this_layer = L.geoJSON(geojson, {
      // Customize marker rendering
      pointToLayer: function (feature, latlng) {
        const props = feature.properties;

        // Filter out stale sensors (>3 days latency)
        if (parseInt(props.latency) >= 24 * 3) return;

        const marker = L.shapeMarker(latlng, purpleairPropertiesToIconOptions(props));
        const isSelected = $selected_purpleair_ids.includes(props.deviceDeploymentID);
        marker.setStyle({
          opacity: isSelected ? 1.0 : 0.2,
          weight: isSelected ? 2 : 1
        });

        return marker;
      },

      // Define interactive behavior
      onEachFeature: function (feature, layer) {
        const id = feature.properties.deviceDeploymentID;

        layer.on('mouseover', () => {
          $hovered_purpleair_id = id;
          $use_hovered_purpleair = true;
        });

        layer.on('mouseout', () => {
          $hovered_purpleair_id = "";
          $use_hovered_purpleair = false;
        });

        layer.on('click', (e) => {
          purpleairIconClick(e);
        });
      }
    });

    return this_layer;
  }

  /**
   * Handles click events on PurpleAir sensor markers.
   * Loads and stores time series data if selected, and updates map and URL state.
   *
   * @param {Object} e - Leaflet event triggered by marker click.
   */
  async function purpleairIconClick(e) {
    const id = e.target.feature.properties.deviceDeploymentID;
    const isSelected = $selected_purpleair_ids.includes(id);

    if (!isSelected) {
      // Load and add time series data if not already in the cart
      if (!$patCart.items.some(item => item.id === id)) {
        console.log("Downloading PurpleAir data for id =", id);
        const purpleairData = await getPurpleAirData(id);
        patCart.addItem({ id, data: purpleairData });
      } else {
        console.log("pat id:", id, "is already loaded.");
      }

      // Update selected IDs (immutable update)
      $selected_purpleair_ids = [id, ...$selected_purpleair_ids];
      e.target.setStyle({ opacity: 1.0, weight: 2 });

    } else {
      // Deselect and update state
      $selected_purpleair_ids = $selected_purpleair_ids.filter((x) => x !== id);
      e.target.setStyle({ opacity: 0.2, weight: 1 });

      // Optional: consider removing time series from patCart here
      // patCart.removeItem({ id });
    }

    replaceWindowHistory($centerLat, $centerLon, $zoom, $selected_monitor_ids, $selected_purpleair_ids);
  }

  /* ----- HMS functions ---------------------------------------------------- */

  /**
   * Creates a Leaflet layer group containing HMS fire detection points,
   * rendered efficiently using a shared canvas renderer.
   *
   * Each fire point is represented as a small orange circle marker.
   * The layer group can be added to a map or to another parent layer group.
   *
   * @param {Array<Object>} csv - An array of fire detection records, each with `latitude` and `longitude` fields.
   * @returns {L.LayerGroup} A Leaflet layer group with circle markers for all fire points.
   */
  function createHMSFiresLayer_csv(csv) {
    const renderer = L.canvas({ padding: 0.5 });
    const layerGroup = L.layerGroup();

    for (let i = 0; i < csv.length; i++) {
      const { latitude, longitude } = csv[i];

      const marker = L.circleMarker([latitude, longitude], {
        renderer,
        radius: 3,
        fillColor: '#d7721c',
        fillOpacity: 0.5,
        weight: 1.5,
        color: "#e9c28f",
        opacity: 0.5,
      });

      marker.addTo(layerGroup);
    }

    return layerGroup;
  }

  /**
   * Creates a Leaflet GeoJSON layer representing HMS smoke plumes.
   * @param {Object} geojson - A valid GeoJSON FeatureCollection of polygons.
   * @returns {L.GeoJSON} A styled Leaflet GeoJSON layer.
   */
   function createHMSSmokeLayer(geojson) {
    let this_layer = L.geoJSON(geojson, {
      style: (feature) => ({
        fillColor: 'gray',
        weight: 1,
        opacity: 0.5,
        color: 'gray',
        fillOpacity: 0.15
      })
    });
    return this_layer;
  }

  /* ----- Other functions -------------------------------------------------- */

  // Watcher for map-external monitor deselect events
  $: if ($unselected_monitor_id !== "") {
    map.eachLayer(function(layer) {
      if (layer instanceof L.ShapeMarker) {
        if (layer.id == $unselected_monitor_id) {
          layer.setStyle({weight: 1});
          $unselected_monitor_id = "";
        }
      }
    })
    replaceWindowHistory($centerLat, $centerLon, $zoom, $selected_monitor_ids, $selected_clarity_ids); //, $selected_purpleair_ids);
  }

  // Watcher for map-external sensor deselect events
  // $: if ($unselected_purpleair_id !== "") {
  //   map.eachLayer(function(layer) {
  //     if (layer instanceof L.ShapeMarker) {
  //       if (layer.id == $unselected_purpleair_id) {
  //         layer.setStyle({opacity: 0.2, weight: 1});
  //         $unselected_purpleair_id = "";
  //       }
  //     }
  //   })
  //   replaceWindowHistory($centerLat, $centerLon, $zoom, $selected_monitor_ids, $selected_purpleair_ids); //, $selected_clarity_ids);
  // }

  // Watcher for map-external sensor deselect events
  $: if ($unselected_clarity_id !== "") {
    map.eachLayer(function(layer) {
      if (layer instanceof L.ShapeMarker) {
        if (layer.id == $unselected_clarity_id) {
          layer.setStyle({opacity: 0.2, weight: 1});
          $unselected_clarity_id = "";
        }
      }
    })
    replaceWindowHistory($centerLat, $centerLon, $zoom, $selected_monitor_ids, $selected_purpleair_ids, $selected_clarity_ids);
  }

</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
    integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
    crossorigin=""
  />
</svelte:head>

<!-- Note that sizing needs to be included as part of the element style. -->
<div id="map"
  style="width: {width}; height: {height};">
</div>

<style>

</style>