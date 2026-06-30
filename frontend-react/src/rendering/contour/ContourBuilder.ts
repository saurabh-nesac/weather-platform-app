// frontend-react/src/rendering/contour/ContourBuilder.ts

import type {
    ContourPoint,
    ContourSegment,
} from "./MarchingSquares";

export type ContourPolyline =
    ContourPoint[];

const EPS = 1e-6;

function key(
    p: ContourPoint
): string {

    return (
        `${p.x.toFixed(6)},${p.y.toFixed(6)}`
    );

}

function equal(
    a: ContourPoint,
    b: ContourPoint
): boolean {

    return (
        Math.abs(a.x - b.x) < EPS &&
        Math.abs(a.y - b.y) < EPS
    );

}

export function buildPolylines(

    segments: ContourSegment[]

): ContourPolyline[] {

    const unused =
        new Set<number>();

    for (
        let i = 0;
        i < segments.length;
        i++
    ) {
        unused.add(i);
    }

    //
    // adjacency map
    //
    const lookup =
        new Map<
            string,
            number[]
        >();

    function add(
        p: ContourPoint,
        idx: number
    ) {

        const k = key(p);

        if (!lookup.has(k)) {

            lookup.set(
                k,
                []
            );

        }

        lookup.get(k)!.push(idx);

    }

    segments.forEach(
        (s, i) => {

            add(s.a, i);

            add(s.b, i);

        }
    );

    const polylines:
        ContourPolyline[] = [];

    while (
        unused.size > 0
    ) {

        const first =
            unused.values().next().value as number;

        unused.delete(first);

        const seg =
            segments[first];

        const line =
            [
                seg.a,
                seg.b,
            ];

        //
        // extend forward
        //
        let changed = true;

        while (changed) {

            changed = false;

            const end =
                line[
                line.length - 1
                ];

            const candidates =
                lookup.get(
                    key(end)
                ) ?? [];

            for (const idx of candidates) {

                if (!unused.has(idx))
                    continue;

                unused.delete(idx);

                const s =
                    segments[idx];

                if (
                    equal(
                        s.a,
                        end
                    )
                ) {

                    line.push(
                        s.b
                    );

                } else {

                    line.push(
                        s.a
                    );

                }

                changed = true;

                break;

            }

        }

        //
        // extend backward
        //
        changed = true;

        while (changed) {

            changed = false;

            const start =
                line[0];

            const candidates =
                lookup.get(
                    key(start)
                ) ?? [];

            for (const idx of candidates) {

                if (!unused.has(idx))
                    continue;

                unused.delete(idx);

                const s =
                    segments[idx];

                if (
                    equal(
                        s.a,
                        start
                    )
                ) {

                    line.unshift(
                        s.b
                    );

                } else {

                    line.unshift(
                        s.a
                    );

                }

                changed = true;

                break;

            }

        }

        polylines.push(
            line
        );

    }

    return polylines;

}