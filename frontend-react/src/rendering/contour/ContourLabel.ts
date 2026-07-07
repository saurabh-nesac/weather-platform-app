// frontend-react/src/rendering/contour/ContourLabel.ts

import maplibregl from "maplibre-gl";

import {
    ContourPolyline,
} from "./ContourBuilder";

export interface ContourLabelOptions {

    font?: string;

    fillStyle?: string;

    strokeStyle?: string;

    lineWidth?: number;

    every?: number;

}

const DEFAULT_OPTIONS: Required<ContourLabelOptions> = {

    font: "11px sans-serif",

    fillStyle: "#ffffff",

    strokeStyle: "#000000",

    lineWidth: 3,

    every: 4,

};

export function drawContourLabels(

    ctx: CanvasRenderingContext2D,

    map: maplibregl.Map,

    polylines: ContourPolyline[],

    level: number,

    bbox: [number, number, number, number],

    width: number,

    height: number,

    options: ContourLabelOptions = {}

) {

    const cfg = {

        ...DEFAULT_OPTIONS,

        ...options,

    };

    ctx.save();

    ctx.font = cfg.font;

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    let count = 0;

    for (const polyline of polylines) {
        

        // if (
        //     polyline.length < 2
        // ) {
        //     continue;
        // }

        //
        // don't label every contour
        //
        // if (
        //     count++ % cfg.every !== 0
        // ) {
        //     continue;
        // }

        const mid = Math.floor(polyline.length / 2);

        const pt = polyline[mid];

        const lon = bbox[0] + pt.x / (width - 1) * (bbox[2] - bbox[0]);

        const lat = bbox[1] + pt.y / (height - 1) * (bbox[3] - bbox[1]);

        const screen = map.project([lon, lat,]);

        const text = level.toString();

        ctx.strokeStyle = cfg.strokeStyle;

        ctx.lineWidth = cfg.lineWidth;

        ctx.strokeText(text, screen.x, screen.y);

        ctx.fillStyle = cfg.fillStyle;

        ctx.fillText(text, screen.x, screen.y);

    }

    ctx.restore();

}