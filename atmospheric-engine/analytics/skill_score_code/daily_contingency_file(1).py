import xarray as xr
import numpy as np
import pandas as pd
import os
from glob import glob

# -------------------------
# BASE PATHS
# -------------------------
wrf_base = r"D:\WRF_April_REGRIDDED_TO_GPM"
gpm_base = r"D:\April_GPM_HOURLY_NETCDF"
output_base = r"D:\April_contingency_output"

os.makedirs(output_base, exist_ok=True)

threshold = 0.1  # mm/hr

# -------------------------
# LOOP OVER DAYS
# -------------------------
for day in range(1, 32):

    day_str = f"Day_{day:02d}"
    print(f"\n================ {day_str} ================")

    wrf_folder = os.path.join(wrf_base, day_str)
    gpm_folder = os.path.join(gpm_base, day_str)

    output_day_folder = os.path.join(output_base, day_str)
    os.makedirs(output_day_folder, exist_ok=True)

    wrf_files = sorted(glob(os.path.join(wrf_folder, "*.nc")))
    gpm_files = sorted(glob(os.path.join(gpm_folder, "*.nc")))

    print("WRF files:", len(wrf_files))
    print("GPM files:", len(gpm_files))

    # -------------------------
    # MATCH FILES BY HOUR (IMPORTANT FIX)
    # -------------------------
    wrf_dict = {
        os.path.basename(f).split("_")[-1].split(".")[0]: f
        for f in wrf_files
    }

    gpm_dict = {
        os.path.basename(f).split("_")[-1].split(".")[0]: f
        for f in gpm_files
    }

    common_hours = sorted(set(wrf_dict.keys()) & set(gpm_dict.keys()))
    print("Common hours:", len(common_hours))

    # -------------------------
    # LOOP HOURS
    # -------------------------
    for hour in common_hours:

        print("Processing:", day_str, "Hour:", hour)

        wfile = wrf_dict[hour]
        gfile = gpm_dict[hour]

        hour_folder = os.path.join(output_day_folder, f"Hour_{hour}")
        os.makedirs(hour_folder, exist_ok=True)

        wrf = xr.open_dataset(wfile)
        gpm = xr.open_dataset(gfile)

        # -------------------------
        # REMOVE EXTRA DIMENSION
        # -------------------------
        wrf_rain = wrf["rain"].squeeze().values
        gpm_rain = gpm["hourly_rain"].squeeze().values

        lat = wrf["lat"].squeeze().values
        lon = wrf["lon"].squeeze().values

        # Debug (optional)
        # print(wrf_rain.shape, gpm_rain.shape)

        # -------------------------
        # BINARY
        # -------------------------
        wrf_bin = (wrf_rain >= threshold).astype(int)
        gpm_bin = (gpm_rain >= threshold).astype(int)

        # -------------------------
        # 4 MATRICES
        # -------------------------
        hit = ((wrf_bin == 1) & (gpm_bin == 1)).astype(int)
        miss = ((wrf_bin == 0) & (gpm_bin == 1)).astype(int)
        false_alarm = ((wrf_bin == 1) & (gpm_bin == 0)).astype(int)
        true_negative = ((wrf_bin == 0) & (gpm_bin == 0)).astype(int)

        # -------------------------
        # SAVE CSVs
        # -------------------------
        pd.DataFrame(hit, index=lat, columns=lon).to_csv(os.path.join(hour_folder, "hit.csv"))
        pd.DataFrame(miss, index=lat, columns=lon).to_csv(os.path.join(hour_folder, "miss.csv"))
        pd.DataFrame(false_alarm, index=lat, columns=lon).to_csv(os.path.join(hour_folder, "false_alarm.csv"))
        pd.DataFrame(true_negative, index=lat, columns=lon).to_csv(os.path.join(hour_folder, "true_negative.csv"))

        wrf.close()
        gpm.close()

print("\n✅ MONTHLY PROCESS COMPLETED!")