// frontend-react/src/core/state/selectors.ts
import { useAtmosStore } from "./atmosStore";
import { useDatasetStore } from "./datasetStore";

export const useFrame = () =>
    useAtmosStore((s) => s.frame);

export const useVariable = () =>
    useAtmosStore((s) => s.variable);

export const useSelectedPoint = () =>
    useAtmosStore((s) => s.selectedPoint);

export const useSetSelectedPoint = () =>
    useAtmosStore(
        s => s.setSelectedPoint
    );

export const useSetFrame = () =>
    useAtmosStore((s) => s.setFrame);

export const useSelectedDataset = () =>
    useDatasetStore((s) =>
        s.availableDatasets.find(
            (d) =>
                d.id ===
                s.selectedDatasetId
        )
    );


export const useMaxFrame = () =>
    useDatasetStore((s) => {
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
export const useRenderBackend =
    () =>
        useAtmosStore(
            s => s.renderBackend
        );

export const useSetRenderBackend =
    () =>
        useAtmosStore(
            s => s.setRenderBackend
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

export const useSelectedDatasetId = () =>
    useDatasetStore(
        s => s.selectedDatasetId
    );
// selectors.ts

export const useCurrentTimestamp = () => {

    const frame =
        useFrame();

    const timestamps =
        useTimestamps();

    return timestamps?.[
        frame
    ];
};

export const usePlaying = () =>
    useAtmosStore(
        s => s.playing
    );

export const useSetPlaying = () =>
    useAtmosStore(
        s => s.setPlaying
    );


const DEFAULT_POINT = {
    lat: 26.1445,
    lon: 91.7362,
    name: "Guwahati",
};

// export const useActivePoint =
//     () => {

//         const point =
//             useSelectedPoint();

//         return point ??
//             DEFAULT_POINT;
//     };


export const useActivePoint = () =>
    useAtmosStore(
        s => s.selectedPoint
    ) ?? DEFAULT_POINT;

export const useBasemap = () =>
    useAtmosStore(
        s => s.basemap
    );

export const useSetBasemap = () =>
    useAtmosStore(
        s => s.setBasemap
    );

export const usePressureLevel =
    () =>
        useAtmosStore(
            s => s.pressureLevel
        );

export const useSetPressureLevel =
    () =>
        useAtmosStore(
            s => s.setPressureLevel
        );
export const useContourInterval =
    () =>
        useAtmosStore(
            s => s.rendererConfig.contour.interval
        );

export const useContourLineWidth =
    () =>
        useAtmosStore(
            s => s.rendererConfig.contour.lineWidth
        );

export const useContourColorScheme =
    () =>
        useAtmosStore(
            s => s.rendererConfig.contour.colorScheme
        );

export const useShowContourLabels =
    () =>
        useAtmosStore(
            s => s.rendererConfig.contour.showLabels
        );

export const useUpdateContourConfig =
    () =>
        useAtmosStore(
            s => s.updateContourConfig
        );
export const useRenderMode = () => useAtmosStore(
    s => s.renderMode
);

export const useContourThreshold =
    () =>
        useAtmosStore(
            s => s.rendererConfig.contour.threshold
        );

