// frontend-react/src/rendering/surface/WebGLSurface.ts

import { RenderSurface } from "./RenderSurface";
import { WebGLContextManager } from "../webgl/WebGLContextManager";

export class WebGLSurface
    implements RenderSurface {

    readonly backend = "webgl";

    private readonly manager: WebGLContextManager;

    readonly gl: WebGL2RenderingContext;

    constructor(

        public readonly canvas: HTMLCanvasElement

    ) {

        this.manager = new WebGLContextManager(
            canvas
        );

        this.gl = this.manager.getContext();

    }

    resize(): void {

        this.manager.resize();

    }

    clear(): void {

        this.gl.clear(

            this.gl.COLOR_BUFFER_BIT

        );

    }

    dispose(): void {

        //
        // Release GPU resources.
        //
        // Later this will destroy:
        //
        // • Shader programs
        // • Vertex Array Objects (VAOs)
        // • Vertex / Index Buffers (VBOs/EBOs)
        // • Textures
        // • Framebuffers
        // • Renderbuffers
        // • Uniform buffers
        // • Transform feedback objects
        // • WebGL queries / sync objects
        //
        // Also unregister any event listeners owned
        // by the surface (context lost/restored, etc.).
        //

    }

}