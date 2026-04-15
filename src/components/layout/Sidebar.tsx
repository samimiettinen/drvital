import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  FlaskConical,
  Stethoscope,
  Activity,
  HeartPulse,
  CalendarDays,
  ClipboardCheck,
  FileText,
  Accessibility,
  X,
  Shield,
  BookOpen,
  Settings
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/upload', label: 'Upload & Inbox', icon: Upload },
  { path: '/results', label: 'Results Explorer', icon: FlaskConical },
  { path: '/diagnoses', label: 'Diagnoses', icon: Stethoscope },
  { path: '/health-trends', label: 'Health Trends', icon: Activity },
  { path: '/healthspan', label: 'Healthspan', icon: HeartPulse },
  { path: '/events', label: 'Events', icon: CalendarDays },
  { path: '/appointment-prep', label: 'Appointment Prep', icon: ClipboardCheck },
  { path: '/documents', label: 'Documents', icon: FileText },
  { path: '/accessibility-plan', label: 'Accessibility Plan', icon: Accessibility },
  { path: '/medical-resources', label: 'Medical Resources', icon: BookOpen },
  { path: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  onClose: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold font-display text-foreground leading-none">Health Navigator</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">Personal health workspace</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 rounded-md hover:bg-muted">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border">
        <div className="rounded-lg bg-muted px-3 py-2.5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            This app is for personal health organization. It does not provide medical diagnoses or advice.
          </p>
        </div>
      </div>
    </div>
  );
}
