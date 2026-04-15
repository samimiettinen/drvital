import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ContextPanel, ContextSection } from '@/components/layout/ContextPanel';
import { TrendChart, Sparkline } from '@/components/shared/Charts';
import { MedicalTerm } from '@/components/shared/MedicalTerm';
import { healthspanData, healthMetrics } from '@/data/mockData';
import { biomarkers } from '@/data/biomarkerData';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

type FilterCategory = 'all' | 'labs' | 'vitals' | 'lifestyle';

const dimensionLabels: Record<string, { label: string; description: string }> = {
  sleep: { label: 'Sleep Quality', description: 'Duration, consistency, and restorative phases' },
  recovery: { label: 'Recovery', description: 'HRV trends and nervous system restoration' },
  activity: { label: 'Activity', description: 'Daily movement and exercise patterns' },
  cardiovascular: { label: 'Heart Health', description: 'Resting heart rate and cardiovascular fitness' },
  clinicalBurden: { label: 'Clinical Balance', description: 'Medication tolerance and condition management' },
};

const dimensionStatus = (score: number): string => {
  if (score >= 75) return 'Optimal';
  if (score >= 65) return 'Steady';
  if (score >= 50) return 'Needs attention';
  return 'Concerning';
};

export default function HealthOverviewPage() {
  const [evidenceOpen, setEvidenceOpen] = useState(true);
  const [evidenceFilter, setEvidenceFilter] = useState<FilterCategory>('all');
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  const [range, setRange] = useState<'7d' | '30d'>('30d');

  const bd = healthspanData.breakdown;
  const dimensions = [
    { key: 'sleep', score: bd.sleep },
    { key: 'recovery', score: bd.recovery },
    { key: 'activity', score: bd.activity },
    { key: 'cardiovascular', score: bd.cardiovascular },
    { key: 'clinicalBurden', score: bd.clinicalBurden },
  ];

  // Compute deltas for "What is Changing"
  const changingMetrics = healthMetrics
    .filter(m => m.trend !== 'stable')
    .map(m => {
      const diff = m.current - m.baseline;
      const pct = m.baseline !== 0 ? ((diff / m.baseline) * 100) : 0;
      return { ...m, diff, pct };
    });

  // Filter metrics for evidence section
  const filteredMetrics = healthMetrics.filter(m => {
    if (evidenceFilter === 'all') return true;
    if (evidenceFilter === 'labs') return false; // labs come from biomarkers
    if (evidenceFilter === 'vitals') return ['heart', 'body', 'respiratory'].includes(m.category);
    if (evidenceFilter === 'lifestyle') return ['sleep', 'activity'].includes(m.category);
    return true;
  });

  const filteredBiomarkers = evidenceFilter === 'vitals' || evidenceFilter === 'lifestyle'
    ? []
    : biomarkers;

  const contextContent = (
    <ContextPanel>
      <ContextSection title="About This View">
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          This page synthesizes your health data into a single narrative — from wearables, lab results, and clinical records.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Scores reflect wellness trends, not medical predictions. Discuss concerns with your clinician.
        </p>
      </ContextSection>
      <ContextSection title="Trend Direction">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">30-day</span>
            <span className="font-medium capitalize">{healthspanData.trend30d}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">90-day</span>
            <span className="font-medium capitalize">{healthspanData.trend90d}</span>
          </div>
        </div>
      </ContextSection>
      <ContextSection title="What's Helping">
        <ul className="space-y-1.5">
          {healthspanData.helping.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-success flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </ContextSection>
      <ContextSection title="What's Hurting">
        <ul className="space-y-1.5">
          {healthspanData.hurting.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </ContextSection>
    </ContextPanel>
  );

  return (
    <AppShell pageTitle="My Health Story" contextContent={contextContent}>
      <div className="space-y-16 max-w-4xl animate-fade-in pb-12">

        {/* ═══════════════════════════════════════════════
            SECTION 1: YOUR HEALTH NOW
            ═══════════════════════════════════════════════ */}
        <section className="space-y-8">
          <header className="space-y-3">
            <h2 className="text-2xl font-light tracking-tight text-foreground">
              Your Health Now
            </h2>
            <p className="text-sm text-muted-foreground">
              A snapshot of where you stand today, synthesized from your latest data.
            </p>
          </header>

          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Healthspan Score Circle */}
            <div className="col-span-12 md:col-span-4">
              <div className="relative aspect-square rounded-full border border-border flex items-center justify-center bg-card/40 shadow-sm max-w-[240px] mx-auto">
                <div className="text-center space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                    Healthspan Score
                  </span>
                  <div className="text-6xl font-light tracking-tighter text-foreground tabular-nums">
                    {healthspanData.overall}
                  </div>
                  <div className="text-sm text-muted-foreground italic">
                    {healthspanData.overall >= 75 ? 'Optimal Resilience' :
                     healthspanData.overall >= 60 ? 'Steady Progress' : 'Needs Attention'}
                  </div>
                </div>
                <div className="absolute inset-3 rounded-full border border-dashed border-border/40 animate-[spin_90s_linear_infinite]" />
              </div>
            </div>

            {/* Dimensions + AI Synthesis */}
            <div className="col-span-12 md:col-span-8 space-y-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {dimensions.map(d => (
                  <div key={d.key} className="space-y-1.5">
                    <div className="flex justify-between items-end border-b border-border pb-1.5">
                      <span className="text-xs text-muted-foreground">
                        {dimensionLabels[d.key].label}
                      </span>
                      <span className="text-xs font-medium text-foreground">
                        {dimensionStatus(d.score)}
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${d.score}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {dimensionLabels[d.key].description}
                    </p>
                  </div>
                ))}
              </div>

              {/* AI Synthesis */}
              <div className="rounded-xl bg-accent/30 border border-primary/10 px-5 py-4">
                <p className="text-sm leading-relaxed text-foreground italic">
                  "Your overall trajectory is stable with signs of improvement in cardiovascular health and weight management.
                  The main areas to watch are sleep consistency and recovery — your HRV has dipped below baseline this week,
                  likely reflecting recent stress. Maintaining your current medication adherence and dietary changes is supporting
                  positive momentum."
                </p>
                <p className="text-[10px] text-muted-foreground mt-2 not-italic">
                  Synthesis based on {healthMetrics.length} tracked metrics and {biomarkers.length} lab values
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* ═══════════════════════════════════════════════
            SECTION 2: WHAT IS CHANGING
            ═══════════════════════════════════════════════ */}
        <section className="space-y-6">
          <div className="flex justify-between items-baseline">
            <div>
              <h2 className="text-2xl font-light tracking-tight text-foreground">What is Changing</h2>
              <p className="text-sm text-muted-foreground mt-1">Key shifts compared to your baseline</p>
            </div>
            <div className="flex gap-2">
              {(['7d', '30d'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    range === r ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {r === '7d' ? '7 Days' : '30 Days'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {changingMetrics.slice(0, 4).map(m => {
              const isImproving = m.trend === 'improving';
              const isDeclining = m.trend === 'declining';
              return (
                <div
                  key={m.id}
                  className="group rounded-2xl bg-card border border-border p-5 hover:border-primary/20 transition-all duration-300"
                >
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
                    <MedicalTerm term={m.name} />
                  </span>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-light tracking-tight tabular-nums text-foreground">
                      {m.current}
                    </span>
                    <span className="text-xs text-muted-foreground">{m.unit}</span>
                    <span className={`text-xs font-medium ml-auto ${
                      isImproving ? 'text-success' : isDeclining ? 'text-destructive' : 'text-warning'
                    }`}>
                      {m.diff > 0 ? '+' : ''}{m.diff.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-4">
                    {isImproving && <ArrowUpRight className="h-3 w-3 text-success" />}
                    {isDeclining && <ArrowDownRight className="h-3 w-3 text-destructive" />}
                    {!isImproving && !isDeclining && <Minus className="h-3 w-3 text-warning" />}
                    <span className={`text-xs italic ${
                      isImproving ? 'text-success' : isDeclining ? 'text-destructive' : 'text-warning'
                    }`}>
                      {m.trend === 'improving' ? 'Improving' : m.trend === 'declining' ? 'Declining' : 'Variable'}
                    </span>
                  </div>
                  <div className="h-10">
                    <Sparkline data={range === '7d' ? m.data7d : m.data30d} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stable metrics note */}
          {healthMetrics.filter(m => m.trend === 'stable').length > 0 && (
            <div className="rounded-lg bg-muted px-4 py-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Holding steady: </span>
                {healthMetrics.filter(m => m.trend === 'stable').map(m => m.name).join(', ')} — no significant changes this period.
              </p>
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* ═══════════════════════════════════════════════
            SECTION 3: EVIDENCE & DETAILS
            ═══════════════════════════════════════════════ */}
        <section className="space-y-6">
          <button
            onClick={() => setEvidenceOpen(!evidenceOpen)}
            className="flex items-center justify-between w-full text-left group"
          >
            <div>
              <h2 className="text-2xl font-light tracking-tight text-foreground">Evidence & Details</h2>
              <p className="text-sm text-muted-foreground mt-1">The raw data behind your story</p>
            </div>
            {evidenceOpen
              ? <ChevronUp className="h-5 w-5 text-muted-foreground" />
              : <ChevronDown className="h-5 w-5 text-muted-foreground" />
            }
          </button>

          {evidenceOpen && (
            <div className="space-y-6 animate-fade-in">
              {/* Filter pills */}
              <div className="flex gap-2">
                {([
                  { key: 'all', label: 'All Data' },
                  { key: 'labs', label: 'Lab Values' },
                  { key: 'vitals', label: 'Vitals' },
                  { key: 'lifestyle', label: 'Lifestyle' },
                ] as { key: FilterCategory; label: string }[]).map(f => (
                  <button
                    key={f.key}
                    onClick={() => setEvidenceFilter(f.key)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      evidenceFilter === f.key
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-muted-foreground border border-border hover:bg-muted'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Lab values */}
              {filteredBiomarkers.length > 0 && (
                <div className="space-y-1">
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">
                    Lab Results
                  </h3>
                  {filteredBiomarkers.map(b => (
                    <div
                      key={b.id}
                      className="group rounded-xl bg-card/40 hover:bg-card border border-transparent hover:border-border p-4 transition-all cursor-pointer"
                      onClick={() => setExpandedMetric(expandedMetric === b.id ? null : b.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 flex-1 min-w-0">
                          <div className="w-40 flex-shrink-0">
                            <span className="text-sm font-medium text-foreground truncate block">
                              {b.plainName}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase">{b.medicalName}</span>
                          </div>
                          <div className="w-24 flex-shrink-0">
                            <span className="text-sm tabular-nums text-foreground">
                              {b.value} {b.unit}
                            </span>
                          </div>
                          <div className="flex-1 hidden sm:block">
                            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  b.status === 'normal' ? 'bg-success' :
                                  (b.status === 'slightly_high' || b.status === 'slightly_low') ? 'bg-warning' : 'bg-destructive'
                                }`}
                                style={{ width: `${Math.min(((b.value - b.referenceRange.low) / (b.referenceRange.high - b.referenceRange.low)) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ml-3 ${
                          b.status === 'normal' ? 'bg-success/10 text-success' :
                          (b.status === 'slightly_high' || b.status === 'slightly_low') ? 'bg-warning/10 text-warning' :
                          'bg-destructive/10 text-destructive'
                        }`}>
                          {b.status.replace('_', ' ')}
                        </span>
                      </div>
                      {expandedMetric === b.id && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs text-muted-foreground leading-relaxed">{b.explanation}</p>
                          <p className="text-[10px] text-muted-foreground mt-2">
                            Range: {b.referenceRange.low}–{b.referenceRange.high} {b.unit} · {b.sourceProvider} · {b.date}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Wearable / Vital metrics */}
              {filteredMetrics.length > 0 && (
                <div className="space-y-1">
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">
                    {evidenceFilter === 'lifestyle' ? 'Lifestyle Metrics' : 'Tracked Metrics'}
                  </h3>
                  {filteredMetrics.map(m => (
                    <div
                      key={m.id}
                      className="group rounded-xl bg-card/40 hover:bg-card border border-transparent hover:border-border p-4 transition-all cursor-pointer"
                      onClick={() => setExpandedMetric(expandedMetric === m.id ? null : m.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 flex-1 min-w-0">
                          <div className="w-40 flex-shrink-0">
                            <span className="text-sm font-medium text-foreground">
                              <MedicalTerm term={m.name} />
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase block capitalize">
                              {m.source.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="w-24 flex-shrink-0">
                            <span className="text-sm tabular-nums text-foreground">
                              {m.current} {m.unit}
                            </span>
                          </div>
                          <div className="flex-1 hidden sm:block h-8">
                            <Sparkline data={range === '7d' ? m.data7d : m.data30d} height={32} />
                          </div>
                        </div>
                        <span className={`text-xs font-medium capitalize ml-3 ${
                          m.trend === 'improving' ? 'text-success' :
                          m.trend === 'declining' ? 'text-destructive' :
                          m.trend === 'variable' ? 'text-warning' : 'text-muted-foreground'
                        }`}>
                          {m.trend}
                        </span>
                      </div>
                      {expandedMetric === m.id && (
                        <div className="mt-3 pt-3 border-t border-border space-y-3">
                          <p className="text-xs text-muted-foreground leading-relaxed">{m.insight}</p>
                          <div className="h-40">
                            <TrendChart
                              data={range === '7d' ? m.data7d : m.data30d}
                              baseline={m.baseline}
                              unit={m.unit}
                              height={150}
                            />
                          </div>
                          <p className="text-[10px] text-muted-foreground">
                            Baseline: {m.baseline} {m.unit} · Current: {m.current} {m.unit}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Footer disclaimer */}
        <div className="rounded-lg bg-muted px-4 py-3">
          <p className="text-[11px] text-muted-foreground text-center">
            This view is for personal health organization. Scores and interpretations are wellness-oriented and do not constitute medical advice.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
