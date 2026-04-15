import { diagnoses, medications, appointments, documents, events, healthspanData } from '@/data/mockData';
import { FileText, Pill, CalendarDays, Stethoscope, TrendingUp, Activity } from 'lucide-react';

export function YearAtAGlance() {
  const activeDiags = diagnoses.filter(d => d.status === 'active').length;
  const resolvedDiags = diagnoses.filter(d => d.status === 'resolved').length;
  const activeMeds = medications.filter(m => m.status === 'active').length;
  const completedAppts = appointments.filter(a => a.status === 'completed').length;
  const upcomingAppts = appointments.filter(a => a.status === 'upcoming').length;
  const totalDocs = documents.length;
  const totalEvents = events.length;

  const cards = [
    {
      label: 'Conditions',
      value: `${activeDiags} active`,
      sub: `${resolvedDiags} resolved`,
      icon: Stethoscope,
      color: 'bg-accent text-accent-foreground',
    },
    {
      label: 'Medications',
      value: `${activeMeds} active`,
      sub: `${medications.length} total`,
      icon: Pill,
      color: 'bg-info/10 text-info',
    },
    {
      label: 'Appointments',
      value: `${upcomingAppts} upcoming`,
      sub: `${completedAppts} completed`,
      icon: CalendarDays,
      color: 'bg-success/10 text-success',
    },
    {
      label: 'Records',
      value: `${totalDocs} files`,
      sub: 'All extracted',
      icon: FileText,
      color: 'bg-warning/10 text-warning',
    },
    {
      label: 'Events Logged',
      value: `${totalEvents} events`,
      sub: '2 with analysis',
      icon: Activity,
      color: 'bg-destructive/10 text-destructive',
    },
    {
      label: 'Resilience',
      value: `${healthspanData.overall}/100`,
      sub: `90d: ${healthspanData.trend90d}`,
      icon: TrendingUp,
      color: 'bg-primary/10 text-primary',
    },
  ];

  return (
    <section>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="health-card p-4 text-center">
              <div className={`h-9 w-9 rounded-lg ${c.color} flex items-center justify-center mx-auto mb-2.5`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide mb-1">{c.label}</p>
              <p className="text-base font-bold font-display">{c.value}</p>
              <p className="text-[11px] text-muted-foreground">{c.sub}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
