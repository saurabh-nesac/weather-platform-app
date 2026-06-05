// frontend/src/data/loaders/contourLoader.js
import { contourCache }
    from '../cache/contourCache.js';

export async function loadContours(map, frame) {

    if (contourCache[frame]) {

        updateContourSource(
            map,
            contourCache[frame]
        );

        return contourCache[frame];
    }

    const file =
        'public/data/contours/contour_' +
        String(frame).padStart(3, '0') +
        '.geojson';

    const res = await fetch(file);

    const data = await res.json();

    contourCache[frame] = data;

    updateContourSource(map, data);

    console.log(`✅ Loaded contour ${frame}`);

    return data;
}

function updateContourSource(map, data) {

    if (map.getSource('gpm-contours')) {

        map.getSource('gpm-contours')
            .setData(data);

        return;
    }

    map.addSource('gpm-contours', {

        type: 'geojson',

        data
    });

    map.addLayer({

        id: 'gpm-contours-line',

        type: 'line',

        source: 'gpm-contours',

        paint: {

            'line-color': [
                'interpolate',
                ['linear'],
                ['get', 'value'],
                0, '#ffffff',
                0.1, '#b0e0e6',
                1, '#5b6baf',
                5, '#00ff00',
                10, '#ffff00',
                20, '#ff9900',
                30, '#ff0000',
                50, '#800080',
                100, '#ff00ff'
            ]
            ,

            'line-width': 2,

            'line-opacity': 0.9
        }
    });
}