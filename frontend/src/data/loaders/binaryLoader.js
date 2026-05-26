export async function loadBinary(url) {

    const res = await fetch(url);

    const buf = await res.arrayBuffer();

    return new Float32Array(buf);
}
