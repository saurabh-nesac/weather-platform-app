from metpy.units import units

from metpy.calc import (

    bunkers_storm_motion,

    storm_relative_helicity
)


# ============================================================
# BUNKERS STORM MOTION
# ============================================================

def compute_storm_motion(
    sounding
):

    pressure = (
        sounding.pressure
        * units.hPa
    )

    u = (
        sounding.u
        * units("m/s")
    )

    v = (
        sounding.v
        * units("m/s")
    )

    height = (
        sounding.height
        * units.meter
    )

    right_mover, left_mover, mean = (

        bunkers_storm_motion(

            pressure,

            u,

            v,

            height
        )
    )

    return {

        "right_mover_u":
            float(
                right_mover[0].magnitude
            ),

        "right_mover_v":
            float(
                right_mover[1].magnitude
            ),

        "left_mover_u":
            float(
                left_mover[0].magnitude
            ),

        "left_mover_v":
            float(
                left_mover[1].magnitude
            ),

        "mean_u":
            float(
                mean[0].magnitude
            ),

        "mean_v":
            float(
                mean[1].magnitude
            )
    }


# ============================================================
# SRH
# ============================================================

def compute_srh(
    sounding
):

    u = (
        sounding.u
        * units("m/s")
    )

    v = (
        sounding.v
        * units("m/s")
    )

    height = (
        sounding.height
        * units.meter
    )

    srh_pos, srh_neg, srh_total = (

        storm_relative_helicity(

            height,

            u,

            v,

            depth=3000 * units.meter
        )
    )

    return {

        "srh_positive":
            float(
                srh_pos.magnitude
            ),

        "srh_negative":
            float(
                srh_neg.magnitude
            ),

        "srh_total":
            float(
                srh_total.magnitude
            )
    }