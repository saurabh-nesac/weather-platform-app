// frontend-react/src/rendering/RendererFactory.ts

import maplibregl from "maplibre-gl";

import { DatasetManifest } from "@/core/datasets/datasetTypes";
import { RenderMode } from "@/core/state/types";

import { Renderer } from "./Renderer";
import { RasterRenderer } from "./raster/RasterRenderer";
import { ContourRenderer } from "./contour/ContourRenderer";
import { RendererConfig } from "./RendererConfig";
export function createRenderer(

    mode: RenderMode,

    map: maplibregl.Map,

    canvas: HTMLCanvasElement,

    manifest: DatasetManifest,

    config: RendererConfig

): Renderer {

    switch (mode) {

        case "raster":

            return new RasterRenderer(
                map,
                canvas,
                manifest
            );

        case "contour":

            return new ContourRenderer(
                map,
                canvas,
                manifest,
                config
            );

        default:

            throw new Error("Unknown renderer");
    }

}