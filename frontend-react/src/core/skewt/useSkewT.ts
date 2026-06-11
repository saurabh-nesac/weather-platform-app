// frontend-react/src/core/skewt/useSkewT.ts
import {
    useEffect,
    useState,
} from "react";

import {
    useActivePoint,
    useFrame,
} from "../state/selectors";

import {
    loadSkewT,
} from "./skewtService";

import type {
    SkewTResponse,
} from "./skewtTypes";

export function useSkewT() {

    const point =
        useActivePoint();

    const frame =
        useFrame();

    const [data, setData] =
        useState<
            SkewTResponse
            | null
        >(null);

    useEffect(() => {

        loadSkewT(
            point.lat,
            point.lon,
            frame
        )
            .then(setData)
            .catch(console.error);

    }, [
        point.lat,
        point.lon,
        frame,
    ]);

    return data;
}