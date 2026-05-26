import numpy as np

from app.thermodynamics.thermo_constants import (
    RD,
    CP
)


KAPPA = RD / CP


def dry_lift_temperature(

    t0_k,
    p0_hpa,
    p_hpa
):

    return (
        t0_k
        *
        (p_hpa / p0_hpa) ** KAPPA
    )