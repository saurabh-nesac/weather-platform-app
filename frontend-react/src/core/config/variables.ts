// src/core/config/variables.ts

export const VARIABLES = [
    "T2",
    "RAIN",
    "WIND"
] as const;

export type Variable =
    typeof VARIABLES[number];