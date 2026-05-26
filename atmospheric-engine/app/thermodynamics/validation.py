import numpy as np
from app.thermodynamics.sounding import Sounding
from app.extraction.profile import extract_profile
from app.thermodynamics.build_sounding import build_sounding

profile = extract_profile(lat=26.18,
    lon=91.73,

    time_idx=0)

sounding = build_sounding(profile, 0)

print(sounding)