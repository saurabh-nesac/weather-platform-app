import { BBOX } from '@/core/config/variables.js';
import maplibregl from "maplibre-gl";

export const vs = `
                    attribute vec2 a_pos;
                    uniform mat4 u_matrix;
                    uniform vec2 u_min;
                    uniform vec2 u_max;
                    varying vec2 v_uv;

                    void main() {
                        v_uv = (a_pos - u_min) / (u_max - u_min);
                        gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);
                    }`;

export const fs = `
                    precision highp float;

                    uniform sampler2D u_wrf;

                    varying vec2 v_uv;

                    vec3 colorMap(float t) {
                        if (t < 0.15) return mix(vec3(0.0), vec3(0.0,0.2,1.0), t/0.15);
                        else if (t < 0.3) return mix(vec3(0.0,0.2,1.0), vec3(0.0,1.0,1.0), (t-0.15)/0.15);
                        else if (t < 0.5) return mix(vec3(0.0,1.0,1.0), vec3(0.0,1.0,0.0), (t-0.3)/0.2);
                        else if (t < 0.7) return mix(vec3(0.0,1.0,0.0), vec3(1.0,1.0,0.0), (t-0.5)/0.2);
                        else return mix(vec3(1.0,1.0,0.0), vec3(1.0,0.0,0.0), (t-0.7)/0.3);
                    }

                    void main() {
                        float t;

                        vec2 uv = v_uv;
                        t = texture2D(u_wrf, uv).r;

                        vec3 color = colorMap(t);
                        float alpha = smoothstep(0.01, 0.2, t);

                        gl_FragColor = vec4(color, alpha);
                    }`;

