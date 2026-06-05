const API_BASE = "http://localhost:8000";

export async function getManifest() {
    const res = await fetch(`${API_BASE}/manifest`);
    return res.json();
}

export async function getProfile(
    lat: number,
    lon: number,
    time: string
) {
    const res = await fetch(
        `${API_BASE}/profile?lat=${lat}&lon=${lon}&time=${time}`
    );

    return res.json();
}