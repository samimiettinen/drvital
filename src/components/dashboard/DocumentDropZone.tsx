import { useState, useCallback } from 'react';
import { Upload, FileText, Camera, Shield, X, CheckCircle2 } from 'lucide-react';

interface UploadedFile {
  name: string;
  size: string;
  status: 'uploading' | 'processing' | 'done' | 'error';
  type: string;
}

export function DocumentDropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [showScan, setShowScan] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const simulateUpload = (fileName: string) => {
    const newFile: UploadedFile = {
      name: fileName,
      size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
      status: 'uploading',
      type: fileName.endsWith('.pdf') ? 'PDF' : fileName.endsWith('.csv') ? 'CSV' : 'Document',
    };
    setFiles(prev => [...prev, newFile]);
    
    setTimeout(() => {
      setFiles(prev => prev.map(f => f.name === fileName ? { ...f, status: 'processing' } : f));
    }, 800);
    setTimeout(() => {
      setFiles(prev => prev.map(f => f.name === fileName ? { ...f, status: 'done' } : f));
    }, 2200);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(f => simulateUpload(f.name));
  }, []);

  const handleFileSelect = () => {
    // Simulate file selection
    simulateUpload('lab_results_april_2026.pdf');
  };

  const removeFile = (name: string) => {
    setFiles(prev => prev.filter(f => f.name !== name));
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="section-title">Upload Medical Records</h2>
          <p className="section-subtitle">Drop PDFs, lab results, clinical notes, or scan documents</p>
        </div>
        <button
          onClick={() => setShowScan(!showScan)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground hover:bg-accent transition-colors"
        >
          <Camera className="h-3.5 w-3.5" />
          Scan Document
        </button>
      </div>

      {/* Scan mode */}
      {showScan && (
        <div className="health-card mb-4 bg-accent/20">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Camera className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">Document Scanner</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Position your medical document, prescription, or lab report in view. The scanner will capture and extract key information automatically.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => { simulateUpload('scanned_prescription_001.pdf'); setShowScan(false); }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Camera className="h-3.5 w-3.5" />
                  Capture
                </button>
                <button
                  onClick={() => setShowScan(false)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileSelect}
        className={`drop-zone ${isDragging ? 'drop-zone-active' : ''}`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {isDragging ? 'Drop files here' : 'Drag & drop medical records here'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, TXT, MD, CSV — up to 25 MB per file
            </p>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground hover:bg-accent transition-colors">
            <FileText className="h-3.5 w-3.5" />
            Browse files
          </button>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-4">
          <Shield className="h-3 w-3 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground">Your records are private and stored securely on your device</span>
        </div>
      </div>

      {/* Uploaded files list */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map(f => (
            <div key={f.name} className="health-card p-3 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{f.name}</p>
                <p className="text-[11px] text-muted-foreground">{f.size} · {f.type}</p>
              </div>
              <div className="flex items-center gap-2">
                {f.status === 'uploading' && (
                  <span className="text-[11px] text-info font-medium">Uploading…</span>
                )}
                {f.status === 'processing' && (
                  <span className="text-[11px] text-warning font-medium">Extracting data…</span>
                )}
                {f.status === 'done' && (
                  <span className="flex items-center gap-1 text-[11px] text-success font-medium">
                    <CheckCircle2 className="h-3 w-3" /> Ready
                  </span>
                )}
                <button onClick={() => removeFile(f.name)} className="p-1 hover:bg-muted rounded">
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
