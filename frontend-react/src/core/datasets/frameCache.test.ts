// src/core/datasets/frameCache.test.ts

import {
    describe,
    it,
    expect,
    beforeEach,
} from "vitest";

import {
    cacheFrame,
    getCachedFrame,
    clearFrameCache,
} from "./frameCache";

describe(
    "FrameCache",
    () => {

        beforeEach(() => {
            clearFrameCache();
        });

        it(
            "stores frame",
            () => {

                cacheFrame({
                    datasetId: "wrf",
                    variable: "T2",
                    frame: 0,
                    data: new Float32Array(
                        [1, 2, 3]
                    ),
                });

                const frame =
                    getCachedFrame({
                        datasetId: "wrf",
                        variable: "T2",
                        frame: 0,
                    });

                expect(
                    frame
                ).toBeDefined();
            }
        );

        it(
            "returns cached frame",
            () => {

                const cachedFrame = {
                    datasetId: "wrf",
                    variable: "T2",
                    frame: 7,
                    data: new Float32Array(
                        [10, 20, 30]
                    ),
                };

                cacheFrame(
                    cachedFrame
                );

                const result =
                    getCachedFrame({
                        datasetId: "wrf",
                        variable: "T2",
                        frame: 7,
                    });

                expect(
                    result
                ).toBe(
                    cachedFrame
                );
            }
        );

        it(
            "clears cache",
            () => {

                cacheFrame({
                    datasetId: "wrf",
                    variable: "T2",
                    frame: 0,
                    data: new Float32Array(
                        [1, 2, 3]
                    ),
                });

                clearFrameCache();

                const frame =
                    getCachedFrame({
                        datasetId: "wrf",
                        variable: "T2",
                        frame: 0,
                    });

                expect(
                    frame
                ).toBeUndefined();
            }
        );

        it(
            "separates datasets and variables",
            () => {

                cacheFrame({
                    datasetId: "wrf",
                    variable: "T2",
                    frame: 0,
                    data: new Float32Array([1]),
                });

                expect(
                    getCachedFrame({
                        datasetId: "wrf",
                        variable: "RAIN",
                        frame: 0,
                    })
                ).toBeUndefined();

                expect(
                    getCachedFrame({
                        datasetId: "gfs",
                        variable: "T2",
                        frame: 0,
                    })
                ).toBeUndefined();
            }
        );
    }
);