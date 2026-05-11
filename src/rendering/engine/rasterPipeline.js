//src\rendering\engine\renderRaster.js
/*
raw data
    ↓
filters
    ↓
normalization
    ↓
RGBA texture
*/
import { BBOX } from '@/core/config/variables.js';
import { vs, fs } from '@/rendering/engine/shaderManager.js';

import { store } from '@/core/state/store.js';
import { applyColormap }
    from './applyColormap.js';


export
    function toRGBA(data, width, height, variable) {
    // console.log('variable: ',variable)

    console.log(
        data.length,
        width,
        height,
        width * height,
        width * height * 4
    );
    const rgba =
        new Uint8Array(
            width * height * 4
        );

    for (let i = 0; i < data.length; i++) {

        let d = data[i];

        // 🚫 mask invalid / no rain
        if (!isFinite(d) || d <= 0) {
            rgba[i * 4 + 3] = 0; // transparent
            continue;
        }

        // normalize
        let v = d / variable.scaling.max;
        v = Math.min(1, Math.max(0, v));

        const color =
            applyColormap(
                v,
                variable.colormap
            );

        rgba[i * 4 + 0] = color[0];
        rgba[i * 4 + 1] = color[1];
        rgba[i * 4 + 2] = color[2];
        rgba[i * 4 + 3] = color[3];
    }

    console.log(
        'RGBA SIZE:',
        width * height * 4
    );

    return rgba;
}


export function compile(
    gl,
    type,
    src
) {

    const shader =
        gl.createShader(type);

    gl.shaderSource(
        shader,
        src
    );

    gl.compileShader(shader);

    return shader;
}

export function createProgram(gl, vs, fs) {

    const program =
        gl.createProgram();

    gl.attachShader(
        program,
        compile(
            gl,
            gl.VERTEX_SHADER,
            vs
        )
    );

    gl.attachShader(
        program,
        compile(
            gl,
            gl.FRAGMENT_SHADER,
            fs
        )
    );

    gl.linkProgram(program);
    console.log('Shader Created')

    return program;
}

export function gaussianBlur2D(data, width, height, radius = 1) {


    const kernelSize = radius * 2 + 1;
    const sigma = radius / 2;

    const kernel = [];
    let sum = 0;

    for (let i = -radius; i <= radius; i++) {
        const val = Math.exp(-(i * i) / (2 * sigma * sigma));
        kernel.push(val);
        sum += val;
    }

    // normalize
    for (let i = 0; i < kernel.length; i++) {
        kernel[i] /= sum;
    }

    const temp = new Float32Array(data.length);
    const output = new Float32Array(data.length);

    // horizontal pass
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            let acc = 0;

            for (let k = -radius; k <= radius; k++) {
                const xx = Math.min(width - 1, Math.max(0, x + k));
                acc += data[y * width + xx] * kernel[k + radius];
            }

            temp[y * width + x] = acc;
        }
    }

    // vertical pass
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {

            let acc = 0;

            for (let k = -radius; k <= radius; k++) {
                const yy = Math.min(height - 1, Math.max(0, y + k));
                acc += temp[yy * width + x] * kernel[k + radius];
            }

            output[y * width + x] = acc;
        }
    }
    return output;
}

export function neighborhoodMax3x3(data, width, height) {

    const output = new Float32Array(data.length);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            let maxVal = data[y * width + x];

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {

                    const xx = Math.min(width - 1, Math.max(0, x + kx));
                    const yy = Math.min(height - 1, Math.max(0, y + ky));

                    const val = data[yy * width + xx];
                    if (val > maxVal) maxVal = val;
                }
            }

            output[y * width + x] = maxVal;
        }
    }

    return output;
}


export function maxFilter2D(data, width, height, radius = 1) {

    const output = new Float32Array(data.length);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            let maxVal = 0;

            for (let ky = -radius; ky <= radius; ky++) {
                for (let kx = -radius; kx <= radius; kx++) {

                    const xx = Math.min(width - 1, Math.max(0, x + kx));
                    const yy = Math.min(height - 1, Math.max(0, y + ky));

                    const val = data[yy * width + xx];
                    if (val > maxVal) maxVal = val;
                }
            }

            output[y * width + x] = maxVal;
        }
    }

    return output;
}
