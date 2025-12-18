import { CropStage, ChecklistItem } from '../types/crop';

export const cropTypes = [
  'Rice',
  'Wheat',
  'Maize'
];

export const cropStages: Record<string, CropStage[]> = {
  Rice: [
    { id: 'germination', name: 'Germination', duration: 7, criticalFactors: ['water', 'temperature'], idealConditions: { tempMin: 10, tempMax: 32, rainfallMin: 1000, rainfallMax: 1500, humidity: 'high' } },
    { id: 'seedling', name: 'Seedling', duration: 14, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 16, tempMax: 30, rainfallMin: 1000, rainfallMax: 1500, humidity: 'high' } },
    { id: 'tillering', name: 'Tillering', duration: 20, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 18, tempMax: 32, rainfallMin: 1000, rainfallMax: 1500, humidity: 'high' } },
    { id: 'panicle-initiation', name: 'Panicle Initiation', duration: 15, criticalFactors: ['water'], idealConditions: { tempMin: 20, tempMax: 32, rainfallMin: 1000, rainfallMax: 1500, humidity: 'high' } },
    { id: 'flowering', name: 'Flowering', duration: 10, criticalFactors: ['temperature', 'water'], idealConditions: { tempMin: 22, tempMax: 30, rainfallMin: 800, rainfallMax: 1200, humidity: 'medium' } },
    { id: 'grain-filling', name: 'Grain Filling', duration: 15, criticalFactors: ['temperature'], idealConditions: { tempMin: 20, tempMax: 30, rainfallMin: 600, rainfallMax: 1000, humidity: 'medium' } },
    { id: 'maturity', name: 'Maturity', duration: 10, criticalFactors: ['temperature'], idealConditions: { tempMin: 18, tempMax: 28, rainfallMin: 400, rainfallMax: 800, humidity: 'low' } }
  ],

  Wheat: [
    { id: 'germination', name: 'Germination', duration: 6, criticalFactors: ['temperature', 'water'], idealConditions: { tempMin: 4, tempMax: 25, rainfallMin: 500, rainfallMax: 800, humidity: 'medium' } },
    { id: 'seedling', name: 'Seedling', duration: 10, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 10, tempMax: 22, rainfallMin: 500, rainfallMax: 800, humidity: 'medium' } },
    { id: 'tillering', name: 'Tillering', duration: 15, criticalFactors: ['water'], idealConditions: { tempMin: 12, tempMax: 22, rainfallMin: 500, rainfallMax: 800, humidity: 'medium' } },
    { id: 'stem-elongation', name: 'Stem Elongation', duration: 15, criticalFactors: ['nutrient'], idealConditions: { tempMin: 15, tempMax: 22, rainfallMin: 400, rainfallMax: 700, humidity: 'medium' } },
    { id: 'booting', name: 'Booting', duration: 8, criticalFactors: ['temperature'], idealConditions: { tempMin: 15, tempMax: 22, rainfallMin: 400, rainfallMax: 700, humidity: 'medium' } },
    { id: 'heading', name: 'Heading', duration: 7, criticalFactors: ['temperature'], idealConditions: { tempMin: 15, tempMax: 22, rainfallMin: 350, rainfallMax: 650, humidity: 'medium' } },
    { id: 'flowering', name: 'Flowering', duration: 7, criticalFactors: ['temperature'], idealConditions: { tempMin: 15, tempMax: 22, rainfallMin: 350, rainfallMax: 650, humidity: 'low' } },
    { id: 'grain-filling', name: 'Grain Filling', duration: 14, criticalFactors: ['temperature'], idealConditions: { tempMin: 14, tempMax: 20, rainfallMin: 300, rainfallMax: 600, humidity: 'low' } },
    { id: 'maturity', name: 'Maturity', duration: 10, criticalFactors: ['temperature'], idealConditions: { tempMin: 12, tempMax: 18, rainfallMin: 200, rainfallMax: 400, humidity: 'low' } }
  ],

  Maize: [
    { id: 'germination', name: 'Germination', duration: 5, criticalFactors: ['temperature', 'water'], idealConditions: { tempMin: 8, tempMax: 30, rainfallMin: 500, rainfallMax: 800, humidity: 'medium' } },
    { id: 'seedling', name: 'Seedling', duration: 12, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 15, tempMax: 28, rainfallMin: 500, rainfallMax: 800, humidity: 'medium' } },
    { id: 'vegetative', name: 'Vegetative', duration: 30, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 18, tempMax: 30, rainfallMin: 500, rainfallMax: 800, humidity: 'medium' } },
    { id: 'tasseling', name: 'Tasseling', duration: 8, criticalFactors: ['temperature'], idealConditions: { tempMin: 20, tempMax: 30, rainfallMin: 400, rainfallMax: 700, humidity: 'medium' } },
    { id: 'silking', name: 'Silking', duration: 7, criticalFactors: ['temperature'], idealConditions: { tempMin: 20, tempMax: 30, rainfallMin: 400, rainfallMax: 700, humidity: 'medium' } },
    { id: 'grain-filling', name: 'Grain Filling', duration: 20, criticalFactors: ['temperature'], idealConditions: { tempMin: 18, tempMax: 28, rainfallMin: 300, rainfallMax: 600, humidity: 'low' } },
    { id: 'maturity', name: 'Maturity', duration: 10, criticalFactors: ['temperature'], idealConditions: { tempMin: 18, tempMax: 28, rainfallMin: 200, rainfallMax: 400, humidity: 'low' } }
  ]
};

// Simplified Checklist (MVP Strategy)
// Only critical questions that a farmer can easily answer.
export const checkInQuestions: Record<string, ChecklistItem[]> = {
  Rice: [
    { id: 'rice-water', question: 'Is the field completely dry? (Should be flooded)', category: 'water', riskWeight: 9 },
    { id: 'rice-pest-1', question: 'Do you see dead hearts (dried central shoots)?', category: 'pest', riskWeight: 8 },
    { id: 'rice-pest-2', question: 'Are leaf tips turning yellow or brown?', category: 'disease', riskWeight: 7 },
    { id: 'rice-health', question: 'Does the crop look pale or yellowish?', category: 'nutrient', riskWeight: 6 }
  ],
  
  Wheat: [
    { id: 'wheat-water', question: 's soil moisture very low? (Dry 10cm deep)', category: 'water', riskWeight: 9 },
    { id: 'wheat-pest', question: 'Are there yellow stripes or rust powder on leaves?', category: 'disease', riskWeight: 9 },
    { id: 'wheat-temp', question: 'Is the temperature unusually hot?', category: 'weather', riskWeight: 8 },
    { id: 'wheat-health', question: 'Are plants shorter than normal?', category: 'growth', riskWeight: 6 }
  ],
  
  Maize: [
    { id: 'maize-water', question: 'Are leaves curling inward during the day?', category: 'water', riskWeight: 9 },
    { id: 'maize-pest', question: 'Is there damage in the central whorl (Fall Armyworm)?', category: 'pest', riskWeight: 10 },
    { id: 'maize-pest-2', question: 'Are silks being eaten?', category: 'pest', riskWeight: 8 },
    { id: 'maize-health', question: 'Are lower leaves yellowing?', category: 'nutrient', riskWeight: 6 }
  ]
};