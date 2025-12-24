import { CropStage, ChecklistItem } from '../../types/crop';

export const maizeStages: CropStage[] = [
  { id: 'germination', name: 'Germination', duration: 5, criticalFactors: ['temperature', 'water'], idealConditions: { tempMin: 8, tempMax: 30, rainfallMin: 500, rainfallMax: 800, humidity: 'medium' } },
  { id: 'seedling', name: 'Seedling', duration: 12, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 15, tempMax: 28, rainfallMin: 500, rainfallMax: 800, humidity: 'medium' } },
  { id: 'vegetative', name: 'Vegetative', duration: 30, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 18, tempMax: 30, rainfallMin: 500, rainfallMax: 800, humidity: 'medium' } },
  { id: 'tasseling', name: 'Tasseling', duration: 8, criticalFactors: ['temperature'], idealConditions: { tempMin: 20, tempMax: 30, rainfallMin: 400, rainfallMax: 700, humidity: 'medium' } },
  { id: 'silking', name: 'Silking', duration: 7, criticalFactors: ['temperature'], idealConditions: { tempMin: 20, tempMax: 30, rainfallMin: 400, rainfallMax: 700, humidity: 'medium' } },
  { id: 'grain-filling', name: 'Grain Filling', duration: 20, criticalFactors: ['temperature'], idealConditions: { tempMin: 18, tempMax: 28, rainfallMin: 300, rainfallMax: 600, humidity: 'low' } },
  { id: 'maturity', name: 'Maturity', duration: 10, criticalFactors: ['temperature'], idealConditions: { tempMin: 18, tempMax: 28, rainfallMin: 200, rainfallMax: 400, humidity: 'low' } }
];

export const maizeCheckInQuestions: ChecklistItem[] = [
  { id: 'maize-water', question: 'Are leaves curling inward during the day?', category: 'water', riskWeight: 9 },
  { id: 'maize-pest', question: 'Is there damage in the central whorl (Fall Armyworm)?', category: 'pest', riskWeight: 10 },
  { id: 'maize-pest-2', question: 'Are silks being eaten?', category: 'pest', riskWeight: 8 },
  { id: 'maize-health', question: 'Are lower leaves yellowing?', category: 'nutrient', riskWeight: 6 }
];

export const maizeRiskAssessment = {
    commonRisks: [
        { type: 'Fall Armyworm', impact: 'Critical', mitigation: 'Regular scouting and early pesticide application.' },
        { type: 'Nitrogen Deficiency', impact: 'Moderate', mitigation: 'Split-apply nitrogen fertilizers for better uptake.' }
    ],
    analysis: "Maize requires significant nutrient management. Pests like Fall Armyworm can devastate entire fields if not caught early."
};
