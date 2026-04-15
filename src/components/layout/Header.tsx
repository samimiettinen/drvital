import { Menu } from 'lucide-react';

interface HeaderProps {
  pageTitle: string;
  quickActions?: React.ReactNode;
  onMenuClick: () => void;
}

export function Header({ pageTitle, quickActions, onMenuClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 md:px-6 lg:px-8 py-4">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-1.5 rounded-md hover:bg-muted">
          <Menu className="h-5 w-5 text-muted-foreground" />
        </button>
        <h1 className="text-xl font-semibold font-display text-foreground">{pageTitle}</h1>
      </div>
      {quickActions && <div className="flex items-center gap-2">{quickActions}</div>}
    </header>
  );
}
