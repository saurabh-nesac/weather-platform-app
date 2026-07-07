export class WebGLContextManager {

    constructor(
        private readonly canvas: HTMLCanvasElement
    ) { }

    getContext(): WebGL2RenderingContext;

    dispose(): void;

}