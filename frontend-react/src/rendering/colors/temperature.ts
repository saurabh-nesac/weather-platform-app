// src/rendering/colors/temperature.ts

export const TEMPERATURE_COLORS = [
    [12, 6, 60],      // #0c063c
    [40, 30, 130],    // #281e82
    [30, 90, 160],    // #1e5aa0
    [40, 160, 150],   // #28a096
    [180, 200, 90],   // #b4c85a
    [240, 180, 60],   // #f0b43c
    [230, 90, 40],    // #e65a28
    [170, 30, 30],    // #aa1e1e
] as const;

export function sampleTemperatureColor(
    value: number,
    min: number,
    max: number
): [number, number, number] {

    const range =
        max - min || 1;

    const n =
        Math.max(
            0,
            Math.min(
                1,
                (value - min) / range
            )
        );

    const scaled =
        n *
        (TEMPERATURE_COLORS.length - 1);

    const i =
        Math.floor(scaled);

    const f =
        scaled - i;

    const c0 =
        TEMPERATURE_COLORS[i];

    const c1 =
        TEMPERATURE_COLORS[
        Math.min(
            i + 1,
            TEMPERATURE_COLORS.length - 1
        )
        ];

    return [
        Math.round(
            c0[0] +
            (c1[0] - c0[0]) * f
        ),

        Math.round(
            c0[1] +
            (c1[1] - c0[1]) * f
        ),

        Math.round(
            c0[2] +
            (c1[2] - c0[2]) * f
        ),
    ];
}