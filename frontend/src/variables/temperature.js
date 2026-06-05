export default {

    id: 'temperature',

    filePrefix: 'temp',

    label: 'Temperature',

    units: '°C',

    scaling: {

        min: -10,

        max: 45
    },

    processing: {

        blur: {

            enabled: false,

            radius: 1
        }
    },

    texture: {

        transparentBelow: null,

        smoothing: false
    },

    shader: 'thermal',

    colormap: 'thermal'
};