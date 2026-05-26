//src\core\state\store.js

export const store = {

    app: {

        loaded: false,

        currentFrame: 1,

        currentVariable: 'rain',

        playing: false
    },

    rendering: {

        opacity: 1.0
    },

    processing: {

        blur: {

            enabled: true,

            mode: 'gaussian',

            radius: 1
        },

        maxFilter: {

            enabled: false
        },

        neighborhoodMax: {

            enabled: false
        }
    },

    metadata: {

        WIDTH_WRF: 0,

        HEIGHT_WRF: 0,

        lat: [],

        lon: []
    },

    cache: {

        frames: {},

        contours: {},

        metadata: {}
    },
    progress:{
        visible:false,
        progress:0,
        text:'',
        stages:{
            network:0,
            decode:0,
            textUpload:0,
            shaderCompile:0,
        }
    }

};