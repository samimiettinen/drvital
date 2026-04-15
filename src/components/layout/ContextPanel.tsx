interface ContextPanelProps {
  children: React.ReactNode;
}

export function ContextPanel({ children }: ContextPanelProps) {
  return <div className="space-y-5">{children}</div>;
}

export function ContextSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{title}</h3>
      {children}
    </div>
  );
}
