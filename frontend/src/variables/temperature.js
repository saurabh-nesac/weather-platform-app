export default {

    id: 'temperature',

    label: 'Temperature',

    units: '°C',

    scaling: {

        min: -10,

        max: 45
    },

    texture: {

        transparentBelow: null,

        smoothing: false
    },

    shader: 'thermal',

    colormap: 'thermal'
};