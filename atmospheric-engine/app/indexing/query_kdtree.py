import pickle
from pathlib import Path


BASE_PATH = Path(
    "/home/saurabh/projects/weather-platform/atmospheric-engine"
)

INDEX_PATH = (
    BASE_PATH /
    "datasets/indexes/kdtree.pkl"
)


with open(INDEX_PATH, "rb") as f:

    payload = pickle.load(f)


TREE = payload["tree"]
GRID_MAP = payload["grid_map"]


def query_point(lat, lon):

    distance, flat_idx = TREE.query(
        [lat, lon]
    )

    iy, ix = GRID_MAP[flat_idx]

    return {

        "iy": int(iy),
        "ix": int(ix),
        "distance": float(distance)
    }