import { CropStage, ChecklistItem } from '../../types/crop';

export const wheatStages: CropStage[] = [
  { id: 'germination', name: 'Germination', duration: 6, criticalFactors: ['temperature', 'water'], idealConditions: { tempMin: 4, tempMax: 25, rainfallMin: 500, rainfallMax: 800, humidity: 'medium' } },
  { id: 'seedling', name: 'Seedling', duration: 10, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 10, tempMax: 22, rainfallMin: 500, rainfallMax: 800, humidity: 'medium' } },
  { id: 'tillering', name: 'Tillering', duration: 15, criticalFactors: ['water'], idealConditions: { tempMin: 12, tempMax: 22, rainfallMin: 500, rainfallMax: 800, humidity: 'medium' } },
  { id: 'stem-elongation', name: 'Stem Elongation', duration: 15, criticalFactors: ['nutrient'], idealConditions: { tempMin: 15, tempMax: 22, rainfallMin: 400, rainfallMax: 700, humidity: 'medium' } },
  { id: 'booting', name: 'Booting', duration: 8, criticalFactors: ['temperature'], idealConditions: { tempMin: 15, tempMax: 22, rainfallMin: 400, rainfallMax: 700, humidity: 'medium' } },
  { id: 'heading', name: 'Heading', duration: 7, criticalFactors: ['temperature'], idealConditions: { tempMin: 15, tempMax: 22, rainfallMin: 350, rainfallMax: 650, humidity: 'medium' } },
  { id: 'flowering', name: 'Flowering', duration: 7, criticalFactors: ['temperature'], idealConditions: { tempMin: 15, tempMax: 22, rainfallMin: 350, rainfallMax: 650, humidity: 'low' } },
  { id: 'grain-filling', name: 'Grain Filling', duration: 14, criticalFactors: ['temperature'], idealConditions: { tempMin: 14, tempMax: 20, rainfallMin: 300, rainfallMax: 600, humidity: 'low' } },
  { id: 'maturity', name: 'Maturity', duration: 10, criticalFactors: ['temperature'], idealConditions: { tempMin: 12, tempMax: 18, rainfallMin: 200, rainfallMax: 400, humidity: 'low' } }
];

export const wheatCheckInQuestions: ChecklistItem[] = [
  { id: 'wheat-water', question: 'Is soil moisture very low? (Dry 10cm deep)', category: 'water', riskWeight: 9 },
  { id: 'wheat-pest', question: 'Are there yellow stripes or rust powder on leaves?', category: 'disease', riskWeight: 9 },
  { id: 'wheat-temp', question: 'Is the temperature unusually hot?', category: 'weather', riskWeight: 8 },
  { id: 'wheat-health', question: 'Are plants shorter than normal?', category: 'growth', riskWeight: 6 }
];

export const wheatRiskAssessment = {
    commonRisks: [
        { type: 'Heat Stress', impact: 'High', mitigation: 'Early sowing and selection of heat-tolerant varieties.' },
        { type: 'Rust Disease', impact: 'High', mitigation: 'Apply fungicides early if yellow rust is spotted.' }
    ],
    analysis: "Wheat yields are heavily impacted by terminal heat stress. Monitoring temperature trends during the grain-filling stage is critical."
};
