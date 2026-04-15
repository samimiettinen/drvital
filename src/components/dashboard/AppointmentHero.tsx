import { Link } from 'react-router-dom';
import { type Appointment } from '@/data/mockData';
import { CalendarDays, ArrowRight, ClipboardCheck, Stethoscope } from 'lucide-react';

interface Props {
  appointment: Appointment;
}

export function AppointmentHero({ appointment }: Props) {
  if (!appointment) return null;

  const daysUntil = Math.ceil((new Date(appointment.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="health-card-elevated flex flex-col md:flex-row md:items-center gap-5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-lg bg-info/10 flex items-center justify-center">
            <Stethoscope className="h-4 w-4 text-info" />
          </div>
          <span className="text-xs font-medium text-info">
            {daysUntil > 0 ? `In ${daysUntil} days` : 'Today'}
          </span>
        </div>
        <h3 className="text-base font-semibold mb-1">{appointment.provider} · {appointment.specialty}</h3>
        <p className="text-sm text-muted-foreground mb-1">
          {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <p className="text-sm text-muted-foreground">{appointment.reason}</p>
      </div>
      <Link
        to="/appointment-prep"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        <ClipboardCheck className="h-4 w-4" />
        Prepare for my appointment
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
