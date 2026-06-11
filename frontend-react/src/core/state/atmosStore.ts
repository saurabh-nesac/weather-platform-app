// frontend-react/src/core/state/atmosStore.ts
import { create } from "zustand";
import {
    AtmosState,
    Point,
    RenderMode,
} from "./types";

interface AtmosActions {


    setVariable: (
        variable: string
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

    variable: "T2",

    frame: 0,

    opacity: 1,

    selectedPoint: null,

    selectedBasin: null,

    renderMode: "raster",
    playing: false,

};

export const useAtmosStore =
    create<Store>((set) => ({
        ...initialState,

        setVariable: (variable) =>
            set({ variable }),

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