import { store }
    from '@/core/state/store.js';

export async function loadMeta() {

    const res =
        await fetch('/data/bin/meta.json');

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

    console.log(
        'META:',
        store.metadata.WIDTH_WRF,
        store.metadata.HEIGHT_WRF
    );
    console.log(
        typeof META.nx,
        typeof META.ny
    );
    return META;
}