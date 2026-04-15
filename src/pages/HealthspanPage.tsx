import { AppShell } from '@/components/layout/AppShell';
import { ContextPanel, ContextSection } from '@/components/layout/ContextPanel';
import { healthspanData, healthMetrics } from '@/data/mockData';
import { TrendChart } from '@/components/shared/Charts';

const scoreColor = (score: number) => {
  if (score >= 75) return 'text-success';
  if (score >= 50) return 'text-warning';
  return 'text-destructive';
};

export default function HealthspanPage() {
  const bd = healthspanData.breakdown;
  const categories = [
    { label: 'Sleep', score: bd.sleep },
    { label: 'Recovery', score: bd.recovery },
    { label: 'Activity', score: bd.activity },
    { label: 'Cardiovascular', score: bd.cardiovascular },
    { label: 'Clinical Burden', score: bd.clinicalBurden },
  ];

  const contextContent = (
    <ContextPanel>
      <ContextSection title="About Healthspan Score">
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          This score reflects your long-term resilience, recovery quality, and behavior stability based on wearable and self-reported data.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This is a wellness-oriented interpretation. It is not a medical prediction or life expectancy estimate.
        </p>
      </ContextSection>
      <ContextSection title="Trends">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">30-day direction</span>
            <span className="font-medium capitalize">{healthspanData.trend30d}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">90-day direction</span>
            <span className="font-medium capitalize">{healthspanData.trend90d}</span>
          </div>
        </div>
      </ContextSection>
    </ContextPanel>
  );

  return (
    <AppShell pageTitle="Healthspan" contextContent={contextContent}>
      <div className="space-y-6 max-w-4xl animate-fade-in">
        {/* Score hero */}
        <div className="health-card text-center py-8">
          <p className="text-sm text-muted-foreground mb-2">Healthspan & Resilience Score</p>
          <div className={`text-6xl font-bold font-display ${scoreColor(healthspanData.overall)}`}>
            {healthspanData.overall}
          </div>
          <p className="text-sm text-muted-foreground mt-2">out of 100 · based on your personal baseline</p>
        </div>

        {/* Breakdown */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map(c => (
            <div key={c.label} className="health-card text-center">
              <p className="text-xs text-muted-foreground mb-1">{c.label}</p>
              <p className={`text-2xl font-bold font-display ${scoreColor(c.score)}`}>{c.score}</p>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${c.score}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Resilience trend chart */}
        <div className="health-card">
          <h2 className="section-title mb-1">Recovery & HRV Trend</h2>
          <p className="section-subtitle mb-4">30-day trend compared to your baseline</p>
          <TrendChart
            data={healthMetrics.find(m => m.name === 'HRV')?.data30d || []}
            baseline={42}
            unit="ms"
            height={200}
          />
        </div>

        {/* What's helping / hurting */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="health-card">
            <h3 className="section-title text-success mb-3">What is helping</h3>
            <ul className="space-y-2">
              {healthspanData.helping.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-success flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="health-card">
            <h3 className="section-title text-destructive mb-3">What is hurting</h3>
            <ul className="space-y-2">
              {healthspanData.hurting.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div className="health-card">
          <h3 className="section-title mb-3">Behavioral Recommendations</h3>
          <div className="space-y-3">
            <div className="rounded-lg bg-muted px-4 py-3">
              <p className="text-sm font-medium mb-1">Prioritize sleep consistency</p>
              <p className="text-xs text-muted-foreground">Variable sleep is the top factor reducing your recovery score. Consistent timing may improve HRV within 1–2 weeks.</p>
            </div>
            <div className="rounded-lg bg-muted px-4 py-3">
              <p className="text-sm font-medium mb-1">Increase daily movement</p>
              <p className="text-xs text-muted-foreground">Activity below your baseline correlates with lower recovery quality. Even short walks help.</p>
            </div>
            <div className="rounded-lg bg-muted px-4 py-3">
              <p className="text-sm font-medium mb-1">Continue medication adherence</p>
              <p className="text-xs text-muted-foreground">Consistent medication is positively associated with your cardiovascular score stability.</p>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-accent/30 px-4 py-2.5">
            <p className="text-[11px] text-muted-foreground">These are wellness-oriented recommendations, not medical advice. Discuss persistent concerns with your clinician.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
