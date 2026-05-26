from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware
)

from app.extraction.profile import (
    extract_profile
)

from app.api.routes.diagnostics import (
    router as diagnostics_router
)
from app.api.routes.skewt import (
    router as skewt_router
)
from app.api.routes.meteogram import (
    router as meteogram_router
)

# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(

    title="Atmospheric Engine",

    version="1.0.0"
)

# ============================================================
# CORS
# ============================================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "*"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

# ============================================================
# ROUTERS
# ============================================================

app.include_router(

    diagnostics_router,

    prefix="/api"
)

app.include_router(

    skewt_router,

    prefix="/api"
)
app.include_router(
    meteogram_router,
    prefix="/api"
)


# ============================================================
# HEALTH
# ============================================================

@app.get("/api/health")

def health():

    return {

        "status": "ok"
    }


# ============================================================
# PROFILE EXTRACTION
# ============================================================

@app.get("/api/profile")

def profile(

    lat: float,

    lon: float,

    time_idx: int
):

    return extract_profile(

        lat,

        lon,

        time_idx
    )