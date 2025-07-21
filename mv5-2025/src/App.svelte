<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'

// import { pm_nowcast } from "../src/index.js";
import { trimDate } from 'air-monitor-algorithms';
// import { dailyStats } from "../src/index.js";
// import { diurnalStats } from "../src/index.js";

import { DateTime } from "luxon";

let datetime = [];
let x = [];
let timezone = "America/Los_Angeles";

let now = DateTime.utc().startOf("hour");

const start = DateTime.fromISO("2023-02-14T00:00:00", { zone: "UTC" });

for (let i = 0; i < 240; i++) {
  datetime[i] = start.plus({ hours: i }); // Luxon DateTime in UTC
  const val = 10 + 5 * Math.sin((i * Math.PI) / 12) + Math.random() * 6 - 3;
  x[i] = Math.round(val * 10) / 10;
}


let trimmed = trimDate(datetime, x, timezone);

// let nowcast = pm_nowcast(x); // looks good

// let daily = dailyStats(datetime, x, timezone);
// console.table(daily)

// let diurnal = diurnalStats(datetime, x, timezone);

let z = 1;

// // ----- PLAY AREA -------------------------------------------------------------

// let zzz = 1;
</script>

<main>
  <div>
    <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Vite + Svelte</h1>

  <div id="Jons_dev">
    Dev work in this block.

    Now is {now}.

    Trimmed 0 has {trimmed.datetime[0]} and {trimmed.x[0]}.
  </div>

  <div class="card">
    <Counter />
  </div>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Click on the Vite and Svelte logos to learn more
  </p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
