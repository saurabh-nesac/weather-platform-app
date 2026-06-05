interface Props {
  value: number;
  label: string;
  unit?: string;
  min?: number;
  max?: number;
}

export function Gauge({ value, label, unit = "", min = -20, max = 40 }: Props) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const r = 28;
  const c = Math.PI * r;
  const dash = pct * c;

  return (
    <div className="panel flex flex-col items-center justify-center p-3">
      <svg viewBox="0 0 80 50" className="w-24">
        <path d="M 12 44 A 28 28 0 0 1 68 44" fill="none" stroke="var(--border)" strokeWidth="6" strokeLinecap="round" />
        <path
          d="M 12 44 A 28 28 0 0 1 68 44"
          fill="none"
          stroke="var(--accent-2)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
        <text x="40" y="38" textAnchor="middle" fill="var(--fg)" fontSize="12" fontWeight="600">
          {value}
        </text>
        <text x="62" y="38" textAnchor="start" fill="var(--muted)" fontSize="6">{unit}</text>
      </svg>
      <div className="mt-1 text-[11px] text-muted">{label}</div>
    </div>
  );
}
