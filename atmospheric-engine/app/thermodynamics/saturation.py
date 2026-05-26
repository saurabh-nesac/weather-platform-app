import numpy as np

from app.thermodynamics.thermo_constants import (
    EPSILON
)


# ============================================================
# SATURATION VAPOR PRESSURE
# ============================================================

def saturation_vapor_pressure(
    tc
):

    """
    Bolton (1980)

    Input:
        tc : temperature (°C)

    Returns:
        es : saturation vapor pressure (hPa)
    """

    es = 6.112 * np.exp(

        (
            17.67 * tc
        )
        /
        (
            tc + 243.5
        )
    )

    return es


# ============================================================
# SATURATION MIXING RATIO
# ============================================================

def saturation_mixing_ratio(
    pressure_hpa,
    temperature_c
):

    """
    Saturation mixing ratio (kg/kg)
    """

    es = saturation_vapor_pressure(
        temperature_c
    )

    qs = (

        EPSILON * es

    ) / (

        pressure_hpa - es
    )

    return qs