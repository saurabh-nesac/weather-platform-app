// ============================================================
// SKEW-T TRANSFORM
// ============================================================

export function skewX({

    temperature,

    pressure,

    xScale,

    skew = 40
}) {

    return (

        xScale(temperature)

        +

        skew * Math.log(
            pressure
        )
    );
}