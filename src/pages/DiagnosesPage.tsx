import { useState, useCallback } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ContextPanel, ContextSection } from '@/components/layout/ContextPanel';
import { StatusChip, SourceBadge } from '@/components/shared/Badges';
import { MedicalTerm } from '@/components/shared/MedicalTerm';
import { ConfidenceBadge } from '@/components/shared/ConfidenceBadge';
import { HealthChat } from '@/components/shared/HealthChat';
import { diagnoses, medications, type Diagnosis } from '@/data/mockData';
import { healthStory } from '@/data/biomarkerData';
import { Sparkles, Link2, AlertCircle, TrendingUp, HelpCircle, ChevronDown, ChevronUp, Lightbulb, ArrowRight, ShieldCheck } from 'lucide-react';

// Cross-document synthesis data for diagnoses
const diagnosisSynthesis = {
  overviewNarrative: "You're managing three active conditions that are interconnected in important ways. Your diabetes, hypertension, and anxiety don't exist in isolation — they share common drivers like stress, sleep quality, and inflammation. The good news: your treatment plan is working across all three, with measurable improvements in blood sugar and cholesterol.",

  correlations: [
    {
      id: 'c1',
      title: 'Diabetes and hypertension share a metabolic root',
      conditions: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
      insight: 'These two conditions frequently appear together — roughly 75% of people with type 2 diabetes also have hypertension. They share underlying drivers including insulin resistance, inflammation, and vascular stress. The positive side: interventions that help one often help the other. Your dietary changes and weight loss are likely benefiting both your blood sugar and blood pressure.',
      evidenceStrength: 'strong' as const,
      sources: ['diabetes_management_plan.pdf', 'blood_pressure_log_oct.csv'],
      actionable: 'Your Lisinopril (ACE inhibitor) is a strategic choice — it manages blood pressure while also protecting your kidneys from diabetes-related damage.',
    },
    {
      id: 'c2',
      title: 'Anxiety is amplifying your metabolic stress',
      conditions: ['Generalized Anxiety Disorder', 'Type 2 Diabetes Mellitus', 'Essential Hypertension'],
      insight: 'Anxiety triggers cortisol release, which directly raises blood sugar and blood pressure. Your wearable data shows that during high-stress periods, your HRV drops, sleep quality declines, and recovery takes 1–2 weeks. This creates a feedback loop: poor sleep worsens anxiety, which worsens metabolic control, which increases health worry.',
      evidenceStrength: 'moderate' as const,
      sources: ['psychiatry_notes_sept.pdf', 'Oura ring data', 'sleep_journal_notes.md'],
      actionable: 'Breaking this cycle at the sleep and stress points may have outsized benefits across all three conditions. Your therapy sessions appear to be helping — GAD-7 score improved from 12 to 8.',
    },
    {
      id: 'c3',
      title: 'Inflammation may be the connecting thread',
      conditions: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
      insight: 'Your elevated CRP (2.8 mg/L) suggests chronic low-grade inflammation, which is associated with both diabetes and cardiovascular disease. Inflammation can worsen insulin resistance and contribute to blood vessel stiffness. It may also be influenced by your stress and sleep patterns.',
      evidenceStrength: 'moderate' as const,
      sources: ['lab_results_march.pdf'],
      actionable: 'Addressing inflammation through diet (anti-inflammatory foods), sleep consistency, and stress management could improve your overall metabolic picture. Worth discussing whether further investigation is needed.',
    },
  ],

  additionalConsiderations: [
    {
      title: 'Sleep apnea could be worsening everything',
      detail: 'Your suspected sleep apnea — if confirmed — could be a hidden driver of your elevated blood pressure, blood sugar, inflammation, and anxiety. Untreated sleep apnea raises cortisol, increases insulin resistance, and puts stress on the cardiovascular system. A sleep study could be one of the highest-impact next steps.',
      urgency: 'discuss' as const,
      evidenceStrength: 'suggestive' as const,
    },
    {
      title: 'Medication interactions are being well managed',
      detail: 'Your current combination of Metformin, Lisinopril, Atorvastatin, and Vitamin D3 is a well-established regimen for your conditions. Lab results confirm your liver and kidneys are tolerating these medications well. The Atorvastatin may also have mild anti-inflammatory effects, which could help with your CRP.',
      urgency: 'watch' as const,
      evidenceStrength: 'strong' as const,
    },
  ],

  questionsToExplore: [
    'Could treating sleep apnea improve my blood sugar, blood pressure, and anxiety simultaneously?',
    'Is my elevated CRP driven by metabolic factors, stress, or something else entirely?',
    'Would adding an anti-inflammatory approach (diet or medication) benefit all three conditions?',
    'How much of my blood pressure variability might be anxiety-driven vs. medication timing?',
  ],
};

// Generate AI responses for diagnosis-related questions
function generateDiagnosisResponse(question: string): string {
  const q = question.toLowerCase();

  if (q.includes('sleep apnea')) {
    return `Great question. Based on your records, there are several signals pointing toward possible sleep apnea:\n\n• Your Oura ring data shows variable sleep quality and low HRV patterns\n• Your blood pressure, blood sugar, and inflammation markers are all slightly elevated — sleep apnea can contribute to all three\n• Your psychiatrist noted suspected sleep apnea in September notes\n\nUntreated sleep apnea can worsen diabetes, hypertension, and anxiety through chronic cortisol elevation. A sleep study (polysomnography) would be the definitive next step.\n\n**What to ask your doctor:** "Given my combination of conditions, would a sleep study be worthwhile? Could CPAP therapy help my blood sugar and blood pressure?"`;
  }

  if (q.includes('crp') || q.includes('inflammation')) {
    return `Your CRP is at 2.8 mg/L — about 3x the optimal level. In your case, there are multiple possible contributors:\n\n• **Metabolic inflammation** — Insulin resistance and elevated blood sugar can drive chronic low-grade inflammation\n• **Stress-related** — Your high-stress periods correlate with worse recovery markers\n• **Sleep disruption** — Poor sleep quality is a known inflammation trigger\n• **Visceral fat** — Even modest excess abdominal fat produces inflammatory cytokines\n\nThe good news: your Atorvastatin has mild anti-inflammatory properties, and your dietary improvements may already be helping.\n\n**What to discuss:** Whether retesting CRP after 3 months of improved sleep and stress management would be informative before considering additional interventions.`;
  }

  if (q.includes('anti-inflammatory') || q.includes('diet') || q.includes('benefit all')) {
    return `An anti-inflammatory approach could indeed have broad benefits across your three conditions. Here's the evidence:\n\n• **Mediterranean-style diet** has shown benefits for blood sugar control, blood pressure, and anxiety symptoms in clinical studies\n• **Omega-3 fatty acids** (fish oil) may reduce inflammation and have modest benefits for cardiovascular health\n• **Regular moderate exercise** reduces CRP levels and improves insulin sensitivity\n• **Sleep consistency** is one of the most underrated anti-inflammatory interventions\n\nYou're already making dietary changes that are helping (your HbA1c and cholesterol improvements suggest this). Building on that foundation with more intentional anti-inflammatory foods could amplify the effect.\n\n**Practical next step:** Ask your doctor whether adding an omega-3 supplement makes sense alongside your current medications.`;
  }

  if (q.includes('blood pressure') || q.includes('anxiety-driven') || q.includes('variability')) {
    return `Your blood pressure variability likely has both anxiety and medication timing components:\n\n• **Anxiety contribution:** During high-stress periods, your wearable data shows HRV drops and heart rate elevations — both of which correlate with blood pressure spikes. Your GAD-7 improvement (12→8) may be helping stabilize readings.\n• **Medication timing:** Lisinopril is typically taken once daily. If your blood pressure tends to be higher at certain times, the timing of your dose relative to those peaks matters.\n• **Other factors:** Sleep quality, caffeine, and physical activity also affect daily variation.\n\nYour October blood pressure log shows readings ranging from 128/82 to 145/92 — the higher readings appear to cluster around stressful periods.\n\n**Questions for your doctor:** "Should we consider splitting my blood pressure medication dose, or is the current timing optimal?" and "Would ambulatory blood pressure monitoring give us better data?"`;
  }

  // Generic fallback
  return `Based on your health records, here's what I can share about that:\n\nYour three active conditions — type 2 diabetes, hypertension, and anxiety — are interconnected through shared metabolic and stress pathways. Your current treatment plan (Metformin, Lisinopril, Atorvastatin) is showing measurable improvements:\n\n• HbA1c improved to 6.8% (best in 2 years)\n• LDL cholesterol dropped 17% on Atorvastatin\n• GAD-7 anxiety score improved from 12 to 8\n\nThe main areas still needing attention are inflammation (CRP at 2.8), sleep quality, and stress management.\n\nWould you like to explore any of these areas in more detail? For example, I can explain how your conditions interact, or suggest specific questions for your next doctor visit.`;
}

export default function DiagnosesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved' | 'suspected'>('all');
  const [synthExpanded, setSynthExpanded] = useState(true);
  const [showAllCorrelations, setShowAllCorrelations] = useState(false);
  const [chatQuestion, setChatQuestion] = useState<string | null>(null);

  const filtered = filter === 'all' ? diagnoses : diagnoses.filter(d => d.status === filter);
  const selected = diagnoses.find(d => d.id === selectedId);

  const handleQuestionClick = (question: string) => {
    setChatQuestion(question);
    setSelectedId(null); // switch context panel to chat
  };

  const contextContent = chatQuestion ? (
    <ContextPanel>
      <ContextSection title="Diagnosis AI Chat">
        <HealthChat
          title="Exploring your question"
          suggestedPrompts={diagnosisSynthesis.questionsToExplore.filter(q => q !== chatQuestion)}
          generateResponse={generateDiagnosisResponse}
          initialQuestion={chatQuestion}
          onClose={() => setChatQuestion(null)}
        />
      </ContextSection>
    </ContextPanel>
  ) : selected ? (
    <ContextPanel>
      <ContextSection title="Diagnosis Detail">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-1">{selected.name}</h3>
            <StatusChip status={selected.status} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Plain-language explanation</p>
            <p className="text-sm leading-relaxed">{selected.explanation}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Source</p>
            <SourceBadge source={selected.sourceType} />
            <span className="text-[10px] text-muted-foreground ml-2">Confidence: {selected.confidence}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">First documented</p>
              <p className="text-sm">{new Date(selected.dateFirstDocumented).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Last confirmed</p>
              <p className="text-sm">{new Date(selected.lastConfirmed).toLocaleDateString()}</p>
            </div>
          </div>
          {selected.relatedMedications.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Related medications</p>
              {selected.relatedMedications.map(m => (
                <span key={m} className="source-badge bg-muted text-muted-foreground mr-1 mb-1">{m}</span>
              ))}
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Follow-up plan</p>
            <p className="text-sm leading-relaxed">{selected.followUpPlan}</p>
          </div>
          {selected.suggestedQuestions.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Questions for next visit</p>
              <ul className="space-y-1.5">
                {selected.suggestedQuestions.map((q, i) => (
                  <li key={i} className="text-sm text-foreground bg-muted rounded-lg px-3 py-2">{q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </ContextSection>
    </ContextPanel>
  ) : (
    <ContextPanel>
      <ContextSection title="Select a Diagnosis">
        <p className="text-sm text-muted-foreground">Click on a diagnosis card to see details, related medications, follow-up plans, and suggested questions.</p>
      </ContextSection>
    </ContextPanel>
  );

  return (
    <AppShell pageTitle="Diagnoses" contextContent={contextContent}>
      <div className="space-y-5 max-w-4xl animate-fade-in">

        {/* Cross-Document Synthesis Panel */}
        <section className="health-card border-primary/15">
          <button
            onClick={() => setSynthExpanded(!synthExpanded)}
            className="flex items-start justify-between w-full text-left"
          >
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <h2 className="section-title flex items-center gap-2">
                  Diagnosis Insights
                  <span className="source-badge bg-primary/10 text-primary text-[10px]">AI-powered</span>
                </h2>
                <p className="section-subtitle">How your conditions connect and what patterns emerge across your records</p>
              </div>
            </div>
            {synthExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground mt-1" /> : <ChevronDown className="h-4 w-4 text-muted-foreground mt-1" />}
          </button>

          {synthExpanded && (
            <div className="mt-4 space-y-5">
              {/* Overall narrative */}
              <div className="rounded-lg bg-accent/30 border border-primary/10 px-4 py-3.5">
                <p className="text-sm leading-relaxed text-foreground">{diagnosisSynthesis.overviewNarrative}</p>
              </div>

              {/* Condition correlations */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Link2 className="h-3.5 w-3.5" /> How your conditions connect
                </p>
                <div className="space-y-3">
                  {diagnosisSynthesis.correlations.slice(0, showAllCorrelations ? undefined : 2).map(corr => (
                    <div key={corr.id} className="rounded-lg bg-muted/50 px-4 py-3.5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-foreground">{corr.title}</h3>
                        <ConfidenceBadge strength={corr.evidenceStrength} />
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {corr.conditions.map((c, i) => (
                          <span key={i} className="source-badge bg-accent text-accent-foreground text-[10px]">{c}</span>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">{corr.insight}</p>
                      <div className="rounded-lg bg-primary/5 border border-primary/10 px-3 py-2">
                        <p className="text-xs text-foreground leading-relaxed flex items-start gap-1.5">
                          <Lightbulb className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                          {corr.actionable}
                        </p>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        Sources: {corr.sources.join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
                {diagnosisSynthesis.correlations.length > 2 && (
                  <button
                    onClick={() => setShowAllCorrelations(!showAllCorrelations)}
                    className="text-xs text-primary font-medium mt-2 hover:underline"
                  >
                    {showAllCorrelations ? 'Show less' : `Show ${diagnosisSynthesis.correlations.length - 2} more connection`}
                  </button>
                )}
              </div>

              {/* Additional considerations */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" /> Additional considerations
                </p>
                <div className="space-y-2">
                  {diagnosisSynthesis.additionalConsiderations.map((item, i) => (
                    <div key={i} className="rounded-lg bg-muted/50 px-4 py-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="text-xs font-semibold text-foreground">{item.title}</h4>
                        <ConfidenceBadge strength={item.evidenceStrength} />
                        <span className={`source-badge text-[10px] ${
                          item.urgency === 'discuss' ? 'bg-warning/10 text-warning-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          {item.urgency === 'discuss' ? 'Discuss with doctor' : 'Continue monitoring'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions to explore — now clickable */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5" /> Questions worth exploring
                </p>
                <div className="space-y-1.5">
                  {diagnosisSynthesis.questionsToExplore.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuestionClick(q)}
                      className="w-full text-left text-xs bg-accent/40 rounded-lg px-3 py-2.5 text-foreground flex items-start gap-2 hover:bg-accent/60 transition-colors group"
                    >
                      <ArrowRight className="h-3 w-3 text-primary flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                      <span className="group-hover:text-primary transition-colors">{q}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Click a question to explore it with the AI assistant
                </p>
              </div>

              {/* Disclaimer */}
              <div className="rounded-lg bg-muted/50 border border-border px-3 py-2.5 flex items-start gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  These insights are generated by analyzing patterns across your uploaded records, lab results, and health data.
                  They are intended to help you ask better questions — not to provide a diagnosis or replace clinical judgment.
                  Correlations noted here are observational and should be discussed with your healthcare provider.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Filter chips */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'active', 'resolved', 'suspected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} {f === 'all' ? `(${diagnoses.length})` : `(${diagnoses.filter(d => d.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Diagnosis cards */}
        <div className="space-y-3">
          {filtered.map(d => (
            <button
              key={d.id}
              onClick={() => { setSelectedId(d.id); setChatQuestion(null); }}
              className={`w-full text-left health-card transition-all ${selectedId === d.id ? 'ring-2 ring-primary/30' : ''}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StatusChip status={d.status} />
                  <span className="text-xs text-muted-foreground">
                    Confidence: {d.confidence}
                  </span>
                </div>
                <SourceBadge source={d.sourceType} />
              </div>
              <h3 className="font-semibold text-foreground mb-1"><MedicalTerm term={d.name}>{d.name}</MedicalTerm></h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{d.explanation}</p>
              <div className="flex flex-wrap gap-1.5">
                {d.relatedMedications.map(m => (
                  <span key={m} className="source-badge bg-muted text-muted-foreground text-[11px]"><MedicalTerm term={m}>{m}</MedicalTerm></span>
                ))}
                {d.relatedMeasurements.slice(0, 3).map(m => (
                  <span key={m} className="source-badge bg-accent text-accent-foreground text-[11px]"><MedicalTerm term={m}>{m}</MedicalTerm></span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
