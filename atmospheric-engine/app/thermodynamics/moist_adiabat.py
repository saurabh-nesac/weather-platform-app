import numpy as np

from app.thermodynamics.thermo_constants import (

    G,
    RD,
    CP,
    LV,
    EPSILON
)

from app.thermodynamics.saturation import (
    saturation_mixing_ratio
)


# ============================================================
# MOIST ADIABATIC LAPSE RATE
# ============================================================

def moist_lapse_rate(

    pressure_hpa,
    temperature_k
):

    """
    Moist adiabatic lapse rate.

    Returns:
        K / m
    """

    tc = temperature_k - 273.15

    qs = saturation_mixing_ratio(
        pressure_hpa,
        tc
    )

    numerator = G * (

        1 +
        (
            LV * qs
        )
        /
        (
            RD * temperature_k
        )
    )

    denominator = (

        CP +

        (
            LV**2 * qs * EPSILON
        )

        /
        (
            RD * temperature_k**2
        )
    )

    gamma_m = numerator / denominator

    return gamma_m