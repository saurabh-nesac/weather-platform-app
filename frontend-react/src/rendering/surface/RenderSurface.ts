// frontend-react/src/rendering/surface/RenderSurface.ts

import { RenderBackend } from "../RenderBackend";

export interface RenderSurface {

    /**
     * Rendering backend.
     */
    readonly backend: RenderBackend;

    /**
     * HTML canvas owned by this surface.
     */
    readonly canvas: HTMLCanvasElement;

    /**
     * Resize the drawing surface.
     */
    resize(): void;

    /**
     * Clear the surface.
     */
    clear(): void;

    /**
     * Free graphics resources.
     */
    dispose(): void;


}