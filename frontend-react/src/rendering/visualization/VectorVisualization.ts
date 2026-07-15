import { RasterFrame } from "@/core/datasets/datasetTypes";
import { Visualization } from "./Visualization";
import { RenderSurface } from "../surface/RenderSurface";
import { RenderContext } from "../RenderContext";

export class VectorVisualization
    implements Visualization {

    readonly id = "vector";

    private context: RenderContext | null = null;

    constructor(
        private readonly surface: RenderSurface
    ) { }

    setContext(context: RenderContext): void {
        this.context = context;
    }

    renderFrame(
        frame: RasterFrame
    ): void {

    }

    draw(): void {

    }

    resize(): void {

        this.surface.resize();

    }

    dispose(): void {

    }

}