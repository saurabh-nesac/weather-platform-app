export async function loadTemperatureFrame(frame: number) {
    const file = `/data/temperature/temp_${frame
        .toString()
        .padStart(3, "0")}.bin`;

    const res = await fetch(file);

    if (!res.ok) {
        throw new Error(
            `Failed to load ${file}: ${res.status}`
        );
    }

    return new Float32Array(
        await res.arrayBuffer()
    );
}


export async function loadManifest(){
    const file = `data/temperature/manifest.json`
    const res = await fetch(file)
    return res.json()
}