// frontend-react/src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Cloud, ChevronDown, Play, Pause, RotateCcw, ChevronLeft, ChevronRight,
  SkipBack, SkipForward, Calendar, MapPin, Compass, Gauge as GaugeIcon, Activity,
  Settings2,
} from "lucide-react";
import { MapView } from "@/components/atmos/MapView";
import { Meteogram } from "@/components/atmos/Meteogram";
import { SkewT } from "@/components/atmos/SkewT";
import { Gauge } from "@/components/atmos/Gauge";
import { Timeline } from "@/components/atmos/Timeline";
import { Validation } from "@/components/atmos/Validation";
import type { BasinId } from "@/components/atmos/basins";
import { TimelineControl } from "../components/controls/TimelineControl";
import { bootstrapDatasets } from "../core/bootstrap/bootstrapDatasets";
import { useDatasetStore } from "../core/state/datasetStore";
import { useBasemap, useContourColorScheme, useContourInterval, useContourLineWidth, usePressureLevel, useSetBasemap, useSetPressureLevel, useShowContourLabels, useUpdateContourConfig, useVariable } from "../core/state/selectors";
import { useAtmosStore } from "../core/state/atmosStore";
import {
  useSetPlaying,
  useSetFrame,
} from "../core/state/selectors";
import { resolveVariable } from "@/core/datasets/resolveVariable";
import { PressureLevel } from "@/core/state/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atmospheric Engine — Climate Reanalysis Dashboard" },
      { name: "description", content: "Interactive climate reanalysis: map overlays, meteograms, and Skew-T thermodynamics." },
    ],
  }),
  component: AtmosphericEngine,
});

const overlays = ["Temperature", "Wind", "Pressure", "Clouds", "Precipitation", "Terrain"];

function AtmosphericEngine() {
  const [opacity, setOpacity] = useState(85);
  const [layers, setLayers] = useState<Record<string, boolean>>({
    Temperature: true, Wind: true, Pressure: false, Clouds: false, Precipitation: true, Terrain: false,
  });
  const [selectedBasin, setSelectedBasin] = useState<BasinId | null>("beki");

  useEffect(() => {
    bootstrapDatasets();
  }, []);
  // const contourInterval =
  //   useContourInterval();

  const contourInterval =
    useContourInterval();

  const contourLineWidth =
    useContourLineWidth();

  const contourColorScheme =
    useContourColorScheme();

  const showContourLabels =
    useShowContourLabels();

  const updateContourConfig =
    useUpdateContourConfig();
  const setPlaying = useSetPlaying();
  const setFrame = useSetFrame();

  const basemap = useBasemap();

  const setBasemap = useSetBasemap();
  const baseVariable =
    useVariable();

  const pressureLevel =
    usePressureLevel();
  const setPressureLevel =
    useSetPressureLevel();

  const variable =
    resolveVariable(
      baseVariable,
      pressureLevel
    );

  const setVariable = useAtmosStore(
    s => s.setVariable
  );
  const renderMode =
    useAtmosStore(
      s => s.renderMode
    );

  const setRenderMode =
    useAtmosStore(
      s => s.setRenderMode
    );

  return (
    <div className="flex h-screen flex-col bg-bg text-fg">
      {/* TOP BAR */}
      <header className="flex items-center gap-4 border-b border-border bg-panel px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-accent/20 text-accent">
            <Cloud className="h-4 w-4" />
          </div>
          <div className="font-semibold tracking-tight">Atmospheric Engine</div>
          <span className="chip !py-0.5 !px-1.5 bg-accent/15 border-accent/40 text-accent">v1</span>
        </div>
        {/* <div className="font-mono text-xs text-muted">2010-01-05 00:00 UTC</div>
        <Timeline progress={progress} onScrub={setProgress} />
        <div className="flex items-center gap-1">
          <IconBtn><SkipBack className="h-4 w-4" /></IconBtn>
          <IconBtn><ChevronLeft className="h-4 w-4" /></IconBtn>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="grid h-8 w-8 place-items-center rounded-md bg-accent text-white shadow-[0_0_20px_color-mix(in_oklab,var(--accent)_45%,transparent)]"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-[1px]" />}
          </button>
          <IconBtn><ChevronRight className="h-4 w-4" /></IconBtn>
          <IconBtn><SkipForward className="h-4 w-4" /></IconBtn>
          <button className="ml-1 flex h-8 items-center gap-1 rounded-md border border-border bg-panel-2 px-2 text-xs">
            1x <ChevronDown className="h-3 w-3" />
          </button>
        </div> */}
      </header>

      {/* MAIN */}
      <div className="grid flex-1 grid-cols-[260px_1fr_340px] gap-3 overflow-hidden p-3">
        {/* LEFT SIDEBAR */}
        <aside className="flex flex-col gap-3 overflow-y-auto scroll-thin">
          <section className="panel p-3">
            <SectionTitle icon={<Settings2 className="h-3.5 w-3.5" />}>CONTROLS</SectionTitle>
            <Field label="Variable"
            >

              <select
                value={baseVariable}
                onChange={(e) =>
                  setVariable(
                    e.target.value
                  )
                }
                
              >

                <option value="TEMP">
                  Temperature
                </option>

                <option value="RAIN">
                  Rainfall
                </option>

                <option value="WIND">
                  Wind Speed
                </option>

              </select>

            </Field>
            <Field label="Pressure Level">

              <select
                value={pressureLevel}
                onChange={(e) => {

                  const value =
                    e.target.value;

                  if (
                    value === "surface"
                  ) {

                    setPressureLevel(
                      "surface"
                    );

                  } else {

                    setPressureLevel(
                      Number(value) as PressureLevel
                    );

                  }
                }}
                className="w-full rounded-md border border-border bg-panel-2 px-2 py-1 text-sm"
              >

                <option value="surface">
                  Surface
                </option>

                <option value="1000">
                  1000 hPa
                </option>

                <option value="925">
                  925 hPa
                </option>

                <option value="850">
                  850 hPa
                </option>

                <option value="700">
                  700 hPa
                </option>

                <option value="500">
                  500 hPa
                </option>

                <option value="300">
                  300 hPa
                </option>

                <option value="250">
                  250 hPa
                </option>

                <option value="200">
                  200 hPa
                </option>

              </select>

            </Field>

            <Field label="Render Mode">

              <select

                value={renderMode}

                onChange={(e) =>

                  setRenderMode(
                    e.target.value as
                    "raster" | "contour"
                  )

                }

                className="w-full rounded-md border border-border bg-panel-2 px-2 py-1 text-sm"

              >

                <option value="raster">
                  Raster
                </option>

                <option value="contour">
                  Contour
                </option>

              </select>
              {renderMode === "contour" && (
                <section className="space-y-3">

                  <h3 className="text-sm font-semibold">
                    Contour Settings
                  </h3>

                  <Field label="Contour Interval">

                    <select
                      value={contourInterval}
                      onChange={(e) =>
                        updateContourConfig({
                          interval: Number(e.target.value),
                        })
                      }
                      className="w-full rounded border border-border bg-panel-2 px-2 py-1"
                    >

                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={5}>5</option>
                      <option value={10}>10</option>

                    </select>

                  </Field>

                  <Field label="Line Width">

                    <select
                      value={contourLineWidth}
                      onChange={(e) =>
                        updateContourConfig({
                          lineWidth: Number(e.target.value),
                        })
                      }
                      className="w-full rounded border border-border bg-panel-2 px-2 py-1"
                    >

                      <option value={1}>1 px</option>
                      <option value={1.5}>1.5 px</option>
                      <option value={2}>2 px</option>
                      <option value={3}>3 px</option>

                    </select>

                  </Field>

                  <Field label="Color Scheme">

                    <select
                      value={contourColorScheme}
                      onChange={(e) =>
                        updateContourConfig({
                          colorScheme:
                            e.target.value as
                            | "temperature"
                            | "grayscale"
                            | "rainbow"
                            | "single",
                        })
                      }
                      className="w-full rounded border border-border bg-panel-2 px-2 py-1"
                    >

                      <option value="temperature">
                        Temperature
                      </option>

                      <option value="grayscale">
                        Grayscale
                      </option>

                      <option value="rainbow">
                        Rainbow
                      </option>

                      <option value="single">
                        Single Color
                      </option>

                    </select>

                  </Field>

                  <Field label="Contour Labels">

                    <label className="flex items-center gap-2">

                      <input
                        type="checkbox"
                        checked={showContourLabels}
                        onChange={(e) =>
                          updateContourConfig({
                            showLabels:
                              e.target.checked,
                          })
                        }
                      />

                      <span>Show Labels</span>

                    </label>

                  </Field>

                </section>
              )}
            </Field>

            <Field label="Contour Interval">

              <select

                value={contourInterval}

                onChange={(e) =>
                  updateContourConfig(
                    {interval :Number(e.target.value)}
                  )
                }

                className="w-full rounded-md border border-border bg-panel-2 px-2 py-1 text-sm"

              >

                <option value={1}>1</option>

                <option value={2}>2</option>

                <option value={5}>5</option>

                <option value={10}>10</option>

              </select>

            </Field>

            {/* <Field label="Basemap">
              <select
                value={basemap}
                onChange={(e) =>
                  setBasemap(
                    e.target.value as any
                  )
                }
                className="w-full"
              >
                <option value="dark">
                  Dark
                </option>

                <option value="osm">
                  OSM Standard
                </option>
              </select>
            </Field> */}

            {/* <Field label="Frame / Time">
              <div className="font-mono text-xs text-muted">2010-01-05 00:00 UTC</div>
              
              <input type="range" className="mt-2 w-full accent-[var(--accent)]" />
              <div className="mt-2 flex items-center gap-1">
                <IconBtn small><ChevronLeft className="h-3.5 w-3.5" /></IconBtn>
                <IconBtn small><Calendar className="h-3.5 w-3.5" /></IconBtn>
                <IconBtn small><ChevronRight className="h-3.5 w-3.5" /></IconBtn>
              </div>
            </Field> */}

            <Field label="Timeline">
              <TimelineControl />
            </Field>

            <Field label={`Opacity`} rightLabel={`${opacity}%`}>
              <input
                type="range" min={0} max={100} value={opacity}
                onChange={(e) => setOpacity(+e.target.value)}
                className="w-full accent-[var(--accent)]"
              />
            </Field>
            {/* <div className="mt-3 space-y-1.5">
              <button
                onClick={() => setPlaying(true)}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-accent py-2 text-sm font-medium text-white shadow-[0_0_20px_color-mix(in_oklab,var(--accent)_40%,transparent)]"
              >
                <Play className="h-3.5 w-3.5" /> Play
              </button>
              <button
                onClick={() => setPlaying(false)}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-panel-2 py-2 text-sm"
              >
                <Pause className="h-3.5 w-3.5" /> Pause
              </button>
              <button
                onClick={() => setFrame(0)}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-panel-2 py-2 text-sm"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset Time
              </button>
            </div> */}
          </section>

          <section className="panel p-3">
            <SectionTitle>STATUS</SectionTitle>
            <div className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-good shadow-[0_0_8px_var(--good)]" />
              Data loaded
            </div>
            <dl className="mt-3 space-y-1.5 text-xs">
              <Row k="Model" v="WRF" />
              <Row k="Resolution" v="~3 km (3-day avg)" />
              <Row k="Last update" v="2025-10-15T 0Z" />
            </dl>
          </section>

          <Validation
            selectedBasin={selectedBasin}
            onSelectBasin={setSelectedBasin}
            overlays={overlays}
            visibleOverlays={layers}
            onToggleOverlay={(name, on) => setLayers((prev) => ({ ...prev, [name]: on }))}
          />
        </aside>

        {/* CENTER */}
        <main className="grid grid-rows-[1.1fr_1fr] gap-3 overflow-hidden">
          <div className="panel overflow-hidden p-0">
            <MapView
              opacity={opacity / 100}
              showTemp={layers.Temperature}
              selectedBasin={selectedBasin}
              onSelectBasin={setSelectedBasin}
              visibleOverlays={layers}
            />
          </div>
          <div className="grid grid-cols-[260px_1fr] gap-3 overflow-hidden">
            <section className="panel overflow-hidden p-3">
              <SectionTitle icon={<span>📋</span>}>CLIMATE SUMMARY (FOCUS: NE INDIA)</SectionTitle>
              <table className="w-full text-xs">
                <thead className="text-muted">
                  <tr className="border-b border-border">
                    <th className="py-1.5 text-left font-medium">Metric</th>
                    <th className="py-1.5 text-right font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Days with Rain", "8"], 
                    ["Average Temp (°C)", "14.2"], ["Maximum Temp (°C)", "24.7"],
                    ["Minimum Temp (°C)", "5.8"], ["Total Precip (mm)", "236"],
                    ["Total Snow (cm)", "18"], ["Date", "2025-10-16"],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b border-border/60">
                      <td className="py-1.5 text-fg/90">{k}</td>
                      <td className="py-1.5 text-right font-mono">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="panel flex flex-col overflow-hidden p-3">
              <div className="mb-1 flex items-center justify-between">
                <SectionTitle icon={<Activity className="h-3.5 w-3.5" />} noMargin>
                  METEOGRAM – FOCUS: NE INDIA (Guwahati)
                </SectionTitle>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Legend color="oklch(0.7 0.2 25)" label="Temp (°C)" />
                  <Legend color="oklch(0.75 0.18 150)" label="Dew Point (°C)" />
                  <Legend color="oklch(0.7 0.18 235)" label="Precip (mm)" />
                  <Legend color="oklch(0.82 0.16 85)" label="Wind (km/h)" />
                  <Legend color="oklch(0.72 0.2 320)" label="Humidity (%)" />
                </div>
              </div>
              <div className="flex-1">
                <Meteogram />
              </div>
            </section>
          </div>
        </main>

        {/* RIGHT */}
        <aside className="flex flex-col gap-3 overflow-y-auto scroll-thin">
          {/* <section className="panel p-3">
            <SectionTitle icon={<MapPin className="h-3.5 w-3.5" />}>LOCATION SUMMARY</SectionTitle>
            <div className="text-base font-semibold">New Delhi, India</div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <InfoBox icon="🏔️" label="Elevation" value="10 m" />
              <InfoBox icon={<Compass className="h-3.5 w-3.5" />} label="Coordinates" value="26.18° N, 91.74° E" />
            </div>
          </section> */}

          <section className="panel p-3">
            <SectionTitle icon={<GaugeIcon className="h-3.5 w-3.5" />}>QUICK METRICS</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              <Gauge value={-1} label="Average Temperature" unit="°C" />
              <Gauge value={7} label="Maximum Temperature" unit="°C" />
              <Gauge value={3} label="Days with Rain (Model)" min={0} max={31} />
              <Gauge value={3} label="Days with Rain (GPM)" min={0} max={31} />
            </div>
          </section>

          <section className="panel flex flex-1 flex-col p-3">
            <SectionTitle icon={<Activity className="h-3.5 w-3.5" />}>SKEW-T / THERMODYNAMICS</SectionTitle>
            <div className="mb-1 flex items-center justify-between">
              <div className="text-xs text-muted">Guwahati (2010-01-05 00:00 UTC)</div>
              <div className="flex gap-2">
                <Legend color="oklch(0.75 0.18 150)" label="Temperature" />
                <Legend color="oklch(0.7 0.2 25)" label="Dew Point" />
              </div>
            </div>
            <div className="min-h-[260px] flex-1">
              <SkewT />
            </div>
            <div className="mt-2 grid grid-cols-5 gap-2 border-t border-border pt-2 text-center text-[11px]">
              <Stat k="CAPE" v="0 J/kg" />
              <Stat k="CIN" v="0 J/kg" />
              <Stat k="LI" v="-2.1" />
              <Stat k="LCL" v="948 hPa" />
              <Stat k="PWAT" v="12.4 mm" />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function SectionTitle({ children, icon, noMargin }: { children: React.ReactNode; icon?: React.ReactNode; noMargin?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 ${noMargin ? "" : "mb-3"} text-[11px] font-medium uppercase tracking-wider text-muted`}>
      {icon}
      {children}
    </div>
  );
}

function Field({ label, rightLabel, children }: { label: string; rightLabel?: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <div className="mb-1 flex items-center justify-between text-[11px] text-muted">
        <span>{label}</span>
        {rightLabel && <span className="font-mono">{rightLabel}</span>}
      </div>
      {children}
    </div>
  );
}

function Select({ value }: { value: string }) {
  return (
    <button className="flex w-full items-center justify-between rounded-md border border-border bg-panel-2 px-2.5 py-1.5 text-sm">
      {value}
      <ChevronDown className="h-3.5 w-3.5 text-muted" />
    </button>
  );
}

function IconBtn({ children, small }: { children: React.ReactNode; small?: boolean }) {
  return (
    <button className={`grid place-items-center rounded-md border border-border bg-panel-2 text-muted hover:text-fg ${small ? "h-7 w-7" : "h-8 w-8"}`}>
      {children}
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{k}</dt>
      <dd className="font-mono">{v}</dd>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-border bg-panel-2/60 px-1.5 py-0.5 text-[10px] text-muted">
      <span className="h-2 w-2 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  );
}

function InfoBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-panel-2 p-2">
      <div className="flex items-center gap-1 text-[10px] text-muted">{icon} {label}</div>
      <div className="mt-0.5 font-mono text-sm">{value}</div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-muted">{k}</div>
      <div className="font-mono text-fg">{v}</div>
    </div>
  );
}
