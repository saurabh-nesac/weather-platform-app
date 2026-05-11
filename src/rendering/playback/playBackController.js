//src\rendering\playback\playBackControllers.js

import { store }
from '@/core/state/store.js';

import {
    emit,
    emitAsync
}
from '@/core/events/bus.js';

let running = false;

let playbackTask = null;

function sleep(ms) {

    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

export async function startPlayback() {

    if (running) return;

    running = true;

    store.app.playing = true;

    const currentFrame =
        store.app.currentFrame;

    const timestamp =
        store.cache.metadata?.[
            store.app.currentVariable
        ]?.[
            currentFrame
        ]?.timestamp || null;

    emit('playbackStarted', {
        frame: currentFrame,
        timestamp
    });

    playbackTask = playLoop();
}

export function stopPlayback() {

    running = false;

    store.app.playing = false;

    const currentFrame =
        store.app.currentFrame;

    const timestamp =
        store.cache.metadata?.[
            store.app.currentVariable
        ]?.[
            currentFrame
        ]?.timestamp || null;

    emit('playbackStopped', {
        frame: currentFrame,
        timestamp
    });
}

async function playLoop() {

    while (running) {

        store.app.currentFrame++;

        if (store.app.currentFrame > 72) {
            store.app.currentFrame = 1;
        }

        const frame =
            store.app.currentFrame;

        const timestamp =
            store.cache.metadata?.[
                store.app.currentVariable
            ]?.[
                frame
            ]?.timestamp || null;

        await emitAsync(
            'frameChanged',
            {
                frame,
                timestamp
            }
        );

        await sleep(500);
    }
}