// frontend/src/rendering/map/createRasterLayer.js

import { BBOX }
    from '@/core/config/variables.js';
import { VARIABLES } from '@/variables/index.js';
import { toRGBA, compile } from '../engine/rasterPipeline';

import { store } from '@/core/state/store.js';
import { vs, fs } from '@/rendering/engine/shaderManager.js'
import maplibregl from 'maplibre-gl';
import { createProgram, gaussianBlur2D, neighborhoodMax3x3, maxFilter2D } from '@/rendering/engine/rasterPipeline.js'
import { getOrCreateProgram } from '../engine/programCache';

import { uploadTexture } from '@/rendering/engine/textureManager.js'

import { renderRaster } from '../engine/renderRaster';

export function createRasterLayer(variable) {
    console.log('createRasterLayer variable:', variable)
    return {
        id: 'raster-layer',
        type: 'custom',
        renderingMode: '2d',

        onAdd: function (map, gl) {
            const program =
                getOrCreateProgram({

                    gl,
                    key: 'variable.shader',
                    vertexSource: vs,
                    fragmentSource: fs,

                    createProgram
                });
            this.a_pos = gl.getAttribLocation(program, "a_pos");
            this.program = program;

            this.texture = gl.createTexture();
            // this.texGPM = gl.createTexture();

            this.u_matrix = gl.getUniformLocation(program, "u_matrix");
            // this.u_split = gl.getUniformLocation(program, "u_split");
            this.u_wrf = gl.getUniformLocation(program, "u_wrf");
            // this.u_gpm = gl.getUniformLocation(program, "u_gpm");
            console.log('BBOX: ',BBOX)
            const [minLon, minLat, maxLon, maxLat] = BBOX;

            this.u_min = gl.getUniformLocation(program, "u_min");
            this.u_max = gl.getUniformLocation(program, "u_max");



            const pBL = maplibregl.MercatorCoordinate.fromLngLat([minLon, minLat]);
            const pBR = maplibregl.MercatorCoordinate.fromLngLat([maxLon, minLat]);
            const pTL = maplibregl.MercatorCoordinate.fromLngLat([minLon, maxLat]);
            const pTR = maplibregl.MercatorCoordinate.fromLngLat([maxLon, maxLat]);

            this.min = [pBL.x, pBL.y];
            this.max = [pTR.x, pTR.y];

            const vertices = new Float32Array([

                pBL.x, pBL.y,
                pBR.x, pBR.y,
                pTL.x, pTL.y,

                pTL.x, pTL.y,
                pBR.x, pBR.y,
                pTR.x, pTR.y
            ]);

            this.buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            console.log("🔥 Raster Layer Added:", gl);
        },

        render: function (gl, args) {
            // console.log("RENDERING");
            // console.log(store.app.currentFrame);
            // console.log(store.cache.frames);
            // console.log(store.cache.frames[store.currentFrame]);

            const matrix =
                args.defaultProjectionData.mainMatrix;
            // console.log(matrix)

            const variable =
                VARIABLES[
                    store.app.currentVariable
                ];

            if (!store.app.loaded) return;
            const frame = store.app.currentFrame;
            const raster =
                store.cache.frames?.[
                    variable.id
                ]?.[
                    frame
                ];

            if (!raster) return;
            // const gpm = framesRight[frame];

            // if (!raster || !gpm) return;

            let rasterData = raster;
            const width =
                store.metadata.WIDTH_WRF;

            const height =
                store.metadata.HEIGHT_WRF;

            const blurEnabled =
                variable.processing?.blur?.enabled ?? false;

            const blurRadius =
                variable.processing?.blur?.radius ?? 1;

            if (blurEnabled) {

                rasterData =
                    gaussianBlur2D(
                        rasterData,
                        width,
                        height,
                        blurRadius
                    );
            }

            // if (store.processing.blur.mode === "gaussian") {
            //     rasterData = gaussianBlur2D(rasterData, width, height, variable.processing.blur.radius);
            // }

            // if (store.processing.neighborhoodMax.enabled) {
            //     rasterData = neighborhoodMax3x3(rasterData, width, height);
            // }

            // if (store.processing.maxFilter.enabled) {
            //     rasterData = maxFilter2D(rasterData, width, height, 1);

            // }

            if (
                this.cacheFrame !== frame ||
                this.cacheScale !== variable.scaling.max ||
                this.cacheBlur !== store.processing.blur.mode ||
                this.cacheRadius !== store.processing.blur.radius ||
                this.cacheMax !== store.processing.maxFilter.enabled ||
                this.cacheNeigh !== store.processing.neighborhoodMax.enabled
            ) {
                console.log(
                    rasterData[0],
                    rasterData[1000],
                    rasterData[10000]
                );

                let min = Infinity;
                let max = -Infinity;

                for (let i = 0; i < rasterData.length; i++) {
                    min = Math.min(min, rasterData[i]);
                    max = Math.max(max, rasterData[i]);
                }

                console.log("MIN", min);
                console.log("MAX", max);

                this.textureData =
                    toRGBA(rasterData, width, height, variable);

                uploadTexture({
                    gl,
                    texture:
                        this.texture,
                    width:
                        width,
                    height:
                        height,
                    data:
                        this.textureData
                });



                this.cacheFrame = frame;
                this.cacheScale = variable.scaling.max;
                this.cacheBlur = store.processing.blur.mode;
                this.cacheRadius = store.processing.blur.radius;
                this.cacheMax = store.processing.maxFilter.enabled;
                this.cacheNeigh = store.processing.neighborhoodMax.enabled;
            }


            uploadTexture({
                gl, texture: this.texture, width: width,
                height: height, data: this.textureData
            });

            renderRaster({

                gl,

                matrix,

                shader: this.program,

                uniforms: {

                    u_matrix: this.u_matrix,
                    u_wrf: this.u_wrf,
                    u_min: this.u_min,
                    u_max: this.u_max
                },

                buffer: this.buffer,

                attributes: {

                    a_pos: this.a_pos
                },

                bounds: {

                    min: this.min,
                    max: this.max
                }
            });

        }
    };
}