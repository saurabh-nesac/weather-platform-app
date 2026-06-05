// src/app.js

import './style/input.css';

import { createDashboardLayout } from '@/ui/layout/createDashboardLayout.js';
import { createMap, BBOX } from '@/rendering/map/map.js';
import { addTerrain } from '@/rendering/map/terrain.js';
import { setupMapEvents } from '@/rendering/map/events.js';
import { createRasterLayer } from '@/rendering/map/createRasterLayer.js';
import { loadMeta } from '@/data/loaders/metaLoader.js';
import { loadFrame } from '@/data/loaders/frameLoader.js'; 
import { loadContours } from '@/data/loaders/contourLoader.js';
import { createControls } from '@/ui/controls/createControls.js';
import { initializeRenderController } from '@/rendering/renderController.js';
import { store } from '@/core/state/store.js';
import { VARIABLES } from '@/variables/index.js';
import { emitCurrentFrame } from '@/core/events/frameEvents.js';
import { showLoading, hideLoading } from '@/ui/loading/loadingOverlay.js';
import { initializeSkewt } from '@/features/sounding/skewt/initializeSkewt.js';
import { loadSounding } from '@/features/sounding/controllers/soundingController.js';
import { initializeMeteogram, getMeteogram } from '@/features/meteogram/initializeMeteogram.js';
import { fetchMeteogram } from '@/features/meteogram/api/fetchMeteogram.js';


// ============================================================
// BOOT
// ============================================================

async function boot() {
    // LOADING
    showLoading();
    // LAYOUT
    const layout =
        createDashboardLayout();
    // MAP
    const map =
        createMap(
            layout.mapPanel
        );
    // CURRENT VARIABLE
    const variable =
        VARIABLES[
        store.app.currentVariable
        ];
    // MAP LOAD
    map.on('load', async () => {

        // FIT BOUNDS
        map.fitBounds(

            [

                [BBOX[0], BBOX[1]],

                [BBOX[2], BBOX[3]]
            ],

            {

                padding: 20,
                animate: false
            }
        );

        // TERRAIN
        // addTerrain(map);

        // EVENTS
        setupMapEvents(map);

        // CONTROLS
        createControls(
            map,
            layout.sidebar
        );

        // RENDER CONTROLLER
        initializeRenderController(map);

        // INITIALIZE PANELS
        requestAnimationFrame(() => {

            initializeSkewt(
                layout.skewtPanel
            );

            initializeMeteogram(
                layout.meteogramPanel
            );
        });

        // LOAD META
        await loadMeta();

        // LOAD FIRST FRAME
        const frame1 =
            await loadFrame(

                store.app.currentFrame,
                variable
            );

        // CACHE INIT
        if (

            !store.cache.frames[
            variable.id
            ]
        ) {

            store.cache.frames[
                variable.id
            ] = {};
        }

        // CACHE FRAME
        store.cache.frames[
            variable.id
        ][
            store.app.currentFrame
        ] = frame1;

        // APP READY

        store.app.loaded = true;

        // LOAD CONTOURS

        await loadContours(

            map,

            store.app.currentFrame
        );

        // ADD RASTER LAYER

        map.addLayer(

            createRasterLayer(variable)
        );

        // EMIT FRAME

        await emitCurrentFrame();

        // HIDE LOADING

        hideLoading();
    });


    // MAP CLICK


    map.on('click', async (e) => {

        const lon =
            e.lngLat.lng;

        const lat =
            e.lngLat.lat;

        // METEOGRAM

        const meteogram =
            getMeteogram();

        const meteogramData =
            await fetchMeteogram(

                lat,
                lon
            );

        meteogram.render(
            meteogramData
        );

        // SKEWT

        await loadSounding({

            lat,

            lon,

            timeIdx:
                store.app.currentFrame
        });
    });
}


// ============================================================
// START
// ============================================================

boot();