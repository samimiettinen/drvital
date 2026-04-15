import { Shield, ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';
import type { EvidenceStrength } from '@/data/biomarkerData';

const config: Record<EvidenceStrength, { label: string; icon: typeof Shield; className: string; description: string }> = {
  strong: { label: 'Strong evidence', icon: ShieldCheck, className: 'bg-success/10 text-success', description: 'Backed by clinical records or verified lab data' },
  moderate: { label: 'Moderate evidence', icon: Shield, className: 'bg-info/10 text-info-foreground', description: 'Supported by multiple data points' },
  suggestive: { label: 'Suggestive', icon: ShieldAlert, className: 'bg-warning/10 text-warning-foreground', description: 'Pattern observed but not clinically confirmed' },
  limited: { label: 'Limited data', icon: ShieldQuestion, className: 'bg-muted text-muted-foreground', description: 'Based on limited or self-reported data' },
};

export function ConfidenceBadge({ strength, showLabel = true }: { strength: EvidenceStrength; showLabel?: boolean }) {
  const c = config[strength];
  const Icon = c.icon;
  return (
    <span className={`source-badge ${c.className}`} title={c.description}>
      <Icon className="h-3 w-3" />
      {showLabel && c.label}
    </span>
  );
}

export function ExtractionConfidence({ confidence }: { confidence: number }) {
  const level = confidence >= 90 ? 'high' : confidence >= 75 ? 'moderate' : 'low';
  const colors = {
    high: 'bg-success/10 text-success',
    moderate: 'bg-warning/10 text-warning-foreground',
    low: 'bg-destructive/10 text-destructive',
  };
  const labels = {
    high: 'High confidence',
    moderate: 'Review suggested',
    low: 'Needs review',
  };
  return (
    <span className={`source-badge ${colors[level]}`} title={`${confidence}% extraction confidence`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[level]} · {confidence}%
    </span>
  );
}

export function SourceChain({ chain }: { chain: string[] }) {
  return (
    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
      {chain.map((step, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-border">→</span>}
          <span>{step}</span>
        </span>
      ))}
    </div>
  );
}
