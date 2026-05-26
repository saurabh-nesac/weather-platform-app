import { BASEMAPS }
from '@/rendering/map/basemaps.js';

export function setupBasemapControls(map) {

    const select =
        document.getElementById('basemapSelect');

    if (!select) return;

    select.onchange = () => {

        const type = select.value;

        map.getSource('basemap')
            .setTiles(BASEMAPS[type]);
    };
}