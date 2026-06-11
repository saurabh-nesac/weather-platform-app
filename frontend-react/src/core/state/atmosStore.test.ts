import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    useAtmosStore,
} from "./atmosStore";

describe(
    "AtmosStore",
    () => {
        beforeEach(() => {
            useAtmosStore
                .getState()
                .reset();
        });

        it(
            "starts with defaults",
            () => {
                const state =
                    useAtmosStore.getState();

                expect(
                    state.variable
                ).toBe("T2");

                expect(
                    state.frame
                ).toBe(0);
            }
        );

        it(
            "updates frame",
            () => {
                useAtmosStore
                    .getState()
                    .setFrame(12);

                expect(
                    useAtmosStore
                        .getState()
                        .frame
                ).toBe(12);
            }
        );

        it(
            "updates selected point",
            () => {
                useAtmosStore
                    .getState()
                    .setSelectedPoint({
                        lat: 26.18,
                        lon: 91.74,
                    });

                expect(
                    useAtmosStore
                        .getState()
                        .selectedPoint
                ).toEqual({
                    lat: 26.18,
                    lon: 91.74,
                });
            }
        );

        it(
            "supports point selection workflow",
            () => {
                const store =
                    useAtmosStore.getState();

                store.setFrame(24);

                store.setVariable("T2");

                store.setSelectedPoint({
                    lat: 26.18,
                    lon: 91.74,
                });

                const state =
                    useAtmosStore.getState();

                expect(state.frame)
                    .toBe(24);

                expect(state.variable)
                    .toBe("T2");

                expect(
                    state.selectedPoint
                ).toEqual({
                    lat: 26.18,
                    lon: 91.74,
                });
            }
        );
        it(
            "notifies subscribers",
            () => {
                let frame = -1;

                const unsub =
                    useAtmosStore.subscribe(
                        (state) => {
                            frame = state.frame;
                        }
                    );

                useAtmosStore
                    .getState()
                    .setFrame(42);

                expect(frame)
                    .toBe(42);

                unsub();
            }
        );
        it(
            "changing frame preserves selection",
            () => {
                const store =
                    useAtmosStore.getState();

                store.setSelectedPoint({
                    lat: 26,
                    lon: 91,
                });

                store.setFrame(12);

                expect(
                    useAtmosStore.getState()
                        .selectedPoint
                ).toEqual({
                    lat: 26,
                    lon: 91,
                });
            }
        );
        it(
            "reset returns store to defaults",
            () => {
                const store =
                    useAtmosStore.getState();

                store.setFrame(24);

                store.setVariable("RAIN");

                store.setSelectedPoint({
                    lat: 26,
                    lon: 91,
                });

                store.reset();

                const state =
                    useAtmosStore.getState();

                expect(state.frame)
                    .toBe(0);

                expect(state.variable)
                    .toBe("T2");

                expect(
                    state.selectedPoint
                ).toBeNull();

                expect(
                    state.selectedBasin
                ).toBeNull();

                expect(
                    state.renderMode
                ).toBe("raster");

                expect(
                    state.opacity
                ).toBe(1);
            }
        );

        it(
            "changing frame does not clear selected point",
            () => {
                const store =
                    useAtmosStore.getState();

                store.setSelectedPoint({
                    lat: 26.18,
                    lon: 91.74,
                });

                store.setFrame(12);

                expect(
                    useAtmosStore.getState()
                        .selectedPoint
                ).toEqual({
                    lat: 26.18,
                    lon: 91.74,
                });
            }
        );

        it(
            "changing variable does not affect frame",
            () => {
                const store =
                    useAtmosStore.getState();

                store.setFrame(18);

                store.setVariable("RAIN");

                expect(
                    useAtmosStore.getState()
                        .frame
                ).toBe(18);

                expect(
                    useAtmosStore.getState()
                        .variable
                ).toBe("RAIN");
            }
        );
        it(
            "accepts frame 0",
            () => {
                const store =
                    useAtmosStore.getState();

                store.setFrame(0);

                expect(
                    useAtmosStore.getState()
                        .frame
                ).toBe(0);
            }
        );

        it(
            "accepts high frame values",
            () => {
                const store =
                    useAtmosStore.getState();

                store.setFrame(9999);

                expect(
                    useAtmosStore.getState()
                        .frame
                ).toBe(9999);
            }
        );

        it(
            "can clear selected point",
            () => {
                const store =
                    useAtmosStore.getState();

                store.setSelectedPoint({
                    lat: 26.18,
                    lon: 91.74,
                });

                expect(
                    useAtmosStore.getState()
                        .selectedPoint
                ).toEqual({
                    lat: 26.18,
                    lon: 91.74,
                });

                store.setSelectedPoint(
                    null
                );

                expect(
                    useAtmosStore.getState()
                        .selectedPoint
                ).toBeNull();
            }
        );

        it(
            "starts paused",
            () => {

                expect(
                    useAtmosStore
                        .getState()
                        .playing
                ).toBe(
                    false
                );
            }
        );
        it(
            "can start playback",
            () => {

                useAtmosStore
                    .getState()
                    .setPlaying(
                        true
                    );

                expect(
                    useAtmosStore
                        .getState()
                        .playing
                ).toBe(
                    true
                );
            }
        );
        it(
            "can stop playback",
            () => {

                const store =
                    useAtmosStore
                        .getState();

                store.setPlaying(
                    true
                );

                store.setPlaying(
                    false
                );

                expect(
                    useAtmosStore
                        .getState()
                        .playing
                ).toBe(
                    false
                );
            }
        );
        it(
            "reset clears playback",
            () => {

                const store =
                    useAtmosStore
                        .getState();

                store.setPlaying(
                    true
                );

                store.reset();

                expect(
                    useAtmosStore
                        .getState()
                        .playing
                ).toBe(
                    false
                );
            }
        );
    }
);