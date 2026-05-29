export async function fetchSkewt(

    lat,
    lon,
    timeIdx = 0
) {

    const response = await fetch(

        `http://localhost:8000/api/skewt` +

        `?lat=${lat}` +

        `&lon=${lon}` +

        `&time_idx=${timeIdx}`
    );

    return await response.json();
}