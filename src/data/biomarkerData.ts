// ===== BIOMARKER & LAB RESULTS DATA =====

export type BodySystem = 'heart' | 'liver' | 'kidneys' | 'blood' | 'metabolism' | 'hormones' | 'inflammation' | 'vitamins';
export type ResultStatus = 'normal' | 'slightly_high' | 'high' | 'slightly_low' | 'low' | 'critical';

export interface Biomarker {
  id: string;
  medicalName: string;
  plainName: string;
  value: number;
  unit: string;
  referenceRange: { low: number; high: number };
  status: ResultStatus;
  bodySystem: BodySystem;
  explanation: string;
  whyItMatters: string;
  lifestyleFactors: string[];
  sourceDocument: string;
  date: string;
  previousValue?: number;
  previousDate?: string;
}

export interface HealthCategory {
  id: BodySystem;
  name: string;
  icon: string;
  status: 'good' | 'attention' | 'concern';
  summary: string;
  supportiveHabits: string[];
  markerIds: string[];
}

export interface DocumentExtraction {
  documentId: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  provider: string;
  extractionStatus: 'complete' | 'partial' | 'needs_review';
  confidence: number;
  extractedDiagnoses: string[];
  extractedBiomarkers: string[];
  extractedMedications: string[];
  extractedFollowUps: string[];
  summary: string;
  bodySystemsInvolved: BodySystem[];
  visitReason?: string;
  nextSteps: string[];
}

export interface HealthStory {
  recurringThemes: { title: string; description: string; frequency: string }[];
  timelineHighlights: { date: string; event: string; significance: string }[];
  improvements: string[];
  concerns: string[];
  unresolvedItems: string[];
  questionsForNextVisit: string[];
}

// ===== BIOMARKER DATA =====
export const biomarkers: Biomarker[] = [
  {
    id: 'bm1', medicalName: 'HbA1c', plainName: 'Average blood sugar (3 months)',
    value: 6.8, unit: '%', referenceRange: { low: 4.0, high: 5.6 },
    status: 'slightly_high', bodySystem: 'metabolism',
    explanation: 'This test measures your average blood sugar level over the past 2–3 months. Your value of 6.8% is slightly above the target range, which is common with managed diabetes.',
    whyItMatters: 'Keeping this number closer to target helps protect blood vessels, nerves, and organs over time.',
    lifestyleFactors: ['Diet and carbohydrate intake', 'Physical activity', 'Medication timing', 'Stress levels', 'Sleep quality'],
    sourceDocument: 'doc1', date: '2025-11-20', previousValue: 7.2, previousDate: '2025-06-15'
  },
  {
    id: 'bm2', medicalName: 'Fasting Glucose', plainName: 'Blood sugar (fasting)',
    value: 118, unit: 'mg/dL', referenceRange: { low: 70, high: 99 },
    status: 'slightly_high', bodySystem: 'metabolism',
    explanation: 'This measures your blood sugar after not eating for at least 8 hours. At 118 mg/dL, it\'s a bit above the normal fasting range.',
    whyItMatters: 'Fasting glucose helps track how well your body manages blood sugar overnight and at rest.',
    lifestyleFactors: ['What you ate the night before', 'Stress', 'Sleep quality', 'Medication timing', 'Exercise'],
    sourceDocument: 'doc1', date: '2025-11-20', previousValue: 126, previousDate: '2025-06-15'
  },
  {
    id: 'bm3', medicalName: 'ALT (SGPT)', plainName: 'Liver enzyme',
    value: 28, unit: 'U/L', referenceRange: { low: 7, high: 35 },
    status: 'normal', bodySystem: 'liver',
    explanation: 'ALT is an enzyme found mostly in your liver. Your level of 28 U/L is within the normal range, suggesting your liver is functioning well.',
    whyItMatters: 'Elevated levels can indicate liver stress from medications, alcohol, or other causes.',
    lifestyleFactors: ['Alcohol intake', 'Medications (especially statins)', 'Diet', 'Exercise', 'Body weight'],
    sourceDocument: 'doc3', date: '2025-03-15'
  },
  {
    id: 'bm4', medicalName: 'AST (SGOT)', plainName: 'Liver & muscle enzyme',
    value: 24, unit: 'U/L', referenceRange: { low: 10, high: 34 },
    status: 'normal', bodySystem: 'liver',
    explanation: 'AST is found in several organs but is commonly used to assess liver health. Your level is normal.',
    whyItMatters: 'Along with ALT, this helps your doctor check that your liver is handling medications well.',
    lifestyleFactors: ['Alcohol', 'Intense exercise', 'Medications', 'Diet'],
    sourceDocument: 'doc3', date: '2025-03-15'
  },
  {
    id: 'bm5', medicalName: 'eGFR', plainName: 'Kidney function score',
    value: 92, unit: 'mL/min', referenceRange: { low: 90, high: 120 },
    status: 'normal', bodySystem: 'kidneys',
    explanation: 'This estimates how well your kidneys filter waste. At 92 mL/min, your kidney function is in the normal range.',
    whyItMatters: 'Important to monitor regularly, especially with diabetes and blood pressure medications.',
    lifestyleFactors: ['Hydration', 'Blood pressure management', 'Protein intake', 'Medication effects'],
    sourceDocument: 'doc3', date: '2025-03-15', previousValue: 88, previousDate: '2024-09-15'
  },
  {
    id: 'bm6', medicalName: 'Creatinine', plainName: 'Kidney waste marker',
    value: 1.0, unit: 'mg/dL', referenceRange: { low: 0.7, high: 1.2 },
    status: 'normal', bodySystem: 'kidneys',
    explanation: 'Creatinine is a waste product from normal muscle activity. Your kidneys filter it out. Your level is normal.',
    whyItMatters: 'Rising creatinine can suggest your kidneys aren\'t filtering as efficiently.',
    lifestyleFactors: ['Hydration', 'Muscle mass', 'Protein intake', 'Medications'],
    sourceDocument: 'doc3', date: '2025-03-15'
  },
  {
    id: 'bm7', medicalName: 'LDL Cholesterol', plainName: '"Bad" cholesterol',
    value: 118, unit: 'mg/dL', referenceRange: { low: 0, high: 99 },
    status: 'slightly_high', bodySystem: 'heart',
    explanation: 'LDL carries cholesterol to your arteries. At 118 mg/dL, it\'s above the ideal range but has improved since starting medication.',
    whyItMatters: 'Higher LDL levels are associated with increased risk of heart disease over time.',
    lifestyleFactors: ['Diet (saturated fats)', 'Exercise', 'Medications (statins)', 'Genetics', 'Weight'],
    sourceDocument: 'doc6', date: '2025-01-05', previousValue: 142, previousDate: '2024-07-10'
  },
  {
    id: 'bm8', medicalName: 'HDL Cholesterol', plainName: '"Good" cholesterol',
    value: 52, unit: 'mg/dL', referenceRange: { low: 40, high: 100 },
    status: 'normal', bodySystem: 'heart',
    explanation: 'HDL helps remove cholesterol from your bloodstream. Your level of 52 mg/dL is within the healthy range.',
    whyItMatters: 'Higher HDL is generally protective for heart health.',
    lifestyleFactors: ['Exercise', 'Diet (healthy fats)', 'Not smoking', 'Moderate alcohol', 'Weight'],
    sourceDocument: 'doc6', date: '2025-01-05'
  },
  {
    id: 'bm9', medicalName: 'Triglycerides', plainName: 'Blood fats',
    value: 148, unit: 'mg/dL', referenceRange: { low: 0, high: 149 },
    status: 'normal', bodySystem: 'heart',
    explanation: 'Triglycerides are a type of fat in your blood. Your level is at the upper end of normal.',
    whyItMatters: 'High triglycerides combined with high LDL can increase cardiovascular risk.',
    lifestyleFactors: ['Sugar and refined carbs', 'Alcohol', 'Exercise', 'Weight', 'Omega-3 fatty acids'],
    sourceDocument: 'doc6', date: '2025-01-05', previousValue: 168, previousDate: '2024-07-10'
  },
  {
    id: 'bm10', medicalName: 'Total Cholesterol', plainName: 'Total cholesterol',
    value: 198, unit: 'mg/dL', referenceRange: { low: 125, high: 199 },
    status: 'normal', bodySystem: 'heart',
    explanation: 'This is the combined measure of all cholesterol types. At 198, you\'re just within the desirable range.',
    whyItMatters: 'Total cholesterol gives an overall picture, but LDL and HDL ratios matter more for risk.',
    lifestyleFactors: ['Diet', 'Exercise', 'Medications', 'Genetics'],
    sourceDocument: 'doc6', date: '2025-01-05', previousValue: 218, previousDate: '2024-07-10'
  },
  {
    id: 'bm11', medicalName: 'Vitamin D (25-OH)', plainName: 'Vitamin D level',
    value: 42, unit: 'ng/mL', referenceRange: { low: 30, high: 100 },
    status: 'normal', bodySystem: 'vitamins',
    explanation: 'Your vitamin D is now in a healthy range at 42 ng/mL, up from 18 last year after supplementation.',
    whyItMatters: 'Vitamin D supports bone health, immune function, and mood regulation.',
    lifestyleFactors: ['Sun exposure', 'Supplementation', 'Diet (fatty fish, eggs)', 'Season', 'Skin tone'],
    sourceDocument: 'doc3', date: '2025-03-15', previousValue: 18, previousDate: '2024-06-01'
  },
  {
    id: 'bm12', medicalName: 'Hemoglobin', plainName: 'Oxygen-carrying protein',
    value: 14.8, unit: 'g/dL', referenceRange: { low: 13.5, high: 17.5 },
    status: 'normal', bodySystem: 'blood',
    explanation: 'Hemoglobin carries oxygen in your red blood cells. Your level is healthy and within the expected range.',
    whyItMatters: 'Low hemoglobin can cause fatigue and shortness of breath. Normal levels mean your blood is carrying oxygen efficiently.',
    lifestyleFactors: ['Iron intake', 'Hydration', 'Altitude', 'Exercise'],
    sourceDocument: 'doc3', date: '2025-03-15'
  },
  {
    id: 'bm13', medicalName: 'TSH', plainName: 'Thyroid function',
    value: 2.1, unit: 'mIU/L', referenceRange: { low: 0.4, high: 4.0 },
    status: 'normal', bodySystem: 'hormones',
    explanation: 'TSH tells your thyroid gland how much hormone to produce. At 2.1, your thyroid appears to be functioning normally.',
    whyItMatters: 'An out-of-range TSH can affect energy, weight, mood, and metabolism.',
    lifestyleFactors: ['Stress', 'Sleep', 'Iodine intake', 'Medications', 'Autoimmune conditions'],
    sourceDocument: 'doc3', date: '2025-03-15'
  },
  {
    id: 'bm14', medicalName: 'CRP (hs)', plainName: 'Inflammation marker',
    value: 2.8, unit: 'mg/L', referenceRange: { low: 0, high: 1.0 },
    status: 'slightly_high', bodySystem: 'inflammation',
    explanation: 'High-sensitivity CRP measures low-level inflammation in your body. At 2.8 mg/L, it\'s above the optimal range.',
    whyItMatters: 'Chronic low-grade inflammation is associated with cardiovascular disease and other conditions.',
    lifestyleFactors: ['Stress', 'Sleep quality', 'Diet (processed foods)', 'Exercise', 'Body weight', 'Infections'],
    sourceDocument: 'doc3', date: '2025-03-15'
  },
  {
    id: 'bm15', medicalName: 'WBC', plainName: 'White blood cell count',
    value: 6.8, unit: 'K/uL', referenceRange: { low: 4.5, high: 11.0 },
    status: 'normal', bodySystem: 'blood',
    explanation: 'White blood cells help fight infections. Your count is well within the normal range.',
    whyItMatters: 'An elevated or very low WBC can indicate infection, immune issues, or other conditions.',
    lifestyleFactors: ['Current infections', 'Stress', 'Medications', 'Exercise'],
    sourceDocument: 'doc3', date: '2025-03-15'
  },
  {
    id: 'bm16', medicalName: 'Potassium', plainName: 'Potassium level',
    value: 4.2, unit: 'mEq/L', referenceRange: { low: 3.5, high: 5.0 },
    status: 'normal', bodySystem: 'kidneys',
    explanation: 'Potassium is important for heart and muscle function. Your level is in a healthy range.',
    whyItMatters: 'Too high or too low potassium can affect heart rhythm. Important to monitor with blood pressure medications.',
    lifestyleFactors: ['Medications (ACE inhibitors)', 'Diet (bananas, potatoes)', 'Hydration', 'Kidney function'],
    sourceDocument: 'doc3', date: '2025-03-15'
  },
];

// ===== HEALTH CATEGORIES =====
export const healthCategories: HealthCategory[] = [
  {
    id: 'heart', name: 'Heart & Circulation', icon: '❤️',
    status: 'attention',
    summary: 'Most cardiovascular markers are within range. LDL cholesterol is slightly above target but has improved significantly with medication. Continue monitoring blood pressure at home.',
    supportiveHabits: ['Regular moderate exercise', 'Limit sodium intake', 'Maintain healthy weight', 'Manage stress', 'Take medications consistently'],
    markerIds: ['bm7', 'bm8', 'bm9', 'bm10']
  },
  {
    id: 'liver', name: 'Liver', icon: '🫁',
    status: 'good',
    summary: 'Liver enzymes are within normal range, suggesting your liver is handling current medications well. No concerns at this time.',
    supportiveHabits: ['Moderate alcohol intake', 'Stay hydrated', 'Balanced diet', 'Report any unusual fatigue or yellowing'],
    markerIds: ['bm3', 'bm4']
  },
  {
    id: 'kidneys', name: 'Kidneys', icon: '🫘',
    status: 'good',
    summary: 'Kidney function is normal. eGFR has actually improved slightly since last check. Potassium levels are well-controlled despite ACE inhibitor use.',
    supportiveHabits: ['Stay well-hydrated', 'Manage blood pressure', 'Moderate protein intake', 'Limit NSAID use'],
    markerIds: ['bm5', 'bm6', 'bm16']
  },
  {
    id: 'blood', name: 'Blood', icon: '🩸',
    status: 'good',
    summary: 'Blood counts are healthy. Hemoglobin and white blood cells are within normal ranges. No signs of anemia or infection.',
    supportiveHabits: ['Iron-rich foods', 'Adequate sleep', 'Regular check-ups'],
    markerIds: ['bm12', 'bm15']
  },
  {
    id: 'metabolism', name: 'Metabolism', icon: '⚡',
    status: 'attention',
    summary: 'Blood sugar management has improved — HbA1c decreased from 7.2% to 6.8%. Fasting glucose is still slightly elevated. Dietary changes are helping.',
    supportiveHabits: ['Consistent meal timing', 'Lower carbohydrate meals', 'Post-meal walks', 'Adequate sleep', 'Stress management'],
    markerIds: ['bm1', 'bm2']
  },
  {
    id: 'hormones', name: 'Hormones', icon: '🧬',
    status: 'good',
    summary: 'Thyroid function is normal. No hormone-related concerns at this time.',
    supportiveHabits: ['Regular sleep schedule', 'Balanced nutrition', 'Stress management'],
    markerIds: ['bm13']
  },
  {
    id: 'inflammation', name: 'Inflammation', icon: '🔥',
    status: 'concern',
    summary: 'CRP is above the optimal range at 2.8 mg/L, indicating some low-grade inflammation. This could be related to stress, sleep quality, or metabolic factors. Worth discussing with your doctor.',
    supportiveHabits: ['Anti-inflammatory foods (omega-3, berries, leafy greens)', 'Regular exercise', 'Adequate sleep', 'Stress reduction', 'Maintain healthy weight'],
    markerIds: ['bm14']
  },
  {
    id: 'vitamins', name: 'Vitamins & Minerals', icon: '💊',
    status: 'good',
    summary: 'Vitamin D has recovered beautifully from 18 to 42 ng/mL with supplementation. Continue current dose. All other nutritional markers are within range.',
    supportiveHabits: ['Continue vitamin D supplementation', 'Balanced diet', 'Sunlight exposure', 'Annual nutritional blood work'],
    markerIds: ['bm11']
  },
];

// ===== DOCUMENT EXTRACTIONS =====
export const documentExtractions: DocumentExtraction[] = [
  {
    documentId: 'doc1', fileName: 'diabetes_management_plan.pdf', fileType: 'pdf',
    uploadDate: '2025-11-21', provider: 'Dr. Sarah Chen',
    extractionStatus: 'complete', confidence: 95,
    extractedDiagnoses: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
    extractedBiomarkers: ['HbA1c: 6.8%', 'Fasting Glucose: 118 mg/dL', 'Blood Pressure: 128/82'],
    extractedMedications: ['Metformin 1000mg (continued)', 'Lisinopril 10mg (continued)'],
    extractedFollowUps: ['Repeat HbA1c in 3 months', 'Home BP monitoring'],
    summary: 'Updated diabetes management plan showing improved HbA1c from 7.2% to 6.8%. Blood pressure stable. Continue current medications. Follow up in 3 months.',
    bodySystemsInvolved: ['metabolism', 'heart'],
    visitReason: 'Quarterly diabetes and hypertension review',
    nextSteps: ['Schedule next HbA1c lab for Feb 2026', 'Continue home BP monitoring', 'Maintain dietary changes']
  },
  {
    documentId: 'doc3', fileName: 'lab_results_march.pdf', fileType: 'pdf',
    uploadDate: '2025-03-16', provider: 'Quest Diagnostics',
    extractionStatus: 'complete', confidence: 98,
    extractedDiagnoses: ['Vitamin D Deficiency (resolved)'],
    extractedBiomarkers: ['Vitamin D: 42 ng/mL', 'eGFR: 92 mL/min', 'ALT: 28 U/L', 'AST: 24 U/L', 'Creatinine: 1.0 mg/dL', 'TSH: 2.1 mIU/L', 'CRP: 2.8 mg/L', 'Hemoglobin: 14.8 g/dL', 'WBC: 6.8 K/uL', 'Potassium: 4.2 mEq/L'],
    extractedMedications: ['Vitamin D3 2000 IU (continue)'],
    extractedFollowUps: ['Discuss CRP elevation', 'Recheck Vitamin D in 6 months'],
    summary: 'Comprehensive metabolic panel mostly normal. Vitamin D recovered to 42 ng/mL. CRP slightly elevated at 2.8 mg/L — may warrant follow-up. Kidney and liver function normal.',
    bodySystemsInvolved: ['kidneys', 'liver', 'vitamins', 'blood', 'inflammation', 'hormones'],
    nextSteps: ['Discuss CRP with Dr. Chen', 'Continue Vitamin D supplementation', 'Recheck labs in 6 months']
  },
  {
    documentId: 'doc6', fileName: 'lipid_panel_jan.pdf', fileType: 'pdf',
    uploadDate: '2025-01-06', provider: 'Quest Diagnostics',
    extractionStatus: 'complete', confidence: 96,
    extractedDiagnoses: ['Hyperlipidemia'],
    extractedBiomarkers: ['LDL: 142 mg/dL', 'HDL: 52 mg/dL', 'Triglycerides: 168 mg/dL', 'Total Cholesterol: 218 mg/dL'],
    extractedMedications: ['Atorvastatin 20mg (new)'],
    extractedFollowUps: ['Repeat lipid panel in 3 months', 'Monitor liver enzymes on statin'],
    summary: 'Lipid panel showing elevated LDL and triglycerides. Atorvastatin 20mg started. Follow-up lipid panel needed in 3 months.',
    bodySystemsInvolved: ['heart'],
    nextSteps: ['Start Atorvastatin as prescribed', 'Repeat lipid panel in 3 months', 'Report any muscle pain']
  },
  {
    documentId: 'doc7', fileName: 'sleep_journal_notes.md', fileType: 'md',
    uploadDate: '2025-11-15', provider: 'Self',
    extractionStatus: 'partial', confidence: 72,
    extractedDiagnoses: [],
    extractedBiomarkers: ['Sleep onset latency: ~35 min'],
    extractedMedications: [],
    extractedFollowUps: ['Discuss sleep difficulties with provider'],
    summary: 'Personal sleep journal noting increased difficulty falling asleep, especially during travel weeks. Average sleep onset taking about 35 minutes.',
    bodySystemsInvolved: [],
    visitReason: undefined,
    nextSteps: ['Consider sleep study referral', 'Track sleep onset time consistently']
  },
];

// ===== HEALTH STORY / CROSS-DOCUMENT SYNTHESIS =====
export const healthStory: HealthStory = {
  recurringThemes: [
    { title: 'Blood sugar management', description: 'Type 2 diabetes has been a consistent focus. HbA1c has improved from 7.2% to 6.8% over the past year with medication and dietary changes.', frequency: 'Appears in 3 documents' },
    { title: 'Cardiovascular health', description: 'Blood pressure and cholesterol are being actively managed. LDL cholesterol dropped from 142 to 118 mg/dL after starting Atorvastatin.', frequency: 'Appears in 4 documents' },
    { title: 'Sleep and recovery quality', description: 'Variable sleep patterns and suspected sleep apnea are affecting HRV and daily recovery. This intersects with anxiety management.', frequency: 'Appears in 3 documents' },
    { title: 'Stress-recovery connection', description: 'Work stress periods show measurable impact on sleep, HRV, and activity levels, with recovery taking 1–2 weeks.', frequency: 'Observed across events and trends' },
  ],
  timelineHighlights: [
    { date: '2023-03', event: 'Type 2 Diabetes diagnosed', significance: 'Major diagnosis — started Metformin and dietary management' },
    { date: '2024-01', event: 'Anxiety disorder documented', significance: 'Began therapy sessions — impacts sleep and recovery patterns' },
    { date: '2024-06', event: 'Vitamin D deficiency found', significance: 'Started supplementation — now resolved (42 ng/mL)' },
    { date: '2025-01', event: 'Lipid panel flagged high LDL', significance: 'Started Atorvastatin — cholesterol improving' },
    { date: '2025-08', event: 'Dietary changes begun', significance: 'Reduced carbs — supporting blood sugar and weight goals' },
    { date: '2025-11', event: 'HbA1c improved to 6.8%', significance: 'Best reading in 2 years — medication and lifestyle working together' },
  ],
  improvements: [
    'HbA1c decreased from 7.2% to 6.8% — a meaningful improvement in blood sugar control',
    'LDL cholesterol dropped from 142 to 118 mg/dL with Atorvastatin',
    'Vitamin D fully recovered from deficient (18) to healthy (42 ng/mL)',
    'Weight trending down — consistent with dietary changes',
    'eGFR improved slightly from 88 to 92 mL/min — kidneys are functioning well',
    'Total cholesterol dropped from 218 to 198 mg/dL — now within desirable range',
  ],
  concerns: [
    'CRP is elevated at 2.8 mg/L — some low-grade inflammation present',
    'Sleep remains variable — possible sleep apnea not yet evaluated',
    'HRV below personal baseline — may reflect ongoing stress',
    'Activity levels have declined in recent weeks',
    'Fasting glucose still slightly above the normal range',
  ],
  unresolvedItems: [
    'Sleep study referral for suspected sleep apnea — not yet scheduled',
    'CRP elevation — needs follow-up discussion with Dr. Chen',
    'Evening social commitments during Austin conference — accommodation planning incomplete',
    'Blood pressure monitoring consistency — some gaps in home readings',
  ],
  questionsForNextVisit: [
    'Should we investigate the elevated CRP further?',
    'Is a sleep study warranted given my symptoms and wearable data?',
    'Should Metformin dosage be adjusted now that HbA1c has improved?',
    'Are there additional tests to assess cardiovascular risk given my history?',
    'Could my anxiety be contributing to the inflammation marker?',
  ],
};
