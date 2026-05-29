// src/rendering/map/map.js

import maplibregl from 'maplibre-gl';

import {

    BASEMAPS

} from './basemaps.js';


// ============================================================
// BOUNDS
// ============================================================

export const BBOX = [

    87.32,
    19.35,

    99.03,
    30.66
];


// ============================================================
// CREATE MAP
// ============================================================

export function createMap(
    container
) {

    const map =
        new maplibregl.Map({

            container,

            renderWorldCopies: false,

            minZoom: 5,

            maxZoom: 11,

            style: {

                version: 8,

                sources: {

                    basemap: {

                        type: 'raster',

                        tiles:
                            BASEMAPS.osm,

                        tileSize: 256
                    }
                },

                layers: [

                    {

                        id:
                            'basemap-layer',

                        type:
                            'raster',

                        source:
                            'basemap'
                    }
                ]
            },

            maxBounds: [

                [BBOX[0], BBOX[1]],

                [BBOX[2], BBOX[3]]
            ]
        });

    return map;
}