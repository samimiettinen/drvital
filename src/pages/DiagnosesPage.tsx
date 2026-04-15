import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ContextPanel, ContextSection } from '@/components/layout/ContextPanel';
import { StatusChip, SourceBadge } from '@/components/shared/Badges';
import { diagnoses, medications, type Diagnosis } from '@/data/mockData';

export default function DiagnosesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved' | 'suspected'>('all');

  const filtered = filter === 'all' ? diagnoses : diagnoses.filter(d => d.status === filter);
  const selected = diagnoses.find(d => d.id === selectedId);

  const contextContent = selected ? (
    <ContextPanel>
      <ContextSection title="Diagnosis Detail">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-1">{selected.name}</h3>
            <StatusChip status={selected.status} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Plain-language explanation</p>
            <p className="text-sm leading-relaxed">{selected.explanation}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Source</p>
            <SourceBadge source={selected.sourceType} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">First documented</p>
            <p className="text-sm">{new Date(selected.dateFirstDocumented).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Last confirmed</p>
            <p className="text-sm">{new Date(selected.lastConfirmed).toLocaleDateString()}</p>
          </div>
          {selected.relatedMedications.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Related medications</p>
              {selected.relatedMedications.map(m => (
                <span key={m} className="source-badge bg-muted text-muted-foreground mr-1 mb-1">{m}</span>
              ))}
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Follow-up plan</p>
            <p className="text-sm leading-relaxed">{selected.followUpPlan}</p>
          </div>
          {selected.suggestedQuestions.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Suggested questions for next visit</p>
              <ul className="space-y-1.5">
                {selected.suggestedQuestions.map((q, i) => (
                  <li key={i} className="text-sm text-foreground bg-muted rounded-lg px-3 py-2">{q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </ContextSection>
    </ContextPanel>
  ) : (
    <ContextPanel>
      <ContextSection title="Select a Diagnosis">
        <p className="text-sm text-muted-foreground">Click on a diagnosis card to see details, related medications, follow-up plans, and suggested questions.</p>
      </ContextSection>
    </ContextPanel>
  );

  return (
    <AppShell pageTitle="Diagnoses" contextContent={contextContent}>
      <div className="space-y-5 max-w-4xl animate-fade-in">
        {/* Filter chips */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'active', 'resolved', 'suspected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} {f === 'all' ? `(${diagnoses.length})` : `(${diagnoses.filter(d => d.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Diagnosis cards */}
        <div className="space-y-3">
          {filtered.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedId(d.id)}
              className={`w-full text-left health-card transition-all ${selectedId === d.id ? 'ring-2 ring-primary/30' : ''}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StatusChip status={d.status} />
                  <span className="text-xs text-muted-foreground">
                    Confidence: {d.confidence}
                  </span>
                </div>
                <SourceBadge source={d.sourceType} />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{d.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{d.explanation}</p>
              <div className="flex flex-wrap gap-1.5">
                {d.relatedMedications.map(m => (
                  <span key={m} className="source-badge bg-muted text-muted-foreground text-[11px]">{m}</span>
                ))}
                {d.relatedMeasurements.slice(0, 3).map(m => (
                  <span key={m} className="source-badge bg-accent text-accent-foreground text-[11px]">{m}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
