// frontend-react/src/core/datasets/datasetTypes.ts

export type BoundingBox = [
    minLon: number,
    minLat: number,
    maxLon: number,
    maxLat: number
];


// ============================================================
// Manifest
// ============================================================
export interface DatasetManifest {
    dataset_id: string;
    variable: string;

    long_name: string;
    units: string;
    dtype: string;

    width: number;
    height: number;
    frames: number;

    timestamps: string[];

    bbox: BoundingBox;

    min: number;
    max: number;
}

// ============================================================
// Dataset Store Representation
// ============================================================

export interface Dataset {
    id: string;

    name: string;

    model: string;

    variables: string[];

    timesteps: number;

    timestamps?: string[];

    bbox?: BoundingBox;
}


// ============================================================
// Frame Loading
// ============================================================

export interface FrameRequest {
    datasetId: string;

    variable: string;

    frame: number;
}


// ============================================================
// Raster Data
// ============================================================

export interface RasterFrame {
    datasetId: string;

    variable: string;

    frame: number;

    data: Float32Array;
}