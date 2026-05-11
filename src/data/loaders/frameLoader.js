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

    const file =

        '/data/bin/' +

        variable.id +

        '_' +

        String(frame)
            .padStart(3, '0')

        +

        '.bin';

    const res =
        await fetch(file);

    const buf =
        await res.arrayBuffer();

    frames[
        variable.id
    ][frame] =

        new Float32Array(buf);

    console.log(
        `✅ Loaded ${variable.id} frame ${frame}`
    );

    return frames[
        variable.id
    ][frame];
}