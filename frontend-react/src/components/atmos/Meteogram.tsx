//frontend-react/src/components/atmos/Meteogram.tsx
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useMeteogram } from "../../core/meteogram/useMeteogram";
import { buildMeteogramSeries } from "../../core/meteogram/buildMeteogramSeries";
import {
  useFrame,
} from "../../core/state/selectors";
import { drawMeteogram } from "../../core/meteogram/drawMeteogram";

export function Meteogram() {
  
  const cursorRef =
    useRef<
      d3.Selection<
        SVGLineElement,
        unknown,
        null,
        undefined
      > | null
    >(null);
  
  const xScaleRef =
    useRef<
      d3.ScaleTime<
        number,
        number
      > | null
    >(null);
  
  const dataRef =
    useRef<any[]>([]);
  const ref = useRef<SVGSVGElement>(null);
  const response =
    useMeteogram();
  const frame =
    useFrame();

  useEffect(() => {

    if (!response)
      return;

    if (!ref.current)
      return;

    const data =
      buildMeteogramSeries(
        response
      );

    dataRef.current =
      data;

    const result =
      drawMeteogram(
        ref.current,
        data,
        frame
      );

    cursorRef.current =
      result.cursor;

    xScaleRef.current =
      result.xScale;

  }, [
    response,
    frame
  ]);

  return <svg ref={ref} className="h-full w-full" />;
}
