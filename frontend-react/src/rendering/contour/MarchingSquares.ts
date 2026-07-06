// frontend-react/src/rendering/contour/MarchingSquares.ts
export interface ContourPoint {
    x: number;
    y: number;
}

export interface ContourSegment {
    a: ContourPoint;
    b: ContourPoint;
}

function interpolate(

    x1: number,
    y1: number,
    v1: number,

    x2: number,
    y2: number,
    v2: number,

    level: number

): ContourPoint {

    if (Math.abs(v2 - v1) < 1e-6) {

        return {
            x: (x1 + x2) * 0.5,
            y: (y1 + y2) * 0.5,
        };

    }

    const t =
        (level - v1) /
        (v2 - v1);

    return {

        x:
            x1 +
            t * (x2 - x1),

        y:
            y1 +
            t * (y2 - y1),

    };

}
const CASE_TABLE: Record<number, number[][]> = {

    0: [],

    1: [[0, 3]],

    2: [[3, 2]],

    3: [[0, 2]],

    4: [[2, 1]],

    5: [
        [0, 1],
        [3, 2],
    ],

    6: [[3, 1]],

    7: [[0, 1]],

    8: [[1, 0]],

    9: [[3, 1]],

    10: [
        [0, 3],
        [1, 2],
    ],

    11: [[2, 1]],

    12: [[2, 0]],

    13: [[3, 2]],

    14: [[0, 3]],

    15: []

};
export function marchingSquares(

    data: Float32Array,

    width: number,

    height: number,

    level: number,

    threshold = -Infinity

): ContourSegment[]{

    const segments: ContourSegment[] = [];

    for (let y = 0; y < height - 1; y++) {

        for (let x = 0; x < width - 1; x++) {

            const v0 = data[y * width + x];

            const v1 = data[y * width + x + 1];

            const v2 = data[(y + 1) * width + x + 1];

            const v3 = data[(y + 1) * width + x];

            if (
                v0 < threshold &&
                v1 < threshold &&
                v2 < threshold &&
                v3 < threshold
            ) {
                continue;
            }

            let code = 0;

            if (v0 > level) code |= 1;
            if (v1 > level) code |= 2;
            if (v2 > level) code |= 4;
            if (v3 > level) code |= 8;

            // We'll use 'code' in the next step.
            const edges = [

                interpolate(
                    x,
                    y,
                    v0,

                    x,
                    y + 1,
                    v3,

                    level
                ),

                interpolate(
                    x,
                    y + 1,
                    v3,

                    x + 1,
                    y + 1,
                    v2,

                    level
                ),

                interpolate(
                    x + 1,
                    y,
                    v1,

                    x + 1,
                    y + 1,
                    v2,

                    level
                ),

                interpolate(
                    x,
                    y,
                    v0,

                    x + 1,
                    y,
                    v1,

                    level
                ),

            ];

            for (const pair of CASE_TABLE[code]) {

                const a = edges[pair[0] as 0 | 1 | 2 | 3];

                const b = edges[pair[1] as 0 | 1 | 2 | 3];

                segments.push({

                    a,

                    b,

                });

            }

        }

    }

    return segments;
}