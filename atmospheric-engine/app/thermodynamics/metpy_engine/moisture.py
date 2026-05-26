from metpy.units import units

from metpy.calc import (

    precipitable_water,

    relative_humidity_from_dewpoint,

    mixing_ratio_from_relative_humidity
)


# ============================================================
# PRECIPITABLE WATER
# ============================================================

def compute_precipitable_water(
    sounding
):

    pressure = (
        sounding.pressure
        * units.hPa
    )

    dewpoint = (
        sounding.dewpoint
        * units.degC
    )

    pw = precipitable_water(
        pressure,
        dewpoint
    )

    return float(
        pw.magnitude
    )


# ============================================================
# RELATIVE HUMIDITY
# ============================================================

def compute_relative_humidity(
    sounding
):

    temperature = (
        sounding.temperature
        * units.degC
    )

    dewpoint = (
        sounding.dewpoint
        * units.degC
    )

    rh = relative_humidity_from_dewpoint(

        temperature,

        dewpoint
    )

    return rh.magnitude.tolist()