import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ContextPanel, ContextSection } from '@/components/layout/ContextPanel';
import { RangeBar } from '@/components/results/RangeBar';
import { BodyMap } from '@/components/results/BodyMap';
import { MedicalTerm } from '@/components/shared/MedicalTerm';
import { biomarkers, healthCategories, healthStory, type Biomarker, type BodySystem } from '@/data/biomarkerData';
import { TrendingUp, TrendingDown, Minus, BookOpen, AlertCircle, HelpCircle, ArrowRight, Filter } from 'lucide-react';

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
            <p className="text-xs text-muted-foreground mb-1">Why it matters</p>
            <p className="text-sm leading-relaxed">{selectedMarker.whyItMatters}</p>
          </div>
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
          <div className="rounded-lg bg-muted px-3 py-2">
            <p className="text-[11px] text-muted-foreground">Source: {selectedMarker.sourceDocument} · {selectedMarker.date}</p>
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
              <p key={i} className="text-xs text-muted-foreground mb-1">{item}</p>
            ))}
          </div>
          <div>
            <p className="text-xs font-medium text-warning-foreground flex items-center gap-1 mb-1"><AlertCircle className="h-3 w-3" /> Monitor</p>
            {healthStory.concerns.slice(0, 3).map((item, i) => (
              <p key={i} className="text-xs text-muted-foreground mb-1">{item}</p>
            ))}
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1"><HelpCircle className="h-3 w-3" /> Ask next</p>
            {healthStory.questionsForNextVisit.slice(0, 2).map((q, i) => (
              <p key={i} className="text-xs text-muted-foreground mb-1">{q}</p>
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

        {/* Category summary (when filtered) */}
        {selectedSystem !== 'all' && (
          <div className="health-card animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{healthCategories.find(c => c.id === selectedSystem)?.icon}</span>
              <h3 className="font-semibold text-sm">{healthCategories.find(c => c.id === selectedSystem)?.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {healthCategories.find(c => c.id === selectedSystem)?.summary}
            </p>
          </div>
        )}

        {/* Biomarker results */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="section-title">Lab Results & Biomarkers</h2>
              <p className="section-subtitle">{filtered.length} results · Click for details</p>
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
                  {marker.previousValue && (
                    <div className="text-right">
                      {marker.value < marker.previousValue ? (
                        <span className="text-[11px] text-success flex items-center gap-0.5"><TrendingDown className="h-3 w-3" /> from {marker.previousValue}</span>
                      ) : marker.value > marker.previousValue ? (
                        <span className="text-[11px] text-warning-foreground flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> from {marker.previousValue}</span>
                      ) : null}
                    </div>
                  )}
                </div>
                <RangeBar
                  value={marker.value}
                  low={marker.referenceRange.low}
                  high={marker.referenceRange.high}
                  status={marker.status}
                  unit={marker.unit}
                />
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{marker.explanation}</p>
                <p className="text-[11px] text-muted-foreground mt-1">Source: {marker.sourceDocument} · {marker.date}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Cross-document story */}
        <section className="health-card">
          <div className="flex items-start gap-3 mb-4">
            <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="section-title">What is my story?</h2>
              <p className="section-subtitle">A synthesis across all your records</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Timeline highlights */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Timeline highlights</p>
              <div className="space-y-2">
                {healthStory.timelineHighlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xs text-muted-foreground font-mono w-16 flex-shrink-0 pt-0.5">{h.date}</span>
                    <div>
                      <p className="text-sm font-medium">{h.event}</p>
                      <p className="text-xs text-muted-foreground">{h.significance}</p>
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
                  <p key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 text-warning flex-shrink-0 mt-0.5" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="rounded-lg bg-muted/50 border border-border p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            This summary is for education and preparation, not diagnosis. All values are compared to standard reference ranges.
            Your doctor may use different targets based on your health history. Always discuss results with a healthcare professional.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
