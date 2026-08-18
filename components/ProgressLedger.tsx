type Props = {
  percent: number; // 0-100
  status: "on-track" | "attention" | "at-risk";
  label?: string;
};

const STATUS_COLOR: Record<Props["status"], string> = {
  "on-track": "#2F6F4E",
  attention: "#B8792F",
  "at-risk": "#9C3B2E",
};

// Renders mastery as 20 tally ticks grouped in fives, gradebook-style,
// rather than a generic filled progress bar.
export function ProgressLedger({ percent, status, label }: Props) {
  const filled = Math.round((percent / 100) * 20);
  const color = STATUS_COLOR[status];

  return (
    <div className="flex items-center gap-3">
      <svg width="120" height="16" viewBox="0 0 120 16" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => {
          const group = Math.floor(i / 5);
          const x = i * 5.6 + group * 3;
          const isFilled = i < filled;
          return (
            <line
              key={i}
              x1={x}
              y1={2}
              x2={x}
              y2={14}
              stroke={isFilled ? color : "#DEDBCE"}
              strokeWidth={isFilled ? 2 : 1.5}
            />
          );
        })}
      </svg>
      <span className="font-mono text-sm text-ink" aria-label={`${percent} percent mastery`}>
        {percent}%
      </span>
      {label && <span className="text-xs text-ink-soft">{label}</span>}
    </div>
  );
}
