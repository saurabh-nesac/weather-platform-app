import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import geopandas as gpd
import os

# -------------------------
# BASE PATHS
# -------------------------
base_folder = r"D:\April_contingency_output"
shapefile_path = r"D:\NER_boundary\ner_bnd_geo.shp"
output_folder = os.path.join(base_folder, "April_Daily_Maps")
os.makedirs(output_folder, exist_ok=True)


# -------------------------
# LOAD SHAPEFILE ONCE
# -------------------------
gdf = gpd.read_file(shapefile_path)
gdf = gdf.to_crs("EPSG:4326")

# -------------------------
# LOOP OVER DAYS
# -------------------------
for day in range(1, 32):

    day_str = f"Day_{day:02d}"
    day_folder = os.path.join(base_folder, day_str)

    if not os.path.exists(day_folder):
        print(f"⚠ Skipping {day_str}")
        continue

    print(f"\n========== {day_str} ==========")

    # -------------------------
    # LOOP OVER METRICS
    # -------------------------
    for metric_name in ["POD", "FAR", "ETS", "CSI", "Accuracy"]:

        csv_file = os.path.join(day_folder, f"{metric_name}_{day_str}.csv")

        if not os.path.exists(csv_file):
            print(f"  ⚠ Missing {metric_name}")
            continue

        print(f"  Processing {metric_name}")

        # -------------------------
        # READ DATA
        # -------------------------
        df = pd.read_csv(csv_file, index_col=0)

        data = df.values
        lat = df.index.astype(float)
        lon = df.columns.astype(float)

        # -------------------------
        # CREATE MESHGRID
        # -------------------------
        lon2d, lat2d = np.meshgrid(lon, lat)

        # -------------------------
        # PLOT
        # -------------------------
        plt.figure(figsize=(10, 8))

        if metric_name == "ETS":

            # -------------------------
            # CUSTOM COLORMAP FOR ETS
            # -------------------------
            bounds = [-0.33, 0, 0.2, 0.4, 0.6, 0.8, 1.0]

            cmap = plt.cm.coolwarm
            norm = mcolors.BoundaryNorm(bounds, cmap.N)

            im = plt.pcolormesh(
                lon2d, lat2d, data,
                cmap=cmap,
                norm=norm,
                shading="auto"
            )
        else:
            im = plt.pcolormesh(
                lon2d, lat2d, data,
                cmap="coolwarm",
                shading="auto"
            )

        # Overlay shapefile
        gdf.boundary.plot(ax=plt.gca(), color="black", linewidth=1)

        # Colorbar
        cbar = plt.colorbar(im, shrink=0.7, pad=0.02)
        cbar.set_label(metric_name, fontweight="bold")
        cbar.ax.tick_params(labelsize=10)
        # Make colorbar tick labels bold
        for t in cbar.ax.get_yticklabels():
            t.set_fontweight('bold')

        # Labels
        plt.xlabel("Longitude (°E)", fontsize=12, fontweight='bold')
        plt.ylabel("Latitude (°N)", fontsize=12, fontweight='bold')
        plt.xticks(fontsize=10, fontweight='bold')
        plt.yticks(fontsize=10, fontweight='bold')
        plt.title(f"{metric_name} April ({day_str})", fontsize=14, fontweight='bold')

        # Limits
        plt.xlim(88, 98)
        plt.ylim(20, 30)

        plt.rcParams.update({
            "font.weight": "bold",
            "axes.labelweight": "bold",
            "axes.titleweight": "bold",
        })

        # Save
        output_file = os.path.join(
            output_folder,
            f"{metric_name}_{day_str}.png"
        )

        plt.tight_layout()
        plt.savefig(output_file, dpi=300)
        plt.close()

        print(f"  ✅ Saved: {output_file}")

print("\n🔥 ALL DAILY MAPS GENERATED!")