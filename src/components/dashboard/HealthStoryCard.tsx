import { healthStory } from '@/data/biomarkerData';
import { ConfidenceBadge } from '@/components/shared/ConfidenceBadge';
import { BookOpen, TrendingUp, AlertCircle, HelpCircle, ArrowRight, Lightbulb, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function HealthStoryCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="health-card">
      <div className="flex items-start gap-3 mb-4">
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <BookOpen className="h-4.5 w-4.5 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="section-title">What is my story?</h2>
          <p className="section-subtitle">Synthesized across {healthStory.crossDocumentInsights.length + healthStory.narrativeThreads.length} data sources and documents</p>
        </div>
      </div>

      {/* Overall narrative */}
      <div className="rounded-lg bg-accent/30 border border-primary/10 px-4 py-3.5 mb-5">
        <p className="text-sm leading-relaxed text-foreground">{healthStory.overallNarrative}</p>
        <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
          <FileText className="h-3 w-3" />
          Based on {healthStory.timelineHighlights.length} clinical events across {healthStory.recurringThemes.length} recurring themes
        </p>
      </div>

      {/* Narrative threads */}
      <div className="mb-5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Key narrative threads</p>
        <div className="space-y-2.5">
          {healthStory.narrativeThreads.slice(0, expanded ? undefined : 2).map(thread => {
            const statusColors = {
              improving: 'bg-success/10 text-success',
              stable: 'bg-muted text-muted-foreground',
              worsening: 'bg-destructive/10 text-destructive',
              resolved: 'bg-muted text-muted-foreground',
              emerging: 'bg-warning/10 text-warning-foreground',
            };
            return (
              <div key={thread.id} className="rounded-lg bg-muted/50 px-4 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">{thread.title}</span>
                  <span className={`source-badge ${statusColors[thread.status]}`}>
                    {thread.status.charAt(0).toUpperCase() + thread.status.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{thread.narrative.split('.').slice(0, 2).join('.') + '.'}</p>
                <div className="flex flex-wrap gap-1.5">
                  {thread.evidence.slice(0, 2).map((e, i) => (
                    <ConfidenceBadge key={i} strength={e.confidence} />
                  ))}
                  <span className="text-[10px] text-muted-foreground self-center">{thread.timespan}</span>
                </div>
              </div>
            );
          })}
        </div>
        {healthStory.narrativeThreads.length > 2 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary font-medium mt-2 hover:underline"
          >
            {expanded ? 'Show less' : `Show ${healthStory.narrativeThreads.length - 2} more threads`}
          </button>
        )}
      </div>

      {/* Cross-document insights */}
      <div className="mb-5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
          <Lightbulb className="h-3 w-3" /> Cross-document insights
        </p>
        <div className="space-y-2">
          {healthStory.crossDocumentInsights.slice(0, 3).map((insight, i) => (
            <div key={i} className="rounded-lg bg-muted/50 px-3 py-2.5">
              <p className="text-xs text-foreground leading-relaxed mb-1.5">{insight.insight}</p>
              <div className="flex items-center gap-2">
                <ConfidenceBadge strength={insight.confidence} />
                <span className="text-[10px] text-muted-foreground">{insight.documents.length} documents</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvements & concerns */}
      <div className="grid gap-3 sm:grid-cols-2 mb-5">
        <div>
          <p className="text-xs font-medium text-success flex items-center gap-1 mb-2">
            <TrendingUp className="h-3 w-3" /> What improved
          </p>
          <ul className="space-y-2">
            {healthStory.improvements.slice(0, 3).map((item, i) => (
              <li key={i} className="text-xs text-muted-foreground leading-relaxed">
                <div className="flex items-start gap-1.5">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-success flex-shrink-0" />
                  <div>
                    <span>{item.text}</span>
                    <span className="block text-[10px] text-muted-foreground/70 mt-0.5">Source: {item.evidenceSource}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium text-warning-foreground flex items-center gap-1 mb-2">
            <AlertCircle className="h-3 w-3" /> Worth monitoring
          </p>
          <ul className="space-y-2">
            {healthStory.concerns.slice(0, 3).map((item, i) => (
              <li key={i} className="text-xs text-muted-foreground leading-relaxed">
                <div className="flex items-start gap-1.5">
                  <span className={`mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                    item.urgency === 'act' ? 'bg-destructive' : item.urgency === 'discuss' ? 'bg-warning' : 'bg-muted-foreground'
                  }`} />
                  <div>
                    <span>{item.text}</span>
                    <span className="block text-[10px] text-muted-foreground/70 mt-0.5">Source: {item.evidenceSource}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Questions for next visit */}
      <div>
        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-2">
          <HelpCircle className="h-3 w-3" /> Questions for your next visit
        </p>
        <div className="space-y-1.5">
          {healthStory.questionsForNextVisit.slice(0, 3).map((q, i) => (
            <div key={i} className="text-xs bg-muted/50 rounded-lg px-3 py-2.5">
              <p className="text-foreground font-medium mb-0.5">{q.question}</p>
              <p className="text-[11px] text-muted-foreground">{q.rationale}</p>
            </div>
          ))}
        </div>
      </div>

      <Link to="/results" className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-4 hover:underline">
        Explore full story & results <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
