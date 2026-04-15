import type { ResultStatus } from '@/data/biomarkerData';

interface RangeBarProps {
  value: number;
  low: number;
  high: number;
  status: ResultStatus;
  unit: string;
}

export function RangeBar({ value, low, high, status, unit }: RangeBarProps) {
  // Create a visual scale with padding beyond reference range
  const rangePadding = (high - low) * 0.4;
  const scaleMin = Math.max(0, low - rangePadding);
  const scaleMax = high + rangePadding;
  const totalRange = scaleMax - scaleMin;

  const normalStart = ((low - scaleMin) / totalRange) * 100;
  const normalWidth = ((high - low) / totalRange) * 100;
  const markerPos = Math.max(2, Math.min(98, ((value - scaleMin) / totalRange) * 100));

  const statusColor = {
    normal: 'bg-success',
    slightly_high: 'bg-warning',
    high: 'bg-destructive',
    slightly_low: 'bg-warning',
    low: 'bg-destructive',
    critical: 'bg-destructive',
  }[status];

  const statusLabel = {
    normal: 'Normal',
    slightly_high: 'Slightly High',
    high: 'High',
    slightly_low: 'Slightly Low',
    low: 'Low',
    critical: 'Critical',
  }[status];

  const statusLabelColor = {
    normal: 'text-success',
    slightly_high: 'text-warning-foreground',
    high: 'text-destructive',
    slightly_low: 'text-warning-foreground',
    low: 'text-destructive',
    critical: 'text-destructive',
  }[status];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{low} {unit}</span>
        <span className={`font-semibold ${statusLabelColor}`}>{statusLabel}</span>
        <span className="text-muted-foreground">{high} {unit}</span>
      </div>
      <div className="relative h-3 rounded-full bg-muted overflow-hidden">
        {/* Low zone */}
        <div
          className="absolute h-full bg-warning/20 rounded-l-full"
          style={{ left: '0%', width: `${normalStart}%` }}
        />
        {/* Normal zone */}
        <div
          className="absolute h-full bg-success/25"
          style={{ left: `${normalStart}%`, width: `${normalWidth}%` }}
        />
        {/* High zone */}
        <div
          className="absolute h-full bg-warning/20 rounded-r-full"
          style={{ left: `${normalStart + normalWidth}%`, width: `${100 - normalStart - normalWidth}%` }}
        />
        {/* Value marker */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full ${statusColor} border-2 border-card shadow-md transition-all`}
          style={{ left: `${markerPos}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>
      <div className="flex items-center justify-center">
        <span className="text-sm font-bold">{value} <span className="text-xs font-normal text-muted-foreground">{unit}</span></span>
      </div>
    </div>
  );
}
