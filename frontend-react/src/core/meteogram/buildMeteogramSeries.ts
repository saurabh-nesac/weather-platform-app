// src/core/meteogram/buildMeteogramSeries.ts

import type { MeteogramResponse }
    from "./meteogramTypes";

export interface MeteogramPoint {

    date: Date;

    temp: number;

    dew: number;

    precip: number;

    wind: number;

    humidity: number;
}

export function
    buildMeteogramSeries(
        response: MeteogramResponse
    ): MeteogramPoint[] {

    return response.times.map(
        (time, i) => ({

            date:
                new Date(time),

            temp:
                response.temperature[i],

            dew:
                response.dewpoint[i],

            precip:
                response.rain[i],

            wind:
                response.wind_speed[i],

            humidity:
                response.rh[i],
        })
    );
}