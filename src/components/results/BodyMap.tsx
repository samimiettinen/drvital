import { useState } from 'react';
import type { BodySystem } from '@/data/biomarkerData';
import { biomarkers, healthCategories } from '@/data/biomarkerData';
import { MedicalTerm } from '@/components/shared/MedicalTerm';
import { X } from 'lucide-react';
import bodyAnatomyImg from '@/assets/body-anatomy.png';
import liverIcon from '@/assets/liver-icon.png';

function SystemIcon({ icon }: { icon: string }) {
  if (icon === 'liver-img') {
    return <img src={liverIcon} alt="Liver" className="h-4 w-4 inline-block" />;
  }
  return <span>{icon}</span>;
}

// Hotspot positions as percentages relative to the image
const bodyRegions: { id: BodySystem; label: string; top: number; left: number; width: number; height: number }[] = [
  { id: 'heart', label: 'Heart', top: 22, left: 42, width: 16, height: 10 },
  { id: 'liver', label: 'Liver', top: 33, left: 30, width: 20, height: 10 },
  { id: 'kidneys', label: 'Kidneys', top: 42, left: 30, width: 40, height: 8 },
  { id: 'metabolism', label: 'Metabolism', top: 48, left: 32, width: 36, height: 14 },
  { id: 'blood', label: 'Blood', top: 16, left: 30, width: 40, height: 8 },
  { id: 'hormones', label: 'Hormones', top: 5, left: 35, width: 30, height: 8 },
  { id: 'inflammation', label: 'Inflammation', top: 28, left: 52, width: 18, height: 10 },
  { id: 'vitamins', label: 'Vitamins', top: 62, left: 35, width: 30, height: 10 },
];

const statusColors: Record<string, { bg: string; border: string; ring: string }> = {
  good: { bg: 'bg-success/15', border: 'border-success/30', ring: 'ring-success/40' },
  attention: { bg: 'bg-warning/15', border: 'border-warning/30', ring: 'ring-warning/40' },
  concern: { bg: 'bg-destructive/10', border: 'border-destructive/25', ring: 'ring-destructive/40' },
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
        {/* Body image with hotspots */}
        <div className="relative w-full max-w-[260px] mx-auto lg:mx-0 flex-shrink-0">
          <img
            src={bodyAnatomyImg}
            alt="Human body anatomy showing major organ systems"
            className="w-full h-auto"
            width={512}
            height={1024}
          />
          {/* Clickable hotspots */}
          {bodyRegions.map(region => {
            const cat = healthCategories.find(c => c.id === region.id);
            const colors = cat ? statusColors[cat.status] : statusColors.good;
            const isSelected = selected === region.id;
            return (
              <button
                key={region.id}
                onClick={() => setSelected(selected === region.id ? null : region.id)}
                className={`absolute rounded-lg border transition-all duration-200 flex items-center justify-center group
                  ${colors.bg} ${colors.border}
                  ${isSelected ? `ring-2 ${colors.ring} border-primary/50 shadow-md` : 'hover:shadow-sm'}
                `}
                style={{
                  top: `${region.top}%`,
                  left: `${region.left}%`,
                  width: `${region.width}%`,
                  height: `${region.height}%`,
                }}
                title={region.label}
              >
                <span className={`text-[9px] font-semibold px-1 py-0.5 rounded bg-card/80 backdrop-blur-sm shadow-sm transition-opacity
                  ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `}>
                  {region.label}
                </span>
              </button>
            );
          })}
          {/* Legend */}
          <div className="flex gap-3 justify-center mt-3 text-[10px] text-muted-foreground">
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
                    <SystemIcon icon={selectedCategory.icon} />
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
