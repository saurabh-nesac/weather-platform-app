//src/core/config/variables.js

export const BBOX = [87.32, 19.35, 99.03, 30.66];

export const VARIABLES = {

    rain: {
        key: "rain",
        name: "Rainfall",
        unit: "mm/hr",
        min: 0,
        max: 100,
        colormap: "rainbow"
    },

    temperature: {
        key: "temperature",
        name: "Temperature",
        unit: "°C",
        min: -10,
        max: 45,
        colormap: "temperature"
    },

    humidity: {
        key: "humidity",
        name: "Humidity",
        unit: "%",
        min: 0,
        max: 100,
        colormap: "humidity"
    },
};

