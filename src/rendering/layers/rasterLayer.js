render(gl, args) {

    renderRaster({

        gl,

        matrix:
            args.defaultProjectionData.mainMatrix,

        texture:
            this.texture,

        shader:
            this.shader,

        scaling:
            this.scaling,

        opacity:
            store.opacity
    });
}