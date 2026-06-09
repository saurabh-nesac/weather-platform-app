// src/components/controls/TimelineControl.test.tsx

import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import { TimelineControl } from "./TimelineControl";

import { useAtmosStore }
  from "../../core/state/atmosStore";

import { useDatasetStore }
  from "../../core/state/datasetStore";
import { act } from "@testing-library/react";

describe(
  "TimelineControl",
  () => {
    beforeEach(() => {
      useAtmosStore
        .getState()
        .reset();

      useDatasetStore
        .getState()
        .reset();

      useDatasetStore
        .getState()
        .addDataset({
          id: "wrf_d02",

          name:
            "WRF D02 Forecast",

          model: "WRF",

          variables: [
            "T2",
            "RAIN",
          ],

          timesteps: 72,
        });

      useDatasetStore
        .getState()
        .selectDataset(
          "wrf_d02"
        );
    });

    it(
      "renders current frame",
      () => {
        useAtmosStore
          .getState()
          .setFrame(12);

        render(
          <TimelineControl />
        );

        const slider =
          screen.getByRole(
            "slider"
          );

        expect(
          slider
        ).toHaveValue("12");
      }
    );

    it(
      "updates frame when slider moves",
      () => {
        render(
          <TimelineControl />
        );

        const slider =
          screen.getByRole(
            "slider"
          );

        fireEvent.change(
          slider,
          {
            target: {
              value: "25",
            },
          }
        );

        expect(
          useAtmosStore
            .getState()
            .frame
        ).toBe(25);
      }
    );

    it(
      "uses selected dataset timesteps",
      () => {
        render(
          <TimelineControl />
        );

        const slider =
          screen.getByRole(
            "slider"
          );

        expect(
          slider
        ).toHaveAttribute(
          "max",
          "71"
        );
      }
    );


      it(
          "reacts to frame changes from store",
          () => {
              render(
                  <TimelineControl />
              );

              act(() => {
                  useAtmosStore
                      .getState()
                      .setFrame(42);
              });

              expect(
                  screen.getByRole(
                      "slider"
                  )
              ).toHaveValue("42");
          }
      );
      it(
          "updates store multiple times",
          () => {
              render(
                  <TimelineControl />
              );

              const slider =
                  screen.getByRole(
                      "slider"
                  );

              fireEvent.change(
                  slider,
                  {
                      target: {
                          value: "10",
                      },
                  }
              );

              fireEvent.change(
                  slider,
                  {
                      target: {
                          value: "20",
                      },
                  }
              );

              expect(
                  useAtmosStore
                      .getState()
                      .frame
              ).toBe(20);
          }
      );
  }
);