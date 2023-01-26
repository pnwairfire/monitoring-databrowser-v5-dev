<script>
	// Exports
  export let width = '400px';
  export let height = '300px';

  import { all_monitors } from '../stores/monitor-data-store.js';
  import { selected_id, selected_meta } from '../stores/gui-store.js';

</script>

<div class="monitor-info-box"
     style="width: {width}; height: {height};">

  <label>{$all_monitors.getMetadata($selected_id, 'locationName')}</label>
  <p>
    <span>AQSID: {$all_monitors.getMetadata($selected_id, 'AQSID')}</span><br>
    <span>Source: AirNow</span><br>
    <span>Timezone: {$selected_meta.timezone}</span><br>
    <span>lon: {$selected_meta.longitude}</span><br>
    <span>lat: {$selected_meta.latitude}</span><br>
    <span>QA/QC: by {$selected_meta.dataIngestSource}</span><br>
    <a href="https://tools.airfire.org/location/report?longitude={$selected_meta.longitude}&latitude={$selected_meta.latitude}"
       target="_blank" rel="noreferrer">
      Location Report
    </a>
  </p>

</div>

<style>
	.monitor-info-box {
    text-align: left;
    padding-left: 1rem;
    padding-top: 1rem
	}
  label {
    font-size: x-large;
    font-weight: bold;
  }
</style>
