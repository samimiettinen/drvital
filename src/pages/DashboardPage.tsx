import { useState, useCallback } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ContextPanel, ContextSection } from '@/components/layout/ContextPanel';
import { StatusChip, SourceBadge, CategoryBadge, PriorityDot, TrendIndicator } from '@/components/shared/Badges';
import { MedicalTerm } from '@/components/shared/MedicalTerm';
import { Sparkline } from '@/components/shared/Charts';
import { YearAtAGlance } from '@/components/dashboard/YearAtAGlance';
import { HealthStoryCard } from '@/components/dashboard/HealthStoryCard';
import { CoachSummary } from '@/components/dashboard/CoachSummary';
import { DocumentDropZone } from '@/components/dashboard/DocumentDropZone';
import { AppointmentHero } from '@/components/dashboard/AppointmentHero';
import {
  diagnoses, healthMetrics, appointments, recommendations,
  events, documents, healthspanData
} from '@/data/mockData';
import { CalendarDays, ArrowRight, FileText, AlertCircle, TrendingUp, TrendingDown, Activity, Heart, Moon, Footprints } from 'lucide-react';
import { Link } from 'react-router-dom';

const metricIcons: Record<string, typeof Heart> = {
  'Sleep Duration': Moon,
  'HRV': Heart,
  'Resting Heart Rate': Activity,
  'Steps': Footprints,
};

export default function DashboardPage() {
  const activeDiagnoses = diagnoses.filter(d => d.status === 'active');
  const upcomingAppt = appointments.find(a => a.status === 'upcoming');
  const topRecs = recommendations.filter(r => r.priority === 'high').slice(0, 4);
  const declinedMetrics = healthMetrics.filter(m => m.trend === 'declining' || m.trend === 'variable');

  const contextContent = (
    <ContextPanel>
      <ContextSection title="Health Snapshot">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Healthspan</span>
            <span className="font-semibold text-primary">{healthspanData.overall}/100</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: `${healthspanData.overall}%` }} />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Active conditions</span>
            <span className="font-medium">{activeDiagnoses.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Active medications</span>
            <span className="font-medium">4</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Documents</span>
            <span className="font-medium">{documents.length}</span>
          </div>
        </div>
      </ContextSection>
      <ContextSection title="Needs Attention">
        {declinedMetrics.map(m => (
          <div key={m.id} className="flex items-start gap-2.5 mb-3">
            <div className="mt-0.5 h-5 w-5 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-3 w-3 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.trend} — {m.insight.split('.')[0]}.</p>
            </div>
          </div>
        ))}
      </ContextSection>
      <ContextSection title="Priority Actions">
        {topRecs.slice(0, 3).map(r => (
          <div key={r.id} className="flex items-start gap-2.5 mb-3">
            <PriorityDot priority={r.priority} />
            <div>
              <p className="text-sm font-medium">{r.title}</p>
              <CategoryBadge category={r.category} />
            </div>
          </div>
        ))}
      </ContextSection>
    </ContextPanel>
  );

  return (
    <AppShell pageTitle="Dashboard" contextContent={contextContent}>
      <div className="space-y-6 max-w-5xl">
        {/* Coach Summary — "Your year at a glance" */}
        <CoachSummary />

        {/* Hero Action — Appointment Prep */}
        <AppointmentHero appointment={upcomingAppt!} />

        {/* Year at a Glance Cards */}
        <YearAtAGlance />

        {/* Recovery Metrics Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="section-title">Recovery & Vitals</h2>
              <p className="section-subtitle">7-day snapshot compared to your baseline</p>
            </div>
            <Link to="/health-trends" className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
              All trends <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {healthMetrics.slice(0, 4).map(m => {
              const Icon = metricIcons[m.name] || Activity;
              const diff = m.current - m.baseline;
              const diffLabel = diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
              return (
                <div key={m.id} className="health-card-hover">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                      <Icon className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <TrendIndicator trend={m.trend} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-0.5"><MedicalTerm term={m.name} /></p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-display">{m.current}</span>
                    <span className="text-xs text-muted-foreground">{m.unit}</span>
                    <span className={`text-xs font-medium ${diff >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {diffLabel}
                    </span>
                  </div>
                  <div className="mt-2">
                    <Sparkline data={m.data7d} height={36} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Active Diagnoses + Recommendations */}
        <div className="grid gap-4 lg:grid-cols-5">
          {/* Active Diagnoses */}
          <section className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Active Diagnoses</h2>
              <Link to="/diagnoses" className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2.5">
              {activeDiagnoses.map(d => (
                <Link to="/diagnoses" key={d.id} className="health-card-hover flex items-start gap-4 group">
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-accent-foreground">{d.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm"><MedicalTerm term={d.name}>{d.name}</MedicalTerm></h3>
                      <StatusChip status={d.status} />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-1.5">{d.explanation}</p>
                    <div className="flex items-center gap-2">
                      <SourceBadge source={d.sourceType} />
                      {d.relatedMedications.slice(0, 1).map(m => (
                        <span key={m} className="source-badge bg-secondary text-secondary-foreground">{m}</span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-2" />
                </Link>
              ))}
            </div>
          </section>

          {/* Recommendations */}
          <section className="lg:col-span-2">
            <h2 className="section-title mb-4">Recommendations</h2>
            <div className="space-y-2.5">
              {topRecs.map(r => (
                <div key={r.id} className="health-card p-4">
                  <div className="flex items-start gap-2.5">
                    <PriorityDot priority={r.priority} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{r.title}</span>
                      </div>
                      <CategoryBadge category={r.category} />
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{r.rationale.split('.')[0]}.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* What is my story? */}
        <HealthStoryCard />

        {/* Document Upload Zone */}
        <DocumentDropZone />

        {/* Recent Documents */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Recent Records</h2>
            <Link to="/documents" className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {documents.slice(0, 6).map(doc => (
              <div key={doc.id} className="health-card-hover p-4 flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.fileName}</p>
                  <p className="text-[11px] text-muted-foreground">{doc.provider} · {new Date(doc.documentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <SourceBadge source={doc.sourceType} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
