// frontend-react/src/rendering/registerShaders.ts

import {
    rendererRegistry,
} from "./RendererRegistry";

import {
    RainShader,
} from "./webgl/shaders/RainShader";

/**
 * Register all built-in shader modules.
 *
 * Call this once during application startup.
 */
export function registerShaders(): void {

    rendererRegistry.register(

        new RainShader()

    );

}