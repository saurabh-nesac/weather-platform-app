from app.thermodynamics.metpy_engine.parcels import (

    compute_surface_based,

    compute_mixed_layer,

    compute_most_unstable
)

from app.thermodynamics.metpy_engine.theta import (

    compute_theta,

    compute_thetae
)

from app.thermodynamics.metpy_engine.shear import (
    compute_bulk_shear
)

from app.thermodynamics.metpy_engine.moisture import (

    compute_precipitable_water,

    compute_relative_humidity
)

from app.thermodynamics.metpy_engine.indices import (
    compute_indices
)

from app.thermodynamics.metpy_engine.storm_motion import (

    compute_storm_motion,

    compute_srh
)


# ============================================================
# FULL DIAGNOSTIC PAYLOAD
# ============================================================

def compute_full_diagnostics(
    sounding
):

    return {

        "surface_based":

            compute_surface_based(
                sounding
            ),

        "mixed_layer":

            compute_mixed_layer(
                sounding
            ),

        "most_unstable":

            compute_most_unstable(
                sounding
            ),

        "theta":
            compute_theta(
                sounding
            ),

        "thetae":
            compute_thetae(
                sounding
            ),

        "bulk_shear_0_6km":
            compute_bulk_shear(
                sounding
            ),

        "precipitable_water":
            compute_precipitable_water(
                sounding
            ),

        "relative_humidity":
            compute_relative_humidity(
                sounding
            ),

        "indices":
            compute_indices(
                sounding
            ),

        "storm_motion":
            compute_storm_motion(
                sounding
            ),

        "srh":
            compute_srh(
                sounding
            )
    }