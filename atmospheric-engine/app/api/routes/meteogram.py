from fastapi import APIRouter

from app.extraction.profile import (
    extract_profile
)

from app.thermodynamics.build_sounding import (
    build_sounding
)

router = APIRouter()


# ============================================================
# METEOGRAM
# ============================================================

@router.get("/meteogram")
def meteogram(

    lat: float,

    lon: float
):

    times = []

    temperature = []

    dewpoint = []

    wind_speed = []

    wind_gust = []

    rh = []

    rain = []

    total_times = 49

    previous_rain = 0.0

    for time_idx in range(total_times):

        # ----------------------------------------------------
        # PROFILE
        # ----------------------------------------------------

        profile = extract_profile(

            lat=lat,

            lon=lon,

            time_idx=time_idx
        )

        # ----------------------------------------------------
        # SOUNDING
        # ----------------------------------------------------

        sounding = build_sounding(

            profile=profile,

            time_idx=time_idx
        )

        # ----------------------------------------------------
        # TIME
        # ----------------------------------------------------

        times.append(
            str(
                profile["time"]
            )
        )

        # ----------------------------------------------------
        # SURFACE VALUES
        # ----------------------------------------------------

        temperature.append(

            float(
                sounding.temperature[0]
            )
        )

        dewpoint.append(

            float(
                sounding.dewpoint[0]
            )
        )

        wind = float(
            sounding.wind_speed[0]
        )

        wind_speed.append(
            wind
        )

        wind_gust.append(
            wind * 1.3
        )

        # ----------------------------------------------------
        # RH
        # ----------------------------------------------------

        t = float(
            sounding.temperature[0]
        )

        td = float(
            sounding.dewpoint[0]
        )

        rh_value = (

            100.0
            *
            (
                (
                    112
                    -
                    0.1 * t
                    +
                    td
                )
                /
                (
                    112
                    +
                    0.9 * t
                )
            ) ** 8
        )

        rh.append(
            max(
                0,
                min(100, rh_value)
            )
        )

        # ----------------------------------------------------
        # SIMPLE RAIN PROXY
        # ----------------------------------------------------

        rain_value = max(

            0,

            (
                rh[-1]
                -
                80
            ) * 0.2
        )

        rain.append(
            rain_value
        )

    # ========================================================
    # RESPONSE
    # ========================================================

    return {

        "times": times,

        "temperature": temperature,

        "dewpoint": dewpoint,

        "wind_speed": wind_speed,

        "wind_gust": wind_gust,

        "rh": rh,

        "rain": rain
    }