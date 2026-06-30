// src/core/datasets/frameManager.ts

import {
    loadFrame,
} from "./frameLoader";

import type {
    FrameRequest,
    RasterFrame,
} from "./datasetTypes";

export async function getFrame(
    request: FrameRequest
): Promise<RasterFrame> {

    return loadFrame(
        request
    );
}