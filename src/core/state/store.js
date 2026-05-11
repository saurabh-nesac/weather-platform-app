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

        BLUR_MODE: 'linear',
        USE_NEIGH_MAX: false,
        USE_MAX_FILTER: false,
        GAUSS_RADIUS: 1
    },

    metadata: {

        WIDTH_WRF: 0,
        HEIGHT_WRF: 0,
        lat: [],
        lon: []
    },

    cache: {

        frames: {},
        contours: {}
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
    }
};

