
// frontend-react/src/core/state/atmosStore.ts
import { create } from "zustand";
import {
    AtmosState,
    Point,
    PressureLevel,
    RenderMode,
} from "./types";
import { BasemapType } from "../../maps/basemaps";
import { DEFAULT_RENDERER_CONFIG, RendererConfig } from "@/rendering/RendererConfig";

interface AtmosActions {
    
    updateContourConfig(

        config:
            Partial<
                RendererConfig["contour"]
            >

    ): void;
    setPressureLevel: (
        level: PressureLevel
    ) => void;

    setVariable: (
        variable: string
    ) => void;
    setBasemap: (
        basemap: BasemapType
    ) => void;
    setFrame: (
        frame: number
    ) => void;

    setOpacity: (
        opacity: number
    ) => void;

    setSelectedPoint: (
        point: Point | null
    ) => void;

    setSelectedBasin: (
        basin: string | null
    ) => void;

    setRenderMode: (
        mode: RenderMode
    ) => void;
    setPlaying: (
        playing: boolean
    ) => void;

    reset: () => void;
}

type Store =
    AtmosState &
    AtmosActions;

const initialState: AtmosState = {

    variable: "TEMP",

    pressureLevel: "surface",

    basemap: "dark",

    frame: 0,

    opacity: 1,

    selectedPoint: null,

    selectedBasin: null,

    renderMode: "raster",

    playing: false,
    rendererConfig:
        DEFAULT_RENDERER_CONFIG,

};

export const useAtmosStore =
    create<Store>((set) => ({
        ...initialState,
        updateContourConfig:
            (config) =>

                set((state) => ({

                    rendererConfig: {

                        ...state.rendererConfig,

                        contour: {

                            ...state.rendererConfig.contour,

                            ...config,

                        },

                    },

                })),

        setPressureLevel: (
            pressureLevel
        ) =>
            set({
                pressureLevel,
            }),
        setVariable: (variable) =>
            set({ variable }),

        setBasemap: (
            basemap
        ) =>
            set({
                basemap,
            }),
        setFrame: (frame) =>
            set({ frame }),

        setOpacity: (opacity) =>
            set({ opacity }),

        setSelectedPoint: (
            selectedPoint
        ) => set({ selectedPoint }),

        setSelectedBasin: (
            selectedBasin
        ) => set({ selectedBasin }),

        setRenderMode: (
            renderMode
        ) => set({ renderMode }),

        setPlaying: (
            playing
        ) =>
            set({
                playing,
            }),


        reset: () =>
            set(initialState),
    }));