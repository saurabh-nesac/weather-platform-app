// frontend-react/src/rendering/surface/CanvasSurface.ts

import { RenderSurface } from "./RenderSurface";

export class CanvasSurface
    implements RenderSurface {

    readonly backend = "canvas";

    readonly ctx:
        CanvasRenderingContext2D;

    constructor(
        public readonly canvas: HTMLCanvasElement
    ) {

        const ctx =
            canvas.getContext("2d");

        if (!ctx) {

            throw new Error(
                "Unable to create Canvas2D context."
            );

        }

        this.ctx = ctx;

        this.resize();

    }

    resize(): void {

        if (

            this.canvas.width !==
            this.canvas.clientWidth ||

            this.canvas.height !==
            this.canvas.clientHeight

        ) {

            this.canvas.width =
                this.canvas.clientWidth;

            this.canvas.height =
                this.canvas.clientHeight;

        }

    }

    clear(): void {

        this.ctx.clearRect(

            0,

            0,

            this.canvas.width,

            this.canvas.height

        );

    }

    dispose(): void {

        //
        // Nothing to dispose.
        //

    }

}