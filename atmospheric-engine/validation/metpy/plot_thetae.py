import matplotlib.pyplot as plt
import numpy as np

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


# ============================================================
# LOAD PROFILE
# ============================================================

print("Opening atmospheric profile...")

profile = extract_profile(

    lat=26,
    lon=91,

    time_idx=0
)

sounding = build_sounding(

    profile=profile,

    time_idx=0
)

print("Profile ready")


# ============================================================
# COMPUTE
# ============================================================

pressure = sounding.pressure

theta = np.array(

    compute_theta(
        sounding
    )
)

thetae = np.array(

    compute_thetae(
        sounding
    )
)

rh = np.array(
    sounding.relative_humidity
) * 100.0


# ============================================================
# PLOT
# ============================================================

fig, ax = plt.subplots(

    figsize=(8, 10)
)

ax.plot(

    theta,

    pressure,

    label="Theta"
)

ax.plot(

    thetae,

    pressure,

    label="Theta-E"
)

ax.set_ylim(
    1000,
    100
)

ax.invert_yaxis()

ax.set_xlabel(
    "Temperature (K)"
)

ax.set_ylabel(
    "Pressure (hPa)"
)

ax.set_title(
    "Theta / Theta-E Profile"
)

ax.grid(True)

ax.legend()

plt.show()


# ============================================================
# RH PLOT
# ============================================================

fig2, ax2 = plt.subplots(

    figsize=(6, 10)
)

ax2.plot(

    rh,

    pressure
)

ax2.set_ylim(
    1000,
    100
)

ax2.invert_yaxis()

ax2.set_xlabel(
    "Relative Humidity (%)"
)

ax2.set_ylabel(
    "Pressure (hPa)"
)

ax2.set_title(
    "Relative Humidity Profile"
)

ax2.grid(True)

plt.show()