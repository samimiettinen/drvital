import { healthStory } from '@/data/biomarkerData';
import { BookOpen, TrendingUp, TrendingDown, AlertCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HealthStoryCard() {
  return (
    <div className="health-card">
      <div className="flex items-start gap-3 mb-4">
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <BookOpen className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h2 className="section-title">What is my story?</h2>
          <p className="section-subtitle">A synthesis across all your records and data</p>
        </div>
      </div>

      {/* Recurring themes */}
      <div className="mb-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Recurring themes</p>
        <div className="space-y-2">
          {healthStory.recurringThemes.slice(0, 3).map((t, i) => (
            <div key={i} className="rounded-lg bg-muted/50 px-3 py-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{t.title}</span>
                <span className="text-[10px] text-muted-foreground">{t.frequency}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{t.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Improvements & concerns */}
      <div className="grid gap-3 sm:grid-cols-2 mb-4">
        <div>
          <p className="text-xs font-medium text-success flex items-center gap-1 mb-2">
            <TrendingUp className="h-3 w-3" /> What improved
          </p>
          <ul className="space-y-1.5">
            {healthStory.improvements.slice(0, 3).map((item, i) => (
              <li key={i} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-success flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium text-warning-foreground flex items-center gap-1 mb-2">
            <AlertCircle className="h-3 w-3" /> Worth monitoring
          </p>
          <ul className="space-y-1.5">
            {healthStory.concerns.slice(0, 3).map((item, i) => (
              <li key={i} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-warning flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Key questions */}
      <div>
        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-2">
          <HelpCircle className="h-3 w-3" /> Questions for your next visit
        </p>
        <div className="space-y-1">
          {healthStory.questionsForNextVisit.slice(0, 3).map((q, i) => (
            <p key={i} className="text-xs text-foreground bg-muted/50 rounded-lg px-3 py-2">{q}</p>
          ))}
        </div>
      </div>

      <Link to="/results" className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-4 hover:underline">
        Explore full story & results →
      </Link>
    </div>
  );
}
