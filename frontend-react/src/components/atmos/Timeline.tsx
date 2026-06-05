import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { generateTimelineSeries } from "./data";

interface Props {
  progress: number; // 0..1
  onScrub: (p: number) => void;
}

export function Timeline({ progress, onScrub }: Props) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    const w = ref.current!.clientWidth;
    const h = ref.current!.clientHeight;
    const pts = generateTimelineSeries(w);
    const y = d3.scaleLinear().domain([-1.2, 1.2]).range([h - 14, 6]);
    const line = d3
      .line<{ x: number; y: number }>()
      .x((d) => d.x)
      .y((d) => y(d.y))
      .curve(d3.curveBasis);
    svg
      .append("path")
      .attr("d", line(pts)!)
      .attr("fill", "none")
      .attr("stroke", "oklch(0.7 0.2 285)")
      .attr("stroke-width", 1.2)
      .attr("opacity", 0.9);

    // year ticks
    const years = [1955, 1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010];
    const tx = d3.scaleLinear().domain([0, years.length - 1]).range([20, w - 20]);
    svg
      .append("g")
      .selectAll("text")
      .data(years)
      .join("text")
      .attr("x", (_, i) => tx(i))
      .attr("y", 12)
      .attr("fill", "oklch(0.65 0.02 258)")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .text((d) => d);
  }, []);

  return (
    <div
      className="relative h-12 flex-1 cursor-pointer"
      onMouseDown={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const handle = (ev: MouseEvent | React.MouseEvent) => {
          const p = Math.min(1, Math.max(0, ((ev as MouseEvent).clientX - rect.left) / rect.width));
          onScrub(p);
        };
        handle(e);
        const up = () => {
          window.removeEventListener("mousemove", handle);
          window.removeEventListener("mouseup", up);
        };
        window.addEventListener("mousemove", handle);
        window.addEventListener("mouseup", up);
      }}
    >
      <svg ref={ref} className="absolute inset-0 h-full w-full" />
      <div
        className="absolute top-0 bottom-0 w-px bg-accent shadow-[0_0_8px_var(--accent)]"
        style={{ left: `${progress * 100}%` }}
      >
        <div className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-accent" />
      </div>
    </div>
  );
}
