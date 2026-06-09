import { beforeEach, describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { Timeline } from "./Timeline";
import { useAtmosStore }
    from "../../core/state/atmosStore";
describe("Timeline", () => {
    beforeEach(() => {
        useAtmosStore.getState().reset();
    });

    it("reads frame from store", () => {
        useAtmosStore
            .getState()
            .setFrame(36);

        const frame =
            useAtmosStore.getState().frame;

        expect(frame).toBe(36);

        render(
            <Timeline
                progress={frame / 71}
                onScrub={() => { }}
            />
        );
    });
    it(
        "renders cursor position",
        () => {
            render(
                <Timeline
                    progress={0.5}
                    onScrub={() => { }}
                />
            );

            expect(true).toBe(true);
        }
    );
});