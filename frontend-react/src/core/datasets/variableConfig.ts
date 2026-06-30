// frontend-react/src/core/datasets/variableConfig.ts
export interface VariableConfig {
folder: string;
prefix: string;
}

export const VARIABLE_CONFIG: Record<
    string,
    VariableConfig
> = {

    T2: {
        folder: "t2",
        prefix: "temp",
    },

    RAIN: {
        folder: "rain",
        prefix: "rain",
    },

    WIND10: {
        folder: "wind",
        prefix: "wind",
    },

    TEMP_850: {
        folder: "temp_850",
        prefix: "temp",
    },

    TEMP_700: {
        folder: "temp_700",
        prefix: "temp",
    },

    TEMP_500: {
        folder: "temp_500",
        prefix: "temp",
    },

    TEMP_300: {
        folder: "temp_300",
        prefix: "temp",
    },

    TEMP_250: {
        folder: "temp_250",
        prefix: "temp",
    },

    TEMP_200: {
        folder: "temp_200",
        prefix: "temp",
    },
    TEMP_1000: {
        folder: "temp_1000",
        prefix: "temp",
    },

    TEMP_925: {
        folder: "temp_925",
        prefix: "temp",
    },

    GPM: {
        folder: "gpm",
        prefix: "gpm",
    },

    BIAS: {
        folder: "bias",
        prefix: "bias",
    },

    ABS_ERROR: {
        folder: "abs_error",
        prefix: "error",
    },
};