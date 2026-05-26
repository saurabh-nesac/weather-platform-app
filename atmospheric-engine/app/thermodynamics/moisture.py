import numpy as np
from app.thermodynamics.thermo_constants import (
    RD,
    CP
)

def qvapor_to_dewpoint(
    pressure,
    qvapor
):

    # convert Pa → hPa
    p_hpa = pressure / 100.0

    vapor_pressure = (
        qvapor * p_hpa
    ) / (
        0.622 + qvapor
    )

    ln_ratio = np.log(
        vapor_pressure / 6.112
    )

    dewpoint = (
        243.5 * ln_ratio
    ) / (
        17.67 - ln_ratio
    )

    return dewpoint



def lcl_temperature(
    t_k,
    td_k
):

    return (

        1
        /
        (
            1 / (td_k - 56)
            +
            np.log(t_k / td_k) / 800
        )

    ) + 56
    

def lcl_pressure(
    p_hpa,
    t_k,
    tlcl_k
):

    return (
        p_hpa
        *
        (tlcl_k / t_k) ** (CP / RD)
    )