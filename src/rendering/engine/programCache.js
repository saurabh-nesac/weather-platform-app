const PROGRAM_CACHE = {};

export function getOrCreateProgram({

    gl,

    key,

    vertexSource,

    fragmentSource,

    createProgram
}) {

    if (PROGRAM_CACHE[key]) {

        return PROGRAM_CACHE[key];
    }

    const program =
        createProgram(
            gl,
            vertexSource,
            fragmentSource
        );

    PROGRAM_CACHE[key] =
        program;

    return program;
}