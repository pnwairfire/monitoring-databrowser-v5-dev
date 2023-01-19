# Monitoring v5

This directory contains one (or more) Svelte apps that together make up the
monitoring v5 website. These are each built using Svelte and Svelte-kit. For
more information about Svelte, see https://svelte.dev.

## monitoring-v5-simple

This first app only displays one plot at a time.

Initial setup with:

```
npm create svelte@latest monitoring-v5-simple
cd monitoring-v5-simple
npm install
```

Then, from Visual Studio, you can

```
npm run dev
```

And view the page at http://localhost:5173/

Next up we need to install the package dependencies with:

```
# npm packages
npm install arquero highcharts moment-timezone suncalc
npm install @square/svelte-store
# AirFire packages
npm install github:MazamaScience/air-monitor-algorithms
npm install github:MazamaScience/air-monitor
npm install github:pnwairfire/air-monitor-plots
```

## Svelte + Charting Examples

- Simple Highcharts: https://svelte.dev/repl/d283589caa554badb16644ad40682802?version=3.38.2
- Chart Component: https://www.youtube.com/watch?v=s7rk2b1ioVE
- Using Actions: https://www.youtube.com/watch?v=HzmaqcsDiP0

## Svelte + Leaflet

- Simple Component: https://dev.to/khromov/using-leaflet-with-sveltekit-3jn1
