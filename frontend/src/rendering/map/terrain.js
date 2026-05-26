export function addTerrain(map) {

    map.addSource('terrain', {

        type: 'raster-dem',

        tiles: [
            'https://api.maptiler.com/tiles/terrain-rgb-v2/{z}/{x}/{y}.png?key=rXxNYojI5TunEnE0Clu1'
        ],

        tileSize: 256,
        maxzoom: 14
    });

    map.addLayer({

        id: 'hillshade',

        type: 'hillshade',

        source: 'terrain',

        paint: {
            'hillshade-exaggeration': 0.4
        }
    });
}