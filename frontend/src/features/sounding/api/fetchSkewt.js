import { API_BASE }
    from '@/core/config/api.js';


export async function fetchSkewt(

    lat,
    lon,
    timeIdx = 0
) {

    const response = await fetch(

        `${API_BASE}/skewt` +

        `?lat=${lat}` +

        `&lon=${lon}` +

        `&time_idx=${timeIdx}`
    );

    return await response.json();
}