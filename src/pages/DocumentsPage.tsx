import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { SourceBadge } from '@/components/shared/Badges';
import { documents, type HealthDocument } from '@/data/mockData';
import { FileText, Search, Filter } from 'lucide-react';

const categoryLabels: Record<string, string> = {
  labs: 'Labs', visit_notes: 'Visit Notes', imaging: 'Imaging',
  medications: 'Medications', admin: 'Admin', wellness_logs: 'Wellness Logs', other: 'Other',
};

const confidenceColors = {
  high: 'text-success',
  moderate: 'text-warning',
  needs_review: 'text-destructive',
};

export default function DocumentsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<HealthDocument | null>(null);

  const categories = ['all', ...new Set(documents.map(d => d.category))];
  const filtered = documents
    .filter(d => category === 'all' || d.category === category)
    .filter(d => search === '' || d.fileName.toLowerCase().includes(search.toLowerCase()) || d.summary.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppShell pageTitle="Documents">
      <div className="space-y-5 max-w-4xl animate-fade-in">
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  category === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {c === 'all' ? 'All' : categoryLabels[c] || c}
              </button>
            ))}
          </div>
        </div>

        {/* Document list */}
        <div className="space-y-2">
          {filtered.map(doc => (
            <button
              key={doc.id}
              onClick={() => setSelectedDoc(selectedDoc?.id === doc.id ? null : doc)}
              className={`w-full text-left health-card transition-all ${selectedDoc?.id === doc.id ? 'ring-2 ring-primary/30' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-medium truncate">{doc.fileName}</h3>
                      <p className="text-xs text-muted-foreground">
                        {doc.provider && `${doc.provider} · `}
                        {new Date(doc.documentDate).toLocaleDateString()} ·{' '}
                        <span className="capitalize">{categoryLabels[doc.category]}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <SourceBadge source={doc.sourceType} />
                      <span className={`text-[11px] font-medium ${confidenceColors[doc.extractionConfidence]}`}>
                        {doc.extractionConfidence === 'needs_review' ? 'Needs review' : doc.extractionConfidence}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{doc.summary}</p>
                  {selectedDoc?.id === doc.id && (
                    <div className="mt-3 pt-3 border-t border-border space-y-2">
                      {doc.linkedDiagnoses.length > 0 && (
                        <div>
                          <p className="text-[11px] text-muted-foreground mb-1">Linked diagnoses</p>
                          <div className="flex flex-wrap gap-1">
                            {doc.linkedDiagnoses.map(id => {
                              const diag = documents.find(d => d.id === id);
                              return <span key={id} className="source-badge bg-accent text-accent-foreground">{id}</span>;
                            })}
                          </div>
                        </div>
                      )}
                      {doc.linkedMedications.length > 0 && (
                        <div>
                          <p className="text-[11px] text-muted-foreground mb-1">Linked medications</p>
                          <div className="flex flex-wrap gap-1">
                            {doc.linkedMedications.map(id => (
                              <span key={id} className="source-badge bg-muted text-muted-foreground">{id}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No documents found matching your search.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
