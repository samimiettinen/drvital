import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ContextPanel, ContextSection } from '@/components/layout/ContextPanel';
import { RangeBar } from '@/components/results/RangeBar';
import { BodyMap } from '@/components/results/BodyMap';
import { MedicalTerm } from '@/components/shared/MedicalTerm';
import { ConfidenceBadge, ExtractionConfidence } from '@/components/shared/ConfidenceBadge';
import { biomarkers, healthCategories, healthStory, type Biomarker, type BodySystem } from '@/data/biomarkerData';
import { TrendingUp, TrendingDown, Minus, BookOpen, AlertCircle, HelpCircle, ArrowRight, Lightbulb, FileText, Shield } from 'lucide-react';

export default function ResultsExplorerPage() {
  const [selectedSystem, setSelectedSystem] = useState<BodySystem | 'all'>('all');
  const [selectedMarker, setSelectedMarker] = useState<Biomarker | null>(null);

  const filtered = selectedSystem === 'all' ? biomarkers : biomarkers.filter(b => b.bodySystem === selectedSystem);

  const contextContent = selectedMarker ? (
    <ContextPanel>
      <ContextSection title="Result Detail">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Medical name</p>
            <p className="text-sm font-semibold">{selectedMarker.medicalName}</p>
            <p className="text-xs text-muted-foreground">{selectedMarker.plainName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">What it is</p>
            <p className="text-sm leading-relaxed">{selectedMarker.explanation}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Why it matters for you</p>
            <p className="text-sm leading-relaxed">{selectedMarker.whyItMatters}</p>
          </div>
          {selectedMarker.clinicalContext && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Your specific context</p>
              <p className="text-sm leading-relaxed">{selectedMarker.clinicalContext}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Everyday factors</p>
            <ul className="space-y-1">
              {selectedMarker.lifestyleFactors.map((f, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          {selectedMarker.previousValue && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Previous result</p>
              <p className="text-sm">
                {selectedMarker.previousValue} {selectedMarker.unit}
                <span className="text-xs text-muted-foreground ml-1">({selectedMarker.previousDate})</span>
              </p>
              <p className="text-xs mt-1">
                {selectedMarker.value < selectedMarker.previousValue ? (
                  <span className="text-success flex items-center gap-1"><TrendingDown className="h-3 w-3" /> Decreased since last check</span>
                ) : selectedMarker.value > selectedMarker.previousValue ? (
                  <span className="text-warning-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Increased since last check</span>
                ) : (
                  <span className="text-muted-foreground flex items-center gap-1"><Minus className="h-3 w-3" /> Unchanged</span>
                )}
              </p>
            </div>
          )}
          <div className="space-y-1.5">
            <div className="rounded-lg bg-muted px-3 py-2">
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <FileText className="h-3 w-3" /> Source: {selectedMarker.sourceProvider}
              </p>
              <p className="text-[10px] text-muted-foreground">{selectedMarker.sourceDocument} · {selectedMarker.date}</p>
            </div>
            <ExtractionConfidence confidence={selectedMarker.extractionConfidence} />
          </div>
        </div>
      </ContextSection>
    </ContextPanel>
  ) : (
    <ContextPanel>
      <ContextSection title="Your Story Summary">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-success flex items-center gap-1 mb-1"><TrendingUp className="h-3 w-3" /> Improved</p>
            {healthStory.improvements.slice(0, 3).map((item, i) => (
              <div key={i} className="mb-1.5">
                <p className="text-xs text-muted-foreground">{item.text}</p>
                <p className="text-[10px] text-muted-foreground/60">{item.evidenceSource}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-medium text-warning-foreground flex items-center gap-1 mb-1"><AlertCircle className="h-3 w-3" /> Monitor</p>
            {healthStory.concerns.slice(0, 3).map((item, i) => (
              <div key={i} className="mb-1.5">
                <p className="text-xs text-muted-foreground">{item.text}</p>
                <span className={`inline-flex text-[10px] ${
                  item.urgency === 'discuss' ? 'text-warning-foreground' : 'text-muted-foreground/60'
                }`}>{item.urgency === 'discuss' ? 'Discuss with doctor' : 'Continue monitoring'}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1"><HelpCircle className="h-3 w-3" /> Ask next</p>
            {healthStory.questionsForNextVisit.slice(0, 2).map((q, i) => (
              <p key={i} className="text-xs text-muted-foreground mb-1">{q.question}</p>
            ))}
          </div>
        </div>
      </ContextSection>
    </ContextPanel>
  );

  return (
    <AppShell pageTitle="Results Explorer" contextContent={contextContent}>
      <div className="space-y-6 max-w-5xl animate-fade-in">
        {/* Body Map */}
        <BodyMap />

        {/* Health categories */}
        <section>
          <h2 className="section-title mb-1">Health Categories</h2>
          <p className="section-subtitle mb-4">Your results grouped by body system</p>
          <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-4">
            {healthCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedSystem(selectedSystem === cat.id ? 'all' : cat.id)}
                className={`health-card-hover p-3 text-center transition-all ${selectedSystem === cat.id ? 'ring-2 ring-primary/30' : ''}`}
              >
                <span className="text-xl mb-1 block">{cat.icon}</span>
                <p className="text-xs font-medium mb-0.5">{cat.name}</p>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  cat.status === 'good' ? 'bg-success/10 text-success' :
                  cat.status === 'attention' ? 'bg-warning/10 text-warning-foreground' :
                  'bg-destructive/10 text-destructive'
                }`}>
                  {cat.status === 'good' ? 'Good' : cat.status === 'attention' ? 'Attention' : 'Concern'}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Category narrative (when filtered) */}
        {selectedSystem !== 'all' && (() => {
          const cat = healthCategories.find(c => c.id === selectedSystem);
          return cat ? (
            <div className="health-card animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{cat.icon}</span>
                <h3 className="font-semibold text-sm">{cat.name}</h3>
                <span className={`source-badge ${
                  cat.status === 'good' ? 'bg-success/10 text-success' :
                  cat.status === 'attention' ? 'bg-warning/10 text-warning-foreground' :
                  'bg-destructive/10 text-destructive'
                }`}>{cat.status}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{cat.narrativeSummary}</p>
              <div className="rounded-lg bg-muted/50 px-3 py-2">
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Source documents: {cat.sourceDocuments.join(', ')}
                </p>
              </div>
            </div>
          ) : null;
        })()}

        {/* Biomarker results */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="section-title">Lab Results & Biomarkers</h2>
              <p className="section-subtitle">{filtered.length} results · Click for detailed explanation</p>
            </div>
            {selectedSystem !== 'all' && (
              <button onClick={() => setSelectedSystem('all')} className="text-xs text-primary font-medium hover:underline">
                Show all
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map(marker => (
              <button
                key={marker.id}
                onClick={() => setSelectedMarker(marker)}
                className={`health-card-hover text-left transition-all ${selectedMarker?.id === marker.id ? 'ring-2 ring-primary/30' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold">
                      <MedicalTerm term={marker.medicalName}>{marker.plainName}</MedicalTerm>
                    </p>
                    <p className="text-[11px] text-muted-foreground">{marker.medicalName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {marker.previousValue && (
                      <div>
                        {marker.value < marker.previousValue ? (
                          <span className="text-[11px] text-success flex items-center gap-0.5"><TrendingDown className="h-3 w-3" /> from {marker.previousValue}</span>
                        ) : marker.value > marker.previousValue ? (
                          <span className="text-[11px] text-warning-foreground flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> from {marker.previousValue}</span>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
                <RangeBar
                  value={marker.value}
                  low={marker.referenceRange.low}
                  high={marker.referenceRange.high}
                  status={marker.status}
                  unit={marker.unit}
                />
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{marker.explanation}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <FileText className="h-3 w-3" /> {marker.sourceProvider} · {marker.date}
                  </p>
                  <ExtractionConfidence confidence={marker.extractionConfidence} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Cross-document narrative story */}
        <section className="health-card">
          <div className="flex items-start gap-3 mb-4">
            <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="section-title">What is my story?</h2>
              <p className="section-subtitle">A synthesis across all your records and data sources</p>
            </div>
          </div>

          {/* Overall narrative */}
          <div className="rounded-lg bg-accent/30 border border-primary/10 px-4 py-3.5 mb-5">
            <p className="text-sm leading-relaxed text-foreground">{healthStory.overallNarrative}</p>
          </div>

          <div className="space-y-5">
            {/* Narrative threads */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                <Lightbulb className="h-3 w-3" /> Key narrative threads
              </p>
              <div className="space-y-2.5">
                {healthStory.narrativeThreads.map(thread => {
                  const statusColors = {
                    improving: 'bg-success/10 text-success',
                    stable: 'bg-muted text-muted-foreground',
                    worsening: 'bg-destructive/10 text-destructive',
                    resolved: 'bg-muted text-muted-foreground',
                    emerging: 'bg-warning/10 text-warning-foreground',
                  };
                  return (
                    <div key={thread.id} className="rounded-lg bg-muted/50 px-4 py-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium">{thread.title}</span>
                        <span className={`source-badge ${statusColors[thread.status]}`}>
                          {thread.status.charAt(0).toUpperCase() + thread.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">{thread.narrative}</p>
                      <div className="space-y-1">
                        {thread.evidence.map((e, i) => (
                          <div key={i} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <ConfidenceBadge strength={e.confidence} showLabel={false} />
                            <span>{e.source}: {e.detail}</span>
                            <span className="text-muted-foreground/50">({e.date})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cross-document insights */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Cross-document insights</p>
              <div className="space-y-2">
                {healthStory.crossDocumentInsights.map((insight, i) => (
                  <div key={i} className="rounded-lg bg-muted/50 px-3 py-2.5">
                    <p className="text-xs text-foreground leading-relaxed mb-1.5">{insight.insight}</p>
                    <div className="flex items-center gap-2">
                      <ConfidenceBadge strength={insight.confidence} />
                      <span className="text-[10px] text-muted-foreground">{insight.documents.length} source documents</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline highlights */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Timeline highlights</p>
              <div className="space-y-2">
                {healthStory.timelineHighlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xs text-muted-foreground font-mono w-16 flex-shrink-0 pt-0.5">{h.date}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{h.event}</p>
                      <p className="text-xs text-muted-foreground">{h.significance}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">Source: {h.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Unresolved items */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Still unresolved</p>
              <div className="space-y-1.5">
                {healthStory.unresolvedItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-warning/5 px-3 py-2">
                    <AlertCircle className="h-3.5 w-3.5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-foreground">{item.text}</p>
                      <p className="text-[10px] text-muted-foreground">Last mentioned: {item.lastMentioned} · Owner: {item.owner}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="rounded-lg bg-muted/50 border border-border p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            This summary is for education and preparation, not diagnosis. All values are compared to standard reference ranges
            and labeled with source provenance and extraction confidence. Your doctor may use different targets based on your health history.
            Always discuss results with a healthcare professional.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
