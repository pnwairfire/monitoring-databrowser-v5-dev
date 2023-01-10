<script>
  export let text = "Time series";
  export let type = "timeseries";
  import { selected_plot_type } from "../stores/monitor-store";

  // TODO:  How to get conditional styling?
  export function isChosen() {
    return(type === $selected_plot_type);
  }

  function handleClick() {
    $selected_plot_type = type;
  }
</script>

<button on:click={handleClick} class:chosen={isChosen()}>
  { text }
</button>

<style>
  .chosen {
    font-weight: bold;
  }
</style>