// src/core/timeline/setFrame.js

import {

    store

} from '@/core/state/store.js';

import {

    emitAsync

} from '@/core/events/bus.js';


// ============================================================
// SET FRAME
// ============================================================

export async function setFrame(
    frame
) {

    // --------------------------------------------------------
    // LIMITS
    // --------------------------------------------------------

    const clamped =
        Math.max(
            0,
            Math.min(48, frame)
        );

    // --------------------------------------------------------
    // STORE
    // --------------------------------------------------------

    store.app.currentFrame =
        clamped;

    // --------------------------------------------------------
    // TIMESTAMP
    // --------------------------------------------------------

    const timestamp =
        store.cache.metadata?.[
            store.app.currentVariable
        ]?.[
            clamped
        ]?.timestamp || null;

    // --------------------------------------------------------
    // EMIT
    // --------------------------------------------------------

    await emitAsync(

        'frameChanged',

        {

            frame:
                clamped,

            timestamp
        }
    );
}