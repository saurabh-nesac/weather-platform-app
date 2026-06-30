import {
    describe,
    expect,
    it,
    vi,
} from "vitest";

import * as frameLoader
    from "./frameLoader";

import {
    getFrame,
} from "./frameManager";

describe(
    "FrameManager",
    () => {

        it(
            "delegates to frame loader",
            async () => {

                const mockFrame = {
                    datasetId:
                        "wrf",

                    variable:
                        "T2",

                    frame:
                        0,

                    data:
                        new Float32Array(
                            [1]
                        ),
                };

                const spy =
                    vi.spyOn(
                        frameLoader,
                        "loadFrame"
                    )
                        .mockResolvedValue(
                            mockFrame
                        );

                const result =
                    await getFrame({
                        datasetId:
                            "wrf",

                        variable:
                            "T2",

                        frame:
                            0,
                    });

                expect(
                    spy
                ).toHaveBeenCalled();

                expect(
                    result
                ).toBe(
                    mockFrame
                );
            }
        );
    }
);