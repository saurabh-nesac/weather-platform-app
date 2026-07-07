// frontend-react/src/rendering/WebGLRendererFactory.ts

import type { Renderer, } from "./Renderer";

import type { RenderContext, } from "./RenderContext";

import { rendererRegistry } from "./RendererRegistry";
import { RasterWebGLRenderer, } from "./webgl/RasterWebGLRenderer";

/**
 * Factory responsible for constructing
 * GPU raster renderers.
 */
export class WebGLRendererFactory {

    create(

        context: RenderContext

    ): Renderer {

        if (!context.gl) {

            throw new Error(

                "RenderContext does not contain a WebGL2RenderingContext."

            );

        }

        const shader =
            rendererRegistry.getShader(
                context.manifest.variable
            );

        return new RasterWebGLRenderer(

            context.gl,
            context.canvas,
            context.manifest,
            context.config,
            shader

        );

    }

}

/**
 * Global factory instance.
 */
export const webGLRendererFactory =
    new WebGLRendererFactory();