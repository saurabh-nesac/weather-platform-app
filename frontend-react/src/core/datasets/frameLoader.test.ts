// src/core/datasets/frameLoader.test.ts

import {
    clearFrameCache,
} from "./frameCache";
import {
    describe,
    expect,
    it,
    vi,
    beforeEach,
} from "vitest";

import {
    loadFrame,
} from "./frameLoader";

describe(
    "loadFrame",
    () => {

        beforeEach(() => {
            vi.restoreAllMocks();
            clearFrameCache();
        });

        it(
            "loads valid frame data",
            async () => {

                const values =
                    new Float32Array([
                        1,
                        2,
                        3,
                        4,
                    ]);

                vi.spyOn(
                    global,
                    "fetch"
                ).mockResolvedValue({
                    ok: true,
                    arrayBuffer:
                        async () =>
                            values.buffer,
                } as Response);

                const frame =
                    await loadFrame({
                        datasetId:
                            "wrf",

                        variable:
                            "T2",

                        frame: 0,
                    });

                expect(
                    frame.datasetId
                ).toBe("wrf");

                expect(
                    frame.variable
                ).toBe("T2");

                expect(
                    frame.frame
                ).toBe(0);

                expect(
                    frame.data
                ).toBeInstanceOf(
                    Float32Array
                );

                expect(
                    frame.data[0]
                ).toBe(1);

                expect(
                    frame.data[3]
                ).toBe(4);
            }
        );
        it(
            "throws when fetch fails",
            async () => {

                vi.spyOn(
                    global,
                    "fetch"
                ).mockResolvedValue({
                    ok: false,
                    status: 404,
                } as Response);

                await expect(
                    loadFrame({
                        datasetId: "wrf",
                        variable: "T2",
                        frame: 0,
                    })
                ).rejects.toThrow(
                    "Failed to load"
                );
            }
        );
    }
);