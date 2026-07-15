// frontend-react/src/rendering/visualization/VisualizationFactory.ts
import { RenderMode } from "@/core/state/types";

import { RenderSurface } from "../surface/RenderSurface";

import { Visualization } from "./Visualization";
import { RasterVisualization } from "./RasterVisualization";
import { ContourVisualization } from "./ContourVisualization";
import { StreamlineVisualization } from "./StreamlineVisualization";
import { VectorVisualization } from "./VectorVisualization";

export class VisualizationFactory {

    static create(
        mode: RenderMode,
        surface: RenderSurface
    ): Visualization {

        switch (mode) {

            case "raster":

                return new RasterVisualization(
                    surface, 
                );

            case "contour":

                return new ContourVisualization(
                    surface
                );

            default:

                throw new Error(
                    `Unknown visualization: ${mode}`
                );

        }

    }

}export const visualizationFactory = new VisualizationFactory();