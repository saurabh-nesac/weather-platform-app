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

    private drawSegments(

        ctx: CanvasRenderingContext2D,
        segments: ContourSegment[],
        color: string,
        width: number

    ) {

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;

        for (const s of segments) {
            const a = this.gridToScreen(
                s.a.x,
                s.a.y
            );

            const b = this.gridToScreen(
                s.b.x,
                s.b.y
            );

            ctx.moveTo(a.x, a.y);

            ctx.lineTo(b.x, b.y);

        }

        ctx.stroke();

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
        const interval = this.config.contour.interval;

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
        for (const level of levels) {

            const segments = marchingSquares(
                this.currentFrame.data,
                this.manifest.width,
                this.manifest.height,
                level
            );

            const major =

                level %

                (
                    interval *
                    this.config.contour.majorMultiplier
                )

                === 0;

            this.drawSegments(

                ctx,

                segments,

                this.contourColor(
                    level,
                    major
                ),

                major
                    ? this.config.contour.lineWidth *
                    this.config.contour.majorMultiplier
                    : this.config.contour.lineWidth

            )
            if (
                this.config.contour.showLabels
            ) {

                drawContourLabels(

                    ctx,

                    this.map,

                    segments,

                    level,

                    this.manifest.bbox,

                    this.manifest.width,

                    this.manifest.height

                );

            }

        }

    }

}