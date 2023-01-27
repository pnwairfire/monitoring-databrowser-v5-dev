// The air-monitor package encapsulates much of the functionality found in the
// AirMonitor R package.

// npm install github:MazamaScience/air-monitor
import Monitor from "air-monitor";

// NOTE:  The @square/svelte-store replacement for svelte-store is
// NOTE:  Incredibly helpful for us. The problem it solves is explained here:
// NOTE:    https://github.com/sveltejs/svelte/issues/8011
// NOTE:  More details and examples are given here:
// NOTE:    https://github.com/square/svelte-store

// NOTE:  Basically, it allows us to abstract away the async/await aspects of
// NOTE:  fetching data and create a derived object, "all_monitors", that will
// NOTE:   always stay up-to-date as data get periodically updated.

// npm install @square/svelte-store --save
import { asyncReadable, writable } from "@square/svelte-store";

export const airnowLoadTime = writable(1000);

// Reloadable AirNow data
export const all_monitors = asyncReadable(
  new Monitor(),
  async () => {
    const monitor = new Monitor();
    let start = Date.now();
    await monitor.loadAnnual(2021);
    let end = Date.now();
    let elapsed = (end - start) / 1000;
    let rounded = Math.round(10 * elapsed) / 10;
    airnowLoadTime.set(rounded);
    return monitor;
  },
  { reloadable: true }
);
