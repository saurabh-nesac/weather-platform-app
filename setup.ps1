# =========================
# WEATHER PLATFORM BACKBONE
# =========================

# --- ROOT SRC ---
New-Item -ItemType Directory -Force src

# =========================
# CORE
# =========================

New-Item -ItemType Directory -Force src/core/state
New-Item -ItemType Directory -Force src/core/config
New-Item -ItemType Directory -Force src/core/events

# store.js
@"
export const store = {
    currentVariable: "rain",
    currentFrame: 1,
    loaded: false,

    datasets: {},

    ui: {
        playing: false,
        sidebarOpen: true
    }
};
"@ | Set-Content src/core/state/store.js

# variables.js
@"
export const VARIABLES = {

    rain: {
        key: "rain",
        name: "Rainfall",
        unit: "mm/hr",
        min: 0,
        max: 100,
        colormap: "rainbow"
    },

    temperature: {
        key: "temperature",
        name: "Temperature",
        unit: "°C",
        min: -10,
        max: 45,
        colormap: "temperature"
    },

    humidity: {
        key: "humidity",
        name: "Humidity",
        unit: "%",
        min: 0,
        max: 100,
        colormap: "humidity"
    }
};
"@ | Set-Content src/core/config/variables.js

# bus.js
@"
const listeners = {};

export function on(event, callback) {

    if (!listeners[event]) {
        listeners[event] = [];
    }

    listeners[event].push(callback);
}

export function emit(event, payload) {

    if (!listeners[event]) return;

    listeners[event].forEach(cb => cb(payload));
}
"@ | Set-Content src/core/events/bus.js

# =========================
# DATA
# =========================

New-Item -ItemType Directory -Force src/data/loaders
New-Item -ItemType Directory -Force src/data/cache

# binaryLoader.js
@"
export async function loadBinary(url) {

    const res = await fetch(url);

    const buf = await res.arrayBuffer();

    return new Float32Array(buf);
}
"@ | Set-Content src/data/loaders/binaryLoader.js

# metaLoader.js
@"
export async function loadMeta() {

    const res = await fetch('/data/meta.json');

    return await res.json();
}
"@ | Set-Content src/data/loaders/metaLoader.js

# contourLoader.js
@"
export async function loadContour(frame) {

    const file =
        '/data/contours/contour_' +
        String(frame).padStart(3, '0') +
        '.geojson';

    const res = await fetch(file);

    return await res.json();
}
"@ | Set-Content src/data/loaders/contourLoader.js

# =========================
# RENDERING
# =========================

New-Item -ItemType Directory -Force src/rendering/map
New-Item -ItemType Directory -Force src/rendering/shaders
New-Item -ItemType Directory -Force src/rendering/colormaps

# map.js
@"
import maplibregl from 'maplibre-gl';

export function createMap(container = 'map') {

    return new maplibregl.Map({

        container,

        style: {
            version: 8,
            sources: {},
            layers: []
        },

        center: [92, 26],
        zoom: 6
    });
}
"@ | Set-Content src/rendering/map/map.js

# layers.js
@"
export function addRainLayer(map) {

    console.log('Add rain layer');
}
"@ | Set-Content src/rendering/map/layers.js

# controls.js
@"
export function setupControls() {

    console.log('Setup controls');
}
"@ | Set-Content src/rendering/map/controls.js

# fragment.glsl
@"
precision highp float;

void main() {

    gl_FragColor = vec4(1.0);
}
"@ | Set-Content src/rendering/shaders/fragment.glsl

# vertex.glsl
@"
attribute vec2 a_pos;

void main() {

    gl_Position = vec4(a_pos, 0.0, 1.0);
}
"@ | Set-Content src/rendering/shaders/vertex.glsl

# rainfall.js
@"
export const rainfallColors = [
    '#0000ff',
    '#00ffff',
    '#00ff00',
    '#ffff00',
    '#ff0000'
];
"@ | Set-Content src/rendering/colormaps/rainfall.js

# =========================
# ANALYTICS
# =========================

New-Item -ItemType Directory -Force src/analytics/metrics

# rmse.js
@"
export function rmse(obs, forecast) {

    let sum = 0;

    for (let i = 0; i < obs.length; i++) {

        const diff = forecast[i] - obs[i];

        sum += diff * diff;
    }

    return Math.sqrt(sum / obs.length);
}
"@ | Set-Content src/analytics/metrics/rmse.js

# mae.js
@"
export function mae(obs, forecast) {

    let sum = 0;

    for (let i = 0; i < obs.length; i++) {

        sum += Math.abs(forecast[i] - obs[i]);
    }

    return sum / obs.length;
}
"@ | Set-Content src/analytics/metrics/mae.js

# =========================
# VARIABLES
# =========================

New-Item -ItemType Directory -Force src/variables

# =========================
# UI
# =========================

New-Item -ItemType Directory -Force src/ui

# =========================
# WORKERS
# =========================

New-Item -ItemType Directory -Force src/workers

# blurWorker.js
@"
self.onmessage = (e) => {

    console.log('Worker received:', e.data);

    self.postMessage({
        ok: true
    });
};
"@ | Set-Content src/workers/blurWorker.js

# =========================
# APP ENTRY
# =========================

@"
import './style.css';

import { createMap } from './rendering/map/map.js';
import { loadMeta } from './data/loaders/metaLoader.js';

async function boot() {

    console.log('Booting Weather Platform...');

    const meta = await loadMeta();

    console.log('Loaded meta:', meta);

    const map = createMap();

    console.log(map);
}

boot();
"@ | Set-Content src/app.js

# =========================
# STYLE
# =========================

@"
html, body, #app {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
}

body {
    background: #000;
    overflow: hidden;
    font-family: sans-serif;
}

#map {
    width: 100vw;
    height: 100vh;
}
"@ | Set-Content src/style.css

# =========================
# HTML UPDATE
# =========================

@"
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Weather Platform</title>
</head>

<body>

    <div id="map"></div>

    <script type="module" src="/src/app.js"></script>

</body>

</html>
"@ | Set-Content index.html

Write-Host ""
Write-Host "✅ Weather Platform Backbone Created"
Write-Host ""