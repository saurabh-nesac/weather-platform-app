// frontend-react/src/rendering/visualization/Visualization.ts
import { DatasetManifest, RasterFrame } from "@/core/datasets/datasetTypes";
import { RenderSurface } from "../surface/RenderSurface";

export interface Visualization {
    /**
     * Rendering algorithm and GPU Resource Ownership
     */
    readonly id: string;


    initialize(
        gl: WebGL2RenderingContext,
        manifest: DatasetManifest

    ): void;

    renderFrame(
        frame: RasterFrame,
        manifest: DatasetManifest
    ): void;

    draw(): void;

    resize(): void;

    dispose(): void;


}