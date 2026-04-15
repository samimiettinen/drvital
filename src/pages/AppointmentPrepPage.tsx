import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ContextPanel, ContextSection } from '@/components/layout/ContextPanel';
import { StatusChip, SourceBadge, CategoryBadge, TrendIndicator } from '@/components/shared/Badges';
import { ConfidenceBadge } from '@/components/shared/ConfidenceBadge';
import { Sparkline } from '@/components/shared/Charts';
import { MedicalTerm } from '@/components/shared/MedicalTerm';
import { appointments, diagnoses, medications, healthMetrics, documents, recommendations, events } from '@/data/mockData';
import { biomarkers, healthStory } from '@/data/biomarkerData';
import { CalendarDays, FileText, Download, Copy, CheckCircle2, AlertCircle, TrendingUp, TrendingDown, ArrowRight, Clock, Pill, Activity, ChevronDown, ChevronUp, Printer } from 'lucide-react';

export default function AppointmentPrepPage() {
  const upcomingAppts = appointments.filter(a => a.status === 'upcoming');
  const [selectedApptId, setSelectedApptId] = useState(upcomingAppts[0]?.id || '');
  const selected = appointments.find(a => a.id === selectedApptId);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    brief: true, changes: true, diagnoses: true, meds: true, trends: true, questions: true, docs: true, recs: true
  });
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleCheck = (key: string) => setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));

  const linkedDiags = selected ? diagnoses.filter(d => selected.linkedDiagnoses.includes(d.id)) : [];
  const activeMeds = medications.filter(m => m.status === 'active');
  const relevantRecs = recommendations.filter(r => r.category === 'appointment_prep' || r.category === 'clinician_followup');
  const recentDocs = documents.slice(0, 4);
  const relevantMetrics = healthMetrics.filter(m => m.trend !== 'stable').slice(0, 4);
  const recentEvents = events.filter(e => new Date(e.endDate) > new Date('2025-10-01')).slice(0, 3);

  // Changes since last visit
  const lastVisit = appointments.find(a => a.status === 'completed');
  const changedBiomarkers = biomarkers.filter(b => b.previousValue !== undefined);

  const completedChecks = Object.values(checkedItems).filter(Boolean).length;
  const totalChecks = 7;

  const contextContent = (
    <ContextPanel>
      <ContextSection title="Preparation Progress">
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-muted-foreground">Checklist</span>
            <span className="font-semibold text-primary">{completedChecks}/{totalChecks}</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(completedChecks / totalChecks) * 100}%` }} />
          </div>
        </div>
        <div className="space-y-2">
          {[
            { key: 'rev_diag', label: 'Review relevant diagnoses' },
            { key: 'rev_meds', label: 'Check medication list is current' },
            { key: 'rev_trends', label: 'Review recent health trends' },
            { key: 'rev_changes', label: 'Note changes since last visit' },
            { key: 'rev_questions', label: 'Prepare questions for provider' },
            { key: 'rev_docs', label: 'Gather documents to bring' },
            { key: 'rev_brief', label: 'Review visit brief' },
          ].map(item => (
            <label key={item.key} className="flex items-center gap-2 text-sm cursor-pointer group">
              <input
                type="checkbox"
                checked={!!checkedItems[item.key]}
                onChange={() => toggleCheck(item.key)}
                className="rounded border-border text-primary focus:ring-primary/30"
              />
              <span className={`text-muted-foreground group-hover:text-foreground transition-colors ${checkedItems[item.key] ? 'line-through opacity-60' : ''}`}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </ContextSection>
      <ContextSection title="Documents to Bring">
        {recentDocs.slice(0, 3).map(doc => (
          <div key={doc.id} className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <FileText className="h-3 w-3" />
            <span className="truncate">{doc.fileName}</span>
            <SourceBadge source={doc.sourceType} />
          </div>
        ))}
      </ContextSection>
      <ContextSection title="Export Options">
        <div className="space-y-2">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
            <Download className="h-3.5 w-3.5" /> Download visit brief (PDF)
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:bg-accent transition-colors">
            <Copy className="h-3.5 w-3.5" /> Copy to clipboard
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:bg-accent transition-colors">
            <Printer className="h-3.5 w-3.5" /> Print-friendly version
          </button>
        </div>
      </ContextSection>
    </ContextPanel>
  );

  const SectionHeader = ({ id, icon: Icon, title, subtitle, badge }: { id: string; icon: typeof CalendarDays; title: string; subtitle?: string; badge?: React.ReactNode }) => (
    <button onClick={() => toggleSection(id)} className="flex items-center justify-between w-full text-left mb-3 group">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
          <Icon className="h-4 w-4 text-accent-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2">{title} {badge}</h3>
          {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {expandedSections[id] ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
    </button>
  );

  return (
    <AppShell pageTitle="Appointment Prep" contextContent={contextContent}>
      <div className="space-y-5 max-w-4xl animate-fade-in">
        {/* Appointment selector */}
        <div className="flex gap-3 flex-wrap">
          {upcomingAppts.map(a => (
            <button
              key={a.id}
              onClick={() => setSelectedApptId(a.id)}
              className={`health-card transition-all ${selectedApptId === a.id ? 'ring-2 ring-primary/30 border-primary/20' : ''}`}
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
            {/* Visit Brief Header */}
            <div className="health-card-elevated">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold font-display">Visit Brief</h2>
                    <span className="source-badge bg-primary/10 text-primary">
                      <Clock className="h-3 w-3" />
                      {Math.ceil((new Date(selected.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days away
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selected.provider} · {selected.specialty} · {selected.reason}</p>
                </div>
              </div>

              {/* Visit summary narrative */}
              <div className="rounded-lg bg-accent/30 border border-primary/10 px-4 py-3 mb-4">
                <p className="text-sm leading-relaxed text-foreground">
                  This visit is primarily about your quarterly diabetes and blood pressure review with Dr. Chen.
                  Since your last visit in November, your HbA1c has reached its best level in two years (6.8%),
                  and your cholesterol numbers have improved on Atorvastatin. The main topics to cover are:
                  the elevated CRP finding, whether a sleep study referral is appropriate, and whether your
                  current medication dosages should be adjusted given your progress.
                </p>
                <p className="text-[10px] text-muted-foreground mt-2">
                  This summary was generated from {linkedDiags.length} linked diagnoses, {activeMeds.length} active medications, and recent lab and wearable data.
                </p>
              </div>

              {/* Quick stats */}
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                <div className="rounded-lg bg-muted px-3 py-2.5 text-center">
                  <p className="text-lg font-bold font-display text-primary">{linkedDiags.length}</p>
                  <p className="text-[11px] text-muted-foreground">Linked diagnoses</p>
                </div>
                <div className="rounded-lg bg-muted px-3 py-2.5 text-center">
                  <p className="text-lg font-bold font-display text-primary">{activeMeds.length}</p>
                  <p className="text-[11px] text-muted-foreground">Active medications</p>
                </div>
                <div className="rounded-lg bg-muted px-3 py-2.5 text-center">
                  <p className="text-lg font-bold font-display text-primary">{changedBiomarkers.length}</p>
                  <p className="text-[11px] text-muted-foreground">Changed lab values</p>
                </div>
                <div className="rounded-lg bg-muted px-3 py-2.5 text-center">
                  <p className="text-lg font-bold font-display text-primary">{healthStory.questionsForNextVisit.length}</p>
                  <p className="text-[11px] text-muted-foreground">Suggested questions</p>
                </div>
              </div>
            </div>

            {/* Changes Since Last Visit */}
            <div className="health-card">
              <SectionHeader
                id="changes"
                icon={TrendingUp}
                title="Changes Since Last Visit"
                subtitle={lastVisit ? `Since ${new Date(lastVisit.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : undefined}
                badge={<span className="source-badge bg-primary/10 text-primary">{changedBiomarkers.length} changes</span>}
              />
              {expandedSections.changes && (
                <div className="space-y-4">
                  {/* Lab value changes */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Lab value changes</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {changedBiomarkers.map(b => {
                        const improved = b.status === 'normal' || (b.previousValue && b.value < b.previousValue && b.status !== 'low' && b.status !== 'slightly_low');
                        return (
                          <div key={b.id} className="rounded-lg bg-muted px-3 py-2.5">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-xs font-medium">
                                <MedicalTerm term={b.medicalName}>{b.plainName}</MedicalTerm>
                              </span>
                              {improved ? (
                                <span className="text-[11px] text-success flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> Improved</span>
                              ) : (
                                <span className="text-[11px] text-warning-foreground flex items-center gap-0.5"><TrendingDown className="h-3 w-3" /> Changed</span>
                              )}
                            </div>
                            <p className="text-sm font-semibold">
                              {b.previousValue} → {b.value} {b.unit}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              Source: {b.sourceProvider} · {b.date}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent events that may be relevant */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Recent health events</p>
                    <div className="space-y-1.5">
                      {recentEvents.map(e => (
                        <div key={e.id} className="flex items-start gap-2.5 rounded-lg bg-muted/50 px-3 py-2">
                          <span className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                            e.severity === 'high' ? 'bg-destructive' : e.severity === 'moderate' ? 'bg-warning' : 'bg-muted-foreground'
                          }`} />
                          <div>
                            <p className="text-xs font-medium">{e.title}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {new Date(e.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              {e.startDate !== e.endDate && ` – ${new Date(e.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                              {' · '}{e.notes.split('.')[0]}.
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Plain-language summary of changes */}
                  <div className="rounded-lg bg-accent/20 border border-primary/10 px-3 py-2.5">
                    <p className="text-xs text-foreground leading-relaxed">
                      <strong>In plain language:</strong> Since your last visit, your blood sugar control has improved (HbA1c down to 6.8%),
                      cholesterol numbers are better on the statin, and kidney function remains healthy. The main new concerns are
                      elevated inflammation (CRP), a period of high work stress that disrupted your sleep and recovery, and ongoing
                      sleep difficulties that haven't been formally evaluated yet.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Relevant Diagnoses */}
            <div className="health-card">
              <SectionHeader id="diagnoses" icon={Activity} title="Relevant Diagnoses" subtitle={`${linkedDiags.length} conditions linked to this visit`} />
              {expandedSections.diagnoses && (
                <div className="space-y-2">
                  {linkedDiags.map(d => (
                    <div key={d.id} className="flex items-start gap-3 rounded-lg bg-muted px-3 py-2.5">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium"><MedicalTerm term={d.name}>{d.name}</MedicalTerm></span>
                          <StatusChip status={d.status} />
                          <SourceBadge source={d.sourceType} />
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{d.explanation}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-muted-foreground">Since {new Date(d.dateFirstDocumented).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                          <span className="text-[10px] text-muted-foreground">· Confidence: {d.confidence}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Medications */}
            <div className="health-card">
              <SectionHeader id="meds" icon={Pill} title="Active Medications" subtitle="Current medication list to review with provider" />
              {expandedSections.meds && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {activeMeds.map(m => (
                    <div key={m.id} className="rounded-lg bg-muted px-3 py-2.5">
                      <p className="text-sm font-medium">{m.name} {m.dosage}</p>
                      <p className="text-xs text-muted-foreground">{m.frequency}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        For: {m.prescribedFor} · Since {new Date(m.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Health Trends */}
            <div className="health-card">
              <SectionHeader id="trends" icon={Activity} title="Recent Health Trends" subtitle="Wearable and measurement data from the past 7 days" />
              {expandedSections.trends && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {relevantMetrics.map(m => (
                    <div key={m.id} className="rounded-lg bg-muted px-3 py-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium"><MedicalTerm term={m.name} /></span>
                        <TrendIndicator trend={m.trend} />
                      </div>
                      <Sparkline data={m.data7d} height={32} />
                      <p className="text-[11px] text-muted-foreground mt-1">{m.insight}</p>
                      <span className="text-[10px] text-muted-foreground">Source: {m.source === 'oura' ? 'Oura ring' : m.source === 'apple_health' ? 'Apple Health' : 'Manual entry'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Suggested Questions — highest-value section */}
            <div className="health-card border-primary/20">
              <SectionHeader
                id="questions"
                icon={AlertCircle}
                title="Questions to Ask"
                subtitle="Generated from your diagnoses, trends, and recent changes"
                badge={<span className="source-badge bg-primary/10 text-primary">High value</span>}
              />
              {expandedSections.questions && (
                <div className="space-y-2">
                  {healthStory.questionsForNextVisit.map((q, i) => (
                    <div key={i} className="rounded-lg bg-accent/30 border border-primary/5 px-3 py-3">
                      <p className="text-sm font-medium text-foreground mb-1">{q.question}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-1.5">{q.rationale}</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <FileText className="h-3 w-3" /> Related data: {q.relatedData}
                      </p>
                    </div>
                  ))}
                  {/* Diagnosis-specific questions */}
                  {linkedDiags.flatMap(d => d.suggestedQuestions).length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">Additional diagnosis-specific questions:</p>
                      {linkedDiags.flatMap(d => d.suggestedQuestions).slice(0, 3).map((q, i) => (
                        <p key={i} className="text-xs bg-muted/50 rounded-lg px-3 py-2 mb-1.5">{q}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="health-card">
              <SectionHeader id="recs" icon={CheckCircle2} title="Recommendations" subtitle="Based on your data and upcoming visit" />
              {expandedSections.recs && (
                <div className="space-y-2">
                  {relevantRecs.map(r => (
                    <div key={r.id} className="rounded-lg bg-muted px-3 py-2.5">
                      <div className="flex items-center gap-2 mb-1">
                        <CategoryBadge category={r.category} />
                        <span className="text-sm font-medium">{r.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{r.rationale}</p>
                      <p className="text-xs text-primary font-medium mt-1.5">{r.actionText}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Documents to Review */}
            <div className="health-card">
              <SectionHeader id="docs" icon={FileText} title="Documents to Review" subtitle="Recent records relevant to this visit" />
              {expandedSections.docs && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {recentDocs.map(doc => (
                    <div key={doc.id} className="rounded-lg bg-muted px-3 py-2.5 flex items-start gap-2.5">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{doc.fileName}</p>
                        <p className="text-[11px] text-muted-foreground">{doc.provider} · {new Date(doc.documentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <SourceBadge source={doc.sourceType} />
                          <span className={`source-badge ${
                            doc.extractionConfidence === 'high' ? 'bg-success/10 text-success' :
                            doc.extractionConfidence === 'moderate' ? 'bg-warning/10 text-warning-foreground' :
                            'bg-destructive/10 text-destructive'
                          }`}>
                            {doc.extractionConfidence} confidence
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="rounded-lg bg-muted/50 border border-border p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                This visit brief is generated from your uploaded records, wearable data, and logged events to help you prepare for your appointment.
                It is not a substitute for your doctor's clinical judgment. All source data is labeled with extraction confidence and provenance.
              </p>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
