//frontend/src/data/loaders/frameLoader.js
import { frames }
    from '../cache/frameCache.js';

export async function loadFrame(
    frame,
    variable
) {

    // initialize variable cache
    if (!frames[variable.id]) {

        frames[variable.id] = {};
    }

    // already cached
    if (
        frames[variable.id][frame]
    ) {

        return frames[
            variable.id
        ][frame];
    }

    const prefix =
        variable.filePrefix ||
        variable.id;

    const file =
        '/data/bin/' +
        prefix +
        '_' +
        String(frame)
            .padStart(3, '0')
        +
        '.bin';

    const res =
        await fetch(file);

    if (!res.ok) {
        throw new Error(
            `Failed to load frame: ${file} (${res.status} ${res.statusText})`
        );
    }

    const buf =
        await res.arrayBuffer();

    if (buf.byteLength % 4 !== 0) {
        throw new Error(
            `Invalid frame size for ${file}: ${buf.byteLength} bytes`
        );
    }

    frames[
        variable.id
    ][frame] =  new Float32Array(buf);

    console.log(
        `✅ Loaded ${variable.id} frame ${frame}`
    );

    return frames[
        variable.id
    ][frame];
}