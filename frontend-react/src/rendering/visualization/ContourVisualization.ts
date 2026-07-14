import { RasterFrame } from "@/core/datasets/datasetTypes";
import { Visualization } from "./Visualization";
import { RenderSurface } from "../surface/RenderSurface";

export class ContourVisualization
    implements Visualization {

    readonly id = "contour";

    constructor(
        private readonly surface: RenderSurface
    ) { }

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