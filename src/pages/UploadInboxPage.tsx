import { useState, useCallback } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ContextPanel, ContextSection } from '@/components/layout/ContextPanel';
import { SourceBadge } from '@/components/shared/Badges';
import { documentExtractions, type DocumentExtraction } from '@/data/biomarkerData';
import { Upload, FileText, ClipboardPaste, CheckCircle2, AlertCircle, Clock, Search, X } from 'lucide-react';

type UploadedFile = {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'uploading' | 'extracting' | 'complete' | 'needs_review';
  progress: number;
};

export default function UploadInboxPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [showPaste, setShowPaste] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedExtraction, setSelectedExtraction] = useState<DocumentExtraction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(f => simulateUpload(f.name, f.type));
  }, [simulateUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    selected.forEach(f => simulateUpload(f.name, f.type));
  }, [simulateUpload]);

  const handlePasteSubmit = () => {
    if (pasteText.trim()) {
      simulateUpload('pasted_text_note.txt', 'text/plain');
      setPasteText('');
      setShowPaste(false);
    }
  };

  const filteredExtractions = documentExtractions.filter(e =>
    !searchQuery || e.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading': return <Clock className="h-4 w-4 text-info animate-pulse" />;
      case 'extracting': return <Clock className="h-4 w-4 text-primary animate-pulse" />;
      case 'complete': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'needs_review': return <AlertCircle className="h-4 w-4 text-warning" />;
    }
  };

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
    <AppShell pageTitle="Upload & Inbox" contextContent={contextContent}>
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

        {/* Document library with extractions */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">Document Library</h2>
          </div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="space-y-2.5">
            {filteredExtractions.map(ext => (
              <button
                key={ext.documentId}
                onClick={() => setSelectedExtraction(ext)}
                className={`w-full text-left health-card-hover p-4 ${selectedExtraction?.documentId === ext.documentId ? 'ring-2 ring-primary/30' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{ext.fileName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {ext.extractionStatus === 'needs_review' && (
                      <span className="source-badge bg-warning/10 text-warning-foreground">Needs review</span>
                    )}
                    <span className={`text-[11px] font-medium ${ext.confidence > 90 ? 'text-success' : ext.confidence > 75 ? 'text-warning-foreground' : 'text-destructive'}`}>
                      {ext.confidence}% confidence
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{ext.provider} · {ext.uploadDate}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{ext.summary}</p>
                <div className="flex flex-wrap gap-1.5">
                  {ext.extractedDiagnoses.slice(0, 2).map((d, i) => (
                    <span key={i} className="source-badge bg-accent text-accent-foreground">{d}</span>
                  ))}
                  {ext.extractedBiomarkers.slice(0, 2).map((b, i) => (
                    <span key={i} className="source-badge bg-muted text-muted-foreground">{b}</span>
                  ))}
                  {(ext.extractedBiomarkers.length + ext.extractedDiagnoses.length) > 4 && (
                    <span className="source-badge bg-muted text-muted-foreground">+{ext.extractedBiomarkers.length + ext.extractedDiagnoses.length - 4} more</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Info notice */}
        <div className="rounded-lg bg-muted/50 border border-border p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Demo mode:</strong> Document extraction is simulated with sample data. In a production version,
            uploaded files would be parsed using AI to extract diagnoses, biomarkers, medications, and follow-up instructions automatically.
            All extracted data can be reviewed and edited before being incorporated into your health story.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
