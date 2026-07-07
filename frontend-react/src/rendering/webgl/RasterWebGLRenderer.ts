// frontend-react/src/rendering/webgl/RasterWebGLRenderer.ts

import type {
    DatasetManifest,
    RasterFrame,
} from "@/core/datasets/datasetTypes";

import type {
    RendererConfig,
} from "../RendererConfig";

import { WebGLRenderer } from "./WebGLRenderer";
import type {
    ShaderModule,
} from "./ShaderModule";

export class RasterWebGLRenderer
    extends WebGLRenderer {

    constructor(

        gl: WebGL2RenderingContext,

        canvas: HTMLCanvasElement,

        manifest: DatasetManifest,

        private config: RendererConfig,

        private shader: ShaderModule

    ) {

        super(
            gl,
            canvas,
            manifest
        );

    }

    initialize(): void {

        const gl = this.gl;

        //
        // Compile shader program
        //
        this.program =
            this.createProgram(

                this.shader.vertexSource,

                this.shader.fragmentSource

            );

        this.shader.initialize(

            gl,

            this.program

        );

        //
        // Fullscreen quad
        //
        this.vao =
            gl.createVertexArray();

        if (!this.vao) {

            throw new Error(
                "Unable to create VAO."
            );

        }

        gl.bindVertexArray(
            this.vao
        );

        this.vertexBuffer =
            gl.createBuffer();

        if (!this.vertexBuffer) {

            throw new Error(
                "Unable to create VBO."
            );

        }

        gl.bindBuffer(

            gl.ARRAY_BUFFER,

            this.vertexBuffer

        );

        const vertices =
            new Float32Array([

                -1, -1,

                1, -1,

                -1, 1,

                1, 1,

            ]);

        gl.bufferData(

            gl.ARRAY_BUFFER,

            vertices,

            gl.STATIC_DRAW

        );

        gl.enableVertexAttribArray(0);

        gl.vertexAttribPointer(

            0,

            2,

            gl.FLOAT,

            false,

            0,

            0

        );

        gl.bindVertexArray(
            null
        );

        //
        // Allocate raster texture
        //
        const texture =
            this.createTexture(
                "raster"
            );

        gl.bindTexture(

            gl.TEXTURE_2D,

            texture

        );

        gl.texParameteri(

            gl.TEXTURE_2D,

            gl.TEXTURE_MIN_FILTER,

            gl.LINEAR

        );

        gl.texParameteri(

            gl.TEXTURE_2D,

            gl.TEXTURE_MAG_FILTER,

            gl.LINEAR

        );

        gl.texParameteri(

            gl.TEXTURE_2D,

            gl.TEXTURE_WRAP_S,

            gl.CLAMP_TO_EDGE

        );

        gl.texParameteri(

            gl.TEXTURE_2D,

            gl.TEXTURE_WRAP_T,

            gl.CLAMP_TO_EDGE

        );

        //
        // Allocate GPU memory.
        // Actual frame data will be uploaded
        // by updateTexture().
        //
        gl.texImage2D(

            gl.TEXTURE_2D,

            0,

            gl.R32F,

            this.manifest.width,

            this.manifest.height,

            0,

            gl.RED,

            gl.FLOAT,

            null

        );

        gl.bindTexture(

            gl.TEXTURE_2D,

            null

        );

    }

    protected updateTexture(
        frame: RasterFrame
    ): void {

        const gl = this.gl;

        const texture =
            this.textures.get("raster");

        if (!texture) {

            throw new Error(
                "Raster texture has not been created."
            );

        }

        gl.bindTexture(
            gl.TEXTURE_2D,
            texture
        );

        //
        // Upload Float32Array into the
        // existing R32F texture.
        //
        gl.pixelStorei(
            gl.UNPACK_ALIGNMENT,
            1
        );

        gl.texSubImage2D(

            gl.TEXTURE_2D,

            0,                  // mip level

            0,                  // x offset

            0,                  // y offset

            this.manifest.width,

            this.manifest.height,

            gl.RED,

            gl.FLOAT,

            frame.data

        );

        gl.bindTexture(
            gl.TEXTURE_2D,
            null
        );

    }

    draw(): void {

        if (
            !this.currentFrame ||
            !this.program ||
            !this.vao
        ) {
            return;
        }

        const gl = this.gl;

        //
        // Prepare frame
        //
        this.resizeViewport();

        this.clear();

        this.useProgram();

        //
        // Bind geometry
        //
        gl.bindVertexArray(
            this.vao
        );

        //
        // Bind raster texture
        //
        this.bindTexture(
            "raster",
            0
        );

        //
        // Upload shader uniforms
        //
        this.shader.bindUniforms(

            gl,

            this.program,

            this.currentFrame,

            this.manifest,

            this.config

        );

        //
        // Draw fullscreen quad
        //
        gl.drawArrays(

            gl.TRIANGLE_STRIP,

            0,

            4

        );

        //
        // Cleanup
        //
        gl.bindVertexArray(
            null
        );

        gl.bindTexture(
            gl.TEXTURE_2D,
            null
        );

    }
}