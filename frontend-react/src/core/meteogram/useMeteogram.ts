// frontend-react/src/core/meteogram/useMeteogram.ts
import { useEffect, useState } from "react";

import { useActivePoint }
    from "../state/selectors";

import { loadMeteogram }
    from "./meteogramService";

import type {
    MeteogramResponse,
} from "./meteogramTypes";

export function useMeteogram() {

    const point =
        useActivePoint();
    console.log("meteogram hook");
    const [data, setData] =
        useState<
            MeteogramResponse | null
        >(null);

    useEffect(() => {

        loadMeteogram(
            point.lat,
            point.lon
        )
            .then(setData)
            .catch(console.error);

    }, [
        point.lat,
        point.lon,
    ]);

    return data;
}