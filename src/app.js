import './style.css';
import { createMap } from '@/rendering/map/map.js';
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
import { emitCurrentFrame } from '@/core/events/frameEvents.js'
import { showLoading, hideLoading } from './ui/loading/loadingOverlay';
async function boot() {

    showLoading()
    const map = createMap();

    const variable =
        VARIABLES[
        store.app.currentVariable
        ];

    map.on('load', async () => {
        addTerrain(map);

        setupMapEvents(map);

        createControls(map);

        initializeRenderController(map);

        // async data pipeline
        await loadMeta();

        const frame1 =
            await loadFrame(
                store.app.currentFrame,
                variable
            );

        if (
            !store.cache.frames[
            variable.id
            ]
        ) {

            store.cache.frames[
                variable.id
            ] = {};
        }

        store.cache.frames[
            variable.id
        ][
            store.app.currentFrame
        ] = frame1;

        store.app.loaded = true;

        await loadContours(
            map,
            store.app.currentFrame
        );

        map.addLayer(
            createRasterLayer(variable)
        );

        await emitCurrentFrame();
        
        hideLoading()
    });
}

boot();