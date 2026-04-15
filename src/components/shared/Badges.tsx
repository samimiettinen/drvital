import { type SourceType, type DiagnosisStatus, type RecommendationCategory } from '@/data/mockData';
import { FileText, Upload, Apple, UserCheck, Heart, Stethoscope, CalendarDays, Accessibility } from 'lucide-react';

const sourceLabels: Record<SourceType, { label: string; icon: typeof FileText }> = {
  clinical_note: { label: 'Clinical Note', icon: FileText },
  uploaded_file: { label: 'Uploaded File', icon: Upload },
  apple_clinical: { label: 'Apple Health', icon: Apple },
  user_confirmed: { label: 'User Confirmed', icon: UserCheck },
};

export function SourceBadge({ source }: { source: SourceType }) {
  const config = sourceLabels[source];
  const Icon = config.icon;
  return (
    <span className="source-badge bg-muted text-muted-foreground">
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

const statusConfig: Record<DiagnosisStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'status-chip-active' },
  resolved: { label: 'Resolved', className: 'status-chip-resolved' },
  suspected: { label: 'Suspected', className: 'status-chip-suspected' },
};

export function StatusChip({ status }: { status: DiagnosisStatus }) {
  const config = statusConfig[status];
  return <span className={`status-chip ${config.className}`}>{config.label}</span>;
}

const categoryConfig: Record<RecommendationCategory, { label: string; icon: typeof Heart; className: string }> = {
  wellness: { label: 'Wellness', icon: Heart, className: 'bg-success/10 text-success-foreground' },
  appointment_prep: { label: 'Appointment Prep', icon: CalendarDays, className: 'bg-info/10 text-info-foreground' },
  accessibility: { label: 'Accessibility', icon: Accessibility, className: 'bg-accent text-accent-foreground' },
  clinician_followup: { label: 'Clinician Follow-up', icon: Stethoscope, className: 'bg-warning/10 text-warning-foreground' },
};

export function CategoryBadge({ category }: { category: RecommendationCategory }) {
  const config = categoryConfig[category];
  const Icon = config.icon;
  return (
    <span className={`source-badge ${config.className}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

export function TrendIndicator({ trend }: { trend: 'improving' | 'stable' | 'declining' | 'variable' }) {
  const config = {
    improving: { label: 'Improving', className: 'text-success' },
    stable: { label: 'Stable', className: 'text-muted-foreground' },
    declining: { label: 'Declining', className: 'text-destructive' },
    variable: { label: 'Variable', className: 'text-warning' },
  };
  const c = config[trend];
  return <span className={`text-xs font-medium ${c.className}`}>{c.label}</span>;
}

export function PriorityDot({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  const colors = { high: 'bg-destructive', medium: 'bg-warning', low: 'bg-muted-foreground' };
  return <span className={`inline-block h-2 w-2 rounded-full ${colors[priority]}`} />;
}
