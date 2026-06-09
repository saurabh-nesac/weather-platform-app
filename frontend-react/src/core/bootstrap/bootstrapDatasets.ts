// src/core/bootstrap/bootstrapDatasets.ts

import {
    loadDatasetManifest,
} from "../datasets/datasetLoader";

import {
    useDatasetStore,
} from "../state/datasetStore";

export async function
    bootstrapDatasets() {

    const manifest =
        await loadDatasetManifest();

    const store =
        useDatasetStore.getState();

    store.addDataset({
        id:
            manifest.dataset_id,

        name:
            manifest.dataset_id,

        model:
            "WRF",

        variables: [
            manifest.variable,
        ],

        timesteps:
            manifest.frames,

        timestamps:
            manifest.timestamps,

        bbox:
            manifest.bbox,
    });

    store.selectDataset(
        manifest.dataset_id
    );
}