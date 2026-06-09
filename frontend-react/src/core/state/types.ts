export type Point = {
    lat: number;
    lon: number;
};

export type RenderMode =
    | "raster"
    | "contour"
    | "vectors";

export interface AtmosState {

    variable: string;

    frame: number;

    opacity: number;

    selectedPoint: Point | null;

    selectedBasin: string | null;

    renderMode: RenderMode;

    
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