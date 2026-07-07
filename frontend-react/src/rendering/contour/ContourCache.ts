import { ContourPolyline } from "./ContourBuilder";
import { ContourSegment } from "./MarchingSquares";

export interface ContourCacheKey {

    frame: number;

    level: number;

    threshold: number;

    smoothingIterations: number;

}

export interface CachedContour {

    segments: ContourSegment[];

    polylines: ContourPolyline[];

    smooth: ContourPolyline[];

}