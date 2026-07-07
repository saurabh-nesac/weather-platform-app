// frontend-react/src/rendering/RenderContext.ts

import maplibregl from "maplibre-gl";

import type {
    DatasetManifest,
} from "@/core/datasets/datasetTypes";

import type {
    RendererConfig,
} from "./RendererConfig";
import { RenderBackend } from "./RenderBackend";

/**
 * Immutable rendering environment shared by all renderers.
 *
 * Frame-specific state (RasterFrame), caches, textures, etc.
 * are intentionally NOT stored here.
 */
export interface RenderContext {

    /**
     * MapLibre instance used for projection.
     */
    readonly map: maplibregl.Map;

    /**
     * Target rendering canvas.
     */
    readonly canvas: HTMLCanvasElement;

    /**
     * Dataset metadata.
     */
    readonly manifest: DatasetManifest;

    /**
     * Rendering configuration.
     */
    readonly config: RendererConfig;
    readonly backend: RenderBackend;

    /**
     * Optional WebGL context.
     *
     * Undefined for Canvas2D renderers.
     */
    readonly gl?: WebGL2RenderingContext;

}

