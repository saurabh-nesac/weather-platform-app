// frontend-react/src/rendering/contour/pipeline/CacheKey.ts

export interface MarchingSquaresKey {

    frame: number;

    level: number;

    threshold: number;

}

export function marchingSquaresKey(

    key: MarchingSquaresKey

): string {

    return [

        key.frame,

        key.level,

        key.threshold,

    ].join(":");

}