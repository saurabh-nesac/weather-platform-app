// src/core/skewt/buildSkewTSeries.ts

import type { SkewTResponse } from "./skewtTypes";

export interface SkewTPoint {
    p: number;
    t: number;
    td: number;
    tp: number;
}

export function buildSkewTSeries(
    sounding: SkewTResponse
): SkewTPoint[] {

    return sounding.pressure.map(
        (p, i) => ({
            p,

            t:
                sounding.temperature[i],

            td:
                sounding.dewpoint[i],

            tp:
                sounding.parcel_profile_k[i]
                - 273.15,
        })
    );
}