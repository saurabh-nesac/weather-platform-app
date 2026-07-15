// frontend-react/src/rendering/visualization/VisualizationFactory.ts
import { RenderMode } from "@/core/state/types";

import { RenderSurface } from "../surface/RenderSurface";

import { Visualization } from "./Visualization";
import { RasterVisualization } from "./RasterVisualization";
import { ContourVisualization } from "./ContourVisualization";
import { StreamlineVisualization } from "./StreamlineVisualization";
import { VectorVisualization } from "./VectorVisualization";
import { RenderContext } from "../RenderContext";

export class VisualizationFactory {

    static create(
        mode: RenderMode,
        surface: RenderSurface,
        context?: RenderContext
    ): Visualization {

        let visualization: Visualization;

        switch (mode) {

            case "raster":

                visualization = new RasterVisualization(
                    surface
                );

                break;

            case "contour":

                visualization = new ContourVisualization(
                    surface
                );

                break;

            default:

                throw new Error(
                    `Unknown visualization: ${mode}`
                );

        }

        if (context) {
            visualization.setContext(context);
        }

        return visualization;

    }

}

export const visualizationFactory = new VisualizationFactory();