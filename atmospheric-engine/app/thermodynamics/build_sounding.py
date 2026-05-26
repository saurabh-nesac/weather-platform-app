import numpy as np

from app.thermodynamics.sounding import (
    Sounding
)

from app.thermodynamics.moisture import (
    qvapor_to_dewpoint
)


def build_sounding(
    profile,
    time_idx
):
    """Convert extracted profile → Sounding object."""

    pressure = np.array(
        profile["pressure"]
    ) / 100.0

    temperature = (
        np.array(
            profile["temperature"]
        ) - 273.15
    )

    qvapor = np.array(
        profile["qvapor"]
    )

    dewpoint = qvapor_to_dewpoint(
        pressure * 100.0,
        qvapor
    )

    return Sounding(

        pressure=pressure,

        temperature=temperature,

        dewpoint=dewpoint,

        height=np.array(
            profile["height"]
        ),

        u=np.array(
            profile["u"]
        ),

        v=np.array(
            profile["v"]
        ),

        qvapor=qvapor,

        lat=profile["lat"],
        lon=profile["lon"],

        time_idx=time_idx
    )