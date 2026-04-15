// ===== BIOMARKER & LAB RESULTS DATA =====

export type BodySystem = 'heart' | 'liver' | 'kidneys' | 'blood' | 'metabolism' | 'hormones' | 'inflammation' | 'vitamins';
export type ResultStatus = 'normal' | 'slightly_high' | 'high' | 'slightly_low' | 'low' | 'critical';
export type EvidenceStrength = 'strong' | 'moderate' | 'suggestive' | 'limited';

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
  sourceProvider: string;
  date: string;
  previousValue?: number;
  previousDate?: string;
  extractionConfidence: number; // 0-100
  clinicalContext?: string; // how this relates to the user's specific situation
}

export interface HealthCategory {
  id: BodySystem;
  name: string;
  icon: string;
  status: 'good' | 'attention' | 'concern';
  summary: string;
  narrativeSummary: string; // longer, more intelligent plain-language summary
  supportiveHabits: string[];
  markerIds: string[];
  sourceDocuments: string[];
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
  sourceChain: string[]; // provenance trail
}

export interface NarrativeThread {
  id: string;
  title: string;
  narrative: string; // multi-sentence, written like a smart friend explaining
  evidence: { source: string; detail: string; date: string; confidence: EvidenceStrength }[];
  timespan: string;
  status: 'improving' | 'stable' | 'worsening' | 'resolved' | 'emerging';
  relatedBiomarkers: string[];
  relatedDiagnoses: string[];
}

export interface HealthStory {
  overallNarrative: string; // 3-4 sentence coherent summary of the whole picture
  narrativeThreads: NarrativeThread[];
  recurringThemes: { title: string; description: string; frequency: string; evidenceStrength: EvidenceStrength }[];
  timelineHighlights: { date: string; event: string; significance: string; source: string }[];
  improvements: { text: string; evidenceSource: string; magnitude: string }[];
  concerns: { text: string; urgency: 'watch' | 'discuss' | 'act'; evidenceSource: string }[];
  unresolvedItems: { text: string; lastMentioned: string; owner: string }[];
  questionsForNextVisit: { question: string; rationale: string; relatedData: string }[];
  crossDocumentInsights: { insight: string; documents: string[]; confidence: EvidenceStrength }[];
}

// ===== BIOMARKER DATA =====
export const biomarkers: Biomarker[] = [
  {
    id: 'bm1', medicalName: 'HbA1c', plainName: 'Average blood sugar (3 months)',
    value: 6.8, unit: '%', referenceRange: { low: 4.0, high: 5.6 },
    status: 'slightly_high', bodySystem: 'metabolism',
    explanation: 'This measures your average blood sugar over the past 2–3 months. At 6.8%, it\'s above the standard range, but for someone managing type 2 diabetes, this represents solid progress — down from 7.2% six months ago. That 0.4-point drop is clinically meaningful.',
    whyItMatters: 'Every point closer to target reduces long-term risk of complications to blood vessels, nerves, and kidneys. Your trend is heading in the right direction.',
    clinicalContext: 'Your improvement likely reflects the combined effect of Metformin, the dietary changes you made in August, and your morning exercise routine. Your doctor may consider whether to adjust medication now that you\'re in a lower range.',
    lifestyleFactors: ['Carbohydrate intake and meal timing', 'Physical activity (especially post-meal walks)', 'Metformin adherence and timing', 'Stress — cortisol raises blood sugar', 'Sleep quality — poor sleep affects insulin sensitivity'],
    sourceDocument: 'doc1', sourceProvider: 'Dr. Sarah Chen', date: '2025-11-20',
    previousValue: 7.2, previousDate: '2025-06-15', extractionConfidence: 97
  },
  {
    id: 'bm2', medicalName: 'Fasting Glucose', plainName: 'Blood sugar after overnight fast',
    value: 118, unit: 'mg/dL', referenceRange: { low: 70, high: 99 },
    status: 'slightly_high', bodySystem: 'metabolism',
    explanation: 'This is your blood sugar measured after at least 8 hours without eating. At 118 mg/dL, it\'s still above the standard range, but it\'s come down from 126 — about a 6% improvement. Your body is managing overnight blood sugar better than before.',
    whyItMatters: 'Fasting glucose reflects how well your body regulates sugar at rest, without the influence of recent meals. It\'s one of the simplest ways to track diabetes management over time.',
    clinicalContext: 'The improvement tracks with your HbA1c drop. Some residual elevation is expected with type 2 diabetes — your doctor may have a specific target range for you that differs from the general reference.',
    lifestyleFactors: ['Your last meal\'s size and carb content', 'Stress and cortisol levels', 'Sleep quality the night before', 'Metformin timing', 'Evening exercise'],
    sourceDocument: 'doc1', sourceProvider: 'Dr. Sarah Chen', date: '2025-11-20',
    previousValue: 126, previousDate: '2025-06-15', extractionConfidence: 97
  },
  {
    id: 'bm3', medicalName: 'ALT (SGPT)', plainName: 'Liver enzyme',
    value: 28, unit: 'U/L', referenceRange: { low: 7, high: 35 },
    status: 'normal', bodySystem: 'liver',
    explanation: 'ALT is an enzyme mostly found in your liver. When liver cells are stressed or damaged, more ALT leaks into the blood. Your level of 28 is comfortably within the normal range — your liver is handling its workload well.',
    whyItMatters: 'This is especially relevant for you because both Metformin and Atorvastatin are processed by the liver. Normal ALT means your liver is tolerating these medications without signs of strain.',
    clinicalContext: 'Your doctor will likely continue monitoring this periodically since you\'re on statins. The fact that ALT hasn\'t risen since starting Atorvastatin in January is reassuring.',
    lifestyleFactors: ['Alcohol intake', 'Medications — statins and Metformin are both liver-processed', 'Body weight', 'Vigorous exercise can temporarily elevate ALT'],
    sourceDocument: 'doc3', sourceProvider: 'Quest Diagnostics', date: '2025-03-15', extractionConfidence: 98
  },
  {
    id: 'bm4', medicalName: 'AST (SGOT)', plainName: 'Liver and muscle enzyme',
    value: 24, unit: 'U/L', referenceRange: { low: 10, high: 34 },
    status: 'normal', bodySystem: 'liver',
    explanation: 'AST is found in the liver, heart, and muscles. It\'s usually checked alongside ALT to get a fuller picture of liver health. Your level of 24 is well within normal range.',
    whyItMatters: 'When both ALT and AST are normal — as yours are — it\'s a strong signal that your liver is functioning well, even with multiple medications on board.',
    lifestyleFactors: ['Alcohol', 'Very intense exercise (can temporarily raise AST)', 'Medications', 'Diet'],
    sourceDocument: 'doc3', sourceProvider: 'Quest Diagnostics', date: '2025-03-15', extractionConfidence: 98
  },
  {
    id: 'bm5', medicalName: 'eGFR', plainName: 'Kidney filtration score',
    value: 92, unit: 'mL/min', referenceRange: { low: 90, high: 120 },
    status: 'normal', bodySystem: 'kidneys',
    explanation: 'This estimates how efficiently your kidneys filter waste from your blood. At 92, you\'re in the normal range — and this has actually improved from 88 last September, which is encouraging.',
    whyItMatters: 'Kidney function is especially important to track when you have diabetes and take blood pressure medication. Both conditions can affect kidneys over time, so steady or improving eGFR is good news.',
    clinicalContext: 'The improvement from 88 to 92 suggests your current medication regimen and blood pressure control are supporting kidney health, not harming it.',
    lifestyleFactors: ['Hydration — dehydration can temporarily lower eGFR', 'Blood pressure control', 'Protein intake', 'Lisinopril (your ACE inhibitor) actually protects kidneys'],
    sourceDocument: 'doc3', sourceProvider: 'Quest Diagnostics', date: '2025-03-15',
    previousValue: 88, previousDate: '2024-09-15', extractionConfidence: 98
  },
  {
    id: 'bm6', medicalName: 'Creatinine', plainName: 'Kidney waste marker',
    value: 1.0, unit: 'mg/dL', referenceRange: { low: 0.7, high: 1.2 },
    status: 'normal', bodySystem: 'kidneys',
    explanation: 'Creatinine is a natural byproduct of muscle activity that your kidneys filter out. A normal creatinine level — like yours at 1.0 — means your kidneys are clearing waste efficiently.',
    whyItMatters: 'Rising creatinine can be an early sign that kidneys are working harder. Your stable, normal level is consistent with the healthy eGFR reading.',
    lifestyleFactors: ['Hydration', 'Muscle mass — more muscle produces more creatinine', 'High-protein diets', 'Some medications'],
    sourceDocument: 'doc3', sourceProvider: 'Quest Diagnostics', date: '2025-03-15', extractionConfidence: 98
  },
  {
    id: 'bm7', medicalName: 'LDL Cholesterol', plainName: '"Bad" cholesterol',
    value: 118, unit: 'mg/dL', referenceRange: { low: 0, high: 99 },
    status: 'slightly_high', bodySystem: 'heart',
    explanation: 'LDL carries cholesterol into your artery walls, where it can build up over time. At 118, you\'re above the general target — but you\'ve dropped 24 points since starting Atorvastatin, which is a strong medication response.',
    whyItMatters: 'For someone with diabetes and hypertension, doctors often aim for LDL below 100 or even 70. The significant drop shows the statin is working, and your cardiologist may discuss whether a dose increase is warranted.',
    clinicalContext: 'The 17% reduction in LDL since July is a textbook response to starting a statin. Combined with triglyceride improvements, your overall cardiovascular lipid profile has improved substantially.',
    lifestyleFactors: ['Saturated and trans fats in diet', 'Exercise frequency', 'Atorvastatin adherence', 'Genetics play a significant role', 'Body weight'],
    sourceDocument: 'doc6', sourceProvider: 'Quest Diagnostics', date: '2025-01-05',
    previousValue: 142, previousDate: '2024-07-10', extractionConfidence: 96
  },
  {
    id: 'bm8', medicalName: 'HDL Cholesterol', plainName: '"Good" cholesterol',
    value: 52, unit: 'mg/dL', referenceRange: { low: 40, high: 100 },
    status: 'normal', bodySystem: 'heart',
    explanation: 'HDL works as a cleanup crew — it helps remove excess cholesterol from your bloodstream. At 52, you\'re in a healthy range, though higher is generally better.',
    whyItMatters: 'HDL above 40 for men (or 50 for women) is considered protective. Your level provides a reasonable counterbalance to the slightly elevated LDL.',
    lifestyleFactors: ['Aerobic exercise is the best way to raise HDL', 'Healthy fats (olive oil, nuts, avocado)', 'Avoiding smoking', 'Moderate alcohol may slightly raise HDL', 'Weight loss'],
    sourceDocument: 'doc6', sourceProvider: 'Quest Diagnostics', date: '2025-01-05', extractionConfidence: 96
  },
  {
    id: 'bm9', medicalName: 'Triglycerides', plainName: 'Blood fats from food',
    value: 148, unit: 'mg/dL', referenceRange: { low: 0, high: 149 },
    status: 'normal', bodySystem: 'heart',
    explanation: 'Triglycerides are fats your body stores from food for energy. At 148, you\'re at the upper edge of normal — down from 168, which is a solid improvement likely related to your dietary changes.',
    whyItMatters: 'High triglycerides combined with high LDL increase cardiovascular risk. The fact that both are moving in the right direction is an encouraging sign for your heart health picture overall.',
    clinicalContext: 'Your carbohydrate reduction in August likely contributed to this drop, since refined carbs and sugars are among the biggest dietary drivers of triglycerides.',
    lifestyleFactors: ['Sugar and refined carbohydrates are the biggest dietary factor', 'Alcohol', 'Omega-3 fatty acids (fish, walnuts) can help lower triglycerides', 'Exercise', 'Weight'],
    sourceDocument: 'doc6', sourceProvider: 'Quest Diagnostics', date: '2025-01-05',
    previousValue: 168, previousDate: '2024-07-10', extractionConfidence: 96
  },
  {
    id: 'bm10', medicalName: 'Total Cholesterol', plainName: 'Total cholesterol',
    value: 198, unit: 'mg/dL', referenceRange: { low: 125, high: 199 },
    status: 'normal', bodySystem: 'heart',
    explanation: 'This combines all cholesterol types into one number. At 198, you just made it under the 200 "desirable" line — down from 218. But your doctor will care more about the LDL-to-HDL ratio than this single number.',
    whyItMatters: 'Total cholesterol is a quick snapshot, but the breakdown matters more. Your improving LDL and stable HDL tell a more complete story than this number alone.',
    lifestyleFactors: ['Diet', 'Exercise', 'Medications', 'Genetics — some people have naturally higher cholesterol regardless of lifestyle'],
    sourceDocument: 'doc6', sourceProvider: 'Quest Diagnostics', date: '2025-01-05',
    previousValue: 218, previousDate: '2024-07-10', extractionConfidence: 96
  },
  {
    id: 'bm11', medicalName: 'Vitamin D (25-OH)', plainName: 'Vitamin D level',
    value: 42, unit: 'ng/mL', referenceRange: { low: 30, high: 100 },
    status: 'normal', bodySystem: 'vitamins',
    explanation: 'Your vitamin D has recovered beautifully — from 18 (deficient) to 42 (solidly normal) after about 9 months of supplementation. This is one of the clear success stories in your recent health data.',
    whyItMatters: 'Adequate vitamin D supports bone strength, immune function, mood stability, and may even play a role in blood sugar regulation — relevant given your diabetes management.',
    clinicalContext: 'The deficiency is now fully resolved. Your doctor may recommend continuing at a maintenance dose rather than stopping, especially through winter months.',
    lifestyleFactors: ['Supplementation — you\'re taking 2000 IU daily', 'Sun exposure (15-20 min helps)', 'Fatty fish, eggs, and fortified foods', 'Season and latitude affect natural production'],
    sourceDocument: 'doc3', sourceProvider: 'Quest Diagnostics', date: '2025-03-15',
    previousValue: 18, previousDate: '2024-06-01', extractionConfidence: 98
  },
  {
    id: 'bm12', medicalName: 'Hemoglobin', plainName: 'Oxygen-carrying protein in blood',
    value: 14.8, unit: 'g/dL', referenceRange: { low: 13.5, high: 17.5 },
    status: 'normal', bodySystem: 'blood',
    explanation: 'Hemoglobin is the protein in red blood cells that carries oxygen to your tissues. At 14.8, you\'re well within the healthy range — your blood is transporting oxygen efficiently.',
    whyItMatters: 'Low hemoglobin causes fatigue, shortness of breath, and poor exercise tolerance. Your normal level means these symptoms, if present, likely have other causes.',
    lifestyleFactors: ['Iron-rich foods (red meat, spinach, lentils)', 'Hydration', 'Altitude', 'Intense exercise'],
    sourceDocument: 'doc3', sourceProvider: 'Quest Diagnostics', date: '2025-03-15', extractionConfidence: 98
  },
  {
    id: 'bm13', medicalName: 'TSH', plainName: 'Thyroid function indicator',
    value: 2.1, unit: 'mIU/L', referenceRange: { low: 0.4, high: 4.0 },
    status: 'normal', bodySystem: 'hormones',
    explanation: 'TSH is the signal your brain sends to your thyroid gland, telling it how much hormone to produce. At 2.1, the signal is perfectly calibrated — your thyroid is functioning normally.',
    whyItMatters: 'An out-of-range TSH can cause fatigue, weight changes, mood shifts, and metabolic disruption. Normal TSH rules out thyroid dysfunction as a contributor to any of those symptoms.',
    lifestyleFactors: ['Stress', 'Sleep quality', 'Iodine intake', 'Some medications can affect thyroid function', 'Autoimmune conditions'],
    sourceDocument: 'doc3', sourceProvider: 'Quest Diagnostics', date: '2025-03-15', extractionConfidence: 98
  },
  {
    id: 'bm14', medicalName: 'CRP (hs)', plainName: 'Inflammation level',
    value: 2.8, unit: 'mg/L', referenceRange: { low: 0, high: 1.0 },
    status: 'slightly_high', bodySystem: 'inflammation',
    explanation: 'High-sensitivity CRP detects low-grade inflammation in your body. At 2.8, it\'s nearly three times the upper limit of optimal. This doesn\'t point to a specific cause — it\'s more of a general signal that something is driving inflammation.',
    whyItMatters: 'Chronic low-grade inflammation is linked to cardiovascular disease, metabolic syndrome, and slower recovery. Given your diabetes and cardiovascular risk factors, this is worth investigating.',
    clinicalContext: 'Your recent stress sprint, variable sleep, and metabolic factors could all contribute. It\'s also possible this is a one-time elevation. Your doctor may want to retest after a period of better sleep and lower stress to see if it normalizes.',
    lifestyleFactors: ['Chronic stress is a significant driver', 'Poor sleep quality', 'Processed foods and excess sugar', 'Lack of exercise', 'Excess body weight', 'Recent infections can temporarily spike CRP'],
    sourceDocument: 'doc3', sourceProvider: 'Quest Diagnostics', date: '2025-03-15', extractionConfidence: 98
  },
  {
    id: 'bm15', medicalName: 'WBC', plainName: 'White blood cell count',
    value: 6.8, unit: 'K/uL', referenceRange: { low: 4.5, high: 11.0 },
    status: 'normal', bodySystem: 'blood',
    explanation: 'White blood cells are your immune system\'s front-line defenders. At 6.8, your count is solidly normal — no signs of active infection or immune system issues.',
    whyItMatters: 'A very high count could suggest infection or inflammation. A very low count could indicate immune suppression. Yours is in a healthy middle ground.',
    lifestyleFactors: ['Active infections', 'Chronic stress', 'Medications', 'Intense exercise'],
    sourceDocument: 'doc3', sourceProvider: 'Quest Diagnostics', date: '2025-03-15', extractionConfidence: 98
  },
  {
    id: 'bm16', medicalName: 'Potassium', plainName: 'Potassium level',
    value: 4.2, unit: 'mEq/L', referenceRange: { low: 3.5, high: 5.0 },
    status: 'normal', bodySystem: 'kidneys',
    explanation: 'Potassium is critical for heart rhythm and muscle function. Your level of 4.2 is right in the sweet spot — important because your blood pressure medication (Lisinopril) can sometimes push potassium higher.',
    whyItMatters: 'Both too-high and too-low potassium can cause dangerous heart rhythm problems. The fact that yours is well-controlled despite taking an ACE inhibitor is a good sign.',
    clinicalContext: 'Your doctor monitors this specifically because Lisinopril can cause potassium to rise. Your healthy level means the medication is being well-tolerated.',
    lifestyleFactors: ['ACE inhibitors like Lisinopril can raise potassium', 'Potassium-rich foods (bananas, potatoes, tomatoes)', 'Hydration', 'Kidney function — healthy kidneys regulate potassium well'],
    sourceDocument: 'doc3', sourceProvider: 'Quest Diagnostics', date: '2025-03-15', extractionConfidence: 98
  },
];

// ===== HEALTH CATEGORIES =====
export const healthCategories: HealthCategory[] = [
  {
    id: 'heart', name: 'Heart & Circulation', icon: '❤️',
    status: 'attention',
    summary: 'Cholesterol improving with medication. LDL still above target but trending well.',
    narrativeSummary: 'Your cardiovascular picture has improved meaningfully since starting Atorvastatin in January. LDL cholesterol dropped from 142 to 118 — a 17% reduction — and triglycerides fell from 168 to 148. Total cholesterol slipped under the 200 line for the first time. Your HDL ("good" cholesterol) is holding steady at 52, which provides reasonable protection. The main remaining gap is that LDL is still above the stricter targets your cardiologist may want, especially given your diabetes. Your May 12 appointment with Dr. Park is a good time to discuss whether a dose adjustment is needed.',
    supportiveHabits: ['Regular moderate exercise — especially walking and cycling', 'Limit saturated fats and increase omega-3 sources', 'Maintain healthy weight (your current trend is helping)', 'Manage stress — it affects blood pressure and inflammation', 'Take Atorvastatin consistently at bedtime'],
    markerIds: ['bm7', 'bm8', 'bm9', 'bm10'],
    sourceDocuments: ['doc6', 'doc4']
  },
  {
    id: 'liver', name: 'Liver', icon: 'liver-img',
    status: 'good',
    summary: 'Liver enzymes normal. Medications being well tolerated.',
    narrativeSummary: 'Both liver enzymes — ALT and AST — are comfortably within normal range. This is particularly reassuring because you\'re taking two medications that are processed by the liver (Metformin and Atorvastatin). The fact that these enzymes haven\'t risen since starting the statin in January suggests your liver is handling the additional workload well. No action needed, but your doctor will likely continue checking these periodically as a safety measure.',
    supportiveHabits: ['Moderate alcohol intake', 'Stay hydrated', 'Balanced diet supports liver function', 'Report any unusual fatigue or yellowing of skin/eyes promptly'],
    markerIds: ['bm3', 'bm4'],
    sourceDocuments: ['doc3']
  },
  {
    id: 'kidneys', name: 'Kidneys', icon: '🫘',
    status: 'good',
    summary: 'Kidney function normal and actually improving. Potassium well-controlled on ACE inhibitor.',
    narrativeSummary: 'Your kidneys are working well. eGFR actually improved from 88 to 92 — a small but positive change that suggests your blood pressure management and medication regimen are supporting kidney health rather than straining it. Creatinine is perfectly normal at 1.0, and potassium is well-controlled at 4.2 despite taking Lisinopril (which can raise potassium levels). For someone managing both diabetes and hypertension, healthy kidney numbers are especially important to maintain.',
    supportiveHabits: ['Stay well-hydrated throughout the day', 'Continue blood pressure management', 'Moderate protein intake', 'Avoid regular NSAID use (ibuprofen, naproxen) — they can stress kidneys'],
    markerIds: ['bm5', 'bm6', 'bm16'],
    sourceDocuments: ['doc3']
  },
  {
    id: 'blood', name: 'Blood', icon: '🩸',
    status: 'good',
    summary: 'Blood counts healthy. No signs of anemia or infection.',
    narrativeSummary: 'Your blood counts look healthy across the board. Hemoglobin at 14.8 means your blood is carrying oxygen efficiently — no signs of anemia. White blood cells at 6.8 show your immune system is active but not fighting anything unusual. These normal values are a useful baseline; any future changes in fatigue or energy levels can be compared against these reference points.',
    supportiveHabits: ['Iron-rich foods (leafy greens, lean meats, legumes)', 'Adequate sleep supports blood cell production', 'Regular check-ups to track trends'],
    markerIds: ['bm12', 'bm15'],
    sourceDocuments: ['doc3']
  },
  {
    id: 'metabolism', name: 'Metabolism', icon: '⚡',
    status: 'attention',
    summary: 'Blood sugar management improving. HbA1c down, fasting glucose still slightly elevated.',
    narrativeSummary: 'This is one of your strongest areas of recent improvement. HbA1c dropped from 7.2% to 6.8% — a 0.4-point reduction that reflects better average blood sugar control over the past three months. This improvement likely reflects the combined impact of Metformin, the dietary changes you started in August (reduced carbs), and your exercise routine. Fasting glucose is still slightly above the standard range at 118, down from 126, but the trend is clearly positive. Your doctor may want to discuss whether your HbA1c target should be adjusted now that you\'re making steady progress.',
    supportiveHabits: ['Consistent meal timing — avoid long gaps between meals', 'Lower-carb meals, especially in the evening', 'Post-meal walks (even 10-15 minutes helps)', 'Quality sleep — poor sleep directly raises blood sugar', 'Stress management — cortisol spikes blood sugar'],
    markerIds: ['bm1', 'bm2'],
    sourceDocuments: ['doc1']
  },
  {
    id: 'hormones', name: 'Hormones', icon: '🧬',
    status: 'good',
    summary: 'Thyroid function normal. No hormone-related concerns.',
    narrativeSummary: 'Your thyroid is functioning normally, with TSH at 2.1 — right in the healthy range. This effectively rules out thyroid problems as a contributor to fatigue, weight changes, or mood symptoms. No action needed, but this is a helpful baseline to have on file.',
    supportiveHabits: ['Regular sleep schedule supports hormonal balance', 'Balanced nutrition', 'Stress management — chronic stress affects multiple hormone systems'],
    markerIds: ['bm13'],
    sourceDocuments: ['doc3']
  },
  {
    id: 'inflammation', name: 'Inflammation', icon: '🔥',
    status: 'concern',
    summary: 'CRP elevated — low-grade inflammation detected. Worth investigating.',
    narrativeSummary: 'Your CRP at 2.8 mg/L is the one lab value that stands out as a concern. It\'s nearly three times the optimal cutoff, indicating some level of chronic low-grade inflammation. This doesn\'t tell us exactly what\'s causing it — CRP is a general alarm bell, not a specific diagnosis. The most likely contributors in your case are a combination of metabolic factors (diabetes, weight), recent stress (the November work sprint), and variable sleep quality. It\'s also possible your anxiety contributes through cortisol pathways. This is worth discussing with Dr. Chen — she may want to retest after a few weeks of better sleep and lower stress to see if it normalizes, or investigate further if it persists.',
    supportiveHabits: ['Anti-inflammatory foods — omega-3 fatty acids, berries, leafy greens, turmeric', 'Regular moderate exercise (don\'t overdo it)', 'Prioritize consistent, quality sleep', 'Active stress reduction — meditation, walks, therapy', 'Maintain healthy weight — your current trend helps'],
    markerIds: ['bm14'],
    sourceDocuments: ['doc3']
  },
  {
    id: 'vitamins', name: 'Vitamins & Minerals', icon: '💊',
    status: 'good',
    summary: 'Vitamin D fully recovered. One of your clear success stories.',
    narrativeSummary: 'Vitamin D went from 18 (deficient) to 42 (solidly normal) — a complete recovery driven by your daily 2000 IU supplementation. This is one of the most straightforward wins in your health data. Adequate vitamin D supports bone health, immune function, mood, and may even help with blood sugar regulation. Your doctor will likely recommend staying on a maintenance dose, especially during winter months when sun exposure is limited.',
    supportiveHabits: ['Continue your daily 2000 IU vitamin D supplement', 'Get 15-20 minutes of sunlight when possible', 'Include fatty fish, eggs, and fortified foods in your diet', 'Retest annually to confirm you\'re maintaining adequate levels'],
    markerIds: ['bm11'],
    sourceDocuments: ['doc3']
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
    summary: 'Updated diabetes management plan showing meaningful HbA1c improvement from 7.2% to 6.8%. Blood pressure stable on current regimen. Provider notes that dietary changes and exercise routine are contributing to improvement. Continue current medications.',
    bodySystemsInvolved: ['metabolism', 'heart'],
    visitReason: 'Quarterly diabetes and hypertension review',
    nextSteps: ['Schedule next HbA1c lab for Feb 2026', 'Continue home BP monitoring', 'Maintain dietary changes'],
    sourceChain: ['Uploaded PDF → Auto-extracted → Verified against clinical template']
  },
  {
    documentId: 'doc3', fileName: 'lab_results_march.pdf', fileType: 'pdf',
    uploadDate: '2025-03-16', provider: 'Quest Diagnostics',
    extractionStatus: 'complete', confidence: 98,
    extractedDiagnoses: ['Vitamin D Deficiency (resolved)'],
    extractedBiomarkers: ['Vitamin D: 42 ng/mL', 'eGFR: 92 mL/min', 'ALT: 28 U/L', 'AST: 24 U/L', 'Creatinine: 1.0 mg/dL', 'TSH: 2.1 mIU/L', 'CRP: 2.8 mg/L', 'Hemoglobin: 14.8 g/dL', 'WBC: 6.8 K/uL', 'Potassium: 4.2 mEq/L'],
    extractedMedications: ['Vitamin D3 2000 IU (continue)'],
    extractedFollowUps: ['Discuss CRP elevation', 'Recheck Vitamin D in 6 months'],
    summary: 'Comprehensive metabolic panel with 10 biomarkers extracted. Most values within normal range. Vitamin D has recovered to healthy levels. CRP elevation at 2.8 mg/L is the primary finding warranting follow-up. Kidney and liver function are both normal and stable.',
    bodySystemsInvolved: ['kidneys', 'liver', 'vitamins', 'blood', 'inflammation', 'hormones'],
    nextSteps: ['Discuss CRP with Dr. Chen at next visit', 'Continue Vitamin D supplementation', 'Recheck labs in 6 months'],
    sourceChain: ['Uploaded PDF → OCR extraction → Structured lab format detected → High-confidence auto-extraction']
  },
  {
    documentId: 'doc6', fileName: 'lipid_panel_jan.pdf', fileType: 'pdf',
    uploadDate: '2025-01-06', provider: 'Quest Diagnostics',
    extractionStatus: 'complete', confidence: 96,
    extractedDiagnoses: ['Hyperlipidemia'],
    extractedBiomarkers: ['LDL: 118 mg/dL', 'HDL: 52 mg/dL', 'Triglycerides: 148 mg/dL', 'Total Cholesterol: 198 mg/dL'],
    extractedMedications: ['Atorvastatin 20mg (new)'],
    extractedFollowUps: ['Repeat lipid panel in 3 months', 'Monitor liver enzymes on statin'],
    summary: 'Follow-up lipid panel showing significant improvement since starting Atorvastatin. LDL dropped from 142 to 118, triglycerides from 168 to 148, total cholesterol from 218 to 198. All trending in the right direction. Doctor may discuss target goals at next cardiology visit.',
    bodySystemsInvolved: ['heart'],
    nextSteps: ['Continue Atorvastatin as prescribed', 'Follow-up lipid panel at next cardiology visit', 'Report any muscle pain or unusual fatigue'],
    sourceChain: ['Uploaded PDF → Structured lab format → Auto-extracted with prior values matched']
  },
  {
    documentId: 'doc7', fileName: 'sleep_journal_notes.md', fileType: 'md',
    uploadDate: '2025-11-15', provider: 'Self',
    extractionStatus: 'partial', confidence: 72,
    extractedDiagnoses: [],
    extractedBiomarkers: ['Sleep onset latency: ~35 min'],
    extractedMedications: [],
    extractedFollowUps: ['Discuss sleep difficulties with provider'],
    summary: 'Personal sleep journal entries describing difficulty falling asleep, especially during travel weeks. Average sleep onset taking about 35 minutes. Informal but consistent with wearable data showing variable sleep patterns.',
    bodySystemsInvolved: [],
    visitReason: undefined,
    nextSteps: ['Consider sleep study referral', 'Track sleep onset time consistently'],
    sourceChain: ['User-uploaded Markdown → Partial extraction → Unstructured text — lower confidence']
  },
];

// ===== HEALTH STORY / CROSS-DOCUMENT SYNTHESIS =====
export const healthStory: HealthStory = {
  overallNarrative: 'You\'re managing three active conditions — type 2 diabetes, hypertension, and anxiety — and the data across your records shows a generally positive trajectory over the past year. Blood sugar and cholesterol have both improved measurably with medication and lifestyle changes. Your kidneys, liver, and thyroid are all functioning well. The areas that still need attention are inflammation (elevated CRP), sleep quality (variable and possibly related to undiagnosed sleep apnea), and the relationship between stress, sleep, and recovery. Your next appointment with Dr. Chen on April 28 is a good opportunity to address the CRP finding and discuss whether a sleep study is warranted.',

  narrativeThreads: [
    {
      id: 'nt1',
      title: 'Blood sugar is on a clear improving trend',
      narrative: 'Your diabetes management has been the strongest area of improvement over the past year. HbA1c dropped from 7.2% to 6.8% — a clinically significant change that means your average blood sugar is substantially lower. Fasting glucose also improved from 126 to 118. These improvements appeared after you made dietary changes in August 2025 and maintained your Metformin regimen. The combination of medication, reduced carbohydrates, and your morning exercise routine seems to be working well together.',
      evidence: [
        { source: 'diabetes_management_plan.pdf', detail: 'HbA1c: 7.2% → 6.8%', date: '2025-11-20', confidence: 'strong' },
        { source: 'diabetes_management_plan.pdf', detail: 'Fasting glucose: 126 → 118 mg/dL', date: '2025-11-20', confidence: 'strong' },
        { source: 'Oura / Apple Health', detail: 'Weight trending down ~1.5 lbs/month', date: '2025-11', confidence: 'moderate' },
      ],
      timespan: 'Mar 2023 – Present',
      status: 'improving',
      relatedBiomarkers: ['bm1', 'bm2'],
      relatedDiagnoses: ['d1']
    },
    {
      id: 'nt2',
      title: 'Cholesterol responding well to medication',
      narrative: 'Since starting Atorvastatin in January 2025, your lipid panel has improved across the board. LDL dropped 17%, triglycerides dropped 12%, and total cholesterol fell below 200 for the first time. Your liver enzymes remain normal, meaning the statin is being well tolerated. The remaining question is whether your cardiologist will want to push LDL even lower given your diabetes — stricter targets of below 70-100 mg/dL are common for people with multiple cardiovascular risk factors.',
      evidence: [
        { source: 'lipid_panel_jan.pdf', detail: 'LDL: 142 → 118 mg/dL (17% reduction)', date: '2025-01-05', confidence: 'strong' },
        { source: 'lipid_panel_jan.pdf', detail: 'Triglycerides: 168 → 148 mg/dL', date: '2025-01-05', confidence: 'strong' },
        { source: 'lab_results_march.pdf', detail: 'ALT and AST normal — liver tolerating statin', date: '2025-03-15', confidence: 'strong' },
      ],
      timespan: 'Jul 2024 – Present',
      status: 'improving',
      relatedBiomarkers: ['bm7', 'bm8', 'bm9', 'bm10'],
      relatedDiagnoses: ['d2']
    },
    {
      id: 'nt3',
      title: 'Sleep and recovery remain inconsistent',
      narrative: 'Sleep is the area where your data consistently shows room for improvement. Your wearable data shows variable sleep duration (6.4 to 7.8 hours), and your personal journal notes difficulty falling asleep, especially during travel weeks. HRV — a key recovery indicator — has been below your personal baseline, which tends to correlate with poor sleep periods. Suspected sleep apnea has been noted but not yet evaluated. This thread connects to your anxiety, your stress response, and potentially to your elevated CRP.',
      evidence: [
        { source: 'Oura ring data', detail: 'Sleep duration variable: 6.4–7.8 hrs', date: '2025-11', confidence: 'moderate' },
        { source: 'sleep_journal_notes.md', detail: 'Sleep onset latency ~35 min', date: '2025-11-15', confidence: 'suggestive' },
        { source: 'Oura ring data', detail: 'HRV below baseline: 39 vs 42 ms', date: '2025-11', confidence: 'moderate' },
      ],
      timespan: 'Jan 2024 – Present',
      status: 'worsening',
      relatedBiomarkers: [],
      relatedDiagnoses: ['d3', 'd5']
    },
    {
      id: 'nt4',
      title: 'Inflammation signal needs investigation',
      narrative: 'Your CRP at 2.8 mg/L is the one outlier in an otherwise reassuring set of labs. CRP is a non-specific marker — it tells you inflammation is present but not why. In your case, the most plausible contributors are metabolic factors (diabetes, weight), stress (your recent November work sprint), and poor sleep quality. It could also be a transient spike. The right next step is to discuss this with Dr. Chen, who may recommend retesting after a period of better sleep and stress management, or may want to investigate further.',
      evidence: [
        { source: 'lab_results_march.pdf', detail: 'CRP: 2.8 mg/L (optimal: <1.0)', date: '2025-03-15', confidence: 'strong' },
        { source: 'Event data', detail: 'High-stress work sprint Nov 1–14', date: '2025-11', confidence: 'suggestive' },
        { source: 'Oura ring data', detail: 'HRV and sleep declined during stress period', date: '2025-11', confidence: 'moderate' },
      ],
      timespan: 'Mar 2025 – Present',
      status: 'emerging',
      relatedBiomarkers: ['bm14'],
      relatedDiagnoses: ['d1', 'd3']
    },
  ],

  recurringThemes: [
    { title: 'Blood sugar management', description: 'Type 2 diabetes is your primary ongoing condition. HbA1c has improved from 7.2% to 6.8% over the past year — a meaningful change driven by medication, dietary shifts, and exercise.', frequency: 'Referenced in 3 documents', evidenceStrength: 'strong' },
    { title: 'Cardiovascular risk management', description: 'Blood pressure and cholesterol are being actively managed with Lisinopril and Atorvastatin. Both are trending in the right direction, with LDL dropping 17% since starting the statin.', frequency: 'Referenced in 4 documents', evidenceStrength: 'strong' },
    { title: 'Sleep–stress–recovery loop', description: 'Variable sleep, suspected sleep apnea, and work stress form an interconnected pattern that affects HRV, recovery, and likely contributes to inflammation. This is the area with the most room for improvement.', frequency: 'Observed across 3 documents and wearable data', evidenceStrength: 'moderate' },
    { title: 'Medication effectiveness', description: 'All current medications appear to be working as intended — Metformin supporting blood sugar, Atorvastatin lowering cholesterol, Lisinopril managing blood pressure — without signs of side effects in lab work.', frequency: 'Cross-referenced across medication and lab records', evidenceStrength: 'strong' },
  ],

  timelineHighlights: [
    { date: '2023-03', event: 'Type 2 Diabetes diagnosed', significance: 'Started Metformin and dietary management — the beginning of your primary health management journey', source: 'Clinical note — Dr. Chen' },
    { date: '2024-01', event: 'Anxiety disorder documented', significance: 'Began therapy — this diagnosis intersects with sleep and stress recovery patterns', source: 'Clinical note — Dr. Morgan' },
    { date: '2024-06', event: 'Vitamin D deficiency found', significance: 'Started 2000 IU daily — now fully resolved', source: 'Lab results — Quest Diagnostics' },
    { date: '2025-01', event: 'Lipid panel flagged high LDL → started Atorvastatin', significance: 'Key intervention — cholesterol has since improved significantly', source: 'Lab results — Quest Diagnostics' },
    { date: '2025-08', event: 'Began reduced-carb diet', significance: 'Lifestyle change supporting blood sugar and weight — coincides with HbA1c improvement', source: 'User-entered event' },
    { date: '2025-11', event: 'HbA1c improved to 6.8%', significance: 'Best reading in 2 years — validates that current approach is working', source: 'Diabetes management plan — Dr. Chen' },
  ],

  improvements: [
    { text: 'HbA1c decreased from 7.2% to 6.8% — your best reading in two years', evidenceSource: 'diabetes_management_plan.pdf (Dr. Chen)', magnitude: 'Significant' },
    { text: 'LDL cholesterol dropped 17% from 142 to 118 with Atorvastatin', evidenceSource: 'lipid_panel_jan.pdf (Quest Diagnostics)', magnitude: 'Significant' },
    { text: 'Vitamin D fully recovered from deficient (18) to healthy (42)', evidenceSource: 'lab_results_march.pdf (Quest Diagnostics)', magnitude: 'Complete recovery' },
    { text: 'Weight trending down ~1.5 lbs/month, consistent with dietary changes', evidenceSource: 'Apple Health / scale data', magnitude: 'Moderate' },
    { text: 'Kidney function improved slightly (eGFR 88 → 92)', evidenceSource: 'lab_results_march.pdf (Quest Diagnostics)', magnitude: 'Mild' },
    { text: 'Total cholesterol dropped below 200 for the first time', evidenceSource: 'lipid_panel_jan.pdf (Quest Diagnostics)', magnitude: 'Moderate' },
  ],

  concerns: [
    { text: 'CRP at 2.8 mg/L indicates low-grade inflammation — cause not yet identified', urgency: 'discuss', evidenceSource: 'lab_results_march.pdf' },
    { text: 'Sleep remains variable with suspected sleep apnea not yet evaluated', urgency: 'discuss', evidenceSource: 'sleep_journal_notes.md + Oura data' },
    { text: 'HRV consistently below personal baseline — may reflect chronic stress or poor recovery', urgency: 'watch', evidenceSource: 'Oura ring data' },
    { text: 'Activity levels have dropped below baseline in recent weeks', urgency: 'watch', evidenceSource: 'Apple Health step data' },
    { text: 'Fasting glucose still slightly above the standard reference range', urgency: 'watch', evidenceSource: 'diabetes_management_plan.pdf' },
  ],

  unresolvedItems: [
    { text: 'Sleep study referral for suspected sleep apnea — not yet scheduled', lastMentioned: 'Nov 2025', owner: 'You + Dr. Chen' },
    { text: 'CRP elevation — needs follow-up discussion and possible retest', lastMentioned: 'Mar 2025', owner: 'Dr. Chen' },
    { text: 'Austin conference accommodation planning — some items incomplete', lastMentioned: 'Ongoing', owner: 'You' },
    { text: 'Blood pressure home monitoring gaps — some weeks have missing readings', lastMentioned: 'Oct 2025', owner: 'You' },
  ],

  questionsForNextVisit: [
    { question: 'Should we investigate the elevated CRP further, or retest after improving sleep and stress?', rationale: 'CRP at 2.8 is nearly 3x optimal — understanding the cause could affect treatment approach', relatedData: 'CRP: 2.8 mg/L from March 2025 labs' },
    { question: 'Is a sleep study warranted given my symptoms, journal entries, and wearable data?', rationale: 'Suspected sleep apnea has been noted but never formally evaluated — it could explain HRV and recovery patterns', relatedData: 'Sleep journal, Oura HRV trends, partner-reported snoring' },
    { question: 'Now that HbA1c is at 6.8%, should we adjust the Metformin dosage or target?', rationale: 'Improvement may warrant discussion of whether to maintain, reduce, or adjust medication', relatedData: 'HbA1c: 7.2% → 6.8%, Fasting glucose: 126 → 118' },
    { question: 'What additional tests would help assess my cardiovascular risk profile?', rationale: 'With diabetes + hypertension + elevated CRP, a more complete cardiac risk assessment may be useful', relatedData: 'LDL: 118, CRP: 2.8, BP ~128/82, echocardiogram normal' },
    { question: 'Could my anxiety be contributing to the inflammation and sleep problems?', rationale: 'Anxiety, stress, inflammation, and sleep form an interconnected loop — treating one may help the others', relatedData: 'GAD-7 score improving, HRV below baseline, CRP elevated' },
  ],

  crossDocumentInsights: [
    { insight: 'Your medication regimen is working well across the board — Metformin, Atorvastatin, and Lisinopril are all showing measurable positive effects in lab results, with no signs of adverse effects on liver or kidney function.', documents: ['doc1', 'doc3', 'doc6'], confidence: 'strong' },
    { insight: 'There appears to be a connection between your stress periods, sleep quality, HRV patterns, and potentially your CRP elevation. These may not be separate issues — they could be aspects of the same stress-recovery cycle.', documents: ['doc7', 'doc5'], confidence: 'moderate' },
    { insight: 'Your dietary changes in August 2025 appear to have contributed to improvements in both blood sugar (HbA1c) and blood fats (triglycerides), suggesting they\'re having a broad metabolic benefit.', documents: ['doc1', 'doc6'], confidence: 'moderate' },
    { insight: 'Despite managing three active conditions and four medications, your organ function (liver, kidneys, thyroid) remains healthy — suggesting your overall system is handling the current medical load well.', documents: ['doc3'], confidence: 'strong' },
  ],
};
