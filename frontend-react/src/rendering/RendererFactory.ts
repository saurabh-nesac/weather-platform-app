import type { Renderer } from "./Renderer";

import type { RenderContext } from "./RenderContext";

import type { RenderMode } from "@/core/state/types";

import { RasterRenderer } from "./raster/RasterRenderer";
import { ContourRenderer } from "./contour/ContourRenderer";

import { webGLRendererFactory } from "./WebGLRendererFactory";

export class RendererFactory {

    create(

        mode: RenderMode,

        context: RenderContext

    ): Renderer {

        switch (mode) {

            case "raster":

                if (
                    context.backend === "webgl"
                ) {

                    return webGLRendererFactory.create(
                        context
                    );

                }

                return new RasterRenderer(

                    context.map,

                    context.canvas,

                    context.manifest

                );

            case "contour":

                return new ContourRenderer(

                    context.map,

                    context.canvas,

                    context.manifest,

                    context.config

                );

            default:

                throw new Error(
                    `Unsupported renderer '${mode}'.`
                );

        }

    }

}

export const rendererFactory =
    new RendererFactory();