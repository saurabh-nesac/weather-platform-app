// src/rendering/raster/RasterRenderer.ts
import {
    sampleTemperatureColor
} from "../colors/temperature";
import type { DatasetManifest, RasterFrame } from "../../core/datasets/datasetTypes";
import maplibregl, { validate } from "maplibre-gl";
import { Renderer } from "../Renderer";

export class RasterRenderer implements Renderer {
    constructor(
        private map: maplibregl.Map,
        private canvas: HTMLCanvasElement,
        private manifest: DatasetManifest
    ) {  }
    private currentFrame: RasterFrame | null = null

    async renderFrame(
        frame: RasterFrame
    ) {
        this.currentFrame = frame;
        this.draw();
    }
    draw() {
        
        const canvas = this.canvas;
        const manifest = this.manifest;
        const map = this.map;
        
        const framefetched = this.currentFrame
        if(!framefetched)
            return;

        const data = framefetched.data

        const ctx = canvas.getContext("2d");
        if (!ctx) return;


        const width = manifest.width;
        const height = manifest.height;


        // let min = Infinity;
        // let max = -Infinity;
        const min = manifest.min;
        const max = manifest.max;

        const image = new ImageData(width, height);

        for (let i = 0; i < data.length; i++) {
            const value = data[i];

            const [r, g, b] =
                sampleTemperatureColor(
                    value,
                    min,
                    max
                );

            image.data[i * 4 + 0] = r;
            image.data[i * 4 + 1] = g;
            image.data[i * 4 + 2] = b;

            if (
                framefetched.variable === "RAIN" &&
                value <= 0.1
            ) {
                image.data[i * 4 + 3] = 0;
                continue;
            }
            image.data[i * 4 + 3] = 180;
        }

        const tmp = document.createElement("canvas");

        tmp.width = width;
        tmp.height = height;

        const tctx = tmp.getContext("2d");
        if (!tctx) return;

        tctx.putImageData(image, 0, 0);

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        const bbox = manifest.bbox;


        const nw = map.project([
            bbox[0],
            bbox[3]
        ]);

        const se = map.project([
            bbox[2],
            bbox[1]
        ]);




        ctx.save();

        ctx.scale(1, -1);

        ctx.drawImage(
            tmp,
            nw.x,
            -se.y,
            se.x - nw.x,
            se.y - nw.y
        );
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 4;

        ctx.strokeRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
        ctx.restore();



    }

}