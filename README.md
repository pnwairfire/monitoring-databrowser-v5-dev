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
npm install arquero
npm install moment-timezone
npm install suncalc
npm install highcharts
npm install @square/svelte-store
# AirFire packages
npm install github:MazamaScience/air-monitor
```
