// frontend-react/src/rendering/surface/SurfaceManager.ts

import { RenderBackend } from "../RenderBackend";

import { RenderSurface } from "./RenderSurface";
import { CanvasSurface } from "./CanvasSurface";
import { WebGLSurface } from "./WebGLSurface";

export class SurfaceManager {

    /**
     * Currently active rendering surface.
     */
    private surface: RenderSurface | null = null;

    /**
     * Create (or replace) the rendering surface.
     */
    create(

        backend: RenderBackend,

        canvas: HTMLCanvasElement

    ): RenderSurface {

        //
        // Dispose the previous surface.
        //
        this.surface?.dispose();

        switch (backend) {

            case "canvas":

                this.surface =
                    new CanvasSurface(
                        canvas
                    );

                break;

            case "webgl":

                this.surface =
                    new WebGLSurface(
                        canvas
                    );

                break;

            default:

                throw new Error(
                    `Unsupported backend: ${backend}`
                );

        }

        return this.surface;

    }

    /**
     * Active rendering surface.
     */
    getSurface(): RenderSurface {

        if (!this.surface) {

            throw new Error(
                "Surface has not been created."
            );

        }

        return this.surface;

    }

    /**
     * Resize active surface.
     */
    resize(): void {

        this.surface?.resize();

    }

    /**
     * Clear active surface.
     */
    clear(): void {

        this.surface?.clear();

    }

    /**
     * Dispose active surface.
     */
    dispose(): void {

        this.surface?.dispose();

        this.surface = null;

    }

}

/**
 * Global surface manager.
 */
export const surfaceManager =
    new SurfaceManager();