import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ContextPanel, ContextSection } from '@/components/layout/ContextPanel';
import { StatusChip, SourceBadge, CategoryBadge, TrendIndicator } from '@/components/shared/Badges';
import { Sparkline } from '@/components/shared/Charts';
import { appointments, diagnoses, medications, healthMetrics, documents, recommendations } from '@/data/mockData';
import { CalendarDays, FileText, Download, Copy } from 'lucide-react';

export default function AppointmentPrepPage() {
  const upcomingAppts = appointments.filter(a => a.status === 'upcoming');
  const [selectedApptId, setSelectedApptId] = useState(upcomingAppts[0]?.id || '');
  const selected = appointments.find(a => a.id === selectedApptId);

  const linkedDiags = selected ? diagnoses.filter(d => selected.linkedDiagnoses.includes(d.id)) : [];
  const activeMeds = medications.filter(m => m.status === 'active');
  const relevantRecs = recommendations.filter(r => r.category === 'appointment_prep' || r.category === 'clinician_followup');
  const recentDocs = documents.slice(0, 4);
  const relevantMetrics = healthMetrics.filter(m => m.trend !== 'stable').slice(0, 4);

  const contextContent = (
    <ContextPanel>
      <ContextSection title="Preparation Checklist">
        <div className="space-y-2">
          {[
            'Review diagnoses relevant to visit',
            'Check recent measurement trends',
            'Prepare questions for provider',
            'Gather documents to bring',
            'Note medication changes',
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded border-border text-primary" />
              <span className="text-muted-foreground">{item}</span>
            </label>
          ))}
        </div>
      </ContextSection>
      <ContextSection title="Documents to Bring">
        {recentDocs.slice(0, 3).map(doc => (
          <div key={doc.id} className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <FileText className="h-3 w-3" />
            {doc.fileName}
          </div>
        ))}
      </ContextSection>
    </ContextPanel>
  );

  return (
    <AppShell pageTitle="Appointment Prep" contextContent={contextContent}>
      <div className="space-y-6 max-w-4xl animate-fade-in">
        {/* Appointment selector */}
        <div className="flex gap-3 flex-wrap">
          {upcomingAppts.map(a => (
            <button
              key={a.id}
              onClick={() => setSelectedApptId(a.id)}
              className={`health-card transition-all ${selectedApptId === a.id ? 'ring-2 ring-primary/30' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{a.provider}</span>
              </div>
              <p className="text-xs text-muted-foreground">{a.specialty}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(a.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </button>
          ))}
        </div>

        {selected && (
          <>
            {/* Visit Brief */}
            <div className="health-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="section-title">Visit Brief</h2>
                  <p className="section-subtitle">{selected.provider} · {selected.specialty}</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs font-medium text-muted-foreground hover:bg-accent transition-colors">
                    <Copy className="h-3 w-3" /> Copy
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity">
                    <Download className="h-3 w-3" /> Export
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                {/* Appointment info */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm font-medium">{new Date(selected.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Provider</p>
                    <p className="text-sm font-medium">{selected.provider}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Reason</p>
                    <p className="text-sm font-medium">{selected.reason}</p>
                  </div>
                </div>

                {/* Relevant diagnoses */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Relevant Diagnoses</h3>
                  <div className="space-y-2">
                    {linkedDiags.map(d => (
                      <div key={d.id} className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2">
                        <StatusChip status={d.status} />
                        <span className="text-sm">{d.name}</span>
                        <SourceBadge source={d.sourceType} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active medications */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Active Medications</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {activeMeds.map(m => (
                      <div key={m.id} className="rounded-lg bg-muted px-3 py-2">
                        <p className="text-sm font-medium">{m.name} {m.dosage}</p>
                        <p className="text-xs text-muted-foreground">{m.frequency} · Since {new Date(m.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent trends */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Recent Health Trends</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {relevantMetrics.map(m => (
                      <div key={m.id} className="rounded-lg bg-muted px-3 py-2.5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">{m.name}</span>
                          <TrendIndicator trend={m.trend} />
                        </div>
                        <Sparkline data={m.data7d} height={32} />
                        <p className="text-[11px] text-muted-foreground mt-1">{m.insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested questions */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Suggested Questions</h3>
                  <ul className="space-y-1.5">
                    {linkedDiags.flatMap(d => d.suggestedQuestions).slice(0, 5).map((q, i) => (
                      <li key={i} className="text-sm bg-accent/50 rounded-lg px-3 py-2">{q}</li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Recommendations</h3>
                  <div className="space-y-2">
                    {relevantRecs.map(r => (
                      <div key={r.id} className="rounded-lg bg-muted px-3 py-2.5">
                        <div className="flex items-center gap-2 mb-1">
                          <CategoryBadge category={r.category} />
                          <span className="text-sm font-medium">{r.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{r.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
