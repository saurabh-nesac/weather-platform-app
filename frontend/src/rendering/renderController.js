//src\rendering\renderController.js
import { on }
    from '@/core/events/bus.js';

import { store }
    from '@/core/state/store.js';

import { loadFrame }
    from '@/data/loaders/frameLoader.js';

import { loadContours }
    from '@/data/loaders/contourLoader.js';

import { VARIABLES }
    from '@/variables/index.js';

let mapRef = null;

export function initializeRenderController(map) {

    mapRef = map;
    on('frameChanged', async (payload) => {

        const {
            frame,
            timestamp
        } = payload;

        console.log(
            'Rendering frame:',
            frame,
            timestamp
        );

        const variable =
            VARIABLES[
            store.app.currentVariable
            ];

        const data =
            await loadFrame(
                frame,
                variable
            );

        // initialize variable cache
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
        ][frame] = data;

        await loadContours(
            mapRef,
            frame
        );

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

    on('playbackStarted', () => {

        console.log('▶ Playback Started');
    });

    on('playbackStopped', () => {

        console.log('■ Playback Stopped');
    });
}