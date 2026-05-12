//src\data\loaders\metaLoader.js
import { store }
    from '@/core/state/store.js';

import { formatTimestamp } from '../../utils/formatTimestamp';
export async function loadMeta() {

    const res =
        await fetch(
            '/data/bin/meta.json'
        );

    const META =
        await res.json();

    store.metadata.WIDTH_WRF =
        META.nx;

    store.metadata.HEIGHT_WRF =
        META.ny;

    store.metadata.lat =
        META.lat;

    store.metadata.lon =
        META.lon;

    // initialize metadata cache
    if (
        !store.cache.metadata.rain
    ) {

        store.cache.metadata.rain = {};
    }

    META.timestamps.forEach(
        (timestamp, index) => {

            store.cache.metadata.rain[
                index + 1
            ] = {

                rawTimestamp:
                    timestamp,

                timestamp:
                    formatTimestamp(timestamp)
            };
        }
    );

    console.log(
        META.nx,
        META.ny
    );

    return META;
}