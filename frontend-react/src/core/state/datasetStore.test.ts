import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    useDatasetStore,
} from "./datasetStore";

describe(
    "DatasetStore",
    () => {
        beforeEach(() => {
            useDatasetStore
                .getState()
                .reset();
        });

        it(
            "starts empty",
            () => {
                const state =
                    useDatasetStore.getState();

                expect(
                    state.availableDatasets
                ).toHaveLength(0);

                expect(
                    state.selectedDatasetId
                ).toBeNull();
            }
        );

        it(
            "adds dataset",
            () => {
                useDatasetStore
                    .getState()
                    .addDataset({
                        id: "wrf_d02",

                        name:
                            "WRF D02 Forecast",

                        model: "WRF",

                        variables: [
                            "T2",
                            "RAIN",
                        ],

                        timesteps: 49,
                    });

                expect(
                    useDatasetStore
                        .getState()
                        .availableDatasets
                ).toHaveLength(1);
            }
        );

        it(
            "selects dataset",
            () => {
                const store =
                    useDatasetStore.getState();

                store.addDataset({
                    id: "wrf",

                    name: "WRF",

                    model: "WRF",

                    variables: ["T2"],

                    timesteps: 49,
                });

                store.selectDataset(
                    "wrf"
                );

                expect(
                    useDatasetStore
                        .getState()
                        .selectedDatasetId
                ).toBe("wrf");
            }
        );

        it(
            "removing selected dataset clears selection",
            () => {
                const store =
                    useDatasetStore.getState();

                store.addDataset({
                    id: "wrf",

                    name: "WRF",

                    model: "WRF",

                    variables: ["T2"],

                    timesteps: 49,
                });

                store.selectDataset(
                    "wrf"
                );

                store.removeDataset(
                    "wrf"
                );

                expect(
                    useDatasetStore
                        .getState()
                        .selectedDatasetId
                ).toBeNull();
            }
        );
    }
);