import { writable, derived } from "@square/svelte-store";

import { all_monitors } from "./monitor-data-store.js";

// GUI state with user selections
export let selected_plot_type = writable("");
export let selected_id = writable("");

export let selected_meta = derived(
  [all_monitors, selected_id],
  ([$all_monitors, $selected_id]) => {
    let meta = $all_monitors.getMetaObject($selected_id);
    return meta;
  }
);
