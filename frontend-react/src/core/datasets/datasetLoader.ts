import type {
    DatasetManifest
} from "@/core/datasets/datasetTypes";

import {
    VARIABLE_CONFIG,
} from "./variableConfig";

export async function loadDatasetManifest(
    variable: string
): Promise<DatasetManifest> {

    const cfg =
        VARIABLE_CONFIG[
        variable
        ];

    if (!cfg) {
        throw new Error(
            `Unsupported variable: ${variable}`
        );
    }

    const response =
        await fetch(
            `/data/${cfg.folder}/manifest.json`
        );

    if (!response.ok) {
        throw new Error(
            `Manifest not found for ${variable}`
        );
    }

    const manifest =
        await response.json();

    const required = [
        "dataset_id",
        "variable",
        "width",
        "height",
        "frames",
        "bbox",
        "min",
        "max",
    ];

    for (const key of required) {

        if (!(key in manifest)) {

            throw new Error(
                `Manifest missing field: ${key}`
            );

        }
    }

    return manifest as DatasetManifest;
}