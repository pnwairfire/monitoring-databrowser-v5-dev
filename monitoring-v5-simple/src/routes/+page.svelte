<script>
  import {all_monitors, selected_id} from "../stores/monitor-store.js";
  import SelectRandomButton from "../components/SelectRandomButton.svelte";
</script>

<h1>Welcome to SvelteKit</h1>

{#await all_monitors}
  <p>...loading all_monitors data</p>
{:then}
<!-- <p>whew!</p> -->
  <p>We just created a Monitor. It has {$all_monitors.meta.numRows()} time series;</p>
  <p>The <code>selected_id</code> is {$selected_id}.</p>
{:catch}
  <p style="color: red">An error occurred</p>
{/await}

<div>
  Howdy howdy!
</div>

<SelectRandomButton />

<style>
  h1 {
    color: coral;
  }
</style>