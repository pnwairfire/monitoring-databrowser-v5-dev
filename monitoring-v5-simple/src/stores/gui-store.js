import { writable } from 'svelte/store';

// Reactive function depends on selected_id and selected_plot_type
export let selected_id = writable('');
export let selected_plot_type = writable('');
