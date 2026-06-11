// src/core/meteogram/meteogramService.ts

import type {
    MeteogramResponse
} from "./meteogramTypes";

export async function loadMeteogram(
        lat: number,
        lon: number
    ):Promise<MeteogramResponse> {
    const res =
        await fetch(
            `/api/meteogram?lat=${lat}&lon=${lon}`
        );

    if (!res.ok) {
        throw new Error(
            "Failed to load meteogram"
        );
    }

    return res.json();
}