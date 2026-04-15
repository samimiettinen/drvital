// ===== DIAGNOSES =====
export type DiagnosisStatus = 'active' | 'resolved' | 'suspected';
export type SourceType = 'clinical_note' | 'uploaded_file' | 'apple_clinical' | 'user_confirmed';
export type RecommendationCategory = 'wellness' | 'appointment_prep' | 'accessibility' | 'clinician_followup';

export interface Diagnosis {
  id: string;
  name: string;
  status: DiagnosisStatus;
  icdCode?: string;
  dateFirstDocumented: string;
  lastConfirmed: string;
  sourceType: SourceType;
  sourceDocument?: string;
  explanation: string;
  relatedMedications: string[];
  relatedMeasurements: string[];
  followUpPlan: string;
  confidence: 'high' | 'moderate' | 'low';
  suggestedQuestions: string[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedFor: string;
  status: 'active' | 'discontinued';
}

export interface Appointment {
  id: string;
  date: string;
  provider: string;
  specialty: string;
  reason: string;
  status: 'upcoming' | 'completed';
  linkedDiagnoses: string[];
  notes?: string;
}

export interface HealthDocument {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'txt' | 'md' | 'csv';
  category: 'labs' | 'visit_notes' | 'imaging' | 'medications' | 'admin' | 'wellness_logs' | 'other';
  documentDate: string;
  provider?: string;
  summary: string;
  linkedDiagnoses: string[];
  linkedMedications: string[];
  sourceType: SourceType;
  extractionConfidence: 'high' | 'moderate' | 'needs_review';
}

export interface HealthEvent {
  id: string;
  title: string;
  eventType: 'travel' | 'illness' | 'medication_start' | 'medication_stop' | 'diagnosis_received' | 'surgery' | 'stressful_period' | 'exercise_block' | 'dietary_change' | 'hormonal' | 'conference' | 'accessibility_event' | 'custom';
  startDate: string;
  endDate: string;
  notes: string;
  severity: 'low' | 'moderate' | 'high';
  tags: string[];
  linkedDiagnosis?: string;
  linkedAppointment?: string;
}

export interface MetricDataPoint {
  date: string;
  value: number;
}

export interface HealthMetric {
  id: string;
  name: string;
  unit: string;
  category: 'sleep' | 'heart' | 'activity' | 'body' | 'respiratory' | 'symptom';
  source: 'apple_health' | 'oura' | 'manual';
  data7d: MetricDataPoint[];
  data30d: MetricDataPoint[];
  baseline: number;
  current: number;
  trend: 'improving' | 'stable' | 'declining' | 'variable';
  insight: string;
}

export interface Recommendation {
  id: string;
  category: RecommendationCategory;
  title: string;
  rationale: string;
  linkedSource?: string;
  linkedDiagnosis?: string;
  linkedEvent?: string;
  priority: 'high' | 'medium' | 'low';
  actionText: string;
}

export interface AccessibilityPlan {
  id: string;
  eventName: string;
  eventType: string;
  date: string;
  location: string;
  linkedDiagnoses: string[];
  supportNeeds: string[];
  accommodations: { label: string; checked: boolean }[];
  recoveryPlan: string;
  supportPerson: { name: string; phone: string; role: string };
  notesToOrganizer: string;
}

// ===== MOCK DATA =====

const generateDates = (daysBack: number, count: number): MetricDataPoint[] => {
  const points: MetricDataPoint[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - Math.round((i / (count - 1)) * daysBack));
    points.push({ date: d.toISOString().split('T')[0], value: 0 });
  }
  return points;
};

const sleep7d = generateDates(7, 7).map((p, i) => ({ ...p, value: [7.2, 6.8, 7.5, 6.4, 7.1, 7.8, 6.9][i] }));
const sleep30d = generateDates(30, 30).map((p, i) => ({ ...p, value: 6.5 + Math.sin(i * 0.3) * 0.8 + Math.random() * 0.4 }));

const hrv7d = generateDates(7, 7).map((p, i) => ({ ...p, value: [42, 38, 45, 35, 40, 47, 39][i] }));
const hrv30d = generateDates(30, 30).map((p, i) => ({ ...p, value: 38 + Math.sin(i * 0.2) * 6 + Math.random() * 3 }));

const rhr7d = generateDates(7, 7).map((p, i) => ({ ...p, value: [62, 64, 60, 65, 63, 59, 61][i] }));
const rhr30d = generateDates(30, 30).map((p, i) => ({ ...p, value: 61 + Math.sin(i * 0.25) * 3 + Math.random() * 2 }));

const steps7d = generateDates(7, 7).map((p, i) => ({ ...p, value: [8200, 6400, 9100, 4800, 7600, 10200, 5900][i] }));
const steps30d = generateDates(30, 30).map((p, i) => ({ ...p, value: 6000 + Math.sin(i * 0.3) * 2500 + Math.random() * 1500 }));

const weight7d = generateDates(7, 7).map((p, i) => ({ ...p, value: [178.2, 178.0, 178.4, 177.8, 178.1, 177.6, 177.9][i] }));
const weight30d = generateDates(30, 30).map((p, i) => ({ ...p, value: 179 - i * 0.05 + Math.random() * 0.5 }));

const bp7d = generateDates(7, 7).map((p, i) => ({ ...p, value: [128, 132, 126, 130, 127, 124, 129][i] }));
const bp30d = generateDates(30, 30).map((p, i) => ({ ...p, value: 128 + Math.sin(i * 0.2) * 5 + Math.random() * 3 }));

const resp7d = generateDates(7, 7).map((p, i) => ({ ...p, value: [15.2, 15.8, 14.9, 16.1, 15.4, 15.0, 15.6][i] }));
const resp30d = generateDates(30, 30).map((p, i) => ({ ...p, value: 15.2 + Math.sin(i * 0.3) * 0.6 + Math.random() * 0.3 }));

const temp7d = generateDates(7, 7).map((p, i) => ({ ...p, value: [0.1, 0.3, -0.1, 0.5, 0.2, 0.0, 0.2][i] }));
const temp30d = generateDates(30, 30).map((p, i) => ({ ...p, value: 0.1 + Math.sin(i * 0.25) * 0.3 + Math.random() * 0.15 }));

export const diagnoses: Diagnosis[] = [
  {
    id: 'd1',
    name: 'Type 2 Diabetes Mellitus',
    status: 'active',
    icdCode: 'E11.9',
    dateFirstDocumented: '2023-03-15',
    lastConfirmed: '2025-11-20',
    sourceType: 'clinical_note',
    sourceDocument: 'doc1',
    explanation: 'A chronic condition affecting how the body processes blood sugar (glucose). Managing with medication and lifestyle changes.',
    relatedMedications: ['Metformin 1000mg'],
    relatedMeasurements: ['Blood glucose', 'HbA1c', 'Weight'],
    followUpPlan: 'Next HbA1c check in 3 months. Continue monitoring fasting glucose.',
    confidence: 'high',
    suggestedQuestions: [
      'Should we adjust the Metformin dosage based on recent trends?',
      'Are there additional labs I should get before the next visit?',
      'How is my kidney function related to diabetes management?'
    ]
  },
  {
    id: 'd2',
    name: 'Essential Hypertension',
    status: 'active',
    icdCode: 'I10',
    dateFirstDocumented: '2022-08-10',
    lastConfirmed: '2025-10-15',
    sourceType: 'uploaded_file',
    sourceDocument: 'doc2',
    explanation: 'Persistently elevated blood pressure. Currently managed with medication and dietary modifications.',
    relatedMedications: ['Lisinopril 10mg'],
    relatedMeasurements: ['Blood pressure', 'Resting heart rate'],
    followUpPlan: 'Monitor blood pressure at home twice daily. Follow up in 6 weeks.',
    confidence: 'high',
    suggestedQuestions: [
      'My readings have been variable — should I adjust timing of medication?',
      'Is the current medication adequate given recent stress levels?'
    ]
  },
  {
    id: 'd3',
    name: 'Generalized Anxiety Disorder',
    status: 'active',
    icdCode: 'F41.1',
    dateFirstDocumented: '2024-01-22',
    lastConfirmed: '2025-09-10',
    sourceType: 'clinical_note',
    sourceDocument: 'doc5',
    explanation: 'Persistent anxiety affecting sleep and daily functioning. Working with therapist and using relaxation techniques.',
    relatedMedications: [],
    relatedMeasurements: ['HRV', 'Sleep quality', 'Resting heart rate'],
    followUpPlan: 'Continue therapy sessions biweekly. Reassess in 3 months.',
    confidence: 'high',
    suggestedQuestions: [
      'Would medication be helpful given the sleep impact?',
      'Are there specific CBT exercises for health-related anxiety?'
    ]
  },
  {
    id: 'd4',
    name: 'Vitamin D Deficiency',
    status: 'resolved',
    dateFirstDocumented: '2024-06-01',
    lastConfirmed: '2025-03-15',
    sourceType: 'uploaded_file',
    sourceDocument: 'doc3',
    explanation: 'Previously low vitamin D levels, now within normal range after supplementation.',
    relatedMedications: ['Vitamin D3 2000 IU'],
    relatedMeasurements: ['Vitamin D level'],
    followUpPlan: 'Continue maintenance supplementation. Recheck in 6 months.',
    confidence: 'high',
    suggestedQuestions: []
  },
  {
    id: 'd5',
    name: 'Possible Sleep Apnea',
    status: 'suspected',
    dateFirstDocumented: '2025-11-01',
    lastConfirmed: '2025-11-01',
    sourceType: 'user_confirmed',
    explanation: 'Snoring reported by partner, frequent daytime fatigue, and variable HRV patterns noted from wearable data. Not yet clinically evaluated.',
    relatedMedications: [],
    relatedMeasurements: ['Sleep duration', 'HRV', 'Respiratory rate'],
    followUpPlan: 'Discuss with primary care. Consider referral for sleep study.',
    confidence: 'low',
    suggestedQuestions: [
      'Should I get a sleep study based on these patterns?',
      'Could my fatigue be related to other conditions?'
    ]
  }
];

export const medications: Medication[] = [
  { id: 'm1', name: 'Metformin', dosage: '1000mg', frequency: 'Twice daily', startDate: '2023-04-01', prescribedFor: 'Type 2 Diabetes', status: 'active' },
  { id: 'm2', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2022-09-01', prescribedFor: 'Hypertension', status: 'active' },
  { id: 'm3', name: 'Vitamin D3', dosage: '2000 IU', frequency: 'Once daily', startDate: '2024-06-15', prescribedFor: 'Vitamin D Deficiency', status: 'active' },
  { id: 'm4', name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime', startDate: '2025-01-10', prescribedFor: 'Cholesterol management', status: 'active' },
  { id: 'm5', name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily', startDate: '2024-08-01', endDate: '2025-02-01', prescribedFor: 'Acid reflux', status: 'discontinued' }
];

export const appointments: Appointment[] = [
  { id: 'a1', date: '2026-04-28', provider: 'Dr. Sarah Chen', specialty: 'Internal Medicine', reason: 'Quarterly diabetes and hypertension check', status: 'upcoming', linkedDiagnoses: ['d1', 'd2'] },
  { id: 'a2', date: '2026-05-12', provider: 'Dr. James Park', specialty: 'Cardiology', reason: 'Follow-up on blood pressure trends', status: 'upcoming', linkedDiagnoses: ['d2'] },
  { id: 'a3', date: '2025-11-20', provider: 'Dr. Sarah Chen', specialty: 'Internal Medicine', reason: 'Routine follow-up', status: 'completed', linkedDiagnoses: ['d1', 'd2'], notes: 'Adjusted monitoring frequency. Labs ordered.' },
  { id: 'a4', date: '2025-09-10', provider: 'Dr. Lisa Morgan', specialty: 'Psychiatry', reason: 'Anxiety follow-up', status: 'completed', linkedDiagnoses: ['d3'], notes: 'Continuing therapy. Sleep hygiene discussed.' },
];

export const documents: HealthDocument[] = [
  { id: 'doc1', fileName: 'diabetes_management_plan.pdf', fileType: 'pdf', category: 'visit_notes', documentDate: '2025-11-20', provider: 'Dr. Sarah Chen', summary: 'Updated diabetes management plan. HbA1c at 6.8%, down from 7.2%. Continuing current medication regimen.', linkedDiagnoses: ['d1'], linkedMedications: ['m1'], sourceType: 'clinical_note', extractionConfidence: 'high' },
  { id: 'doc2', fileName: 'blood_pressure_log_oct.csv', fileType: 'csv', category: 'labs', documentDate: '2025-10-15', provider: 'Self-monitored', summary: 'Monthly blood pressure readings. Average systolic 128, diastolic 82. Three readings above 135/85.', linkedDiagnoses: ['d2'], linkedMedications: ['m2'], sourceType: 'uploaded_file', extractionConfidence: 'high' },
  { id: 'doc3', fileName: 'lab_results_march.pdf', fileType: 'pdf', category: 'labs', documentDate: '2025-03-15', provider: 'Quest Diagnostics', summary: 'Comprehensive metabolic panel and vitamin D levels. Vitamin D now at 42 ng/mL (previously 18). Kidney function normal.', linkedDiagnoses: ['d4'], linkedMedications: ['m3'], sourceType: 'uploaded_file', extractionConfidence: 'high' },
  { id: 'doc4', fileName: 'cardiac_imaging_report.pdf', fileType: 'pdf', category: 'imaging', documentDate: '2025-07-22', provider: 'Dr. James Park', summary: 'Echocardiogram results. Normal left ventricular function. EF 60%. No significant valvular disease.', linkedDiagnoses: ['d2'], linkedMedications: [], sourceType: 'clinical_note', extractionConfidence: 'high' },
  { id: 'doc5', fileName: 'psychiatry_notes_sept.pdf', fileType: 'pdf', category: 'visit_notes', documentDate: '2025-09-10', provider: 'Dr. Lisa Morgan', summary: 'Anxiety assessment follow-up. GAD-7 score improved to 8 from 12. Continuing cognitive behavioral therapy.', linkedDiagnoses: ['d3'], linkedMedications: [], sourceType: 'clinical_note', extractionConfidence: 'high' },
  { id: 'doc6', fileName: 'lipid_panel_jan.pdf', fileType: 'pdf', category: 'labs', documentDate: '2025-01-05', provider: 'Quest Diagnostics', summary: 'Lipid panel showing elevated LDL at 142 mg/dL. Total cholesterol 218. HDL 52. Triglycerides 168.', linkedDiagnoses: [], linkedMedications: ['m4'], sourceType: 'uploaded_file', extractionConfidence: 'high' },
  { id: 'doc7', fileName: 'sleep_journal_notes.md', fileType: 'md', category: 'wellness_logs', documentDate: '2025-11-15', summary: 'Personal sleep journal entries. Noted increased difficulty falling asleep during travel weeks. Average sleep onset latency ~35 min.', linkedDiagnoses: ['d3', 'd5'], linkedMedications: [], sourceType: 'user_confirmed', extractionConfidence: 'moderate' },
];

export const events: HealthEvent[] = [
  { id: 'e1', title: 'Business trip to NYC', eventType: 'travel', startDate: '2026-03-28', endDate: '2026-04-03', notes: 'Cross-country flight, 3-hour time zone change. Multiple evening dinners.', severity: 'moderate', tags: ['travel', 'timezone'], linkedDiagnosis: 'd3' },
  { id: 'e2', title: 'Started Atorvastatin', eventType: 'medication_start', startDate: '2025-01-10', endDate: '2025-01-10', notes: 'New cholesterol medication started after lipid panel results.', severity: 'low', tags: ['medication'], linkedDiagnosis: 'd2' },
  { id: 'e3', title: 'Cold / Upper respiratory infection', eventType: 'illness', startDate: '2025-10-20', endDate: '2025-10-28', notes: 'Mild cold with congestion. Rested at home for 3 days. Affected sleep and exercise.', severity: 'moderate', tags: ['illness', 'rest'] },
  { id: 'e4', title: 'High-stress work sprint', eventType: 'stressful_period', startDate: '2025-11-01', endDate: '2025-11-14', notes: 'Major project deadline. Working 12-hour days. Skipped exercise. Poor sleep.', severity: 'high', tags: ['stress', 'work'], linkedDiagnosis: 'd3' },
  { id: 'e5', title: 'Tech conference (Austin)', eventType: 'conference', startDate: '2026-05-05', endDate: '2026-05-08', notes: 'Large venue, long days, networking events. Need to plan accommodations.', severity: 'moderate', tags: ['conference', 'travel', 'accessibility'] },
  { id: 'e6', title: 'Started morning exercise routine', eventType: 'exercise_block', startDate: '2025-09-01', endDate: '2025-09-30', notes: '30 min walk + 15 min strength training, 5 days/week.', severity: 'low', tags: ['exercise', 'routine'] },
  { id: 'e7', title: 'Dietary change: reduced carbs', eventType: 'dietary_change', startDate: '2025-08-15', endDate: '2025-08-15', notes: 'Shifted to lower carbohydrate meals to support blood sugar management.', severity: 'low', tags: ['diet', 'diabetes'], linkedDiagnosis: 'd1' },
];

export const healthMetrics: HealthMetric[] = [
  { id: 'hm1', name: 'Sleep Duration', unit: 'hours', category: 'sleep', source: 'oura', data7d: sleep7d, data30d: sleep30d, baseline: 7.2, current: 6.9, trend: 'variable', insight: 'Your sleep has been more variable than usual this week. Consider maintaining a consistent bedtime.' },
  { id: 'hm2', name: 'HRV', unit: 'ms', category: 'heart', source: 'oura', data7d: hrv7d, data30d: hrv30d, baseline: 42, current: 39, trend: 'declining', insight: 'HRV has been below your usual baseline for several days. This may reflect recent stress or reduced recovery.' },
  { id: 'hm3', name: 'Resting Heart Rate', unit: 'bpm', category: 'heart', source: 'apple_health', data7d: rhr7d, data30d: rhr30d, baseline: 61, current: 61, trend: 'stable', insight: 'Resting heart rate is within your typical range.' },
  { id: 'hm4', name: 'Steps', unit: 'steps', category: 'activity', source: 'apple_health', data7d: steps7d, data30d: steps30d, baseline: 7500, current: 5900, trend: 'declining', insight: 'Activity has dropped compared to your recent average. Even short walks can help maintain your baseline.' },
  { id: 'hm5', name: 'Weight', unit: 'lbs', category: 'body', source: 'apple_health', data7d: weight7d, data30d: weight30d, baseline: 179, current: 177.9, trend: 'improving', insight: 'Gradual downward trend over the past month. Consistent with dietary changes.' },
  { id: 'hm6', name: 'Blood Pressure (Systolic)', unit: 'mmHg', category: 'body', source: 'manual', data7d: bp7d, data30d: bp30d, baseline: 128, current: 129, trend: 'stable', insight: 'Blood pressure is relatively stable. A few readings above 130 — worth tracking consistently.' },
  { id: 'hm7', name: 'Respiratory Rate', unit: 'br/min', category: 'respiratory', source: 'oura', data7d: resp7d, data30d: resp30d, baseline: 15.2, current: 15.6, trend: 'stable', insight: 'Respiratory rate is within normal range with minor fluctuations.' },
  { id: 'hm8', name: 'Body Temp Deviation', unit: '°F', category: 'body', source: 'oura', data7d: temp7d, data30d: temp30d, baseline: 0.0, current: 0.2, trend: 'variable', insight: 'Slight positive deviation noted, which can be influenced by activity, stress, or illness recovery.' },
];

export const recommendations: Recommendation[] = [
  { id: 'r1', category: 'wellness', title: 'Prioritize sleep consistency', rationale: 'Your sleep duration has varied significantly over the past week. Consistent timing supports better HRV and recovery.', linkedSource: 'hm1', priority: 'high', actionText: 'Try setting a consistent bedtime alarm for the next 7 days.' },
  { id: 'r2', category: 'appointment_prep', title: 'Bring blood pressure trends', rationale: 'You have a cardiology follow-up on May 12. Sharing your recent home BP readings and resting heart rate trends will help your cardiologist assess your current management.', linkedSource: 'hm6', linkedDiagnosis: 'd2', priority: 'high', actionText: 'Export last 30 days of blood pressure and resting heart rate data.' },
  { id: 'r3', category: 'clinician_followup', title: 'Discuss sleep concerns', rationale: 'Persistent variable sleep and reported snoring may warrant a sleep study evaluation. Your HRV patterns also suggest reduced recovery quality.', linkedDiagnosis: 'd5', priority: 'medium', actionText: 'Bring this up at your next appointment with Dr. Chen.' },
  { id: 'r4', category: 'wellness', title: 'Increase daily movement', rationale: 'Steps have been below your baseline this week. Even 15-minute walks after meals can support blood sugar management.', linkedSource: 'hm4', linkedDiagnosis: 'd1', priority: 'medium', actionText: 'Add a post-lunch walk to your routine.' },
  { id: 'r5', category: 'accessibility', title: 'Plan accommodations for Austin conference', rationale: 'Your upcoming conference involves long days and high sensory input. Given your anxiety management needs and fatigue patterns, planning accommodations in advance will help.', linkedEvent: 'e5', linkedDiagnosis: 'd3', priority: 'high', actionText: 'Complete your accessibility plan for this event.' },
  { id: 'r6', category: 'appointment_prep', title: 'Prepare diabetes review summary', rationale: 'Your quarterly check with Dr. Chen is in 2 weeks. HbA1c trend, recent glucose patterns, and medication adherence notes will make the visit more productive.', linkedDiagnosis: 'd1', priority: 'high', actionText: 'Review your prep brief before April 28.' },
];

export const accessibilityPlans: AccessibilityPlan[] = [
  {
    id: 'ap1',
    eventName: 'Tech Conference (Austin)',
    eventType: 'conference',
    date: '2026-05-05',
    location: 'Austin Convention Center, Austin TX',
    linkedDiagnoses: ['d3'],
    supportNeeds: ['Quiet room access', 'Scheduled breaks', 'Medication timing', 'Fatigue management'],
    accommodations: [
      { label: 'Quiet room / rest area available', checked: true },
      { label: 'Seating near exits for easy breaks', checked: false },
      { label: 'Dietary accommodations for meals', checked: true },
      { label: 'Medication reminder set for 8 AM, 8 PM', checked: true },
      { label: 'Reduced evening social commitments', checked: false },
      { label: 'Transport arranged to/from venue', checked: false },
      { label: 'Recovery time blocked on return day', checked: true },
    ],
    recoveryPlan: 'Block the day after return for rest. Limit meetings for 2 days post-event. Prioritize sleep consistency.',
    supportPerson: { name: 'Jamie Rivera', phone: '(512) 555-0142', role: 'Travel companion' },
    notesToOrganizer: 'I may need access to a quiet room during breaks for anxiety management. Please seat me near exits if possible. I have dietary restrictions related to diabetes management.'
  }
];

// Healthspan scores
export const healthspanData = {
  overall: 72,
  breakdown: {
    sleep: 65,
    recovery: 58,
    activity: 70,
    cardiovascular: 74,
    clinicalBurden: 68,
  },
  trend30d: 'stable' as const,
  trend90d: 'improving' as const,
  helping: [
    'Consistent medication adherence',
    'Dietary changes supporting weight trend',
    'Regular therapy sessions for anxiety',
  ],
  hurting: [
    'Variable sleep patterns reducing recovery',
    'Below-baseline activity levels this week',
    'Elevated stress during work sprint',
  ],
};

// Event "What Changed" analysis
export interface WhatChanged {
  eventId: string;
  before: { period: string; summary: string; metrics: { name: string; value: string }[] };
  during: { period: string; summary: string; metrics: { name: string; value: string }[] };
  after: { period: string; summary: string; metrics: { name: string; value: string }[] };
  affectedMetrics: string[];
  confidence: 'high' | 'moderate' | 'low';
  explanation: string;
}

export const whatChangedData: WhatChanged[] = [
  {
    eventId: 'e4',
    before: { period: 'Oct 25 – Oct 31', summary: 'Baseline recovery and sleep were within normal range.', metrics: [{ name: 'HRV', value: '44 ms avg' }, { name: 'Sleep', value: '7.3 hrs avg' }, { name: 'Steps', value: '8,100 avg' }] },
    during: { period: 'Nov 1 – Nov 14', summary: 'Sleep dropped significantly. HRV declined. Activity nearly halted.', metrics: [{ name: 'HRV', value: '33 ms avg' }, { name: 'Sleep', value: '5.8 hrs avg' }, { name: 'Steps', value: '3,200 avg' }] },
    after: { period: 'Nov 15 – Nov 28', summary: 'Gradual recovery, but HRV remained below baseline for 10+ days.', metrics: [{ name: 'HRV', value: '38 ms avg' }, { name: 'Sleep', value: '6.7 hrs avg' }, { name: 'Steps', value: '6,400 avg' }] },
    affectedMetrics: ['HRV', 'Sleep Duration', 'Steps', 'Resting Heart Rate'],
    confidence: 'high',
    explanation: 'The high-stress work sprint was associated with significant declines in sleep and recovery markers. HRV remained below your baseline for nearly two weeks after the event ended.'
  },
  {
    eventId: 'e1',
    before: { period: 'Mar 21 – Mar 27', summary: 'Normal patterns. Sleep consistent around 7 hours.', metrics: [{ name: 'Sleep', value: '7.1 hrs avg' }, { name: 'HRV', value: '41 ms avg' }] },
    during: { period: 'Mar 28 – Apr 3', summary: 'Sleep disrupted by time zone change. HRV dropped.', metrics: [{ name: 'Sleep', value: '5.9 hrs avg' }, { name: 'HRV', value: '34 ms avg' }] },
    after: { period: 'Apr 4 – Apr 10', summary: 'Sleep slowly recovered. HRV rebounded by day 5.', metrics: [{ name: 'Sleep', value: '6.6 hrs avg' }, { name: 'HRV', value: '39 ms avg' }] },
    affectedMetrics: ['Sleep Duration', 'HRV', 'Body Temp Deviation'],
    confidence: 'moderate',
    explanation: 'Travel across time zones was associated with disrupted sleep and lower HRV. Recovery took about 5 days after return.'
  }
];
