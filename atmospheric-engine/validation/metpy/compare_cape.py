import numpy as np

from metpy.units import units

from metpy.calc import (
    parcel_profile,
    cape_cin,
    lcl
)

from app.extraction.profile import (
    extract_profile
)

from app.thermodynamics.build_sounding import (
    build_sounding
)


# ============================================================
# EXTRACT PROFILE
# ============================================================

profile = extract_profile(

    lat=26.18,
    lon=91.73,

    time_idx=0
)

sounding = build_sounding(

    profile=profile,

    time_idx=0
)


# ============================================================
# PREPARE METPY INPUTS
# ============================================================

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


# ============================================================
# SORT PRESSURE
# ============================================================

sort_idx = np.argsort(
    pressure.magnitude
)[::-1]

pressure = pressure[sort_idx]
temperature = temperature[sort_idx]
dewpoint = dewpoint[sort_idx]


# ============================================================
# LCL
# ============================================================

lcl_pressure, lcl_temperature = lcl(

    pressure[0],
    temperature[0],
    dewpoint[0]
)


# ============================================================
# PARCEL PROFILE
# ============================================================

parcel_prof = parcel_profile(

    pressure,

    temperature[0],

    dewpoint[0]
)


# ============================================================
# CAPE / CIN
# ============================================================

cape, cin = cape_cin(

    pressure,

    temperature,

    dewpoint,

    parcel_prof
)


# ============================================================
# OUTPUT
# ============================================================

print("\n" + "=" * 60)
print("METPY VALIDATION")
print("=" * 60)

print("\nLCL PRESSURE\n")
print(lcl_pressure)

print("\nLCL TEMPERATURE\n")
print(lcl_temperature)

print("\nCAPE\n")
print(cape)

print("\nCIN\n")
print(cin)

print("\nPARCEL PROFILE (first 10)\n")
print(parcel_prof[:10])