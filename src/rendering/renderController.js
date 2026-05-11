//src\rendering\renderController.js
import { on }
    from '@/core/events/bus.js';

import { store }
    from '@/core/state/store.js';

import { loadFrame }
    from '@/data/loaders/frameLoader.js';

import { loadContours }
    from '@/data/loaders/contourLoader.js';

let mapRef = null;

export function initializeRenderController(map) {

    mapRef = map;

    on('frameChanged', async (frame) => {

        console.log('Rendering frame:', frame);

        const data = await loadFrame(frame);

        store.frames[frame] = data;

        await loadContours(mapRef, frame);

        mapRef.triggerRepaint();
    });

    on('variableChanged', async (variable) => {

        console.log('Variable changed:', variable);

        mapRef.triggerRepaint();
    });

    on('opacityChanged', (opacity) => {

        console.log('Opacity changed:', opacity);

        store.opacity = opacity;

        mapRef.triggerRepaint();
    });
}