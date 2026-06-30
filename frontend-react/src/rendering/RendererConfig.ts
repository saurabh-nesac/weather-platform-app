export type ContourColorScheme =
    | "temperature"
    | "grayscale"
    | "rainbow"
    | "single";
export interface RendererConfig {

    contour: {

        interval: number;

        lineWidth: number;

        majorMultiplier: number;

        showLabels: boolean;

        colorScheme: ContourColorScheme;

    };

}

export const DEFAULT_RENDERER_CONFIG: RendererConfig = {

    contour: {

        interval: 5,

        lineWidth: 1,

        majorMultiplier: 2,

        showLabels: false,

        colorScheme: "temperature",

    },

   

};