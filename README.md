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
npm install github:MazamaScience/air-monitor
npm install github:MazamaScience/air-monitor-algorithms
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

## Rendering static pages

Following example at:

https://dev.to/robertobutti/how-to-start-building-your-static-website-with-svelte-and-tailwindcss-hbk

```
npm i -D @sveltejs/adapter-static@latest
npm i svelte-preprocess
npm i postcss-load-config
```

Update `svelte.config.js` as described in the web page above.

Also see:

https://kit.svelte.dev/docs/adapter-static

\*\*Lots of problems whose solutions involve more and more software bundles.(())

_Should I switch to using Svelte w/o SvelteKit?_

## Svelte-only app

https://akashmittal.com/install-svelte-create-project/

Need to add this to ingest arquero .json files.

```
npm i -D @rollup/plugin-json
```

Now you need to edit `rollup.config.js` to look like this:

```
import json from "@rollup/plugin-json";
...
export default {
    plugins: [
        commonjs(),
        json(),      // <---- put after commonjs
    ]
}
...
```

Now `run build` should work to generate a complete site in the `public/`
directory.

Before deploying, edit `public/index.html` to use relative paths for the .css
and .js files.

Then just deploy as a static site!
