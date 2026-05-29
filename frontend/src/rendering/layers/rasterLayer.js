// frontend/src/rendering/layers/rasterLayer.js

import {

    renderRaster

} from '@/rendering/engine/renderRaster.js';

import {

    store

} from '@/core/state/store.js';


// ============================================================
// RENDER LAYER
// ============================================================

export function renderLayer(

    gl,

    args,

    layer
) {

    renderRaster({

        gl,

        matrix:
            args.defaultProjectionData.mainMatrix,

        texture:
            layer.texture,

        shader:
            layer.shader,

        scaling:
            layer.scaling,

        opacity:
            store.rendering.opacity
    });
}