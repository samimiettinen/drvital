import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ContextPanel, ContextSection } from '@/components/layout/ContextPanel';
import { TrendIndicator } from '@/components/shared/Badges';
import { TrendChart, Sparkline } from '@/components/shared/Charts';
import { healthMetrics } from '@/data/mockData';
import { Wifi, WifiOff } from 'lucide-react';

export default function HealthTrendsPage() {
  const [selectedMetric, setSelectedMetric] = useState(healthMetrics[0]);
  const [range, setRange] = useState<'7d' | '30d'>('7d');

  const contextContent = (
    <ContextPanel>
      <ContextSection title="Connected Sources">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
              <Wifi className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-xs">Apple Health</p>
              <p className="text-[11px] text-muted-foreground">Demo mode · 6 data types</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
              <Wifi className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-xs">Oura Ring</p>
              <p className="text-[11px] text-muted-foreground">Demo mode · 5 data types</p>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-muted px-3 py-2">
          <p className="text-[11px] text-muted-foreground">Wearable data is observational. Trends shown here are behavioral guidance, not medical advice.</p>
        </div>
      </ContextSection>
      <ContextSection title="Selected Metric">
        <div className="space-y-2">
          <p className="text-sm font-medium">{selectedMetric.name}</p>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Current</span>
            <span>{selectedMetric.current} {selectedMetric.unit}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Baseline</span>
            <span>{selectedMetric.baseline} {selectedMetric.unit}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Source</span>
            <span className="capitalize">{selectedMetric.source.replace('_', ' ')}</span>
          </div>
        </div>
      </ContextSection>
    </ContextPanel>
  );

  return (
    <AppShell pageTitle="Health Trends" contextContent={contextContent}>
      <div className="space-y-6 max-w-4xl animate-fade-in">
        {/* Range toggle */}
        <div className="flex gap-2">
          {(['7d', '30d'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                range === r ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {r === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>

        {/* Metric grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {healthMetrics.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMetric(m)}
              className={`metric-card text-left transition-all ${selectedMetric.id === m.id ? 'ring-2 ring-primary/30' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{m.name}</span>
                <TrendIndicator trend={m.trend} />
              </div>
              <div className="text-xl font-semibold font-display">
                {m.current} <span className="text-xs font-normal text-muted-foreground">{m.unit}</span>
              </div>
              <Sparkline data={range === '7d' ? m.data7d : m.data30d} />
            </button>
          ))}
        </div>

        {/* Selected metric detail */}
        <div className="health-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="section-title">{selectedMetric.name}</h2>
              <p className="section-subtitle capitalize">{selectedMetric.source.replace('_', ' ')} · {range === '7d' ? '7-day' : '30-day'} trend</p>
            </div>
            <TrendIndicator trend={selectedMetric.trend} />
          </div>
          <TrendChart
            data={range === '7d' ? selectedMetric.data7d : selectedMetric.data30d}
            baseline={selectedMetric.baseline}
            unit={selectedMetric.unit}
            height={220}
          />
          <div className="mt-4 rounded-lg bg-muted px-4 py-3">
            <p className="text-sm text-foreground leading-relaxed">{selectedMetric.insight}</p>
          </div>
        </div>

        {/* What improved / worsened */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="health-card">
            <h3 className="section-title text-success mb-3">What improved</h3>
            <div className="space-y-2">
              {healthMetrics.filter(m => m.trend === 'improving').map(m => (
                <div key={m.id} className="flex items-center justify-between text-sm">
                  <span>{m.name}</span>
                  <span className="text-success text-xs font-medium">↑ {m.current} {m.unit}</span>
                </div>
              ))}
              {healthMetrics.filter(m => m.trend === 'improving').length === 0 && (
                <p className="text-sm text-muted-foreground">No improving metrics this period.</p>
              )}
            </div>
          </div>
          <div className="health-card">
            <h3 className="section-title text-destructive mb-3">What worsened</h3>
            <div className="space-y-2">
              {healthMetrics.filter(m => m.trend === 'declining').map(m => (
                <div key={m.id} className="flex items-center justify-between text-sm">
                  <span>{m.name}</span>
                  <span className="text-destructive text-xs font-medium">↓ {m.current} {m.unit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
