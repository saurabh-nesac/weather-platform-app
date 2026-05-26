# atmospheric-engine/app/thermodynamics/sounding.py

from dataclasses import dataclass

import numpy as np

# ============================================================
# SOUNDING
# ============================================================

@dataclass(frozen=True)
class Sounding:

    pressure: np.ndarray          # hPa
    temperature: np.ndarray       # °C
    dewpoint: np.ndarray          # °C

    height: np.ndarray            # meters

    u: np.ndarray                 # m/s
    v: np.ndarray                 # m/s

    qvapor: np.ndarray

    lat: float
    lon: float

    time_idx: int


    # ========================================================
    # POST INIT VALIDATION
    # ========================================================

    def __post_init__(self):

        self.validate()


    # ========================================================
    # VALIDATION
    # ========================================================

    def validate(self):

        arrays = [

            self.pressure,
            self.temperature,
            self.dewpoint,
            self.height,
            self.u,
            self.v
        ]

        # ----------------------------------------
        # equal lengths
        # ----------------------------------------

        n = len(self.pressure)

        for arr in arrays:

            if len(arr) != n:

                raise ValueError(
                    "All profile arrays must have equal length"
                )

        # ----------------------------------------
        # pressure monotonic
        # ----------------------------------------

        if not np.all(
            np.diff(self.pressure) < 0
        ):

            raise ValueError(
                "Pressure must decrease upward"
            )

        # ----------------------------------------
        # height monotonic
        # ----------------------------------------

        if not np.all(
            np.diff(self.height) > 0
        ):

            raise ValueError(
                "Height must increase upward"
            )

        # ----------------------------------------
        # finite values
        # ----------------------------------------

        for arr in arrays:

            if not np.isfinite(arr).all():

                raise ValueError(
                    "Non-finite values detected"
                )


    # ========================================================
    # DERIVED PROPERTIES
    # ========================================================

    @property
    def wind_speed(self):

        """
        Wind speed (m/s)
        """

        return np.sqrt(
            self.u**2 +
            self.v**2
        )


    @property
    def wind_direction(self):

        """
        Meteorological wind direction (degrees)
        """

        direction = (
            270 -
            np.degrees(
                np.arctan2(
                    self.v,
                    self.u
                )
            )
        ) % 360

        return direction


    @property
    def virtual_temperature(self):

        """
        Virtual temperature (°C)
        """

        tv = (
            (self.temperature + 273.15)
            *
            (1 + 0.61 * self.qvapor)
        )

        return tv - 273.15


    # ========================================================
    # INTERPOLATION
    # ========================================================

    def interpolate_pressure(
        self,
        target_pressure_hpa
    ):

        """
        Interpolate atmospheric state
        to requested pressure level.
        """

        pressure = self.pressure[::-1]

        temperature = self.temperature[::-1]
        dewpoint = self.dewpoint[::-1]

        height = self.height[::-1]

        u = self.u[::-1]
        v = self.v[::-1]

        return {

            "pressure": target_pressure_hpa,

            "temperature":
                np.interp(
                    target_pressure_hpa,
                    pressure,
                    temperature
                ),

            "dewpoint":
                np.interp(
                    target_pressure_hpa,
                    pressure,
                    dewpoint
                ),

            "height":
                np.interp(
                    target_pressure_hpa,
                    pressure,
                    height
                ),

            "u":
                np.interp(
                    target_pressure_hpa,
                    pressure,
                    u
                ),

            "v":
                np.interp(
                    target_pressure_hpa,
                    pressure,
                    v
                )
        }


    # ========================================================
    # BULK SHEAR
    # ========================================================

    def bulk_shear(
        self,
        bottom_m,
        top_m
    ):

        """
        Bulk wind shear between heights.
        Returns shear magnitude (m/s)
        """

        u_bottom = np.interp(
            bottom_m,
            self.height,
            self.u
        )

        v_bottom = np.interp(
            bottom_m,
            self.height,
            self.v
        )

        u_top = np.interp(
            top_m,
            self.height,
            self.u
        )

        v_top = np.interp(
            top_m,
            self.height,
            self.v
        )

        du = u_top - u_bottom
        dv = v_top - v_bottom

        shear = np.sqrt(
            du**2 +
            dv**2
        )

        return shear


    # ========================================================
    # LCL
    # ========================================================

    def lcl(self):

        """
        Approximate LCL height (m)
        using surface T/Td.
        """

        t = self.temperature[0]
        td = self.dewpoint[0]

        lcl_height = (
            (t - td)
            * 125.0
        )

        return {

            "lcl_height_m": lcl_height
        }


    # ========================================================
    # CAPE
    # ========================================================

    # ============================================================
# CAPE
# ============================================================

    def cape(self):

        """
        Simplified CAPE estimation.

        This is NOT a full parcel integration engine yet.
        It is an initial buoyancy integration framework.

        Returns:
            dict:
                CAPE estimate (J/kg)
        """

        # --------------------------------------------------------
        # ENVIRONMENT
        # --------------------------------------------------------

        pressure = self.pressure
        temperature = self.temperature + 273.15

        dewpoint = self.dewpoint + 273.15

        height = self.height


        # --------------------------------------------------------
        # SURFACE PARCEL
        # --------------------------------------------------------

        parcel_temp = np.copy(temperature)

        # crude dry adiabatic approximation
        # until full moist parcel engine exists

        dry_lapse_rate = 9.8 / 1000.0

        for i in range(1, len(parcel_temp)):

            dz = height[i] - height[i - 1]

            parcel_temp[i] = (
                parcel_temp[i - 1]
                -
                dry_lapse_rate * dz
            )


        # --------------------------------------------------------
        # BUOYANCY
        # --------------------------------------------------------

        g = 9.81

        buoyancy = g * (
            (parcel_temp - temperature)
            /
            temperature
        )


        # --------------------------------------------------------
        # POSITIVE BUOYANCY ONLY
        # --------------------------------------------------------

        positive_buoyancy = np.maximum(
            buoyancy,
            0
        )


        # --------------------------------------------------------
        # INTEGRATE CAPE
        # --------------------------------------------------------

        cape = np.trapezoid(

            positive_buoyancy,

            height
        )


        # --------------------------------------------------------
        # NEGATIVE BUOYANCY
        # --------------------------------------------------------

        negative_buoyancy = np.minimum(
            buoyancy,
            0
        )

        cin = np.trapezoid(

            negative_buoyancy,

            height
        )


        # --------------------------------------------------------
        # LFC / EL APPROXIMATION
        # --------------------------------------------------------

        positive_indices = np.where(
            buoyancy > 0
        )[0]

        if len(positive_indices) > 0:

            lfc_idx = positive_indices[0]
            el_idx = positive_indices[-1]

            lfc_height = height[lfc_idx]
            el_height = height[el_idx]

        else:

            lfc_height = None
            el_height = None


        # --------------------------------------------------------
        # RETURN
        # --------------------------------------------------------

        return {

            "cape_jkg": float(cape),

            "cin_jkg": float(cin),

            "lfc_height_m": (
                None
                if lfc_height is None
                else float(lfc_height)
            ),

            "el_height_m": (
                None
                if el_height is None
                else float(el_height)
            ),

            "parcel_profile_k":
                parcel_temp.tolist(),

            "buoyancy":
                buoyancy.tolist()
        }

    # ========================================================
    # HODOGRAPH
    # ========================================================

    def hodograph(self):

        """
        Hodograph coordinates.
        """

        return {

            "u": self.u.tolist(),

            "v": self.v.tolist(),

            "height":
                self.height.tolist()
        }


    # ========================================================
    # SERIALIZATION
    # ========================================================

    def to_dict(self):

        return {

            "pressure":
                self.pressure.tolist(),
            "temperature":
                self.temperature.tolist(),
            "dewpoint":
                self.dewpoint.tolist(),
            "height":
                self.height.tolist(),
            "u":
                self.u.tolist(),
            "v":
                self.v.tolist(),
            "wind_speed":
                self.wind_speed.tolist(),
            "wind_direction":
                self.wind_direction.tolist(),
            "lat":
                self.lat,
            "lon":
                self.lon,
            "time_idx":
                self.time_idx
        }

    # ========================================================
    # HODOGRAPH
    # ========================================================

    def hodograph(self):

        """
        Hodograph coordinates.
        """

        return {

            "u": self.u.tolist(),

            "v": self.v.tolist(),

            "height":
                self.height.tolist()
        }


    # ========================================================
    # SERIALIZATION
    # ========================================================

    def to_dict(self):

        return {

            "pressure":
                self.pressure.tolist(),
            "temperature":
                self.temperature.tolist(),
            "dewpoint":
                self.dewpoint.tolist(),
            "height":
                self.height.tolist(),
            "u":
                self.u.tolist(),
            "v":
                self.v.tolist(),
            "wind_speed":
                self.wind_speed.tolist(),
            "wind_direction":
                self.wind_direction.tolist(),
            "lat":
                self.lat,
            "lon":
                self.lon,
            "time_idx":
                self.time_idx
        }