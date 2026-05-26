import numpy as np

from app.thermodynamics.lapse_rates import (
    dry_lift_temperature
)

from app.thermodynamics.moisture import (

    lcl_temperature,
    lcl_pressure
)

from app.thermodynamics.moist_adiabat import (
    moist_lapse_rate
)


# ============================================================
# SURFACE PARCEL
# ============================================================

def lift_surface_parcel(
    sounding
):

    pressure = sounding.pressure
    height = sounding.height

    env_temp = (
        sounding.temperature + 273.15
    )

    env_td = (
        sounding.dewpoint + 273.15
    )

    # --------------------------------------------------------
    # SURFACE STATE
    # --------------------------------------------------------

    t0 = env_temp[0]
    td0 = env_td[0]

    p0 = pressure[0]

    # --------------------------------------------------------
    # LCL
    # --------------------------------------------------------

    tlcl = lcl_temperature(
        t0,
        td0
    )

    plcl = lcl_pressure(
        p0,
        t0,
        tlcl
    )

    # --------------------------------------------------------
    # PARCEL PROFILE
    # --------------------------------------------------------

    parcel_temp = np.zeros_like(
        env_temp
    )

    parcel_temp[0] = t0

    # --------------------------------------------------------
    # INTEGRATE UPWARD
    # --------------------------------------------------------

    for i in range(1, len(pressure)):

        dz = (
            height[i]
            -
            height[i - 1]
        )

        p = pressure[i]

        # ====================================================
        # DRY ASCENT
        # ====================================================

        if p >= plcl:

            parcel_temp[i] = (
                dry_lift_temperature(
                    t0,
                    p0,
                    p
                )
            )

        # ====================================================
        # MOIST ASCENT
        # ====================================================

        else:

            gamma_m = moist_lapse_rate(
                p,
                parcel_temp[i - 1]
            )

            parcel_temp[i] = (

                parcel_temp[i - 1]

                -

                gamma_m * dz
            )

    return {

        "parcel_temperature_k":
            parcel_temp,

        "lcl_pressure_hpa":
            plcl,

        "lcl_temperature_k":
            tlcl
    }