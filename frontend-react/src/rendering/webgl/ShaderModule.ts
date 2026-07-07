// frontend-react/src/rendering/webgl/ShaderModule.ts

import type {
    DatasetManifest,
    RasterFrame,
} from "@/core/datasets/datasetTypes";

import type {
    RendererConfig,
} from "../RendererConfig";

/**
 * A ShaderModule describes how a scalar raster
 * should be rendered.
 *
 * RasterWebGLRenderer owns:
 *   - WebGL context
 *   - Program creation
 *   - Texture upload
 *   - Fullscreen quad
 *
 * ShaderModule owns:
 *   - GLSL source
 *   - Uniform locations
 *   - Shader-specific uniforms
 */
export interface ShaderModule {

    /**
     * Human-readable identifier.
     */
    readonly id: string;

    /**
     * Vertex shader GLSL.
     */
    readonly vertexSource: string;

    /**
     * Fragment shader GLSL.
     */
    readonly fragmentSource: string;

    /**
     * Called once after the program has been linked.
     *
     * Cache all uniform locations here.
     */
    initialize(

        gl: WebGL2RenderingContext,

        program: WebGLProgram

    ): void;

    /**
     * Called every frame before drawing.
     *
     * Upload shader-specific uniforms.
     */
    bindUniforms(

        gl: WebGL2RenderingContext,

        program: WebGLProgram,

        frame: RasterFrame,

        manifest: DatasetManifest,

        config: RendererConfig

    ): void;

    
    supports(
        variable: string
    ): boolean;

}