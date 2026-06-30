// frontend-react/src/rendering/contour/ContourSmoother.ts

import type {
    ContourPoint,
} from "./MarchingSquares";

export function chaikin(

    points: ContourPoint[],

    iterations = 2

): ContourPoint[] {

    let current = points;

    for (
        let k = 0;
        k < iterations;
        k++
    ) {

        const next: ContourPoint[] = [];

        if (current.length < 2)
            return current;

        next.push(current[0]);

        for (
            let i = 0;
            i < current.length - 1;
            i++
        ) {

            const p = current[i];
            const q = current[i + 1];

            next.push({

                x:
                    0.75 * p.x +
                    0.25 * q.x,

                y:
                    0.75 * p.y +
                    0.25 * q.y,

            });

            next.push({

                x:
                    0.25 * p.x +
                    0.75 * q.x,

                y:
                    0.25 * p.y +
                    0.75 * q.y,

            });

        }

        next.push(
            current[current.length - 1]
        );

        current = next;

    }

    return current;

}