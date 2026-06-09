import pandas as pd
import numpy as np
import os

# -------------------------
# BASE FOLDER
# -------------------------
base_folder = r"D:\April_contingency_output"

# -------------------------
# LOOP OVER DAYS
# -------------------------
for day in range(1, 32):

    day_str = f"Day_{day:02d}"
    day_folder = os.path.join(base_folder, day_str)

    if not os.path.exists(day_folder):
        print(f"⚠ Skipping {day_str} (folder not found)")
        continue

    print(f"\n========== {day_str} ==========")

    # -------------------------
    # FILE PATHS
    # -------------------------
    hit_file = os.path.join(day_folder, f"total_hit_{day_str}.csv")
    miss_file = os.path.join(day_folder, f"total_miss_{day_str}.csv")
    fa_file = os.path.join(day_folder, f"total_false_alarm_{day_str}.csv")
    tn_file = os.path.join(day_folder, f"total_true_negative_{day_str}.csv")

    # Check existence
    if not all(map(os.path.exists, [hit_file, miss_file, fa_file, tn_file])):
        print("  ⚠ Missing files, skipping...")
        continue

    # -------------------------
    # READ DATA
    # -------------------------
    H_df = pd.read_csv(hit_file, index_col=0)
    M_df = pd.read_csv(miss_file, index_col=0)
    F_df = pd.read_csv(fa_file, index_col=0)
    TN_df = pd.read_csv(tn_file, index_col=0)

    H = H_df.values.astype(float)
    M = M_df.values.astype(float)
    F = F_df.values.astype(float)
    TN = TN_df.values.astype(float)

    lat = H_df.index.astype(float)
    lon = H_df.columns.astype(float)

    # -------------------------
    # CALCULATIONS
    # -------------------------

    # POD
    POD = np.divide(H, H + M, out=np.zeros_like(H), where=(H + M) != 0)

    # FAR
    FAR = np.divide(F, H + F, out=np.zeros_like(F), where=(H + F) != 0)

    # ETS
    total = H + M + F + TN

    H_rand = np.divide((H + F) * (H + M), total,
                       out=np.zeros_like(H),
                       where=total != 0)

    ETS = np.divide(H - H_rand,
                    H + M + F - H_rand,
                    out=np.zeros_like(H),
                    where=(H + M + F - H_rand) != 0)
    # CSI (Critical Success Index / Threat Score)
    CSI = np.divide(H, H + M + F,
                    out=np.zeros_like(H),
                    where=(H + M + F) != 0)

    # Accuracy
    Accuracy = np.divide(H + TN, H + M + F + TN,
                        out=np.zeros_like(H),
                        where=(H + M + F + TN) != 0)

    # -------------------------
    # SAVE CSV
    # -------------------------
    pd.DataFrame(POD, index=lat, columns=lon).to_csv(
        os.path.join(day_folder, f"POD_{day_str}.csv"))

    pd.DataFrame(FAR, index=lat, columns=lon).to_csv(
        os.path.join(day_folder, f"FAR_{day_str}.csv"))

    pd.DataFrame(ETS, index=lat, columns=lon).to_csv(
        os.path.join(day_folder, f"ETS_{day_str}.csv"))
    pd.DataFrame(CSI, index=lat, columns=lon).to_csv(
        os.path.join(day_folder, f"CSI_{day_str}.csv"))

    pd.DataFrame(Accuracy, index=lat, columns=lon).to_csv(
        os.path.join(day_folder, f"Accuracy_{day_str}.csv"))

    print("  ✅ POD, FAR, ETS, CSI, Accuracy saved")

print("\n🔥 MONTHLY DAILY METRICS COMPLETED!")