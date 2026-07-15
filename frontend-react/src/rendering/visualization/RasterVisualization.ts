// frontend-react/src/rendering/visualization/RasterVisualization.ts
import { RasterFrame } from "@/core/datasets/datasetTypes";
import { Visualization } from "./Visualization";
import { RenderSurface } from "../surface/RenderSurface";
import { RenderContext } from "../RenderContext";
import { sampleTemperatureColor } from "../colors/temperature";
import maplibregl from "maplibre-gl";

export class RasterVisualization
    implements Visualization {

    readonly id = "raster";

    private context: RenderContext | null = null;
    private currentFrame: RasterFrame | null = null;

    constructor(
        private readonly surface: RenderSurface
    ) { }

    setContext(context: RenderContext): void {
        this.context = context;
    }

    renderFrame(
        frame: RasterFrame
    ): void {
        console.log('Rendering Frame !!')
        this.currentFrame = frame;
        this.draw();
    }

    draw(): void {
        console.log('Drwaing!!')
        if (!this.context || !this.currentFrame) {
            return;
        }

        const surface = this.surface as any;
        if (surface.backend !== "canvas" || !surface.ctx) {
            return;
        }

        const ctx = surface.ctx as CanvasRenderingContext2D;
        const canvas = this.surface.canvas;
        const manifest = this.context.manifest;
        const map = this.context.map;
        const frame = this.currentFrame;

        const data = frame.data;
        const width = manifest.width;
        const height = manifest.height;
        const min = manifest.min;
        const max = manifest.max;

        // Create RGBA ImageData
        const imageData = new ImageData(width, height);
        const pixelData = imageData.data;

        for (let i = 0; i < data.length; i++) {
            const value = data[i];

            // Sample color from temperature colormap
            const [r, g, b] = sampleTemperatureColor(
                value,
                min,
                max
            );

            pixelData[i * 4 + 0] = r;
            pixelData[i * 4 + 1] = g;
            pixelData[i * 4 + 2] = b;

            // Mask zero/invalid values for certain variables
            if (frame.variable === "RAIN" && value <= 0.1) {
                pixelData[i * 4 + 3] = 0;
            } else if (!isFinite(value)) {
                pixelData[i * 4 + 3] = 0;
            } else {
                pixelData[i * 4 + 3] = 180;
            }
        }

        // Create temporary canvas for the raster data
        const tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = width;
        tmpCanvas.height = height;

        const tmpCtx = tmpCanvas.getContext("2d");
        if (!tmpCtx) return;

        tmpCtx.putImageData(imageData, 0, 0);

        // Resize overlay canvas to match display size
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Get bounding box and project to screen coordinates
        const bbox = manifest.bbox;

        const nw = map.project([
            bbox[0],
            bbox[3]
        ]);

        const se = map.project([
            bbox[2],
            bbox[1]
        ]);

        // Draw the raster with coordinate transformation
        ctx.save();
        ctx.scale(1, -1);

        ctx.drawImage(
            tmpCanvas,
            nw.x,
            -se.y,
            se.x - nw.x,
            se.y - nw.y
        );

        ctx.restore();
    }

    resize(): void {
        this.surface.resize();
    }

    dispose(): void {

    }

}