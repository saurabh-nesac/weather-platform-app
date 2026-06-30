// frontend-react/src/core/datasets/resolveVariable.ts
export function resolveVariable(
    variable: string,
    pressureLevel:
        string | number
): string {

    if (
        variable === "TEMP"
    ) {

        if (
            pressureLevel ===
            "surface"
        ) {
            return "T2";
        }

        return `TEMP_${pressureLevel}`;
    }

    if (
        variable === "RAIN"
    ) {
        return "RAIN";
    }

    if (
        variable === "WIND"
    ) {

        if (
            pressureLevel ===
            "surface"
        ) {
            return "WIND10";
        }

        return `WIND_${pressureLevel}`;
    }

    if (variable === "GPM")
        return "GPM";

    if (variable === "BIAS")
        return "BIAS";

    if (variable === "ABS_ERROR")
        return "ABS_ERROR";

    throw new Error(
        `Unknown variable ${variable}`
    );
}