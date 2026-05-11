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
import { VARIABLES }
    from '@/variables/index.js';
async function boot() {

    const variable =

        VARIABLES[
        store.app.currentVariable
        ];
    console.log(variable)

    await loadMeta();

    const frame1 =
        await loadFrame(7, variable);

    store.cache.frames[1] = frame1;
    store.app.loaded = true;
    const map = createMap();

    map.on('load', async () => {

        addTerrain(map);
        setupMapEvents(map);
        await loadContours(map, 1);

        try {
            map.addLayer
                (createRasterLayer(variable)
                );

        } catch (error) {
            console.log('Done Creating Raster Layer', error)
        }


        createControls(map);
        initializeRenderController(map);

    });
}

boot();