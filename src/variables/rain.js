export default {

    id: 'rain',

    label: 'Rainfall',

    units: 'mm/hr',

    scaling: {

        min: 0,

        max: 30
    },

    processing: {

        blur: {

            enabled: true,

            radius: 1
        }
    },
    colormap: 'rain',
    time:{
        
    }
};