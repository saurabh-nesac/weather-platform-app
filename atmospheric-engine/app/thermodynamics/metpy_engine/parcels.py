import numpy as np

from metpy.units import units

from metpy.calc import (

    mixed_layer_cape_cin,

    most_unstable_cape_cin,

    surface_based_cape_cin
)
from metpy.calc import (

    parcel_profile,

    cape_cin
)


# ============================================================
# PREPARE METPY INPUTS
# ============================================================

def prepare_profile(
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

    # descending pressure
    sort_idx = np.argsort(
        pressure.magnitude
    )[::-1]

    return (

        pressure[sort_idx],

        temperature[sort_idx],

        dewpoint[sort_idx]
    )


# ============================================================
# SBCAPE
# ============================================================



from metpy.calc import (

    parcel_profile,

    cape_cin
)


# ============================================================
# SURFACE-BASED PARCEL
# ============================================================

def compute_surface_based(
    sounding
):

    p, t, td = prepare_profile(
        sounding
    )

    # --------------------------------------------------------
    # PARCEL PROFILE
    # --------------------------------------------------------

    parcel_prof = parcel_profile(

        p,

        t[0],

        td[0]
    )

    # --------------------------------------------------------
    # CAPE / CIN
    # --------------------------------------------------------

    cape, cin = cape_cin(

        p,

        t,

        td,

        parcel_prof
    )

    return {

        "cape_jkg":
            float(
                cape.magnitude
            ),

        "cin_jkg":
            float(
                cin.magnitude
            ),

        "parcel_profile_k":

            parcel_prof
            .to("kelvin")
            .magnitude
            .tolist()
    }

# ============================================================
# MLCAPE
# ============================================================

def compute_mixed_layer(
    sounding
):

    p, t, td = prepare_profile(
        sounding
    )

    cape, cin = mixed_layer_cape_cin(
        p,
        t,
        td
    )

    return {

        "cape_jkg":
            float(cape.magnitude),

        "cin_jkg":
            float(cin.magnitude)
    }


# ============================================================
# MUCAPE
# ============================================================

def compute_most_unstable(
    sounding
):

    p, t, td = prepare_profile(
        sounding
    )

    cape, cin = most_unstable_cape_cin(
        p,
        t,
        td
    )

    return {

        "cape_jkg":
            float(cape.magnitude),

        "cin_jkg":
            float(cin.magnitude)
    }