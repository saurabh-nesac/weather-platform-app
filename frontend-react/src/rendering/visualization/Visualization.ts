// frontend-react/src/rendering/visualization/Visualization.ts
import { RasterFrame } from "@/core/datasets/datasetTypes";
import { RenderSurface } from "../surface/RenderSurface";
import { RenderContext } from "../RenderContext";

export interface Visualization {

    readonly id: string;

    setContext(context: RenderContext): void;

    renderFrame(
        frame: RasterFrame
    ): void | Promise<void>;

    draw(): void;

    resize(): void;

    dispose(): void;

}