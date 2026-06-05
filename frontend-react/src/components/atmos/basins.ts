// Approximate watershed polygons for three NE India basins.
// Coordinates are illustrative outlines, not survey-grade boundaries.

export type BasinId = "beki" | "buridehing" | "jiadhal";

export interface Basin {
  id: BasinId;
  name: string;
  river: string;
  district: string;
  area_km2: number;
  center: [number, number]; // [lon, lat]
  polygon: [number, number][]; // [lon, lat] ring
  metrics: {
    overlay: "Temperature" | "Precipitation" | "Wind";
    bias: number; // model - obs
    rmse: number;
    samples: number;
  }[];
}

export const BASINS: Basin[] = [
  {
    id: "beki",
    name: "Beki",
    river: "Beki (Brahmaputra trib.)",
    district: "Barpeta, Assam",
    area_km2: 5870,
    center: [91.05, 26.55],
    polygon: [
      [90.55, 26.95],
      [90.85, 27.05],
      [91.15, 26.95],
      [91.35, 26.7],
      [91.4, 26.4],
      [91.25, 26.15],
      [91.0, 26.05],
      [90.75, 26.2],
      [90.6, 26.5],
      [90.55, 26.95],
    ],
    metrics: [
      { overlay: "Temperature", bias: -0.42, rmse: 1.18, samples: 1460 },
      { overlay: "Precipitation", bias: 3.6, rmse: 11.4, samples: 1460 },
      { overlay: "Wind", bias: 0.21, rmse: 1.05, samples: 1460 },
    ],
  },
  {
    id: "buridehing",
    name: "Buridehing",
    river: "Buridehing (Brahmaputra trib.)",
    district: "Dibrugarh / Tinsukia, Assam",
    area_km2: 4530,
    center: [95.35, 27.3],
    polygon: [
      [94.95, 27.65],
      [95.25, 27.75],
      [95.6, 27.6],
      [95.8, 27.3],
      [95.75, 27.0],
      [95.5, 26.85],
      [95.2, 26.9],
      [95.0, 27.1],
      [94.9, 27.4],
      [94.95, 27.65],
    ],
    metrics: [
      { overlay: "Temperature", bias: -0.18, rmse: 0.92, samples: 1460 },
      { overlay: "Precipitation", bias: 5.9, rmse: 14.2, samples: 1460 },
      { overlay: "Wind", bias: -0.35, rmse: 1.28, samples: 1460 },
    ],
  },
  {
    id: "jiadhal",
    name: "Jiadhal",
    river: "Jiadhal (Brahmaputra trib.)",
    district: "Dhemaji, Assam",
    area_km2: 1340,
    center: [94.55, 27.55],
    polygon: [
      [94.35, 27.85],
      [94.55, 27.95],
      [94.8, 27.85],
      [94.85, 27.55],
      [94.75, 27.3],
      [94.55, 27.25],
      [94.35, 27.4],
      [94.3, 27.65],
      [94.35, 27.85],
    ],
    metrics: [
      { overlay: "Temperature", bias: 0.31, rmse: 1.05, samples: 1460 },
      { overlay: "Precipitation", bias: -2.4, rmse: 9.8, samples: 1460 },
      { overlay: "Wind", bias: 0.12, rmse: 0.88, samples: 1460 },
    ],
  },
];

export const basinFeatureCollection = {
  type: "FeatureCollection" as const,
  features: BASINS.map((b) => ({
    type: "Feature" as const,
    properties: { id: b.id, name: b.name },
    geometry: {
      type: "Polygon" as const,
      coordinates: [b.polygon],
    },
  })),
};
