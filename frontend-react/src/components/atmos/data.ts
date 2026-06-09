// frontend-react/src/components/atmos/data.ts
// Deterministic mock data + real thermodynamics ported from the reference
// FastAPI backend (atmospheric-engine/app/thermodynamics/*).
// Constants and formulas match build_sounding.py, moisture.py, saturation.py,
// lapse_rates.py, moist_adiabat.py, parcel.py, and cape.py.

// ---------- PRNG ----------
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ============================================================
// THERMO CONSTANTS  (thermo_constants.py)
// ============================================================
const RD = 287.05;
const CP = 1004.0;
const G = 9.81;
const EPSILON = 0.622;
const LV = 2.5e6;
const KAPPA = RD / CP;

// ============================================================
// SATURATION  (saturation.py — Bolton 1980)
// ============================================================
function satVaporPressure(tc: number) {
  return 6.112 * Math.exp((17.67 * tc) / (tc + 243.5));
}
function satMixingRatio(pHpa: number, tc: number) {
  const es = satVaporPressure(tc);
  return (EPSILON * es) / (pHpa - es);
}

// ============================================================
// MOISTURE  (moisture.py)
// ============================================================
function lclTemperatureK(tK: number, tdK: number) {
  return 1 / (1 / (tdK - 56) + Math.log(tK / tdK) / 800) + 56;
}
function lclPressureHpa(pHpa: number, tK: number, tlclK: number) {
  return pHpa * Math.pow(tlclK / tK, CP / RD);
}
function dewpointFromVaporPressure(eHpa: number) {
  const ln = Math.log(eHpa / 6.112);
  return (243.5 * ln) / (17.67 - ln); // °C
}

// ============================================================
// LAPSE RATES
// ============================================================
function dryLiftK(t0K: number, p0: number, p: number) {
  return t0K * Math.pow(p / p0, KAPPA);
}
function moistLapseRateKm(pHpa: number, tK: number) {
  const tc = tK - 273.15;
  const qs = satMixingRatio(pHpa, tc);
  const num = G * (1 + (LV * qs) / (RD * tK));
  const den = CP + (LV * LV * qs * EPSILON) / (RD * tK * tK);
  return num / den; // K/m
}

// ============================================================
// SOUNDING + PARCEL ASCENT
// ============================================================
export interface SkewTPoint {
  p: number; // hPa
  t: number; // °C  environment
  td: number; // °C dewpoint
  tp: number; // °C parcel
  z: number; // m  height
}

export interface SoundingResult {
  profile: SkewTPoint[];
  lclPressure: number;
  cape: number;
  cin: number;
}

export function generateSounding(seed = 11): SoundingResult {
  const rand = mulberry32(seed);

  // realistic levels (hPa)
  const pressure = [1000, 950, 925, 900, 850, 800, 750, 700, 650, 600, 550,
    500, 450, 400, 350, 300, 250, 200, 150, 100];

  // synthetic but physically plausible env profile
  // surface ~28°C, lapse ~6.5K/km, with a small jitter; RH decreases aloft
  const tSurfC = 28;
  const tdSurfC = 22;
  const tSurfK = tSurfC + 273.15;
  const tdSurfK = tdSurfC + 273.15;

  // approx hypsometric height (m) using avg env T
  const z: number[] = [];
  const tEnvC: number[] = [];
  const tdEnvC: number[] = [];
  let zPrev = 0;
  for (let i = 0; i < pressure.length; i++) {
    const p = pressure[i];
    // env temperature: tropical-ish lapse w/ tropopause near 100 hPa
    const tc =
      p >= 200
        ? tSurfC - 6.5 * (Math.log(1000 / p) * 7.5) + (rand() - 0.5) * 1.2
        : -75 + (rand() - 0.5) * 2;
    tEnvC.push(tc);

    // RH: ~85% near surface decaying to ~25% aloft
    const rh = Math.max(0.15, 0.85 - 0.7 * (1 - p / 1000));
    const es = satVaporPressure(tc);
    const e = Math.max(0.01, es * rh);
    tdEnvC.push(Math.min(tc - 0.5, dewpointFromVaporPressure(e)));

    if (i === 0) {
      z.push(0);
    } else {
      const tAvgK = ((tEnvC[i] + tEnvC[i - 1]) / 2) + 273.15;
      const dz = (RD * tAvgK / G) * Math.log(pressure[i - 1] / p);
      zPrev += dz;
      z.push(zPrev);
    }
  }

  // ---- parcel ascent (parcel.py)
  const tlcl = lclTemperatureK(tSurfK, tdSurfK);
  const plcl = lclPressureHpa(pressure[0], tSurfK, tlcl);

  const parcelK: number[] = new Array(pressure.length);
  parcelK[0] = tSurfK;
  for (let i = 1; i < pressure.length; i++) {
    const p = pressure[i];
    if (p >= plcl) {
      parcelK[i] = dryLiftK(tSurfK, pressure[0], p);
    } else {
      const dz = z[i] - z[i - 1];
      const gamma = moistLapseRateKm(p, parcelK[i - 1]);
      parcelK[i] = parcelK[i - 1] - gamma * dz;
    }
  }

  // ---- CAPE / CIN (cape.py, simplified — uses T instead of Tv)
  let cape = 0;
  let cin = 0;
  let lfcIdx = -1;
  const buoy = parcelK.map((tp, i) => G * ((tp - (tEnvC[i] + 273.15)) / (tEnvC[i] + 273.15)));
  for (let i = 1; i < buoy.length; i++) {
    if (lfcIdx < 0 && buoy[i - 1] < 0 && buoy[i] > 0) lfcIdx = i;
  }
  if (lfcIdx > 0) {
    for (let i = lfcIdx; i < buoy.length - 1; i++) {
      const b = Math.max(0, (buoy[i] + buoy[i + 1]) / 2);
      cape += b * (z[i + 1] - z[i]);
      if (buoy[i + 1] < 0) break;
    }
    for (let i = 0; i < lfcIdx; i++) {
      const b = Math.min(0, (buoy[i] + buoy[i + 1]) / 2);
      cin += b * (z[i + 1] - z[i]);
    }
  }

  const profile: SkewTPoint[] = pressure.map((p, i) => ({
    p,
    t: tEnvC[i],
    td: tdEnvC[i],
    tp: parcelK[i] - 273.15,
    z: z[i],
  }));

  return { profile, lclPressure: plcl, cape, cin };
}

// ============================================================
// MOCK SERIES (unchanged)
// ============================================================
export interface MeteoPoint {
  date: Date;
  temp: number;
  dew: number;
  precip: number;
  wind: number;
  humidity: number;
}

export function generateMeteogram(seed = 42, days = 380): MeteoPoint[] {
  const rand = mulberry32(seed);
  const start = new Date(2010, 0, 1).getTime();
  const out: MeteoPoint[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start + i * 86400000);
    const doy = (i % 365) / 365;
    const seasonal = Math.sin((doy - 0.25) * Math.PI * 2);
    const temp = 12 + seasonal * 14 + (rand() - 0.5) * 4;
    const dew = temp - 4 - rand() * 6;
    const precip = Math.max(0, (rand() - 0.55) * 80 * (0.4 + Math.max(0, seasonal)));
    const wind = 25 + (rand() - 0.5) * 30 + Math.abs(seasonal) * 10;
    const humidity = 55 + (rand() - 0.5) * 40 + Math.max(0, seasonal) * 15;
    out.push({ date: d, temp, dew, precip, wind, humidity: Math.max(10, Math.min(100, humidity)) });
  }
  return out;
}

export function generateTimelineSeries(width: number, seed = 7) {
  const rand = mulberry32(seed);
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < width; i++) {
    const t = i / width;
    const y =
      Math.sin(t * 60) * 0.4 +
      Math.sin(t * 12) * 0.5 +
      (rand() - 0.5) * 0.25;
    pts.push({ x: i, y });
  }
  return pts;
}
