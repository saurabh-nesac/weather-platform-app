// src/features/meteogram/initializeMeteogram.js

import {

    MeteogramCanvas

} from './MeteogramCanvas.js';


// ============================================================
// INSTANCE
// ============================================================

let meteogram = null;


// ============================================================
// INITIALIZE
// ============================================================

export function initializeMeteogram(
    container
) {

    // --------------------------------------------------------
    // CLEAR
    // --------------------------------------------------------

    container.innerHTML = '';

    // --------------------------------------------------------
    // METEOGRAM
    // --------------------------------------------------------

    meteogram = new MeteogramCanvas({

        container,

        width:
            container.clientWidth,

        height:
            container.clientHeight
    });

    return meteogram;
}


// ============================================================
// GET
// ============================================================

export function getMeteogram() {

    return meteogram;
}