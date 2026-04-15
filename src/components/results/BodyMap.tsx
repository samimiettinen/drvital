import { useState } from 'react';
import type { BodySystem } from '@/data/biomarkerData';
import { biomarkers, healthCategories } from '@/data/biomarkerData';
import { MedicalTerm } from '@/components/shared/MedicalTerm';
import { X } from 'lucide-react';

const bodyRegions: { id: BodySystem; label: string; x: number; y: number; rx: number; ry: number }[] = [
  { id: 'heart', label: 'Heart', x: 52, y: 28, rx: 8, ry: 7 },
  { id: 'liver', label: 'Liver', x: 40, y: 38, rx: 8, ry: 6 },
  { id: 'kidneys', label: 'Kidneys', x: 50, y: 42, rx: 12, ry: 5 },
  { id: 'metabolism', label: 'Metabolism', x: 50, y: 52, rx: 10, ry: 6 },
  { id: 'blood', label: 'Blood', x: 50, y: 18, rx: 8, ry: 5 },
  { id: 'hormones', label: 'Hormones', x: 50, y: 12, rx: 7, ry: 4 },
  { id: 'inflammation', label: 'Inflammation', x: 62, y: 35, rx: 7, ry: 5 },
  { id: 'vitamins', label: 'Vitamins', x: 50, y: 62, rx: 10, ry: 5 },
];

const statusColors: Record<string, string> = {
  good: 'fill-success/20 stroke-success/50',
  attention: 'fill-warning/20 stroke-warning/50',
  concern: 'fill-destructive/15 stroke-destructive/40',
};

export function BodyMap() {
  const [selected, setSelected] = useState<BodySystem | null>(null);
  const selectedCategory = healthCategories.find(c => c.id === selected);
  const selectedMarkers = biomarkers.filter(b => b.bodySystem === selected);

  return (
    <div className="health-card">
      <h2 className="section-title mb-1">Body Systems Overview</h2>
      <p className="section-subtitle mb-4">Click a region to see related markers and insights</p>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Body SVG */}
        <div className="relative w-full max-w-[220px] mx-auto lg:mx-0 flex-shrink-0">
          <svg viewBox="0 0 100 80" className="w-full">
            {/* Simplified body outline */}
            <ellipse cx="50" cy="8" rx="8" ry="8" className="fill-muted stroke-border" strokeWidth="0.5" />
            <path d="M42 16 L38 28 L32 50 L35 50 L42 32 L44 55 L40 75 L46 75 L50 55 L54 75 L60 75 L56 55 L58 32 L65 50 L68 50 L62 28 L58 16 Z" className="fill-muted stroke-border" strokeWidth="0.5" />

            {/* Clickable regions */}
            {bodyRegions.map(region => {
              const cat = healthCategories.find(c => c.id === region.id);
              const colorClass = cat ? statusColors[cat.status] : 'fill-muted/30 stroke-border';
              const isSelected = selected === region.id;
              return (
                <g key={region.id} onClick={() => setSelected(selected === region.id ? null : region.id)} className="cursor-pointer">
                  <ellipse
                    cx={region.x} cy={region.y} rx={region.rx} ry={region.ry}
                    className={`${colorClass} transition-all duration-200 ${isSelected ? 'stroke-primary stroke-[1.5]' : ''}`}
                    strokeWidth={isSelected ? 1.5 : 0.8}
                    opacity={0.7}
                  />
                  <text x={region.x} y={region.y + 1} textAnchor="middle" className="fill-foreground text-[3px] font-medium pointer-events-none select-none">
                    {region.label}
                  </text>
                </g>
              );
            })}
          </svg>
          {/* Legend */}
          <div className="flex gap-3 justify-center mt-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success/40" /> Good</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning/40" /> Attention</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive/30" /> Concern</span>
          </div>
        </div>

        {/* Detail panel */}
        <div className="flex-1 min-w-0">
          {!selectedCategory ? (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground py-8">
              <p>Select a body region to view related markers and insights.</p>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <span>{selectedCategory.icon}</span>
                    {selectedCategory.name}
                  </h3>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium mt-1 ${
                    selectedCategory.status === 'good' ? 'bg-success/10 text-success' :
                    selectedCategory.status === 'attention' ? 'bg-warning/10 text-warning-foreground' :
                    'bg-destructive/10 text-destructive'
                  }`}>
                    {selectedCategory.status === 'good' ? 'Looking good' : selectedCategory.status === 'attention' ? 'Worth monitoring' : 'Worth discussing'}
                  </span>
                </div>
                <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-muted">
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{selectedCategory.summary}</p>
              {/* Markers */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Related markers</p>
                {selectedMarkers.map(m => (
                  <div key={m.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium"><MedicalTerm term={m.medicalName}>{m.plainName}</MedicalTerm></p>
                      <p className="text-xs text-muted-foreground">{m.medicalName}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold">{m.value} <span className="text-xs font-normal text-muted-foreground">{m.unit}</span></span>
                      <p className={`text-[11px] font-medium ${
                        m.status === 'normal' ? 'text-success' :
                        m.status.includes('slightly') ? 'text-warning-foreground' : 'text-destructive'
                      }`}>
                        {m.status === 'normal' ? 'Normal' : m.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Supportive habits */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Supportive habits</p>
                <ul className="space-y-1">
                  {selectedCategory.supportiveHabits.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
