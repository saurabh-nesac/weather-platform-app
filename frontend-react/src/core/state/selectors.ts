import { useAtmosStore } from "./atmosStore";
import { useDatasetStore } from "./datasetStore";

export const useFrame = () =>
    useAtmosStore((s) => s.frame);

export const useVariable = () =>
    useAtmosStore((s) => s.variable);

export const useSelectedPoint = () =>
    useAtmosStore((s) => s.selectedPoint);

export const useSetFrame = () =>
    useAtmosStore((s) => s.setFrame);

export const useSelectedDataset =
    () =>
        useDatasetStore(
            (s) =>
                s.availableDatasets.find(
                    (d) =>
                        d.id ===
                        s.selectedDatasetId
                )
        );


export const useMaxFrame =
    () =>
        useDatasetStore(
            (s) => {
                const ds =
                    s.availableDatasets.find(
                        (d) =>
                            d.id ===
                            s.selectedDatasetId
                    );

                return Math.max(
                    0,
                    (ds?.timesteps ?? 1) - 1
                );
            }
        );

export const useTimestamps = () =>
    useDatasetStore((s) => {        

        const ds =
            s.availableDatasets.find(
                (d) =>
                    d.id ===
                    s.selectedDatasetId
            );

        

        return ds?.timestamps;
    });

export const useSelectedDatasetId =
    () =>
        useDatasetStore(
            s => s.selectedDatasetId
        );
