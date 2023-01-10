// The air-monitor package encapsulates much of the functionality found in the
// AirMonitor R package.

// npm install github:MazamaScience/air-monitor
import Monitor from 'air-monitor';

// NOTE:  The @square/svelte-store replacement for svelte-store is
// NOTE:  Incredibly helpful for us. The problem it solves is explained here:
// NOTE:    https://github.com/sveltejs/svelte/issues/8011
// NOTE:  More details and examples are given here:
// NOTE:    https://github.com/square/svelte-store

// NOTE:  Basically, it allows us to abstract away the async/await aspects of
// NOTE:  fetching data and create a derived object, "all_monitors", that will
// NOTE:   always stay up-to-date as data get periodically updated.

// npm install @square/svelte-store --save
import { asyncReadable, derived, writable } from '@square/svelte-store';

export let selected_id = writable('');
export let selected_plot_type = writable('');

// Reloadable AirNow data
export const airnow = asyncReadable(
	new Monitor(),
	async () => {
		const monitor = new Monitor();
		await monitor.loadLatest('airnow');
		return monitor;
	},
	{ reloadable: true }
);

// Reloadable AIRSIS data
export const airsis = asyncReadable(
	new Monitor(),
	async () => {
		const monitor = new Monitor();
		await monitor.loadLatest('airsis');
		return monitor;
	},
	{ reloadable: true }
);

// Reloadable WRCC data
export const wrcc = asyncReadable(
	new Monitor(),
	async () => {
		const monitor = new Monitor();
		await monitor.loadLatest('wrcc');
		return monitor;
	},
	{ reloadable: true }
);

// All monitors combined (only returns after all "parent" items return)
export const all_monitors = derived([airnow, airsis, wrcc], ([$airnow, $airsis, $wrcc]) => {
	let all_monitors = $airnow.combine($airsis).combine($wrcc).dropEmpty();

	selected_id.set(all_monitors.meta.sample(1).get('deviceDeploymentID'));
	selected_plot_type.set('timeseries');

	return all_monitors;
});
