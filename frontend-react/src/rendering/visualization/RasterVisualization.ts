// frontend-react/src/rendering/visualization/RasterVisualization.ts

import { DatasetManifest, RasterFrame } from "@/core/datasets/datasetTypes";
import { Visualization } from "./Visualization";
import { RenderSurface } from "../surface/RenderSurface";

import vertexSource from "../webgl/shaders/vertex.glsl?raw";
import fragmentSource from "../webgl/shaders/rainfall.frag?raw";

export class RasterVisualization
    implements Visualization {

    readonly id = "raster";

    private gl!: WebGL2RenderingContext;

    private currentFrame: RasterFrame | null = null;

    private program!: WebGLProgram;
    private vao!: WebGLVertexArrayObject;

    private vbo!: WebGLBuffer;
    private texture!: WebGLTexture;
    private manifest!: DatasetManifest;
    private rasterLocation!: WebGLUniformLocation;
    private minLocation!: WebGLUniformLocation;
    private maxLocation!: WebGLUniformLocation;
    private paletteLocation!: WebGLUniformLocation;


    constructor(
        private readonly surface: RenderSurface,

    ) { }

    initialize(
        gl: WebGL2RenderingContext,

    ): void {

        this.gl = gl;


        const vertexShader =
            this.compileShader(
                gl.VERTEX_SHADER,
                vertexSource
            );

        const fragmentShader =
            this.compileShader(
                gl.FRAGMENT_SHADER,
                fragmentSource
            );

        this.program =
            this.linkProgram(
                vertexShader,
                fragmentShader
            );

        console.log(
            "[RasterVisualization] Shader program created."
        );

        this.cacheUniformLocations();

        this.createFullscreenQuad();
        this.createTexture();

        console.log(
            "[RasterVisualization] Ready."
        );
    }

    renderFrame(
        frame: RasterFrame, manifest: DatasetManifest
    ): void {

        this.currentFrame = frame;
        this.manifest = manifest;

        this.uploadFrame();
        this.draw();

    }

    draw(): void {

        if (!this.currentFrame) {
            return;
        }

        const gl =
            this.gl;

        this.surface.resize();

        gl.viewport(

            0,

            0,

            gl.canvas.width,

            gl.canvas.height

        );

        gl.clearColor(

            0,

            0,

            0,

            0

        );

        gl.clear(
            gl.COLOR_BUFFER_BIT
        );

        gl.useProgram(
            this.program
        );
        gl.activeTexture(
            gl.TEXTURE0
        );

        gl.bindTexture(
            gl.TEXTURE_2D,
            this.texture
        );
        gl.uniform1i(
            this.rasterLocation,
            0
        );
        gl.bindVertexArray(
            this.vao
        );

        gl.drawArrays(

            gl.TRIANGLE_STRIP,

            0,

            4

        );

        gl.bindVertexArray(
            null
        );

        gl.bindTexture(
            gl.TEXTURE_2D,
            null
        );

    }

    resize(): void {

        this.surface.resize();

    }

    dispose(): void {

        if (this.vbo) {

            this.gl.deleteBuffer(
                this.vbo
            );

        }

        if (this.vao) {

            this.gl.deleteVertexArray(
                this.vao
            );

        }

        if (this.program) {

            this.gl.deleteProgram(
                this.program
            );

        }
        if (this.texture) {

            this.gl.deleteTexture(
                this.texture
            );

        }

        this.currentFrame = null;

    }

    /**
     * Compile a GLSL shader.
     */
    private compileShader(

        type: number,

        source: string

    ): WebGLShader {

        const shader =
            this.gl.createShader(type);

        if (!shader) {

            throw new Error(
                "Unable to create shader."
            );

        }

        this.gl.shaderSource(
            shader,
            source
        );

        this.gl.compileShader(
            shader
        );

        if (
            !this.gl.getShaderParameter(
                shader,
                this.gl.COMPILE_STATUS
            )
        ) {

            const log =
                this.gl.getShaderInfoLog(
                    shader
                );

            this.gl.deleteShader(
                shader
            );

            throw new Error(

                "Shader compilation failed:\n" +

                log

            );

        }

        return shader;

    }

    /**
     * Link vertex + fragment shaders.
     */
    private linkProgram(

        vertexShader: WebGLShader,

        fragmentShader: WebGLShader

    ): WebGLProgram {

        const program =
            this.gl.createProgram();

        if (!program) {

            throw new Error(
                "Unable to create program."
            );

        }

        this.gl.attachShader(
            program,
            vertexShader
        );

        this.gl.attachShader(
            program,
            fragmentShader
        );

        this.gl.linkProgram(
            program
        );

        if (

            !this.gl.getProgramParameter(

                program,

                this.gl.LINK_STATUS

            )

        ) {

            const log =
                this.gl.getProgramInfoLog(
                    program
                );

            this.gl.deleteProgram(
                program
            );

            throw new Error(

                "Program linking failed:\n" +

                log

            );

        }

        //
        // Shaders are no longer needed after linking.
        //
        this.gl.deleteShader(
            vertexShader
        );

        this.gl.deleteShader(
            fragmentShader
        );

        return program;

    }

    /**
     * Cache uniform locations from the linked program.
     */
    private cacheUniformLocations(): void {

        const gl = this.gl;

        const rasterLoc =
            gl.getUniformLocation(
                this.program,
                "raster"
            );

        if (!rasterLoc) {
            throw new Error(
                "Uniform 'raster' not found."
            );
        }

        this.rasterLocation = rasterLoc;

        const minLoc =
            gl.getUniformLocation(
                this.program,
                "minValue"
            );

        if (!minLoc) {
            throw new Error(
                "Uniform 'minValue' not found."
            );
        }

        this.minLocation = minLoc;

        const maxLoc =
            gl.getUniformLocation(
                this.program,
                "maxValue"
            );

        if (!maxLoc) {
            throw new Error(
                "Uniform 'maxValue' not found."
            );
        }

        this.maxLocation = maxLoc;

        const paletteLoc =
            gl.getUniformLocation(
                this.program,
                "palette"
            );

        if (!paletteLoc) {
            throw new Error(
                "Uniform 'palette' not found."
            );
        }

        this.paletteLocation = paletteLoc;

    }

    private createFullscreenQuad(): void {

        const gl =
            this.gl;

        //
        // Fullscreen quad.
        //
        const vertices =
            new Float32Array([

                -1, -1,

                1, -1,

                -1, 1,

                1, 1,

            ]);

        this.vao =
            gl.createVertexArray()!;

        this.vbo =
            gl.createBuffer()!;

        gl.bindVertexArray(
            this.vao
        );

        gl.bindBuffer(

            gl.ARRAY_BUFFER,

            this.vbo

        );

        gl.bufferData(

            gl.ARRAY_BUFFER,

            vertices,

            gl.STATIC_DRAW

        );

        gl.enableVertexAttribArray(
            0
        );

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

    }
    private createTexture(): void {

        const gl =
            this.gl;

        const texture =
            gl.createTexture();

        if (!texture) {

            throw new Error(
                "Unable to create texture."
            );

        }

        this.texture =
            texture;

        gl.bindTexture(

            gl.TEXTURE_2D,

            texture

        );

        //
        // Scientific rasters should never
        // interpolate values.
        //
        gl.texParameteri(

            gl.TEXTURE_2D,

            gl.TEXTURE_MIN_FILTER,

            gl.NEAREST

        );

        gl.texParameteri(

            gl.TEXTURE_2D,

            gl.TEXTURE_MAG_FILTER,

            gl.NEAREST

        );

        //
        // No wrapping.
        //
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

        gl.bindTexture(

            gl.TEXTURE_2D,

            null

        );

    }

    private uploadFrame(): void {

        if (!this.currentFrame) {
            return;
        }

        const gl =
            this.gl;

        const frame =
            this.currentFrame;

        console.assert(
            frame.data.length ===
            this.manifest.width *
            this.manifest.height,
            "Frame data length does not match manifest dimensions."
        );

        gl.bindTexture(

            gl.TEXTURE_2D,

            this.texture

        );

        //
        // Set alignment for floating-point data.
        //
        gl.pixelStorei(
            gl.UNPACK_ALIGNMENT,
            1
        );

        //
        // Upload Float32Array to GPU.
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

            frame.data

        );

        gl.bindTexture(

            gl.TEXTURE_2D,

            null

        );

    }

}