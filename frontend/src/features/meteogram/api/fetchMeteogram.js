// src/features/meteogram/api/fetchMeteogram.js

export async function fetchMeteogram(

    lat,

    lon
) {

    const response = await fetch(

        `http://localhost:8000/api/meteogram?lat=${lat}&lon=${lon}`
    );

    return await response.json();
}