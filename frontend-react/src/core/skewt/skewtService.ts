import { SkewTResponse } from "./skewtTypes";

export async function loadSkewT(
    lat: number,
    lon: number,
    frame: number
): Promise<SkewTResponse> {

    const res =
        await fetch(
            `/api/skewt?lat=${lat}&lon=${lon}&time_idx=${frame}`
        );

    if (!res.ok) {
        throw new Error(
            "Failed to load skewt"
        );
    }

    return res.json();
}