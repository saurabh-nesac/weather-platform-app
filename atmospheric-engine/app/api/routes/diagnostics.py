from fastapi import APIRouter

from app.extraction.profile import (
    extract_profile
)

from app.thermodynamics.build_sounding import (
    build_sounding
)

from app.thermodynamics.metpy_engine.composite import (
    compute_full_diagnostics
)

router = APIRouter()


# ============================================================
# FULL ATMOSPHERIC DIAGNOSTICS
# ============================================================

@router.get(
    "/diagnostics"
)

def diagnostics(

    lat: float,

    lon: float,

    time_idx: int = 0
):

    # --------------------------------------------------------
    # PROFILE EXTRACTION
    # --------------------------------------------------------

    profile = extract_profile(

        lat=lat,

        lon=lon,

        time_idx=time_idx
    )

    # --------------------------------------------------------
    # BUILD SOUNDING
    # --------------------------------------------------------

    sounding = build_sounding(

        profile=profile,

        time_idx=time_idx
    )

    # --------------------------------------------------------
    # COMPUTE DIAGNOSTICS
    # --------------------------------------------------------

    diagnostics = compute_full_diagnostics(
        sounding
    )

    return diagnostics