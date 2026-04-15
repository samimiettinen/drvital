import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ContextPanel } from './ContextPanel';
import { Menu, X } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  pageTitle: string;
  contextContent?: React.ReactNode;
  quickActions?: React.ReactNode;
}

export function AppShell({ children, pageTitle, contextContent, quickActions }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          pageTitle={pageTitle}
          quickActions={quickActions}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
          {contextContent && (
            <aside className="hidden xl:block w-80 border-l border-border overflow-y-auto p-5 bg-card">
              {contextContent}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
