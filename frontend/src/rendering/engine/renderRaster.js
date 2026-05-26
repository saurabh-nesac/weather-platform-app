export function renderRaster({

    gl,

    matrix,

    shader,

    uniforms,

    buffer,

    attributes,

    bounds
}) {

    gl.useProgram(shader);

    gl.uniformMatrix4fv(
        uniforms.u_matrix,
        false,
        matrix
    );

    gl.uniform1i(
        uniforms.u_wrf,
        0
    );

    gl.uniform2fv(
        uniforms.u_min,
        bounds.min
    );

    gl.uniform2fv(
        uniforms.u_max,
        bounds.max
    );

    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        buffer
    );

    gl.enableVertexAttribArray(
        attributes.a_pos
    );

    gl.vertexAttribPointer(
        attributes.a_pos,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    gl.drawArrays(
        gl.TRIANGLES,
        0,
        6
    );
}