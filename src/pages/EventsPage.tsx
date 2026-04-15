import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ContextPanel, ContextSection } from '@/components/layout/ContextPanel';
import { events, whatChangedData, type HealthEvent } from '@/data/mockData';

const typeLabels: Record<string, string> = {
  travel: '✈️ Travel', illness: '🤒 Illness', medication_start: '💊 Med Start',
  medication_stop: '💊 Med Stop', diagnosis_received: '📋 Diagnosis', surgery: '🏥 Surgery',
  stressful_period: '😰 Stress', exercise_block: '🏃 Exercise', dietary_change: '🥗 Diet',
  hormonal: '🔄 Hormonal', conference: '🎤 Conference', accessibility_event: '♿ Accessibility',
  custom: '📝 Custom',
};

const severityColors = {
  low: 'bg-muted text-muted-foreground',
  moderate: 'bg-warning/10 text-warning-foreground',
  high: 'bg-destructive/10 text-destructive',
};

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<HealthEvent | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = typeFilter === 'all' ? events : events.filter(e => e.eventType === typeFilter);
  const types = ['all', ...new Set(events.map(e => e.eventType))];
  const whatChanged = selectedEvent ? whatChangedData.find(w => w.eventId === selectedEvent.id) : null;

  const contextContent = selectedEvent ? (
    <ContextPanel>
      <ContextSection title="Event Details">
        <div className="space-y-3">
          <p className="text-sm font-medium">{selectedEvent.title}</p>
          <p className="text-xs text-muted-foreground">{typeLabels[selectedEvent.eventType]}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(selectedEvent.startDate).toLocaleDateString()} –{' '}
            {new Date(selectedEvent.endDate).toLocaleDateString()}
          </p>
          <p className="text-sm leading-relaxed">{selectedEvent.notes}</p>
          <div className="flex flex-wrap gap-1">
            {selectedEvent.tags.map(t => (
              <span key={t} className="source-badge bg-muted text-muted-foreground">{t}</span>
            ))}
          </div>
        </div>
      </ContextSection>
      {whatChanged && (
        <ContextSection title="What Changed">
          <p className="text-xs text-muted-foreground mb-2">Confidence: {whatChanged.confidence}</p>
          <p className="text-sm text-foreground leading-relaxed">{whatChanged.explanation}</p>
        </ContextSection>
      )}
    </ContextPanel>
  ) : (
    <ContextPanel>
      <ContextSection title="Event Timeline">
        <p className="text-sm text-muted-foreground">Click an event to see details and before/during/after analysis.</p>
      </ContextSection>
    </ContextPanel>
  );

  return (
    <AppShell pageTitle="Events" contextContent={contextContent}>
      <div className="space-y-6 max-w-4xl animate-fade-in">
        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                typeFilter === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {t === 'all' ? 'All Events' : typeLabels[t] || t}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-4">
            {filtered.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map(event => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`relative w-full text-left pl-10 transition-all ${selectedEvent?.id === event.id ? '' : ''}`}
              >
                <div className="absolute left-2.5 top-5 h-3 w-3 rounded-full border-2 border-primary bg-card" />
                <div className={`health-card ${selectedEvent?.id === event.id ? 'ring-2 ring-primary/30' : ''}`}>
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{typeLabels[event.eventType]}</span>
                    <span className={`status-chip text-[11px] ${severityColors[event.severity]}`}>
                      {event.severity} impact
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{event.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {event.startDate !== event.endDate && ` – ${new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{event.notes}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* What Changed panel for selected event */}
        {whatChanged && (
          <div className="health-card xl:hidden">
            <h2 className="section-title mb-4">What Changed</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { label: 'Before', data: whatChanged.before },
                { label: 'During', data: whatChanged.during },
                { label: 'After', data: whatChanged.after },
              ].map(phase => (
                <div key={phase.label} className="rounded-lg bg-muted px-4 py-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">{phase.label}</p>
                  <p className="text-[11px] text-muted-foreground mb-2">{phase.data.period}</p>
                  <p className="text-sm mb-2">{phase.data.summary}</p>
                  {phase.data.metrics.map(m => (
                    <div key={m.name} className="flex justify-between text-xs text-muted-foreground">
                      <span>{m.name}</span>
                      <span className="font-medium">{m.value}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg bg-accent/30 px-3 py-2">
              <p className="text-[11px] text-muted-foreground">
                Patterns observed around this event. Does not imply strict causality. May be worth monitoring.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
