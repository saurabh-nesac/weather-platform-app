// frontend-react/src/rendering/RenderBackend.ts

/**
 * Rendering backend.
 *
 * canvas:
 *   HTML Canvas 2D renderer.
 *
 * webgl:
 *   GPU accelerated renderer.
 */
export type RenderBackend =
    | "canvas"
    | "webgl";

/**
 * Default backend.
 *
 * Canvas is currently the safest default
 * until every variable has a WebGL shader.
 */
export const DEFAULT_RENDER_BACKEND: RenderBackend =
    "canvas";

/**
 * Utility helpers.
 */
export const RenderBackends = {

    Canvas: "canvas" as const,

    WebGL: "webgl" as const,

};