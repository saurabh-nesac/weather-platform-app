import pandas as pd
import numpy as np
import os
from glob import glob

# -------------------------
# BASE FOLDER (ALL DAYS)
# -------------------------
base_folder = r"D:\April_contingency_output"

# -------------------------
# FUNCTION (UNCHANGED LOGIC)
# -------------------------
def process_category(day_folder, hour_folders, category_name, day_str):

    print(f"  Processing: {category_name}")

    total_grid = None

    for hfolder in hour_folders:
        file_path = os.path.join(hfolder, f"{category_name}.csv")

        if not os.path.exists(file_path):
            continue

        df = pd.read_csv(file_path, index_col=0)

        if total_grid is None:
            total_grid = df.values
            lat = df.index.astype(float)
            lon = df.columns.astype(float)
        else:
            total_grid += df.values

    if total_grid is None:
        print("  ⚠ No data found")
        return

    # -------------------------
    # SAVE CSV
    # -------------------------
    output_file = os.path.join(
        day_folder,
        f"total_{category_name}_{day_str}.csv"
    )

    pd.DataFrame(total_grid, index=lat, columns=lon).to_csv(output_file)

    print("  ✅ Saved:", output_file)


# -------------------------
# LOOP OVER ALL DAYS
# -------------------------
for day in range(1, 32):

    day_str = f"Day_{day:02d}"
    day_folder = os.path.join(base_folder, day_str)

    if not os.path.exists(day_folder):
        print(f"\n⚠ Skipping {day_str} (folder not found)")
        continue

    print(f"\n========== {day_str} ==========")

    hour_folders = sorted(glob(os.path.join(day_folder, "Hour_*")))
    print("Total hours:", len(hour_folders))

    # Run for all 4 categories
    process_category(day_folder, hour_folders, "hit", day_str)
    process_category(day_folder, hour_folders, "miss", day_str)
    process_category(day_folder, hour_folders, "false_alarm", day_str)
    process_category(day_folder, hour_folders, "true_negative", day_str)

print("\n🔥 FULL MONTH DAILY TOTAL CSVs GENERATED!")