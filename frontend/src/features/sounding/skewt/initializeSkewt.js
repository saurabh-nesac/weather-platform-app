// src/features/sounding/skewt/initializeSkewt.js

import {

    SkewTCanvas

} from './SkewTCanvas.js';


// ============================================================
// INSTANCE
// ============================================================

let skewt = null;


// ============================================================
// INITIALIZE
// ============================================================

export function initializeSkewt(
    container
) {

    // --------------------------------------------------------
    // CLEAR
    // --------------------------------------------------------

    container.innerHTML = '';

    // --------------------------------------------------------
    // SKEWT
    // --------------------------------------------------------

    skewt = new SkewTCanvas({

        container,

        width:
            container.clientWidth,

        height:
            container.clientHeight
    });

    return skewt;
}


// ============================================================
// GET
// ============================================================

export function getSkewt() {

    return skewt;
}