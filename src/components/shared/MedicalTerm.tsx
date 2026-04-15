import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const medicalGlossary: Record<string, string> = {
  'HRV': 'Heart Rate Variability — the variation in time between heartbeats. Higher HRV generally indicates better recovery and stress resilience.',
  'Resting Heart Rate': 'Your heart rate when fully at rest. A lower resting heart rate typically indicates better cardiovascular fitness.',
  'HbA1c': 'Hemoglobin A1c — a blood test that measures average blood sugar over the past 2–3 months. Used to monitor diabetes management.',
  'Blood Pressure': 'The force of blood pushing against artery walls, measured as systolic (pumping) over diastolic (resting). Normal is around 120/80 mmHg.',
  'BMI': 'Body Mass Index — a ratio of weight to height used as a general indicator of body composition.',
  'Respiratory Rate': 'The number of breaths you take per minute. Normal range is 12–20 breaths per minute at rest.',
  'SpO2': 'Blood oxygen saturation — the percentage of hemoglobin carrying oxygen. Normal is typically 95–100%.',
  'VO2 Max': 'Maximum oxygen uptake — a measure of cardiorespiratory fitness. Higher values indicate better aerobic capacity.',
  'EF': 'Ejection Fraction — the percentage of blood pumped out of the heart with each beat. Normal is 55–70%.',
  'Vitamin D': 'A fat-soluble vitamin important for bone health, immune function, and mood. Many people are deficient, especially in northern climates.',
  'Metformin': 'A first-line medication for Type 2 Diabetes that helps lower blood sugar by reducing glucose production in the liver.',
  'Lisinopril': 'An ACE inhibitor used to treat high blood pressure and heart failure by relaxing blood vessels.',
  'Sertraline': 'An SSRI antidepressant used to treat depression, anxiety, and other mood disorders.',
  'Atorvastatin': 'A statin medication that lowers cholesterol levels to reduce the risk of heart disease and stroke.',
  'Type 2 Diabetes Mellitus': 'A chronic condition where the body doesn\'t use insulin effectively, leading to elevated blood sugar levels.',
  'Essential Hypertension': 'Persistently elevated blood pressure without a specific identifiable cause. The most common form of high blood pressure.',
  'Generalized Anxiety Disorder': 'A condition characterized by persistent, excessive worry about everyday things that is difficult to control.',
  'Hyperlipidemia': 'Elevated levels of lipids (fats) in the blood, including cholesterol and triglycerides, which can increase cardiovascular risk.',
  'Sleep Duration': 'Total time spent asleep per night. Most adults need 7–9 hours for optimal recovery and cognitive function.',
  'Body Temperature Deviation': 'How much your body temperature differs from your personal baseline. Deviations can signal illness, stress, or hormonal changes.',
  'Readiness Score': 'A composite score from wearable devices estimating how prepared your body is for physical or mental exertion.',
};

interface MedicalTermProps {
  term: string;
  children?: React.ReactNode;
  className?: string;
}

export function MedicalTerm({ term, children, className = '' }: MedicalTermProps) {
  const explanation = medicalGlossary[term];

  if (!explanation) {
    return <span className={className}>{children || term}</span>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`underline decoration-dotted decoration-muted-foreground/50 underline-offset-2 cursor-help ${className}`}
        >
          {children || term}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-xs text-xs leading-relaxed p-3"
      >
        <p className="font-semibold mb-1">{term}</p>
        <p className="text-muted-foreground">{explanation}</p>
      </TooltipContent>
    </Tooltip>
  );
}
