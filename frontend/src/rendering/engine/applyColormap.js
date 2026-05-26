import { COLORMAPS }
from '@/rendering/colormaps';

export function applyColormap(
    value,
    colormapName
) {

    const map =
        COLORMAPS[colormapName];

    for (let i = 0; i < map.length - 1; i++) {

        const [v0, c0] = map[i];
        const [v1, c1] = map[i + 1];

        if (value >= v0 && value <= v1) {

            const t =
                (value - v0) /
                (v1 - v0);

            return [

                c0[0] + (c1[0] - c0[0]) * t,

                c0[1] + (c1[1] - c0[1]) * t,

                c0[2] + (c1[2] - c0[2]) * t,

                c0[3] + (c1[3] - c0[3]) * t
            ];
        }
    }

    return [0,0,0,0];
}