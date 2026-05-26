from app.indexing.query_kdtree import query_point
import pickle
import numpy as np
import xarray as xr

from pathlib import Path
from scipy.spatial import cKDTree


BASE_PATH = Path(
    "/home/saurabh/projects/weather-platform/atmospheric-engine"
)

ZARR_PATH = (
    BASE_PATH /
    "datasets/zarr/wrf.zarr"
)

INDEX_PATH = (
    BASE_PATH /
    "datasets/indexes/kdtree.pkl"
)


def main():

    print("Opening Zarr dataset...")

    ds = xr.open_zarr(ZARR_PATH)

    print("Loading coordinates...")

    lat = ds["XLAT"].isel(Time=0).values
    lon = ds["XLONG"].isel(Time=0).values

    ny, nx = lat.shape

    print(f"Grid shape: {ny} x {nx}")

    # FLATTEN
    lat_flat = lat.reshape(-1)
    lon_flat = lon.reshape(-1)

    points = np.column_stack([
        lat_flat,
        lon_flat
    ])

    print("Building KDTree...")

    tree = cKDTree(points)

    # GRID INDEX MAP
    iy, ix = np.indices((ny, nx))

    grid_map = np.column_stack([
        iy.reshape(-1),
        ix.reshape(-1)
    ])

    payload = {

        "tree": tree,

        "grid_map": grid_map,

        "shape": (ny, nx)
    }

    INDEX_PATH.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with open(INDEX_PATH, "wb") as f:

        pickle.dump(payload, f)

    print("KDTree saved")
    print(INDEX_PATH)
    

    print(
        query_point(
            26.18,
            91.73
        )
    )


if __name__ == "__main__":

    main()
    
    