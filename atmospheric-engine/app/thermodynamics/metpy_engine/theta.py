from metpy.units import units

from metpy.calc import (

    potential_temperature,

    equivalent_potential_temperature
)

import numpy as np


# ============================================================
# THETA
# ============================================================

def compute_theta(
    sounding
):

    pressure = (
        sounding.pressure
        * units.hPa
    )

    temperature = (
        sounding.temperature
        * units.degC
    )

    theta = potential_temperature(

        pressure,

        temperature
    )

    return (

        theta
        .to("kelvin")
        .magnitude
        .tolist()
    )


# ============================================================
# THETA-E
# ============================================================

def compute_thetae(
    sounding
):

    pressure = (
        sounding.pressure
        * units.hPa
    )

    temperature = (
        sounding.temperature
        * units.degC
    )

    dewpoint = (
        sounding.dewpoint
        * units.degC
    )

    # --------------------------------------------------------
    # STABILIZE VERY DRY UPPER LEVELS
    # --------------------------------------------------------

    dewpoint = dewpoint.copy()

    dewpoint[

        dewpoint < (-80 * units.degC)

    ] = -80 * units.degC

    # --------------------------------------------------------
    # THETA-E
    # --------------------------------------------------------

    thetae = equivalent_potential_temperature(

        pressure,

        temperature,

        dewpoint
    )

    return (

        thetae
        .to("kelvin")
        .magnitude
        .tolist()
    )