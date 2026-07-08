// frontend-react/src/rendering/webgl/WebGLContextManager.ts

export class WebGLContextManager {

    private readonly gl: WebGL2RenderingContext;

    constructor(
        private readonly canvas: HTMLCanvasElement
    ) {

        const gl =
            canvas.getContext(
                "webgl2",
                {
                    alpha: true,
                    antialias: true,
                    depth: false,
                    stencil: false,
                    premultipliedAlpha: false,
                    preserveDrawingBuffer: false,
                }
            );

        if (!gl) {

            throw new Error(
                "WebGL2 is not supported."
            );

        }

        this.gl = gl;

        this.initialize();

        this.registerEvents();

    }

    /**
     * Initialize global GPU state.
     */
    private initialize(): void {

        const gl =
            this.gl;

        //
        // Default viewport
        //
        gl.viewport(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        //
        // Transparent background.
        //
        gl.clearColor(
            0,
            0,
            0,
            0
        );

        //
        // Alpha blending.
        //
        gl.enable(
            gl.BLEND
        );

        gl.blendFunc(
            gl.SRC_ALPHA,
            gl.ONE_MINUS_SRC_ALPHA
        );

        //
        // Scientific rasters don't need
        // depth or stencil.
        //
        gl.disable(
            gl.DEPTH_TEST
        );

        gl.disable(
            gl.STENCIL_TEST
        );

        //
        // Extensions.
        //
        this.requireExtension(
            "EXT_color_buffer_float"
        );

        this.optionalExtension(
            "EXT_float_blend"
        );

    }

    /**
     * Mandatory extension.
     */
    private requireExtension(
        name: string
    ): void {

        if (
            !this.gl.getExtension(name)
        ) {

            throw new Error(
                `Missing WebGL extension '${name}'.`
            );

        }

    }

    /**
     * Optional extension.
     */
    private optionalExtension(
        name: string
    ): void {

        this.gl.getExtension(name);

    }

    /**
     * Register context loss events.
     */
    private registerEvents(): void {

        this.canvas.addEventListener(

            "webglcontextlost",

            e => {

                e.preventDefault();

                console.warn(
                    "WebGL context lost."
                );

            }

        );

        this.canvas.addEventListener(

            "webglcontextrestored",

            () => {

                console.info(
                    "WebGL context restored."
                );

                this.initialize();

            }

        );

    }

    /**
     * Resize viewport.
     */
    resize(): void {

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

    /**
     * Access WebGL2 context.
     */
    getContext(): WebGL2RenderingContext {

        return this.gl;

    }

    /**
     * Current viewport size.
     */
    get size() {

        return {

            width:
                this.canvas.width,

            height:
                this.canvas.height,

        };

    }

}