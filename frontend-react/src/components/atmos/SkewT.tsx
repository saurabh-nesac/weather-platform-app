import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { generateSounding } from "./data";

export function SkewT() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const { profile: data, lclPressure, cape, cin } = generateSounding();
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    const W = ref.current!.clientWidth;
    const H = ref.current!.clientHeight;
    const m = { l: 36, r: 14, t: 10, b: 26 };
    const iw = W - m.l - m.r;
    const ih = H - m.t - m.b;

    // glow filter (from reference)
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "skewt-glow");
    filter.append("feGaussianBlur").attr("stdDeviation", 2).attr("result", "b");
    const merge = filter.append("feMerge");
    merge.append("feMergeNode").attr("in", "b");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);

    // background
    g.append("rect").attr("width", iw).attr("height", ih)
      .attr("fill", "oklch(0.16 0.025 260)")
      .attr("stroke", "oklch(0.32 0.03 262)").attr("stroke-width", 1);

    // scales — match reference domains
    const x = d3.scaleLinear().domain([-50, 50]).range([0, iw]);
    const y = d3.scaleLog().domain([1050, 100]).range([ih, 0]);
    const skewX = (t: number, p: number) => x(t) + (ih - y(p)) * 0.48;

    // pressure grid
    const pTicks = [1000, 925, 850, 700, 500, 300, 200, 100];
    g.append("g").selectAll("line").data(pTicks).join("line")
      .attr("x1", 0).attr("x2", iw).attr("y1", (d) => y(d)).attr("y2", (d) => y(d))
      .attr("stroke", "oklch(0.42 0.03 262)").attr("opacity", 0.35);

    // isotherms (cyan, dense)
    d3.range(-80, 61, 10).forEach((t) => {
      const xB = skewX(t, 1000);
      const xT = skewX(t, 100);
      g.append("line")
        .attr("x1", xB).attr("y1", y(1000))
        .attr("x2", xT).attr("y2", y(100))
        .attr("stroke", "oklch(0.72 0.14 235)").attr("stroke-width", 1).attr("opacity", 0.16);
      g.append("text").attr("x", xB + 3).attr("y", y(1000) - 3)
        .attr("fill", "oklch(0.55 0.02 258)").attr("font-size", 9).text(t);
    });

    // dry adiabats (Poisson, theta 250..460)
    const adiabatP = d3.range(1050, 99, -10);
    d3.range(250, 461, 20).forEach((theta) => {
      const pts = adiabatP.map((p) => {
        const tC = theta * Math.pow(p / 1000, 0.286) - 273.15;
        return [skewX(tC, p), y(p)] as [number, number];
      });
      g.append("path").attr("d", d3.line()(pts)!)
        .attr("fill", "none")
        .attr("stroke", "oklch(0.78 0.16 60)").attr("stroke-width", 1).attr("opacity", 0.18);
    });

    // profile lines with glow
    const tLine = d3.line<any>().x((d) => skewX(d.t, d.p)).y((d) => y(d.p));
    const dLine = d3.line<any>().x((d) => skewX(d.td, d.p)).y((d) => y(d.p));
    const pLine = d3.line<any>().x((d) => skewX(d.tp, d.p)).y((d) => y(d.p));

    // parcel ascent (dashed white, behind env curves)
    g.append("path").attr("d", pLine(data)!).attr("fill", "none")
      .attr("stroke", "oklch(0.92 0.02 258)").attr("stroke-width", 1.6)
      .attr("stroke-dasharray", "4 3").attr("opacity", 0.85);

    g.append("path").attr("d", dLine(data)!).attr("fill", "none")
      .attr("stroke", "oklch(0.78 0.2 150)").attr("stroke-width", 2.5)
      .attr("filter", "url(#skewt-glow)");
    g.append("path").attr("d", tLine(data)!).attr("fill", "none")
      .attr("stroke", "oklch(0.7 0.22 25)").attr("stroke-width", 2.5)
      .attr("filter", "url(#skewt-glow)");

    // LCL marker
    if (lclPressure < 1050 && lclPressure > 100) {
      g.append("line")
        .attr("x1", 0).attr("x2", iw)
        .attr("y1", y(lclPressure)).attr("y2", y(lclPressure))
        .attr("stroke", "oklch(0.82 0.16 85)").attr("stroke-dasharray", "2 4")
        .attr("opacity", 0.6);
      g.append("text").attr("x", iw - 4).attr("y", y(lclPressure) - 3)
        .attr("text-anchor", "end").attr("font-size", 9)
        .attr("fill", "oklch(0.82 0.16 85)")
        .text(`LCL ${lclPressure.toFixed(0)} hPa`);
    }

    // CAPE / CIN readout
    svg.append("text").attr("x", W - 10).attr("y", 18)
      .attr("text-anchor", "end").attr("font-size", 10).attr("font-weight", 600)
      .attr("fill", "oklch(0.7 0.22 25)")
      .text(`CAPE ${cape.toFixed(0)} J/kg`);
    svg.append("text").attr("x", W - 10).attr("y", 32)
      .attr("text-anchor", "end").attr("font-size", 10)
      .attr("fill", "oklch(0.72 0.14 235)")
      .text(`CIN ${cin.toFixed(0)} J/kg`);

    // axes
    const yAxis = d3.axisLeft(y).tickValues(pTicks).tickFormat(d3.format("d") as any);
    g.append("g").call(yAxis).call(styleAxis);
    const xAxis = d3.axisBottom(x).ticks(10);
    g.append("g").attr("transform", `translate(0,${ih})`).call(xAxis).call(styleAxis);

    // labels
    svg.append("text").attr("x", W / 2).attr("y", H - 4)
      .attr("text-anchor", "middle").attr("fill", "oklch(0.65 0.02 258)")
      .attr("font-size", 10).text("Temperature (°C)");
    svg.append("text").attr("transform", "rotate(-90)")
      .attr("x", -H / 2).attr("y", 11).attr("text-anchor", "middle")
      .attr("fill", "oklch(0.65 0.02 258)").attr("font-size", 10).text("Pressure (hPa)");

    function styleAxis(sel: any) {
      sel.selectAll("text").attr("fill", "oklch(0.78 0.02 258)").attr("font-size", 10);
      sel.selectAll("line,path").attr("stroke", "oklch(0.45 0.03 262)");
    }
  }, []);

  return <svg ref={ref} className="h-full w-full" />;
}
