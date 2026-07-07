// frontend-react/src/rendering/webgl/shaders/RainShader.ts

import type {
    DatasetManifest,
    RasterFrame,
} from "@/core/datasets/datasetTypes";

import type {
    RendererConfig,
} from "@/rendering/RendererConfig";

import type {
    ShaderModule,
} from "../ShaderModule";

export class RainShader
    implements ShaderModule {

    readonly id = "rain";

    readonly vertexSource = `#version 300 es

layout(location = 0)
in vec2 aPosition;

out vec2 vTexCoord;

void main() {

    vTexCoord =
        (aPosition + 1.0) * 0.5;

    gl_Position =
        vec4(
            aPosition,
            0.0,
            1.0
        );

}
`;

    readonly fragmentSource = `#version 300 es

precision highp float;

uniform sampler2D uRaster;

uniform float uMin;
uniform float uMax;
uniform float uThreshold;
uniform float uOpacity;

in vec2 vTexCoord;

out vec4 outColor;

void main() {

    float value =
        texture(
            uRaster,
            vec2(
                vTexCoord.x,
                1.0 - vTexCoord.y
            )
        ).r;

    if (
        value < uThreshold
    ) {

        discard;

    }

    float t = clamp(

        (value - uMin) /

        (uMax - uMin),

        0.0,

        1.0

    );

    //
    // Phase 1:
    // grayscale
    //

    outColor = vec4(

        vec3(t),

        uOpacity

    );

}
`;

    private uMin: WebGLUniformLocation | null = null;

    private uMax: WebGLUniformLocation | null = null;

    private uThreshold: WebGLUniformLocation | null = null;

    private uOpacity: WebGLUniformLocation | null = null;

    private uRaster: WebGLUniformLocation | null = null;

    initialize(

        gl: WebGL2RenderingContext,

        program: WebGLProgram

    ): void {

        this.uRaster =
            gl.getUniformLocation(
                program,
                "uRaster"
            );

        this.uMin =
            gl.getUniformLocation(
                program,
                "uMin"
            );

        this.uMax =
            gl.getUniformLocation(
                program,
                "uMax"
            );

        this.uThreshold =
            gl.getUniformLocation(
                program,
                "uThreshold"
            );

        this.uOpacity =
            gl.getUniformLocation(
                program,
                "uOpacity"
            );

    }

    bindUniforms(

        gl: WebGL2RenderingContext,

        _program: WebGLProgram,

        _frame: RasterFrame,

        manifest: DatasetManifest,

        config: RendererConfig

    ): void {

        gl.uniform1i(
            this.uRaster,
            0
        );

        gl.uniform1f(
            this.uMin,
            manifest.min
        );

        gl.uniform1f(
            this.uMax,
            manifest.max
        );

        gl.uniform1f(
            this.uThreshold,
            config.contour.threshold
        );

        gl.uniform1f(
            this.uOpacity,
            1.0
        );

    }

    supports(
        variable: string
    ): boolean {

        return (
            variable === "RAIN"
        );

    }

}