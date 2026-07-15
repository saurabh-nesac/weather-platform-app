// frontend-react/src/rendering/layers/AtmosphericLayer.ts
import type {
    CustomLayerInterface,
    Map,
} from "maplibre-gl";
import { Visualization } from "../visualization/Visualization";

export class AtmosphericLayer
    /**
     * MapLibre LifeCycle
     */
    implements CustomLayerInterface {

    id = "atmos-layer";

    type: "custom" = "custom";

    renderingMode: "2d" = "2d";

    private gl!: WebGL2RenderingContext;

    private program!: WebGLProgram;

    private vao!: WebGLVertexArrayObject;

    private visualization: Visualization | null =
        null;

    setVisualization(
        visualization: Visualization
    ) {

        this.visualization = visualization;

    }

    onAdd(

        _map: Map,

        gl: WebGLRenderingContext | WebGL2RenderingContext

    ): void {

        this.gl =
            gl as WebGL2RenderingContext;

        console.log(
            "Custom layer attached."
        );


    }
    render() {

        this.visualization?.draw();

    }
}

