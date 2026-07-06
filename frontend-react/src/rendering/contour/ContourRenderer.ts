// frontend-react/src/rendering/contour/ContourRenderer.ts
import {
    sampleTemperatureColor,
} from "../colors/temperature";
import maplibregl from "maplibre-gl";

import type {
    DatasetManifest,
    RasterFrame,
} from "@/core/datasets/datasetTypes";

import type { Renderer } from "../Renderer";
import { ContourSegment, marchingSquares } from "./MarchingSquares";
import { RendererConfig } from "../RendererConfig";
import { drawContourLabels } from "./ContourLabel";
import { buildPolylines, ContourPolyline } from "./ContourBuilder";
import { chaikin } from "./ContourSmoother";

export class ContourRenderer
    implements Renderer {

    constructor(
        private map: maplibregl.Map,
        private canvas: HTMLCanvasElement,
        private manifest: DatasetManifest,
        private config: RendererConfig,
        private currentFrame: RasterFrame | null = null
    ) { }

    renderFrame(
        frame: RasterFrame
    ) {
        this.currentFrame = frame;
        this.draw();
    }

    private contourColor(
        level: number,
        major: boolean
    ): string {

        switch (
        this.config.contour.colorScheme
        ) {

            case "single":
                return major
                    ? "#ff0000"
                    : "#00ff00";

            case "grayscale":
                return major
                    ? "#ffffff"
                    : "#888888";

            case "temperature": {

                const [r, g, b] =
                    sampleTemperatureColor(level, this.manifest.min, this.manifest.max);

                return `rgb(${r}, ${g}, ${b})`;

            }

            case "rainbow": {

                const t = (level - this.manifest.min) / (this.manifest.max - this.manifest.min);
                const hue = (1 - t) * 240;
                return `hsl(${hue}, 100%, ${major ? "45%" : "55%"})`;

            }

            default:
                return "#ffffff";

        }

    }

    private drawPolylines(

        ctx: CanvasRenderingContext2D,

        polylines: ContourPolyline[],

        color: string,

        width: number

    ) {

        ctx.save();

        ctx.strokeStyle = color;

        ctx.lineWidth = width;

        ctx.lineJoin = "round";

        ctx.lineCap = "round";

        ctx.beginPath();

        for (const polyline of polylines) {

            if (
                polyline.length < 2
            ) {
                continue;
            }

            const start =
                this.gridToScreen(

                    polyline[0].x,

                    polyline[0].y

                );

            ctx.moveTo(
                start.x,
                start.y
            );

            for (
                let i = 1;
                i < polyline.length;
                i++
            ) {

                const p =
                    this.gridToScreen(

                        polyline[i].x,

                        polyline[i].y

                    );

                ctx.lineTo(
                    p.x,
                    p.y
                );

            }

        }

        ctx.stroke();

        ctx.restore();

    }
    private gridToScreen(
        x: number,
        y: number
    ) {

        const bbox =
            this.manifest.bbox;

        const lon =
            bbox[0] +
            x /
            (this.manifest.width - 1)
            *
            (
                bbox[2] -
                bbox[0]
            );

        const lat =
            bbox[1] +
            y /
            (this.manifest.height - 1) *
            (bbox[3] - bbox[1]);
        return this.map.project([
            lon,
            lat
        ]);

    }

    private contourLevels(): number[] {

        const interval =
            this.config.contour.interval;

        const levels: number[] = [];

        const min =
            Math.floor(
                this.manifest.min / interval
            ) * interval;

        const max =
            Math.ceil(
                this.manifest.max / interval
            ) * interval;

        for (

            let l = min;

            l <= max;

            l += interval

        ) {

            levels.push(l);

        }

        return levels;

    }

    draw() {

        if (!this.currentFrame)
            return;

        const ctx = this.canvas.getContext("2d");

        if (!ctx)
            return;

        ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        
        const interval =
            this.config.contour.interval;
        const threshold =
            this.config.contour.threshold;
        const levels =
            this.contourLevels();
        for (const level of levels) {

            if (level < threshold) {
                continue;
            }


            const major = level % (interval * this.config.contour.majorMultiplier) === 0;



            const segments =
                marchingSquares(
                    this.currentFrame.data,
                    this.manifest.width,
                    this.manifest.height,
                    level,
                    threshold
                );

            const polylines = buildPolylines(segments);
            
            const smooth =
                polylines.map(
                    p => chaikin(
                        p,
                        this.config.contour.smoothingIterations
                    )
                );


            this.drawPolylines(
                ctx,
                smooth,
                this.contourColor(level, major),
                major ? this.config.contour.lineWidth * this.config.contour.majorMultiplier
                    : this.config.contour.lineWidth);

            if (
                this.config.contour.showLabels
            ) {

                drawContourLabels(

                    ctx,

                    this.map,

                    smooth,

                    level,

                    this.manifest.bbox,

                    this.manifest.width,

                    this.manifest.height

                );

            }

        }

    }

}