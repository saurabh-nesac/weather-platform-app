// frontend-react/src/rendering/webgl/WebGLRenderer.ts

import type {
    DatasetManifest,
    RasterFrame,
} from "@/core/datasets/datasetTypes";

import type {
    Renderer,
} from "../Renderer";

export abstract class WebGLRenderer
    implements Renderer {

    protected readonly gl: WebGL2RenderingContext;

    protected readonly canvas: HTMLCanvasElement;

    protected readonly manifest: DatasetManifest;

    protected currentFrame: RasterFrame | null = null;

    protected program: WebGLProgram | null = null;

    protected vao: WebGLVertexArrayObject | null = null;

    protected vertexBuffer: WebGLBuffer | null = null;
    protected readonly textures =
        new Map<string, WebGLTexture>();
    protected initialized = false;

    constructor(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement, manifest: DatasetManifest) {

        this.gl = gl;
        this.canvas = canvas;
        this.manifest = manifest;

    }

    protected abstract initialize(): void;


    protected createShader(type: GLenum, source: string): WebGLShader {

        const shader =
            this.gl.createShader(type);

        if (!shader)
            throw new Error(
                "Unable to create shader."
            );

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
                log ??
                "Shader compilation failed."
            );

        }

        return shader;

    }

    protected createProgram(vertexSource: string, fragmentSource: string): WebGLProgram {

        const vertexShader =
            this.createShader(
                this.gl.VERTEX_SHADER,
                vertexSource
            );

        const fragmentShader =
            this.createShader(
                this.gl.FRAGMENT_SHADER,
                fragmentSource
            );

        const program =
            this.gl.createProgram();

        if (!program) {
            throw new Error(
                "Unable to create WebGL program."
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
                log ??
                "Program linking failed."
            );

        }

        this.gl.deleteShader(
            vertexShader
        );

        this.gl.deleteShader(
            fragmentShader
        );

        return program;

    }

    protected createTexture(name: string): WebGLTexture {

        const texture =
            this.gl.createTexture();

        if (!texture) {

            throw new Error(
                "Unable to create texture."
            );

        }

        this.textures.set(
            name,
            texture
        );

        return texture;

    }




    protected bindTexture(name: string, unit: number): void {

        const texture =
            this.textures.get(name);

        if (!texture) {

            throw new Error(
                `Texture '${name}' not found.`
            );

        }

        this.gl.activeTexture(
            this.gl.TEXTURE0 + unit
        );

        this.gl.bindTexture(
            this.gl.TEXTURE_2D,
            texture
        );

    }

    protected useProgram(): void {

        if (!this.program) {

            throw new Error(
                "Program has not been initialized."
            );

        }

        this.gl.useProgram(
            this.program
        );

    }

    /**
     * Resize viewport to match canvas.
     */
    protected resizeViewport(): void {

        if (

            this.canvas.width !==
            this.canvas.clientWidth ||

            this.canvas.height !==
            this.canvas.clientHeight

        ) {

            this.canvas.width =
                this.canvas.clientWidth;

            this.canvas.height =
                this.canvas.clientHeight;

        }

        this.gl.viewport(

            0,

            0,

            this.canvas.width,

            this.canvas.height

        );

    }

    protected clear(): void {

        this.gl.clearColor(
            0,
            0,
            0,
            0
        );

        this.gl.clear(
            this.gl.COLOR_BUFFER_BIT
        );

    }

    /**
     * Upload current frame to GPU.
     */
    protected abstract updateTexture(frame: RasterFrame): void;

    /**
     * Draw current frame.
     */
    abstract draw(): void;
    /**
     * Delete GPU resources.
     */
    dispose(): void {

        if (

            this.vertexBuffer

        ) {

            this.gl.deleteBuffer(

                this.vertexBuffer

            );

        }

        if (

            this.vao

        ) {

            this.gl.deleteVertexArray(

                this.vao

            );

        }

        if (

            this.program

        ) {

            this.gl.deleteProgram(

                this.program

            );

        }

        for (const texture of this.textures.values()) {

            this.gl.deleteTexture(
                texture
            );

        }

        this.textures.clear();

    }


    renderFrame(frame: RasterFrame): void {

        if (!this.initialized) {

            this.initialize();

            this.initialized = true;

        }

        this.currentFrame = frame;

        this.updateTexture(frame);

        this.draw();

    }


}