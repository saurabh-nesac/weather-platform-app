//src\data\loaders\frameLoader.js

import { frames }
from '../cache/frameCache.js';

export async function loadFrame(frame, variable) {

    if (frames[frame]) {
        return frames[frame];
    }

    const file =
        '/data/bin/' + `${variable.id}` + `_`+
        String(frame).padStart(3, '0') +
        '.bin';

    const res = await fetch(file);

    const buf = await res.arrayBuffer();

    frames[frame] =
        new Float32Array(buf);

    console.log(`✅ Loaded frame ${frame}` + frames[1]+ 'Variable: '+ variable);


    return frames[frame];
}