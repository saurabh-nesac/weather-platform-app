from fastapi import APIRouter

from app.extraction.profile import (
    extract_profile
)

from app.thermodynamics.build_sounding import (
    build_sounding
)

from app.thermodynamics.metpy_engine.theta import (

    compute_theta,

    compute_thetae
)

from app.thermodynamics.metpy_engine.parcels import (
    compute_surface_based
)


router = APIRouter()


# ============================================================
# SKEW-T PAYLOAD
# ============================================================

@router.get("/skewt")

def skewt(

    lat: float,

    lon: float,

    time_idx: int = 0
):

    # --------------------------------------------------------
    # PROFILE
    # --------------------------------------------------------

    profile = extract_profile(

        lat=lat,

        lon=lon,

        time_idx=time_idx
    )

    sounding = build_sounding(

        profile=profile,

        time_idx=time_idx
    )

    # --------------------------------------------------------
    # PARCEL
    # --------------------------------------------------------

    sb = compute_surface_based(
        sounding
    )

    # --------------------------------------------------------
    # RETURN
    # --------------------------------------------------------

    return {

        "pressure":

            sounding.pressure.tolist(),

        "temperature":

            sounding.temperature.tolist(),

        "dewpoint":

            sounding.dewpoint.tolist(),

        "height":

            sounding.height.tolist(),

        "u":

            sounding.u.tolist(),

        "v":

            sounding.v.tolist(),

        "theta":

            compute_theta(
                sounding
            ),

        "thetae":

            compute_thetae(
                sounding
            ),

        "parcel_profile_k":

            sb[
                "parcel_profile_k"
            ],

        "surface_based": {

            "cape_jkg":

                sb[
                    "cape_jkg"
                ],

            "cin_jkg":

                sb[
                    "cin_jkg"
                ]
        }
    }