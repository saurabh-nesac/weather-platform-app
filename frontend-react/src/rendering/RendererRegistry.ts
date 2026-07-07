// frontend-react/src/rendering/RendererRegistry.ts

import type {
    ShaderModule,
} from "./webgl/ShaderModule";

/**
 * Registry of shader modules.
 *
 * Maps dataset variables (RAIN, TEMP, RH, ...)
 * to WebGL shader implementations.
 */
export class RendererRegistry {

    private readonly shaders =
        new Map<
            string,
            ShaderModule
        >();

    /**
     * Register a shader.
     *
     * Throws if another shader has already
     * been registered for the same id.
     */
    register(
        shader: ShaderModule
    ): void {

        if (
            this.shaders.has(
                shader.id
            )
        ) {

            throw new Error(

                `Shader '${shader.id}' already registered.`

            );

        }

        this.shaders.set(
            shader.id,
            shader
        );

    }

    /**
     * Replace an existing shader.
     *
     * Useful for plugins.
     */
    override(
        shader: ShaderModule
    ): void {

        this.shaders.set(
            shader.id,
            shader
        );

    }

    /**
     * Lookup by dataset variable.
     */
    getShader(
        variable: string
    ): ShaderModule {

        for (
            const shader of
            this.shaders.values()
        ) {

            if (
                shader.supports(
                    variable
                )
            ) {

                return shader;

            }

        }

        throw new Error(

            `No shader registered for '${variable}'.`

        );

    }

    has(
        variable: string
    ): boolean {

        for (
            const shader of
            this.shaders.values()
        ) {

            if (
                shader.supports(
                    variable
                )
            ) {

                return true;

            }

        }

        return false;

    }

    unregister(
        id: string
    ): void {

        this.shaders.delete(id);

    }

    clear(): void {

        this.shaders.clear();

    }

    list(): readonly ShaderModule[] {

        return [
            ...this.shaders.values()
        ];

    }

}

/**
 * Global renderer registry.
 *
 * Can later be replaced with
 * dependency injection if needed.
 */
export const rendererRegistry =
    new RendererRegistry();