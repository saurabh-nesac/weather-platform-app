// frontend-react/src/rendering/contour/pipeline/MarchingSquaresCache.ts

import {

    marchingSquares,

    ContourSegment,

} from "../MarchingSquares";

import {

    MarchingSquaresKey,

    marchingSquaresKey,

} from "./CacheKey";

export class MarchingSquaresCache {

    private cache = new Map<string, ContourSegment[]>();

    private hits = 0;

    private misses = 0;

    get(

        key: MarchingSquaresKey,
        data: Float32Array,
        width: number,
        height: number

    ): ContourSegment[] {

        const cacheKey = marchingSquaresKey(key);

        const cached = this.cache.get(cacheKey);

        if (cached) {

            this.hits++;

            // LRU refresh
            this.cache.delete(cacheKey);

            this.cache.set(cacheKey, cached);

            return cached;

        }

        this.misses++;

        const segments =

            marchingSquares(

                data,

                width,

                height,

                key.level,

                key.threshold

            );

        this.cache.set(

            cacheKey,

            segments

        );

        return segments;

    }

    clear() {

        this.cache.clear();

    }

    stats() {

        return {

            hits: this.hits,

            misses: this.misses,

            entries:

                this.cache.size,

        };

    }

}