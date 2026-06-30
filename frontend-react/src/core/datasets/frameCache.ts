import type {
    RasterFrame,
    FrameRequest,
} from "./datasetTypes";


type CacheKey = string;

const frameCache =
    new Map<
        CacheKey,
        RasterFrame
    >();

function buildCacheKey(
    request: FrameRequest
): CacheKey {
    return [
        request.datasetId,
        request.variable,
        request.frame,
    ].join(":");
}

export function getCachedFrame(
    request: FrameRequest
): RasterFrame | undefined {

    const key =
        buildCacheKey(
            request
        );
    console.log(key)
    return frameCache.get(
        key
    );
}

export function cacheFrame(
    frame: RasterFrame
): void {

    const key =
        buildCacheKey({
            datasetId:
                frame.datasetId,

            variable:
                frame.variable,

            frame:
                frame.frame,
        });

    frameCache.set(
        key,
        frame
    );
}

export function clearFrameCache() {
    frameCache.clear();
}

export function getFrameCacheSize() {
    return frameCache.size;
}