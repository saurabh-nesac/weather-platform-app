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

    const data =
      buildMeteogramSeries(
        response
      );

    dataRef.current =
      data;


    console.log(data);
    const svg = d3.select(ref.current);
    
    drawMeteogram(svg, data, frame)

    function gridAndAxis(g: any, y: any, w: number, ticks = 4) {
      g.append("g")
        .call(d3.axisLeft(y).ticks(ticks).tickSize(-w).tickFormat("" as any))
        .call((sel: any) => {
          sel.selectAll("line").attr("stroke", "oklch(0.32 0.03 262)").attr("opacity", 0.5);
          sel.selectAll("path").attr("stroke", "none");
        });
      g.append("g").call(d3.axisLeft(y).ticks(ticks)).call(styleAxis);
    }
    function panelTitle(g: any, label: string, unit: string) {
      g.append("text").attr("x", 0).attr("y", -4)
        .attr("fill", "oklch(0.85 0.01 250)").attr("font-size", 10).attr("font-weight", 600)
        .text(label);
      g.append("text").attr("x", iw).attr("y", -4).attr("text-anchor", "end")
        .attr("fill", "oklch(0.55 0.02 258)").attr("font-size", 9).text(unit);
    }
    function styleAxis(sel: any) {
      sel.selectAll("text").attr("fill", "oklch(0.7 0.02 258)").attr("font-size", 9);
      sel.selectAll("line,path").attr("stroke", "oklch(0.4 0.03 262)");
    }
  }, [
    response,
    frame
  ]);

  return <svg ref={ref} className="h-full w-full" />;
}
