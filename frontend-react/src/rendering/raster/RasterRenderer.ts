// src/rendering/raster/RasterRenderer.ts
import {
    sampleTemperatureColor
} from "../colors/temperature";
import type { DatasetManifest, RasterFrame } from "../../core/datasets/datasetTypes";
import maplibregl from "maplibre-gl";

export class RasterRenderer {
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
        if(!framefetched.data)
            return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;


        const width = manifest.width;
        const height = manifest.height;



        const data = framefetched.data

        console.log(
            data[0],
            data[1000]
        );

        let min = Infinity;
        let max = -Infinity;

        for (const v of data) {
            if (v < min) min = v;
            if (v > max) max = v;
        }

        const image = new ImageData(width, height);

        for (let i = 0; i < data.length; i++) {
            const value = data[i];

            const range = max - min || 1;

            const n =
                (value - min) /
                range;

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
                value <= 0
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

        console.log('clientHeight: ', canvas.clientHeight)
        canvas.width = canvas.clientWidth;
        console.log('clientWidth: ', canvas.clientWidth)
        canvas.height = canvas.clientHeight;

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        console.log('bbox', manifest.bbox);

        const bbox = manifest.bbox;

        console.log(map)

        const nw = map.project([
            bbox[0],
            bbox[3]
        ]);

        const se = map.project([
            bbox[2],
            bbox[1]
        ]);

        console.log(
            "bbox",
            bbox
        );

        console.log(
            "canvas",
            canvas.width,
            canvas.height
        );

        console.log(
            "nw",
            nw
        );

        console.log(
            "se",
            se
        );
        console.log(
            "canvas",
            canvas.width,
            canvas.height
        );

        console.log(
            "draw size",
            se.x - nw.x,
            se.y - nw.y
        );
        ctx.save();

        ctx.scale(1, -1);

        ctx.drawImage(
            tmp,
            nw.x,
            -se.y,
            se.x - nw.x,
            se.y - nw.y
        );

        ctx.restore();

        ctx.strokeStyle = "red";
        ctx.lineWidth = 4;

        ctx.strokeRect(
            nw.x,
            nw.y,
            se.x - nw.x,
            se.y - nw.y
        );

        console.log(nw);
        console.log(se);

        console.log("Rendered frame", framefetched);
    }

}