// frontend-react/src/rendering/visualization/Visualization.ts
import { RasterFrame } from "@/core/datasets/datasetTypes";
import { RenderSurface } from "../surface/RenderSurface";

export interface Visualization {

    readonly id: string;

    renderFrame(
        frame: RasterFrame
    ): void | Promise<void>;

    draw(): void;

    resize(): void;

    dispose(): void;

}