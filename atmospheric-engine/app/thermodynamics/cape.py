import numpy as np

from app.thermodynamics.parcel import (
    lift_surface_parcel
)

from app.thermodynamics.virtual_temperature import (
    virtual_temperature
)

from app.thermodynamics.saturation import (
    saturation_mixing_ratio
)

from app.thermodynamics.thermo_constants import (
    G
)


# ============================================================
# CAPE / CIN
# ============================================================

def compute_cape(
    sounding
):

    # --------------------------------------------------------
    # PARCEL ASCENT
    # --------------------------------------------------------

    result = lift_surface_parcel(
        sounding
    )

    parcel_temp = result[
        "parcel_temperature_k"
    ]

    # --------------------------------------------------------
    # ENVIRONMENT
    # --------------------------------------------------------

    env_temp = (
        sounding.temperature + 273.15
    )

    pressure = sounding.pressure

    height = sounding.height

    qv_env = sounding.qvapor

    # --------------------------------------------------------
    # PARCEL SATURATION MIXING RATIO
    # --------------------------------------------------------

    qv_parcel = saturation_mixing_ratio(

        pressure,

        parcel_temp - 273.15
    )

    # --------------------------------------------------------
    # VIRTUAL TEMPERATURES
    # --------------------------------------------------------

    tv_env = virtual_temperature(
        env_temp,
        qv_env
    )

    tv_parcel = virtual_temperature(
        parcel_temp,
        qv_parcel
    )

    # --------------------------------------------------------
    # BUOYANCY
    # --------------------------------------------------------

    buoyancy = G * (

        (
            tv_parcel
            -
            tv_env
        )

        /

        tv_env
    )

    # --------------------------------------------------------
    # FIND SIGN CHANGES
    # --------------------------------------------------------

    sign = np.sign(
        buoyancy
    )

    crossings = np.where(

        np.diff(sign) > 0

    )[0]

    # --------------------------------------------------------
    # NO POSITIVE TRANSITION
    # --------------------------------------------------------

    if len(crossings) == 0:

        return {

            "cape_jkg": 0.0,

            "cin_jkg": 0.0,

            "lfc_height_m": None,

            "el_height_m": None,

            "parcel_temperature_k":
                parcel_temp.tolist(),

            "buoyancy":
                buoyancy.tolist(),

            "lcl_pressure_hpa":
                float(
                    result[
                        "lcl_pressure_hpa"
                    ]
                )
        }

    # --------------------------------------------------------
    # LFC
    # --------------------------------------------------------

    lfc_idx = crossings[0] + 1

        # --------------------------------------------------------
    # EL DETECTION
    # --------------------------------------------------------

    el_crossings = np.where(

        np.diff(

            np.sign(
                buoyancy[lfc_idx:]
            )

        ) < 0

    )[0]

    if len(el_crossings) == 0:

        el_idx = len(
            buoyancy
        ) - 1

    else:

        el_idx = (
            el_crossings[0]
            +
            lfc_idx
            +
            1
        )

    lfc_height = height[lfc_idx]
    el_height = height[el_idx]

    # --------------------------------------------------------
    # CAPE
    # --------------------------------------------------------

    cape = np.trapezoid(

        np.maximum(

            buoyancy[
                lfc_idx:el_idx + 1
            ],

            0
        ),

        height[
            lfc_idx:el_idx + 1
        ]
    )

    # --------------------------------------------------------
    # CIN
    # --------------------------------------------------------

    cin = np.trapezoid(

        np.minimum(

            buoyancy[
                :lfc_idx + 1
            ],

            0
        ),

        height[
            :lfc_idx + 1
        ]
    )

    # --------------------------------------------------------
    # RETURN
    # --------------------------------------------------------

    return {

        "cape_jkg":
            float(cape),

        "cin_jkg":
            float(cin),

        "lfc_height_m":
            float(lfc_height),

        "el_height_m":
            float(el_height),

        "parcel_temperature_k":
            parcel_temp.tolist(),

        "buoyancy":
            buoyancy.tolist(),

        "lcl_pressure_hpa":
            float(
                result[
                    "lcl_pressure_hpa"
                ]
            )
    }
    