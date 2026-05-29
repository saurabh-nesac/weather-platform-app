// src/rendering/playback/playBackControllers.js

import {

    store

} from '@/core/state/store.js';

import {

    emit

} from '@/core/events/bus.js';

import {

    setFrame

} from '@/core/timeline/setFrame.js';


// ============================================================
// INTERNAL
// ============================================================

let running = false;

let playbackTask = null;


// ============================================================
// SLEEP
// ============================================================

function sleep(ms) {

    return new Promise(resolve => {

        setTimeout(resolve, ms);
    });
}


// ============================================================
// START PLAYBACK
// ============================================================

export async function startPlayback() {

    if (running) return;

    running = true;

    store.app.playing = true;

    // --------------------------------------------------------
    // EVENT
    // --------------------------------------------------------

    emit(

        'playbackStarted',

        {

            frame:
                store.app.currentFrame
        }
    );

    // --------------------------------------------------------
    // LOOP
    // --------------------------------------------------------

    playbackTask =
        playLoop();
}


// ============================================================
// STOP PLAYBACK
// ============================================================

export function stopPlayback() {

    running = false;

    store.app.playing = false;

    emit(

        'playbackStopped',

        {

            frame:
                store.app.currentFrame
        }
    );
}


// ============================================================
// PLAY LOOP
// ============================================================

async function playLoop() {

    while (running) {

        // ----------------------------------------------------
        // NEXT FRAME
        // ----------------------------------------------------

        let nextFrame =
            store.app.currentFrame + 1;

        // ----------------------------------------------------
        // LOOP
        // ----------------------------------------------------

        if (nextFrame > 48) {

            nextFrame = 0;
        }

        // ----------------------------------------------------
        // CENTRALIZED FRAME UPDATE
        // ----------------------------------------------------

        await setFrame(
            nextFrame
        );

        // ----------------------------------------------------
        // SPEED
        // ----------------------------------------------------

        await sleep(500);
    }
}