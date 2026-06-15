// src/map/basemap.ts

export const BASEMAPS = {
    dark: {
        name: "Dark",
        tiles: [
            "https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
        ],
    },

    osm: {
        name: "OSM Standard",
        tiles: [
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        ],
    },
} as const;

export type BasemapType =
    keyof typeof BASEMAPS;