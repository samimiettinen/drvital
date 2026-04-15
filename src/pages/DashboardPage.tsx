import { AppShell } from '@/components/layout/AppShell';
import { ContextPanel, ContextSection } from '@/components/layout/ContextPanel';
import { StatusChip, SourceBadge, CategoryBadge, PriorityDot, TrendIndicator } from '@/components/shared/Badges';
import { Sparkline } from '@/components/shared/Charts';
import {
  diagnoses, healthMetrics, appointments, recommendations,
  events, documents, healthspanData, accessibilityPlans
} from '@/data/mockData';
import { CalendarDays, ArrowRight, FileText, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const activeDiagnoses = diagnoses.filter(d => d.status === 'active');
  const upcomingAppt = appointments.find(a => a.status === 'upcoming');
  const recentDocs = documents.slice(0, 3);
  const topRecs = recommendations.filter(r => r.priority === 'high').slice(0, 3);
  const upcomingEvent = events.find(e => new Date(e.startDate) > new Date());
  const declinedMetrics = healthMetrics.filter(m => m.trend === 'declining' || m.trend === 'variable');

  const contextContent = (
    <ContextPanel>
      <ContextSection title="Quick Facts">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Active diagnoses</span>
            <span className="font-medium">{activeDiagnoses.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Active medications</span>
            <span className="font-medium">4</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Healthspan score</span>
            <span className="font-medium text-primary">{healthspanData.overall}/100</span>
          </div>
        </div>
      </ContextSection>
      <ContextSection title="Alerts">
        {declinedMetrics.map(m => (
          <div key={m.id} className="flex items-start gap-2 text-sm mb-2">
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 text-warning flex-shrink-0" />
            <span className="text-muted-foreground">{m.name}: {m.trend}</span>
          </div>
        ))}
      </ContextSection>
      <ContextSection title="Next Steps">
        {topRecs.map(r => (
          <div key={r.id} className="flex items-start gap-2 text-sm mb-2.5">
            <PriorityDot priority={r.priority} />
            <span className="text-muted-foreground">{r.actionText}</span>
          </div>
        ))}
      </ContextSection>
    </ContextPanel>
  );

  return (
    <AppShell pageTitle="Dashboard" contextContent={contextContent}>
      <div className="space-y-6 max-w-4xl animate-fade-in">
        {/* Hero summary */}
        <div className="health-card bg-accent/30 border-primary/20">
          <p className="text-sm text-muted-foreground mb-1">Today's summary</p>
          <p className="text-base text-foreground leading-relaxed">
            You're managing <strong>{activeDiagnoses.length} active conditions</strong>. Recovery metrics are
            slightly below your baseline this week. Your next appointment is with{' '}
            <strong>{upcomingAppt?.provider}</strong> on{' '}
            <strong>{upcomingAppt ? new Date(upcomingAppt.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'N/A'}</strong>.
            Consider preparing your visit brief.
          </p>
        </div>

        {/* Active Diagnoses */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">Active Diagnoses</h2>
            <Link to="/diagnoses" className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeDiagnoses.map(d => (
              <Link to="/diagnoses" key={d.id} className="health-card group cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <StatusChip status={d.status} />
                  <SourceBadge source={d.sourceType} />
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1">{d.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{d.explanation}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Recovery Snapshot */}
        <section>
          <h2 className="section-title mb-3">Recovery Snapshot</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {healthMetrics.slice(0, 4).map(m => (
              <div key={m.id} className="metric-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{m.name}</span>
                  <TrendIndicator trend={m.trend} />
                </div>
                <div className="text-xl font-semibold font-display">{m.current} <span className="text-xs font-normal text-muted-foreground">{m.unit}</span></div>
                <Sparkline data={m.data7d} />
                <p className="text-[11px] text-muted-foreground leading-snug">{m.insight}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Next Appointment + Recommendations */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Next Appointment */}
          {upcomingAppt && (
            <section className="health-card">
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays className="h-4 w-4 text-primary" />
                <h2 className="section-title">Next Appointment</h2>
              </div>
              <p className="text-sm font-medium">{upcomingAppt.provider}</p>
              <p className="text-xs text-muted-foreground">{upcomingAppt.specialty}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(upcomingAppt.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <p className="text-xs text-muted-foreground mt-2">{upcomingAppt.reason}</p>
              <Link to="/appointment-prep" className="inline-flex items-center gap-1 mt-3 text-xs text-primary font-medium hover:underline">
                Prepare visit brief <ArrowRight className="h-3 w-3" />
              </Link>
            </section>
          )}

          {/* Recommendations */}
          <section className="health-card">
            <h2 className="section-title mb-3">Recommendations</h2>
            <div className="space-y-3">
              {topRecs.map(r => (
                <div key={r.id} className="flex items-start gap-3">
                  <PriorityDot priority={r.priority} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium">{r.title}</span>
                      <CategoryBadge category={r.category} />
                    </div>
                    <p className="text-xs text-muted-foreground">{r.rationale}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Recent Documents */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">Recent Documents</h2>
            <Link to="/documents" className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentDocs.map(doc => (
              <div key={doc.id} className="health-card flex items-center gap-4 py-3">
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.fileName}</p>
                  <p className="text-xs text-muted-foreground">{doc.provider} · {new Date(doc.documentDate).toLocaleDateString()}</p>
                </div>
                <SourceBadge source={doc.sourceType} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
