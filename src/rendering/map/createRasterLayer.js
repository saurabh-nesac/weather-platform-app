//src/rendering/map/rainLayer.js

import { BBOX }
    from '@/core/config/variables.js';
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
        id: 'variable',
        type: 'custom',
        renderingMode: '2d',

        onAdd: function (map, gl) {
            const program =
                getOrCreateProgram({

                    gl,
                    key: 'variable',
                    vertexSource: vs,
                    fragmentSource: fs,

                    createProgram
                });
            this.a_pos = gl.getAttribLocation(program, "a_pos");
            this.program = program;

            this.texWRF = gl.createTexture();
            // this.texGPM = gl.createTexture();

            this.u_matrix = gl.getUniformLocation(program, "u_matrix");
            // this.u_split = gl.getUniformLocation(program, "u_split");
            this.u_wrf = gl.getUniformLocation(program, "u_wrf");
            // this.u_gpm = gl.getUniformLocation(program, "u_gpm");

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


            if (!store.app.loaded) return;
            const frame = store.app.currentFrame;
            const wrf = store.cache.frames[frame];
            // const gpm = framesRight[frame];

            // if (!wrf || !gpm) return;

            let wrfData = wrf;
            const width =
                store.metadata.WIDTH_WRF;

            const height =
                store.metadata.HEIGHT_WRF;

            if (variable.processing.blur.enabled) {

                wrfData =
                    gaussianBlur2D(
                        wrfData,
                        width,
                        height,
                        variable.processing.blur.radius
                    );
            }

            // if (store.processing.blur.mode === "gaussian") {
            //     wrfData = gaussianBlur2D(wrfData, width, height, variable.processing.blur.radius);
            // }

            // if (store.processing.neighborhoodMax.enabled) {
            //     wrfData = neighborhoodMax3x3(wrfData, width, height);
            // }

            // if (store.processing.maxFilter.enabled) {
            //     wrfData = maxFilter2D(wrfData, width, height, 1);

            // }

            if (
                this.cacheFrame !== frame ||
                this.cacheScale !== variable.scaling.max ||
                this.cacheBlur !== store.processing.blur.mode ||
                this.cacheRadius !== store.processing.blur.radius ||
                this.cacheMax !== store.processing.maxFilter.enabled ||
                this.cacheNeigh !== store.processing.neighborhoodMax.enabled
            ) {

                this.texWRFData =
                    toRGBA(wrfData, width, height, variable);

                uploadTexture({
                    gl,
                    texture:
                        this.texWRF,
                    width:
                        width,
                    height:
                        height,
                    data:
                        this.texWRFData
                });



                this.cacheFrame = frame;
                this.cacheScale = variable.scaling.max;
                this.cacheBlur = store.processing.blur.mode;
                this.cacheRadius = store.processing.blur.radius;
                this.cacheMax = store.processing.maxFilter.enabled;
                this.cacheNeigh = store.processing.neighborhoodMax.enabled;
            }


            uploadTexture({
                gl, texture: this.texWRF, width: width,
                height: height, data: this.texWRFData
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