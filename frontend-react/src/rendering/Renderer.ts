// frontend-react/src/rendering/Renderer.ts
import { RasterFrame } from "@/core/datasets/datasetTypes";

export interface Renderer {

    renderFrame(
        frame: RasterFrame
    ): void;

    draw(): void;

    dispose?(): void;

}