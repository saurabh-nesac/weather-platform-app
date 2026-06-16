// src/core/bootstrap/bootstrapDatasets.ts

import {
    loadDatasetManifest,
} from "../datasets/datasetLoader";

import {
    useDatasetStore,
} from "../state/datasetStore";

import { VARIABLES } from "../config/variables";

export async function
    bootstrapDatasets() {

    const store =
        useDatasetStore.getState();

    for (const variable of VARIABLES) {

        try{

            const manifest =
            await loadDatasetManifest(
                variable
            );
            
            store.addDataset({
            id: variable,

            name:
                manifest.long_name,

            model: "WRF",

            variables: [
                variable,
            ],

            timesteps:
            manifest.frames,
            
            timestamps:
                manifest.timestamps,
                
                bbox:
                manifest.bbox,
            });
        }
        catch(err){
            console.error(
                `Failed to load ${variable}`,
                err)
        }
    }

    store.selectDataset(
        "T2"
    );
}