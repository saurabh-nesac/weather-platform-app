export default {

    id: 'humidity',

    label: 'Humidity',

    units: '%',

    scaling: {

        min: 0,

        max: 100
    },

    processing: {

        blur: {

            enabled: false,

            radius: 1
        }
    },

    texture: {

        transparentBelow: null,

        smoothing: true
    },

    shader: 'thermal',

    colormap: 'humidity'
};