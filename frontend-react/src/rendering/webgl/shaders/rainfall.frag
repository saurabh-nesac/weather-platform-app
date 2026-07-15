//frontend-react/src/rendering/webgl/shaders/rainfall.frag

#version 300 es

precision highp float;

uniform sampler2D raster;

in vec2 uv;

out vec4 color;

void main() {

    float t =
        texture(
            raster,
            uv
        ).r;

    color =
        vec4(
            t,
            t,
            t,
            1.0
        );

}