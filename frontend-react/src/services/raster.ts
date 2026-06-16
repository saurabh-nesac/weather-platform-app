//frontend-react/src/services/raster.ts
import { DatasetManifest } from "../core/state/types";
// src/core/datasets/frameLoader.ts


import type { FrameRequest } from "../core/state/types";

export async function loadFrame({
    datasetId,
    variable,
    frame,
}: FrameRequest) {

    const frameStr =
        frame
            .toString()
            .padStart(3, "0");

    const file =
        `/data/${datasetId}/${variable}/${frameStr}.bin`;

    const res =
        await fetch(file);

    if (!res.ok) {
        throw new Error(
            `Failed to load ${file}: ${res.status}`
        );
    }

    return new Float32Array(
        await res.arrayBuffer()
    );
}


export async function loadDatasetManifest(): Promise<DatasetManifest> {

    const res =
        await fetch(
            "/data/temperature/manifest.json"
        );

    return await res.json();
}