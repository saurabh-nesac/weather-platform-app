// frontend-react/src/core/state/types.ts
import { BasemapType } from "../../maps/basemaps";

export type Point = {
    lat: number;
    lon: number;
};

const PRESSURE_LEVELS = [
    1000,
    925,
    850,
    700,
    500,
    300,
    250,
    200,
] as const;

export type PressureLevel =
    | "surface"
    | typeof PRESSURE_LEVELS[number];

export type RenderMode =
    | "raster"
    | "contour"
    | "vectors";

export interface AtmosState {
    variable: string;

    pressureLevel: PressureLevel;

    basemap: BasemapType;

    frame: number;

    opacity: number;

    selectedPoint: Point | null;

    selectedBasin: string | null;

    renderMode: RenderMode;

    playing: boolean;
}

export interface DatasetManifest {
    dataset_id: string;

    variable: string;

    frames: number;

    timestamps: string[];

    bbox: [
        number,
        number,
        number,
        number
    ];

    width: number;

    height: number;
}

export interface FrameRequest {
    datasetId: string;
    variable: string;
    frame: number;
}