import { CropStage, ChecklistItem } from '../../types/crop';

export const riceStages: CropStage[] = [
  { id: 'germination', name: 'Germination', duration: 7, criticalFactors: ['water', 'temperature'], idealConditions: { tempMin: 10, tempMax: 32, rainfallMin: 1000, rainfallMax: 1500, humidity: 'high' } },
  { id: 'seedling', name: 'Seedling', duration: 14, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 16, tempMax: 30, rainfallMin: 1000, rainfallMax: 1500, humidity: 'high' } },
  { id: 'tillering', name: 'Tillering', duration: 20, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 18, tempMax: 32, rainfallMin: 1000, rainfallMax: 1500, humidity: 'high' } },
  { id: 'panicle-initiation', name: 'Panicle Initiation', duration: 15, criticalFactors: ['water'], idealConditions: { tempMin: 20, tempMax: 32, rainfallMin: 1000, rainfallMax: 1500, humidity: 'high' } },
  { id: 'flowering', name: 'Flowering', duration: 10, criticalFactors: ['temperature', 'water'], idealConditions: { tempMin: 22, tempMax: 30, rainfallMin: 800, rainfallMax: 1200, humidity: 'medium' } },
  { id: 'grain-filling', name: 'Grain Filling', duration: 15, criticalFactors: ['temperature'], idealConditions: { tempMin: 20, tempMax: 30, rainfallMin: 600, rainfallMax: 1000, humidity: 'medium' } },
  { id: 'maturity', name: 'Maturity', duration: 10, criticalFactors: ['temperature'], idealConditions: { tempMin: 18, tempMax: 28, rainfallMin: 400, rainfallMax: 800, humidity: 'low' } }
];

export const riceCheckInQuestions: ChecklistItem[] = [
  { id: 'rice-water', question: 'Is the field completely dry? (Should be flooded)', category: 'water', riskWeight: 9 },
  { id: 'rice-pest-1', question: 'Do you see dead hearts (dried central shoots)?', category: 'pest', riskWeight: 8 },
  { id: 'rice-pest-2', question: 'Are leaf tips turning yellow or brown?', category: 'disease', riskWeight: 7 },
  { id: 'rice-health', question: 'Does the crop look pale or yellowish?', category: 'nutrient', riskWeight: 6 }
];

export const riceRiskAssessment = {
    commonRisks: [
        { type: 'Drought', impact: 'High', mitigation: 'Ensure alternative irrigation sources are ready.' },
        { type: 'Blast Disease', impact: 'Moderate', mitigation: 'Avoid excessive nitrogen fertilization.' }
    ],
    analysis: "Rice is highly sensitive to water availability. Monitoring flood levels daily is recommended during tillering and flowering stages."
};
