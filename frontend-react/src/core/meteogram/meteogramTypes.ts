// src/core/meteogram/meteogramTypes.ts

export interface MeteogramResponse {

    times: string[];

    temperature: number[];

    dewpoint: number[];

    wind_speed: number[];

    wind_gust: number[];

    rh: number[];

    rain: number[];
}