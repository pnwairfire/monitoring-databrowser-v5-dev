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
npm install leaflet
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

Things I've tried.

https://www.npmjs.com/package/@sveltehacks/leaflet?activeTab=explore

This looks like a well built modern Svelte component but treats markers as sub-components using Svelte _context_. Not what I'm looking for.

https://dev.to/khromov/using-leaflet-with-sveltekit-3jn1

Just implements leaflet as a full page Svelte app. Not enough details to figure
out how to make a component.

https://www.npmjs.com/package/svelte-map-leaflet?activeTab=readme

Haven't tried it but it also treats markers as individual components.

### leaflet-svelte

https://www.npmjs.com/package/@anoram/leaflet-svelte

This looks promising with 110 weekly downloads. Last publish 2 years ago.

### svelte-leaflet

https://www.npmjs.com/package/svelte-leafletjs

This looks perhaps more promising with 499 weekly downloads. Last publish 2 months ago.
