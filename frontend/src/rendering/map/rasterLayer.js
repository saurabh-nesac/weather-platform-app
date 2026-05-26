const variableConfig =

    VARIABLES[
        store.currentVariable
    ];

renderRaster({

    texture,

    shader:
        variableConfig.shader,

    colormap:
        variableConfig.colormap,

    scaling:
        variableConfig.scaling,

    opacity:
        store.opacity
});