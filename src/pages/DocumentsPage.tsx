import { useState, useCallback } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ContextPanel, ContextSection } from '@/components/layout/ContextPanel';
import { SourceBadge } from '@/components/shared/Badges';
import { documents, type HealthDocument } from '@/data/mockData';
import { documentExtractions, type DocumentExtraction } from '@/data/biomarkerData';
import { FileText, Search, Upload, ClipboardPaste, CheckCircle2, AlertCircle, Clock, X } from 'lucide-react';

const categoryLabels: Record<string, string> = {
  labs: 'Labs', visit_notes: 'Visit Notes', imaging: 'Imaging',
  medications: 'Medications', admin: 'Admin', wellness_logs: 'Wellness Logs', other: 'Other',
};

const confidenceColors = {
  high: 'text-success',
  moderate: 'text-warning',
  needs_review: 'text-destructive',
};

type UploadedFile = {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'uploading' | 'extracting' | 'complete' | 'needs_review';
  progress: number;
};

export default function DocumentsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<HealthDocument | null>(null);
  const [selectedExtraction, setSelectedExtraction] = useState<DocumentExtraction | null>(null);

  // Upload state
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [showPaste, setShowPaste] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const categories = ['all', ...new Set(documents.map(d => d.category))];
  const filtered = documents
    .filter(d => category === 'all' || d.category === category)
    .filter(d => search === '' || d.fileName.toLowerCase().includes(search.toLowerCase()) || d.summary.toLowerCase().includes(search.toLowerCase()));

  const simulateUpload = useCallback((name: string, type: string) => {
    const id = `upload-${Date.now()}`;
    const file: UploadedFile = { id, name, type, size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`, status: 'uploading', progress: 0 };
    setFiles(prev => [file, ...prev]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'extracting', progress: 100 } : f));
        setTimeout(() => {
          setFiles(prev => prev.map(f => f.id === id ? { ...f, status: Math.random() > 0.3 ? 'complete' : 'needs_review' } : f));
        }, 2000);
      } else {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress } : f));
      }
    }, 400);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    Array.from(e.dataTransfer.files).forEach(f => simulateUpload(f.name, f.type));
  }, [simulateUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach(f => simulateUpload(f.name, f.type));
  }, [simulateUpload]);

  const handlePasteSubmit = () => {
    if (pasteText.trim()) {
      simulateUpload('pasted_text_note.txt', 'text/plain');
      setPasteText('');
      setShowPaste(false);
    }
  };

  const statusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading': return <Clock className="h-4 w-4 text-info animate-pulse" />;
      case 'extracting': return <Clock className="h-4 w-4 text-primary animate-pulse" />;
      case 'complete': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'needs_review': return <AlertCircle className="h-4 w-4 text-warning" />;
    }
  };

  // Context panel for extraction details
  const contextContent = selectedExtraction ? (
    <ContextPanel>
      <ContextSection title="Extraction Details">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">File</p>
            <p className="text-sm font-medium">{selectedExtraction.fileName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Provider</p>
            <p className="text-sm">{selectedExtraction.provider}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Confidence</p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${selectedExtraction.confidence > 90 ? 'bg-success' : selectedExtraction.confidence > 75 ? 'bg-warning' : 'bg-destructive'}`} style={{ width: `${selectedExtraction.confidence}%` }} />
              </div>
              <span className="text-xs font-medium">{selectedExtraction.confidence}%</span>
            </div>
          </div>
          {selectedExtraction.extractedDiagnoses.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Diagnoses found</p>
              {selectedExtraction.extractedDiagnoses.map((d, i) => (
                <p key={i} className="text-xs bg-accent rounded px-2 py-1 mb-1">{d}</p>
              ))}
            </div>
          )}
          {selectedExtraction.extractedBiomarkers.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Biomarkers extracted</p>
              {selectedExtraction.extractedBiomarkers.map((b, i) => (
                <p key={i} className="text-xs bg-muted rounded px-2 py-1 mb-1">{b}</p>
              ))}
            </div>
          )}
          {selectedExtraction.extractedMedications.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Medications</p>
              {selectedExtraction.extractedMedications.map((m, i) => (
                <p key={i} className="text-xs bg-muted rounded px-2 py-1 mb-1">{m}</p>
              ))}
            </div>
          )}
          {selectedExtraction.nextSteps.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Next steps</p>
              {selectedExtraction.nextSteps.map((s, i) => (
                <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5 mb-1">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  {s}
                </p>
              ))}
            </div>
          )}
        </div>
      </ContextSection>
    </ContextPanel>
  ) : undefined;

  return (
    <AppShell pageTitle="Documents" contextContent={contextContent}>
      <div className="space-y-6 max-w-4xl animate-fade-in">
        {/* Upload area */}
        <div
          className={`drop-zone ${dragActive ? 'drop-zone-active' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium mb-1">Drop health documents here</p>
          <p className="text-xs text-muted-foreground mb-4">Supports PDF, DOCX, TXT, CSV — up to 20 MB</p>
          <div className="flex gap-3 justify-center">
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors">
              <FileText className="h-4 w-4" />
              Choose files
              <input type="file" multiple accept=".pdf,.docx,.txt,.csv,.md" className="hidden" onChange={handleFileInput} />
            </label>
            <button
              onClick={() => setShowPaste(!showPaste)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-muted transition-colors"
            >
              <ClipboardPaste className="h-4 w-4" />
              Paste text
            </button>
          </div>
        </div>

        {/* Paste area */}
        {showPaste && (
          <div className="health-card animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Paste medical notes or results</h3>
              <button onClick={() => setShowPaste(false)} className="p-1 rounded hover:bg-muted">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste your medical notes, lab results, or health information here..."
              className="w-full h-32 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={handlePasteSubmit}
              disabled={!pasteText.trim()}
              className="mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
            >
              Extract information
            </button>
          </div>
        )}

        {/* Active uploads */}
        {files.length > 0 && (
          <section>
            <h2 className="section-title mb-3">Recent uploads</h2>
            <div className="space-y-2">
              {files.map(f => (
                <div key={f.id} className="health-card flex items-center gap-3 p-3">
                  {statusIcon(f.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{f.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {f.size} · {f.status === 'uploading' ? `Uploading ${f.progress}%` :
                        f.status === 'extracting' ? 'Extracting information...' :
                        f.status === 'complete' ? 'Extraction complete' : 'Needs review'}
                    </p>
                  </div>
                  {f.status === 'uploading' && (
                    <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${f.progress}%` }} />
                    </div>
                  )}
                  {f.status === 'needs_review' && (
                    <span className="source-badge bg-warning/10 text-warning-foreground">Needs review</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Search and filters */}
        <section>
          <h2 className="section-title mb-3">Document Library</h2>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
                onClick={() => {
                  setSelectedDoc(selectedDoc?.id === doc.id ? null : doc);
                  // Also try to match an extraction for the context panel
                  const ext = documentExtractions.find(e => e.documentId === doc.id);
                  setSelectedExtraction(ext || null);
                }}
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
                              {doc.linkedDiagnoses.map(id => (
                                <span key={id} className="source-badge bg-accent text-accent-foreground">{id}</span>
                              ))}
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
        </section>

        {/* Info notice */}
        <div className="rounded-lg bg-muted/50 border border-border p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Demo mode:</strong> Document extraction is simulated with sample data. In a production version,
            uploaded files would be parsed using AI to extract diagnoses, biomarkers, medications, and follow-up instructions automatically.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
