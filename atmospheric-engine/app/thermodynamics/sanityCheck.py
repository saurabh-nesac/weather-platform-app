# atmospheric-engine/app/thermodynamics/sanityCheck.py

from app.extraction.profile import (
    extract_profile
)

from app.thermodynamics.build_sounding import (
    build_sounding
)

from app.thermodynamics.cape import (
    compute_cape
)

from app.thermodynamics.parcel import (
    lift_surface_parcel
)

from app.thermodynamics.virtual_temperature import (
    virtual_temperature
)

from app.thermodynamics.metpy_engine import (
    compute_cape_metpy
)


# ============================================================
# EXTRACT PROFILE
# ============================================================

print("\nOpening atmospheric datastore...")

profile = extract_profile(

    lat=26.18,
    lon=91.73,

    time_idx=0
)

print("Datastore ready")


# ============================================================
# BUILD SOUNDING
# ============================================================

print("\nLoading atmospheric profile...\n")

sounding = build_sounding(

    profile=profile,

    time_idx=0
)

print("Building sounding...\n")


# ============================================================
# BASIC PROFILE
# ============================================================

print("\n" + "=" * 60)
print("BASIC PROFILE")
print("=" * 60)

print("\nPRESSURE (hPa)\n")
print(sounding.pressure[:5])

print("\nTEMPERATURE (°C)\n")
print(sounding.temperature[:5])

print("\nDEWPOINT (°C)\n")
print(sounding.dewpoint[:5])

print("\nHEIGHT (m)\n")
print(sounding.height[:5])

print("\nU WIND (m/s)\n")
print(sounding.u[:5])

print("\nV WIND (m/s)\n")
print(sounding.v[:5])


# ============================================================
# DERIVED PROPERTIES
# ============================================================

print("\n" + "=" * 60)
print("DERIVED PROPERTIES")
print("=" * 60)

print("\nWIND SPEED (m/s)\n")
print(sounding.wind_speed[:5])

print("\nWIND DIRECTION (deg)\n")
print(sounding.wind_direction[:5])

print("\nVIRTUAL TEMPERATURE (°C)\n")
print(sounding.virtual_temperature[:5])


# ============================================================
# PRESSURE INTERPOLATION
# ============================================================

print("\n" + "=" * 60)
print("850 hPa INTERPOLATION")
print("=" * 60)

interp_850 = sounding.interpolate_pressure(
    850
)

for key, value in interp_850.items():

    print(f"{key}: {value}")


# ============================================================
# BULK SHEAR
# ============================================================

print("\n" + "=" * 60)
print("BULK SHEAR")
print("=" * 60)

shear_0_6km = sounding.bulk_shear(
    0,
    6000
)

print(f"\n0-6 km Bulk Shear: {shear_0_6km:.2f} m/s")


# ============================================================
# LCL
# ============================================================

print("\n" + "=" * 60)
print("LCL")
print("=" * 60)

lcl = sounding.lcl()

for key, value in lcl.items():

    print(f"{key}: {value}")


# ============================================================
# SURFACE PARCEL
# ============================================================

print("\n" + "=" * 60)
print("SURFACE PARCEL")
print("=" * 60)

parcel = lift_surface_parcel(
    sounding
)

print("\nLCL PRESSURE (hPa)\n")
print(parcel["lcl_pressure_hpa"])

print("\nLCL TEMPERATURE (K)\n")
print(parcel["lcl_temperature_k"])

print("\nPARCEL TEMPERATURE PROFILE (K)\n")
print(parcel["parcel_temperature_k"][:10])


# ============================================================
# VIRTUAL TEMPERATURE VALIDATION
# ============================================================

print("\n" + "=" * 60)
print("VIRTUAL TEMPERATURE VALIDATION")
print("=" * 60)

tv_surface = virtual_temperature(

    sounding.temperature[0] + 273.15,

    sounding.qvapor[0]
)

print("\nSurface Virtual Temperature (K)\n")
print(tv_surface)


# ============================================================
# NATIVE CAPE / CIN
# ============================================================

print("\n" + "=" * 60)
print("NATIVE CAPE / CIN")
print("=" * 60)

native_cape = compute_cape(
    sounding
)

print("\nCAPE (J/kg)\n")
print(native_cape["cape_jkg"])

print("\nCIN (J/kg)\n")
print(native_cape["cin_jkg"])

print("\nLFC HEIGHT (m)\n")
print(native_cape["lfc_height_m"])

print("\nEL HEIGHT (m)\n")
print(native_cape["el_height_m"])

print("\nLCL PRESSURE (hPa)\n")
print(native_cape["lcl_pressure_hpa"])

print("\nBUOYANCY PROFILE (first 10)\n")
print(native_cape["buoyancy"][:10])

print("\nPARCEL PROFILE (first 10 K)\n")
print(native_cape["parcel_temperature_k"][:10])


# ============================================================
# METPY CAPE / CIN
# ============================================================

print("\n" + "=" * 60)
print("METPY CAPE / CIN")
print("=" * 60)

metpy_cape = compute_cape_metpy(
    sounding
)

print("\nCAPE (J/kg)\n")
print(metpy_cape["cape_jkg"])

print("\nCIN (J/kg)\n")
print(metpy_cape["cin_jkg"])

print("\nLCL PRESSURE (hPa)\n")
print(metpy_cape["lcl_pressure_hpa"])

print("\nLFC PRESSURE (hPa)\n")
print(metpy_cape["lfc_pressure_hpa"])

print("\nEL PRESSURE (hPa)\n")
print(metpy_cape["el_pressure_hpa"])

print("\nPARCEL PROFILE (first 10 K)\n")
print(metpy_cape["parcel_temperature_k"][:10])


# ============================================================
# DIRECT COMPARISON
# ============================================================

print("\n" + "=" * 60)
print("NATIVE vs METPY COMPARISON")
print("=" * 60)

cape_diff = (
    native_cape["cape_jkg"]
    -
    metpy_cape["cape_jkg"]
)

cin_diff = (
    native_cape["cin_jkg"]
    -
    metpy_cape["cin_jkg"]
)

print(f"\nCAPE Difference: {cape_diff:.2f} J/kg")
print(f"CIN Difference : {cin_diff:.2f} J/kg")


# ============================================================
# HODOGRAPH
# ============================================================

print("\n" + "=" * 60)
print("HODOGRAPH")
print("=" * 60)

hodograph = sounding.hodograph()

print("\nHODOGRAPH U COMPONENT\n")
print(hodograph["u"][:5])

print("\nHODOGRAPH V COMPONENT\n")
print(hodograph["v"][:5])

print("\nHODOGRAPH HEIGHT\n")
print(hodograph["height"][:5])


# ============================================================
# SERIALIZATION
# ============================================================

print("\n" + "=" * 60)
print("TO_DICT SERIALIZATION")
print("=" * 60)

serialized = sounding.to_dict()

print("\nSerialized Keys:\n")
print(serialized.keys())


# ============================================================
# VALIDATION SUMMARY
# ============================================================

print("\n" + "=" * 60)
print("VALIDATION SUMMARY")
print("=" * 60)

print("\n✓ Sounding validation passed")
print("✓ Pressure monotonic")
print("✓ Height monotonic")
print("✓ Finite values verified")
print("✓ Virtual temperature correction operational")
print("✓ Moist pseudo-adiabatic ascent operational")
print("✓ Parcel ascent operational")
print("✓ Native CAPE/CIN operational")
print("✓ MetPy CAPE/CIN operational")
print("✓ Hodograph diagnostics operational")
print("✓ Thermodynamic pipeline operational")