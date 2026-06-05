import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { generateMeteogram } from "./data";

export function Meteogram() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const data = generateMeteogram();
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    const W = ref.current!.clientWidth;
    const H = ref.current!.clientHeight;
    const m = { l: 44, r: 14, t: 8, b: 22 };
    const iw = W - m.l - m.r;
    const availH = H - m.t - m.b;

    // panel sizing from reference (48/16/20/12 with gaps)
    const ratios = { thermo: 0.46, rain: 0.16, wind: 0.2, humid: 0.12 };
    const gap = 18;
    const totalRatio = ratios.thermo + ratios.rain + ratios.wind + ratios.humid;
    const usable = availH - gap * 3;
    const ph = {
      thermo: usable * (ratios.thermo / totalRatio),
      rain: usable * (ratios.rain / totalRatio),
      wind: usable * (ratios.wind / totalRatio),
      humid: usable * (ratios.humid / totalRatio),
    };

    const x = d3.scaleTime().domain(d3.extent(data, (d) => d.date) as [Date, Date]).range([0, iw]);

    const root = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);

    let yOff = 0;

    // -------- THERMO PANEL --------
    {
      const g = root.append("g").attr("transform", `translate(0,${yOff})`);
      const tMax = d3.max(data, (d) => d.temp)! + 2;
      const tMin = d3.min(data, (d) => d.dew)! - 2;
      const y = d3.scaleLinear().domain([tMin, tMax]).range([ph.thermo, 0]);
      gridAndAxis(g, y, iw);

      const area = d3.area<any>()
        .x((d) => x(d.date)).y0(ph.thermo).y1((d) => y(d.temp))
        .curve(d3.curveMonotoneX);
      const areaD = d3.area<any>()
        .x((d) => x(d.date)).y0(ph.thermo).y1((d) => y(d.dew))
        .curve(d3.curveMonotoneX);
      g.append("path").datum(data).attr("d", area as any).attr("fill", "oklch(0.7 0.22 25 / 0.1)");
      g.append("path").datum(data).attr("d", areaD as any).attr("fill", "oklch(0.78 0.2 150 / 0.08)");

      const lineT = d3.line<any>().x((d) => x(d.date)).y((d) => y(d.temp)).curve(d3.curveMonotoneX);
      const lineD = d3.line<any>().x((d) => x(d.date)).y((d) => y(d.dew)).curve(d3.curveMonotoneX);
      g.append("path").datum(data).attr("d", lineD as any).attr("fill", "none")
        .attr("stroke", "oklch(0.78 0.2 150)").attr("stroke-width", 1.6);
      g.append("path").datum(data).attr("d", lineT as any).attr("fill", "none")
        .attr("stroke", "oklch(0.7 0.22 25)").attr("stroke-width", 1.6);

      panelTitle(g, "Temperature & Dew Point", "°C");
      yOff += ph.thermo + gap;
    }

    // -------- RAIN PANEL --------
    {
      const g = root.append("g").attr("transform", `translate(0,${yOff})`);
      const maxR = d3.max(data, (d) => d.precip) || 1;
      const y = d3.scaleLinear().domain([0, maxR]).range([ph.rain, 0]);
      gridAndAxis(g, y, iw, 3);
      const bw = Math.max(1.2, iw / data.length * 0.7);
      g.append("g").selectAll("rect").data(data).join("rect")
        .attr("x", (d) => x(d.date) - bw / 2)
        .attr("y", (d) => y(d.precip))
        .attr("width", bw)
        .attr("height", (d) => ph.rain - y(d.precip))
        .attr("fill", "oklch(0.65 0.18 235)").attr("opacity", 0.85);
      panelTitle(g, "Rainfall", "mm");
      yOff += ph.rain + gap;
    }

    // -------- WIND PANEL --------
    {
      const g = root.append("g").attr("transform", `translate(0,${yOff})`);
      const maxW = d3.max(data, (d) => d.wind)! + 2;
      const y = d3.scaleLinear().domain([0, maxW]).range([ph.wind, 0]);
      gridAndAxis(g, y, iw, 3);
      const ln = d3.line<any>().x((d) => x(d.date)).y((d) => y(d.wind)).curve(d3.curveMonotoneX);
      g.append("path").datum(data).attr("d", ln as any).attr("fill", "none")
        .attr("stroke", "oklch(0.82 0.16 85)").attr("stroke-width", 1.5);
      panelTitle(g, "Wind", "km/h");
      yOff += ph.wind + gap;
    }

    // -------- HUMIDITY PANEL --------
    {
      const g = root.append("g").attr("transform", `translate(0,${yOff})`);
      const y = d3.scaleLinear().domain([0, 100]).range([ph.humid, 0]);
      gridAndAxis(g, y, iw, 2);
      const area = d3.area<any>()
        .x((d) => x(d.date)).y0(ph.humid).y1((d) => y(d.humidity))
        .curve(d3.curveMonotoneX);
      g.append("path").datum(data).attr("d", area as any).attr("fill", "oklch(0.72 0.2 320 / 0.18)");
      const ln = d3.line<any>().x((d) => x(d.date)).y((d) => y(d.humidity)).curve(d3.curveMonotoneX);
      g.append("path").datum(data).attr("d", ln as any).attr("fill", "none")
        .attr("stroke", "oklch(0.72 0.2 320)").attr("stroke-width", 1.3);
      panelTitle(g, "Humidity", "%");
    }

    // bottom time axis
    svg.append("g")
      .attr("transform", `translate(${m.l},${H - m.b})`)
      .call(d3.axisBottom(x).ticks(7).tickFormat(d3.timeFormat("%Y-%m") as any))
      .call(styleAxis);

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
  }, []);

  return <svg ref={ref} className="h-full w-full" />;
}
