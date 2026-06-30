// frontend-react/src/core/datasets/frameLoader.ts
import type {
    FrameRequest,
    RasterFrame,
} from "./datasetTypes";

import {
    getCachedFrame,
    cacheFrame,
} from "./frameCache";
import {
    VARIABLE_CONFIG,
} from "./variableConfig";
export async function loadFrame(
    request: FrameRequest
): Promise<RasterFrame> {

    const cached =
        getCachedFrame(
            request
        );

    if (cached) {
        console.log(
            "CACHE HIT",
            request.frame
        );

        return cached;
    }

    const file =
        buildFramePath(
            request
        );

    const res =
        await fetch(file);

    if (!res.ok) {
        throw new Error(
            `Failed to load ${file}: ${res.status}`
        );
    }

    const data =
        new Float32Array(
            await res.arrayBuffer()
        );

    const rasterFrame: RasterFrame = {
        datasetId:
            request.datasetId,

        variable:
            request.variable,

        frame:
            request.frame,

        data,
    };

    cacheFrame(
        rasterFrame
    );

    return rasterFrame;
}

export function buildFramePath(
    request: FrameRequest
): string {

    const cfg =
        VARIABLE_CONFIG[
        request.variable
        ];

    if (!cfg) {
        throw new Error(
            `Unsupported variable: ${request.variable}`
        );
    }

    const frameStr =
        request.frame
            .toString()
            .padStart(3, "0");

    return `/data/${cfg.folder}/${cfg.prefix}_${frameStr}.bin`;
}