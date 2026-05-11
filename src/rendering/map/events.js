//src/rendering/map/event.js

export function setupMapEvents(map) {

    map.on('click', (e) => {

        console.log(e.lngLat);
    });
}