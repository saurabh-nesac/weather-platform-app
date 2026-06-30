// frontend-react/src/rendering/contour/ContourLabel.ts

import maplibregl from "maplibre-gl";

import type {
    ContourSegment,
} from "./MarchingSquares";

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

    every: 40,

};

export function drawContourLabels(

    ctx: CanvasRenderingContext2D,

    map: maplibregl.Map,

    segments: ContourSegment[],

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

    for (

        let i = 0;

        i < segments.length;

        i += cfg.every

    ) {

        const s = segments[i];

        const mx =

            (s.a.x + s.b.x) * 0.5;

        const my =

            (s.a.y + s.b.y) * 0.5;

        const lon =

            bbox[0] +

            mx /

            (width - 1)

            *

            (bbox[2] - bbox[0]);

        const lat =

            bbox[1] +

            my /

            (height - 1)

            *

            (bbox[3] - bbox[1]);

        const p = map.project([

            lon,

            lat,

        ]);

        const text =

            level.toString();

        ctx.strokeStyle =

            cfg.strokeStyle;

        ctx.lineWidth =

            cfg.lineWidth;

        ctx.strokeText(

            text,

            p.x,

            p.y

        );

        ctx.fillStyle =

            cfg.fillStyle;

        ctx.fillText(

            text,

            p.x,

            p.y

        );

    }

    ctx.restore();

}