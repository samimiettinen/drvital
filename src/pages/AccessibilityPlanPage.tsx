import { AppShell } from '@/components/layout/AppShell';
import { ContextPanel, ContextSection } from '@/components/layout/ContextPanel';
import { accessibilityPlans, diagnoses } from '@/data/mockData';
import { Accessibility, Download, CheckCircle2, Circle, User, Phone, MapPin, CalendarDays } from 'lucide-react';

const templates = [
  { label: 'Conference Day', description: 'Large venue, long schedule, high sensory input' },
  { label: 'Long Travel Day', description: 'Flights, transport, time zone changes' },
  { label: 'Hospital Visit', description: 'Clinical environment, tests, waiting periods' },
  { label: 'High-Sensory Event', description: 'Concerts, crowds, bright environments' },
  { label: 'Physically Demanding', description: 'Hiking, sports, extended physical activity' },
];

export default function AccessibilityPlanPage() {
  const plan = accessibilityPlans[0];
  const linkedDiags = diagnoses.filter(d => plan.linkedDiagnoses.includes(d.id));

  const contextContent = (
    <ContextPanel>
      <ContextSection title="Templates">
        <div className="space-y-2">
          {templates.map(t => (
            <button key={t.label} className="w-full text-left rounded-lg bg-muted px-3 py-2 hover:bg-accent transition-colors">
              <p className="text-xs font-medium">{t.label}</p>
              <p className="text-[11px] text-muted-foreground">{t.description}</p>
            </button>
          ))}
        </div>
      </ContextSection>
      <ContextSection title="Support Contact">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-3 w-3 text-muted-foreground" />
            <span>{plan.supportPerson.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{plan.supportPerson.phone}</span>
          </div>
          <p className="text-xs text-muted-foreground">{plan.supportPerson.role}</p>
        </div>
      </ContextSection>
    </ContextPanel>
  );

  return (
    <AppShell pageTitle="Accessibility Plan" contextContent={contextContent}>
      <div className="space-y-6 max-w-4xl animate-fade-in">
        {/* Event header */}
        <div className="health-card">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <Accessibility className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h2 className="section-title">{plan.eventName}</h2>
                <p className="section-subtitle capitalize">{plan.eventType}</p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity">
              <Download className="h-3 w-3" /> Export Summary
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{new Date(plan.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{plan.location}</span>
            </div>
          </div>
        </div>

        {/* Linked health concerns */}
        <div className="health-card">
          <h3 className="text-sm font-semibold mb-2">Linked Health Concerns</h3>
          <div className="space-y-2">
            {linkedDiags.map(d => (
              <div key={d.id} className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                <span className="status-chip status-chip-active">{d.status}</span>
                <span>{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Support needs */}
        <div className="health-card">
          <h3 className="text-sm font-semibold mb-3">Support Needs</h3>
          <div className="flex flex-wrap gap-2">
            {plan.supportNeeds.map(need => (
              <span key={need} className="source-badge bg-accent text-accent-foreground text-xs">
                {need}
              </span>
            ))}
          </div>
        </div>

        {/* Accommodations checklist */}
        <div className="health-card">
          <h3 className="text-sm font-semibold mb-3">Accommodations Checklist</h3>
          <div className="space-y-2">
            {plan.accommodations.map((item, i) => (
              <label key={i} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted cursor-pointer transition-colors">
                {item.checked ? (
                  <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
                <span className={`text-sm ${item.checked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Recovery plan */}
        <div className="health-card">
          <h3 className="text-sm font-semibold mb-2">Recovery Plan</h3>
          <p className="text-sm text-foreground leading-relaxed">{plan.recoveryPlan}</p>
        </div>

        {/* Notes to organizer */}
        <div className="health-card">
          <h3 className="text-sm font-semibold mb-2">Notes to Share with Organizer</h3>
          <div className="rounded-lg bg-muted px-4 py-3">
            <p className="text-sm text-foreground leading-relaxed">{plan.notesToOrganizer}</p>
          </div>
          <button className="mt-3 flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
            <Download className="h-3 w-3" /> Copy as shareable text
          </button>
        </div>
      </div>
    </AppShell>
  );
}
