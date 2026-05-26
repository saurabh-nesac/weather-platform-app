import xarray as xr

from pathlib import Path

from app.indexing.query_kdtree import (
    query_point
)


BASE_PATH = Path(
    "/home/saurabh/projects/weather-platform"
)

ZARR_PATH = (
    BASE_PATH /
    "datasets/zarr/wrf.zarr"
)


print("Opening atmospheric datastore...")

ds = xr.open_zarr(
    ZARR_PATH
)

print("Datastore ready")


def extract_profile(
    lat,
    lon,
    time_idx
):

    # FIND GRID POINT
    result = query_point(
        lat,
        lon
    )

    iy = result["iy"]
    ix = result["ix"]

    # EXTRACT COLUMN
    profile = ds.isel(

        Time=time_idx,

        south_north=iy,

        west_east=ix
    )

    return {

        "lat": float(
            profile["XLAT"].values
        ),

        "lon": float(
            profile["XLONG"].values
        ),

        "pressure":
            profile["pressure"]
            .values
            .tolist(),

        "temperature":
            profile["temperature"]
            .values
            .tolist(),

        "height":
            profile["height"]
            .values
            .tolist(),

        "u":
            profile["u"]
            .values
            .tolist(),

        "v":
            profile["v"]
            .values
            .tolist(),

        "qvapor":
            profile["qvapor"]
            .values
            .tolist(),
            
        "time":
        str(ds.XTIME.values[time_idx])
    }