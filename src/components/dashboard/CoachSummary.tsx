import { healthspanData, diagnoses, healthMetrics, appointments, events } from '@/data/mockData';
import { Sparkle, TrendingUp, Shield, Calendar } from 'lucide-react';

export function CoachSummary() {
  const activeDiags = diagnoses.filter(d => d.status === 'active');
  const improvingMetrics = healthMetrics.filter(m => m.trend === 'improving');
  const decliningMetrics = healthMetrics.filter(m => m.trend === 'declining');
  const nextAppt = appointments.find(a => a.status === 'upcoming');

  return (
    <div className="coach-card animate-fade-in">
      <div className="flex items-start gap-3 mb-4">
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Sparkle className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold font-display mb-0.5">Your year at a glance</h2>
          <p className="text-sm text-muted-foreground">Here's how you're doing — and what to focus on next.</p>
        </div>
      </div>

      <div className="bg-card/70 backdrop-blur-sm rounded-lg p-4 mb-4">
        <p className="text-sm leading-relaxed text-foreground">
          You're managing <strong>{activeDiags.length} active conditions</strong> with consistent medication adherence.
          Your weight has been <strong>trending down</strong> over the past month — a positive signal from your dietary changes.
          {decliningMetrics.length > 0 && (
            <> Recovery markers like <strong>HRV</strong> and <strong>activity</strong> are below your baseline this week,
            likely influenced by recent stress. </>
          )}
          {improvingMetrics.length > 0 && (
            <> Good news: <strong>{improvingMetrics.map(m => m.name).join(', ')}</strong> {improvingMetrics.length === 1 ? 'is' : 'are'} improving. </>
          )}
          Your healthspan score is <strong>{healthspanData.overall}/100</strong> — {healthspanData.trend90d === 'improving' ? 'trending upward over 90 days' : 'holding steady'}.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="stat-pill">
          <Shield className="h-3 w-3 text-primary" />
          {healthspanData.overall} healthspan
        </span>
        <span className="stat-pill">
          <TrendingUp className="h-3 w-3 text-success" />
          {improvingMetrics.length} improving
        </span>
        <span className="stat-pill">
          <Calendar className="h-3 w-3 text-info" />
          Next visit {nextAppt ? new Date(nextAppt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
        </span>
      </div>
    </div>
  );
}
