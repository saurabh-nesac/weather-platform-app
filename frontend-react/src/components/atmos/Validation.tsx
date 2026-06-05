import { BASINS, type BasinId } from "./basins";
import { ShieldCheck } from "lucide-react";

interface Props {
  selectedBasin: BasinId | null;
  onSelectBasin: (id: BasinId) => void;
  overlays: string[];
  visibleOverlays: Record<string, boolean>;
  onToggleOverlay: (name: string, on: boolean) => void;
}

export function Validation({
  selectedBasin,
  onSelectBasin,
  overlays,
  visibleOverlays,
  onToggleOverlay,
}: Props) {
  const basin = BASINS.find((b) => b.id === selectedBasin) ?? BASINS[0];
  const activeId = selectedBasin ?? basin.id;

  return (
    <section className="panel flex flex-col p-3">
      <div className="mb-3 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted">
        <ShieldCheck className="h-3.5 w-3.5" />
        VALIDATION — NE INDIA WATERSHEDS
      </div>

      {/* Basin selector */}
      <div className="mb-3 grid grid-cols-3 gap-1.5">
        {BASINS.map((b) => {
          const active = b.id === activeId;
          return (
            <button
              key={b.id}
              onClick={() => onSelectBasin(b.id)}
              className={`rounded-md border px-2 py-1.5 text-left text-[11px] transition-colors ${
                active
                  ? "border-accent bg-accent/15 text-fg"
                  : "border-border bg-panel-2 text-muted hover:text-fg"
              }`}
            >
              <div className="font-medium">{b.name}</div>
              <div className="font-mono text-[10px] opacity-70">
                {b.area_km2.toLocaleString()} km²
              </div>
            </button>
          );
        })}
      </div>

      {/* Overlay layers (moved from Controls) */}
      <div className="mb-3">
        <div className="mb-1.5 text-[11px] uppercase tracking-wide text-muted">
          Overlay Layers
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {overlays.map((o) => (
            <label key={o} className="flex cursor-pointer items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={!!visibleOverlays[o]}
                onChange={(e) => onToggleOverlay(o, e.target.checked)}
                className="h-3.5 w-3.5 accent-[var(--accent)]"
              />
              {o}
            </label>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="rounded-md border border-border bg-panel-2/60 p-2">
        <div className="mb-1.5 flex items-center justify-between text-[11px]">
          <span className="text-muted">
            Model vs Obs · <span className="text-fg/90">{basin.river}</span>
          </span>
          <span className="font-mono text-[10px] text-muted">
            n={basin.metrics[0].samples.toLocaleString()}
          </span>
        </div>
        <table className="w-full text-xs">
          <thead className="text-muted">
            <tr className="border-b border-border">
              <th className="py-1 text-left font-medium">Variable</th>
              <th className="py-1 text-right font-medium">Bias</th>
              <th className="py-1 text-right font-medium">RMSE</th>
            </tr>
          </thead>
          <tbody>
            {basin.metrics.map((m) => {
              const unit =
                m.overlay === "Temperature"
                  ? "°C"
                  : m.overlay === "Precipitation"
                  ? "mm"
                  : "m/s";
              const biasColor =
                Math.abs(m.bias) < 0.5
                  ? "text-good"
                  : Math.abs(m.bias) < 2
                  ? "text-warn"
                  : "text-bad";
              return (
                <tr key={m.overlay} className="border-b border-border/60 last:border-0">
                  <td className="py-1 text-fg/90">{m.overlay}</td>
                  <td className={`py-1 text-right font-mono ${biasColor}`}>
                    {m.bias > 0 ? "+" : ""}
                    {m.bias.toFixed(2)} {unit}
                  </td>
                  <td className="py-1 text-right font-mono">
                    {m.rmse.toFixed(2)} {unit}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-2 text-[10px] leading-relaxed text-muted">
        Click a basin polygon on the map to inspect its validation skill scores
        against the NorESM1-M reanalysis.
      </div>
    </section>
  );
}
