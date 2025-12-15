import { CropStage, ChecklistItem } from '../types/crop';

export const cropTypes = [
  'Rice',
  'Wheat',
  'Maize',
  'Barley',
  'Soybean',
  'Cotton',
  'Sugarcane',
  'Potato',
  'Tomato',
  'Onion',
  'Sorghum',
  'Millet',
  'Peanut',
  'Sunflower',
  'Rapeseed',
  'Chickpea',
  'Lentil',
  'Mustard',
  'Groundnut',
  'Beans',
];

export const cropStages: Record<string, CropStage[]> = {
  Rice: [
    { id: 'germination', name: 'Germination', duration: 10, criticalFactors: ['water', 'temperature'], idealConditions: { tempMin: 20, tempMax: 35, rainfall: 'moderate', humidity: 'high' } },
    { id: 'seedling', name: 'Seedling', duration: 15, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 22, tempMax: 32, rainfall: 'moderate', humidity: 'high' } },
    { id: 'tillering', name: 'Tillering', duration: 20, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'high' } },
    { id: 'panicle', name: 'Panicle Initiation', duration: 15, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 22, tempMax: 30, rainfall: 'moderate', humidity: 'high' } },
    { id: 'flowering', name: 'Flowering', duration: 10, criticalFactors: ['water', 'temperature'], idealConditions: { tempMin: 24, tempMax: 32, rainfall: 'low', humidity: 'medium' } },
    { id: 'grain-filling', name: 'Grain Filling', duration: 15, criticalFactors: ['water', 'temperature'], idealConditions: { tempMin: 22, tempMax: 30, rainfall: 'low', humidity: 'medium' } },
    { id: 'maturity', name: 'Maturity', duration: 10, criticalFactors: ['water'], idealConditions: { tempMin: 20, tempMax: 28, rainfall: 'low', humidity: 'low' } },
  ],
  Wheat: [
    { id: 'germination', name: 'Germination', duration: 8, criticalFactors: ['water', 'temperature'], idealConditions: { tempMin: 12, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'seedling', name: 'Seedling', duration: 12, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 14, tempMax: 22, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'tillering', name: 'Tillering', duration: 18, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 15, tempMax: 22, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'stem-elongation', name: 'Stem Elongation', duration: 15, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 16, tempMax: 22, rainfall: 'low', humidity: 'medium' } },
    { id: 'booting', name: 'Booting', duration: 10, criticalFactors: ['water', 'temperature'], idealConditions: { tempMin: 16, tempMax: 22, rainfall: 'low', humidity: 'medium' } },
    { id: 'heading', name: 'Heading', duration: 8, criticalFactors: ['water', 'temperature'], idealConditions: { tempMin: 16, tempMax: 22, rainfall: 'low', humidity: 'medium' } },
    { id: 'flowering', name: 'Flowering', duration: 7, criticalFactors: ['water', 'temperature'], idealConditions: { tempMin: 16, tempMax: 22, rainfall: 'low', humidity: 'medium' } },
    { id: 'grain-filling', name: 'Grain Filling', duration: 15, criticalFactors: ['water', 'temperature'], idealConditions: { tempMin: 18, tempMax: 25, rainfall: 'low', humidity: 'low' } },
    { id: 'maturity', name: 'Maturity', duration: 10, criticalFactors: ['water'], idealConditions: { tempMin: 18, tempMax: 25, rainfall: 'low', humidity: 'low' } },
  ],
  Maize: [
    { id: 'germination', name: 'Germination', duration: 7, criticalFactors: ['water', 'temperature'], idealConditions: { tempMin: 18, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'seedling', name: 'Seedling', duration: 14, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 20, tempMax: 28, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'vegetative', name: 'Vegetative', duration: 30, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 20, tempMax: 28, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'tasseling', name: 'Tasseling', duration: 10, criticalFactors: ['water', 'temperature'], idealConditions: { tempMin: 22, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'silking', name: 'Silking', duration: 8, criticalFactors: ['water', 'temperature'], idealConditions: { tempMin: 22, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'grain-filling', name: 'Grain Filling', duration: 20, criticalFactors: ['water', 'temperature'], idealConditions: { tempMin: 22, tempMax: 30, rainfall: 'low', humidity: 'medium' } },
    { id: 'maturity', name: 'Maturity', duration: 10, criticalFactors: ['water'], idealConditions: { tempMin: 20, tempMax: 28, rainfall: 'low', humidity: 'low' } },
  ],
  Barley: [
    { id: 'germination', name: 'Germination', duration: 7, criticalFactors: ['soil moisture', 'temperature'], idealConditions: { tempMin: 5, tempMax: 15, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'seedling', name: 'Seedling', duration: 14, criticalFactors: ['water', 'nutrients'], idealConditions: { tempMin: 10, tempMax: 20, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'tillering', name: 'Tillering', duration: 21, criticalFactors: ['nitrogen', 'water'], idealConditions: { tempMin: 10, tempMax: 20, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'stem-elongation', name: 'Stem Elongation', duration: 14, criticalFactors: ['temperature', 'pests'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'low', humidity: 'medium' } },
    { id: 'heading', name: 'Heading', duration: 7, criticalFactors: ['water', 'disease'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'low', humidity: 'medium' } },
    { id: 'flowering', name: 'Flowering', duration: 7, criticalFactors: ['pollination', 'temperature'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'low', humidity: 'medium' } },
    { id: 'grain-filling', name: 'Grain Filling', duration: 28, criticalFactors: ['water', 'nutrients'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'low', humidity: 'low' } },
    { id: 'maturity', name: 'Maturity', duration: 14, criticalFactors: ['dry conditions'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'low', humidity: 'low' } }
  ],
  Soybean: [
    { id: 'germination', name: 'Germination', duration: 8, criticalFactors: ['soil moisture', 'temperature'], idealConditions: { tempMin: 15, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'seedling', name: 'Seedling', duration: 14, criticalFactors: ['water', 'light'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'vegetative', name: 'Vegetative', duration: 35, criticalFactors: ['nitrogen', 'pests'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'flowering', name: 'Flowering', duration: 14, criticalFactors: ['pollination', 'water'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'pod-development', name: 'Pod Development', duration: 21, criticalFactors: ['nutrients', 'temperature'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'pod-filling', name: 'Pod Filling', duration: 28, criticalFactors: ['water', 'disease'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'low', humidity: 'medium' } },
    { id: 'maturity', name: 'Maturity', duration: 14, criticalFactors: ['dry conditions'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'low', humidity: 'low' } }
  ],
  Cotton: [
    { id: 'germination', name: 'Germination', duration: 7, criticalFactors: ['soil moisture', 'temperature'], idealConditions: { tempMin: 15, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'seedling', name: 'Seedling', duration: 14, criticalFactors: ['water', 'nutrients'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'squaring', name: 'Squaring', duration: 21, criticalFactors: ['temperature', 'pests'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'flowering', name: 'Flowering', duration: 28, criticalFactors: ['pollination', 'water'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'boll-development', name: 'Boll Development', duration: 35, criticalFactors: ['nutrients', 'disease'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'boll-opening', name: 'Boll Opening', duration: 21, criticalFactors: ['dry conditions'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'low', humidity: 'low' } },
    { id: 'maturity', name: 'Maturity', duration: 14, criticalFactors: ['harvest timing'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'low', humidity: 'low' } }
  ],
  Sugarcane: [
    { id: 'germination', name: 'Germination', duration: 10, criticalFactors: ['soil moisture', 'temperature'], idealConditions: { tempMin: 20, tempMax: 35, rainfall: 'high', humidity: 'high' } },
    { id: 'seedling', name: 'Seedling', duration: 30, criticalFactors: ['water', 'nutrients'], idealConditions: { tempMin: 25, tempMax: 35, rainfall: 'high', humidity: 'high' } },
    { id: 'tillering', name: 'Tillering', duration: 60, criticalFactors: ['nitrogen', 'pests'], idealConditions: { tempMin: 25, tempMax: 35, rainfall: 'high', humidity: 'high' } },
    { id: 'grand-growth', name: 'Grand Growth', duration: 90, criticalFactors: ['water', 'temperature'], idealConditions: { tempMin: 25, tempMax: 35, rainfall: 'moderate', humidity: 'high' } },
    { id: 'maturity', name: 'Maturity', duration: 30, criticalFactors: ['dry conditions'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'low', humidity: 'medium' } }
  ],
  Potato: [
    { id: 'germination', name: 'Germination', duration: 14, criticalFactors: ['soil moisture', 'temperature'], idealConditions: { tempMin: 7, tempMax: 20, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'seedling', name: 'Seedling', duration: 21, criticalFactors: ['water', 'light'], idealConditions: { tempMin: 10, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'tuber-initiation', name: 'Tuber Initiation', duration: 14, criticalFactors: ['nutrients', 'temperature'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'tuber-bulking', name: 'Tuber Bulking', duration: 35, criticalFactors: ['water', 'disease'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'maturity', name: 'Maturity', duration: 21, criticalFactors: ['dry conditions'], idealConditions: { tempMin: 10, tempMax: 20, rainfall: 'low', humidity: 'low' } }
  ],
  Tomato: [
    { id: 'germination', name: 'Germination', duration: 7, criticalFactors: ['soil moisture', 'temperature'], idealConditions: { tempMin: 15, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'seedling', name: 'Seedling', duration: 14, criticalFactors: ['water', 'light'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'vegetative', name: 'Vegetative', duration: 21, criticalFactors: ['nutrients', 'pests'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'flowering', name: 'Flowering', duration: 14, criticalFactors: ['pollination', 'temperature'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'fruit-set', name: 'Fruit Set', duration: 21, criticalFactors: ['water', 'disease'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'fruit-development', name: 'Fruit Development', duration: 28, criticalFactors: ['nutrients'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'maturity', name: 'Maturity', duration: 14, criticalFactors: ['harvest timing'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'low', humidity: 'low' } }
  ],
  Onion: [
    { id: 'germination', name: 'Germination', duration: 10, criticalFactors: ['soil moisture', 'temperature'], idealConditions: { tempMin: 10, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'seedling', name: 'Seedling', duration: 21, criticalFactors: ['water', 'light'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'bulb-initiation', name: 'Bulb Initiation', duration: 14, criticalFactors: ['day length', 'temperature'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'bulb-growth', name: 'Bulb Growth', duration: 35, criticalFactors: ['water', 'nutrients'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'maturity', name: 'Maturity', duration: 21, criticalFactors: ['dry conditions'], idealConditions: { tempMin: 10, tempMax: 20, rainfall: 'low', humidity: 'low' } }
  ],
  Sorghum: [
    { id: 'germination', name: 'Germination', duration: 7, criticalFactors: ['soil moisture', 'temperature'], idealConditions: { tempMin: 15, tempMax: 35, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'seedling', name: 'Seedling', duration: 14, criticalFactors: ['water', 'nutrients'], idealConditions: { tempMin: 20, tempMax: 35, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'vegetative', name: 'Vegetative', duration: 30, criticalFactors: ['nitrogen', 'pests'], idealConditions: { tempMin: 25, tempMax: 35, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'panicle-emergence', name: 'Panicle Emergence', duration: 14, criticalFactors: ['temperature', 'water'], idealConditions: { tempMin: 25, tempMax: 35, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'flowering', name: 'Flowering', duration: 7, criticalFactors: ['pollination'], idealConditions: { tempMin: 25, tempMax: 35, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'grain-filling', name: 'Grain Filling', duration: 28, criticalFactors: ['water', 'disease'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'low', humidity: 'medium' } },
    { id: 'maturity', name: 'Maturity', duration: 14, criticalFactors: ['dry conditions'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'low', humidity: 'low' } }
  ],
  Millet: [
    { id: 'germination', name: 'Germination', duration: 5, criticalFactors: ['soil moisture', 'temperature'], idealConditions: { tempMin: 15, tempMax: 35, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'seedling', name: 'Seedling', duration: 10, criticalFactors: ['water', 'light'], idealConditions: { tempMin: 20, tempMax: 35, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'vegetative', name: 'Vegetative', duration: 25, criticalFactors: ['nutrients', 'pests'], idealConditions: { tempMin: 25, tempMax: 35, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'heading', name: 'Heading', duration: 10, criticalFactors: ['temperature', 'water'], idealConditions: { tempMin: 25, tempMax: 35, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'flowering', name: 'Flowering', duration: 7, criticalFactors: ['pollination'], idealConditions: { tempMin: 25, tempMax: 35, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'grain-filling', name: 'Grain Filling', duration: 20, criticalFactors: ['water', 'disease'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'low', humidity: 'medium' } },
    { id: 'maturity', name: 'Maturity', duration: 10, criticalFactors: ['dry conditions'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'low', humidity: 'low' } }
  ],
  Peanut: [
    { id: 'germination', name: 'Germination', duration: 7, criticalFactors: ['soil moisture', 'temperature'], idealConditions: { tempMin: 20, tempMax: 35, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'seedling', name: 'Seedling', duration: 14, criticalFactors: ['water', 'nutrients'], idealConditions: { tempMin: 25, tempMax: 35, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'vegetative', name: 'Vegetative', duration: 30, criticalFactors: ['nitrogen', 'pests'], idealConditions: { tempMin: 25, tempMax: 35, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'flowering', name: 'Flowering', duration: 14, criticalFactors: ['pollination', 'temperature'], idealConditions: { tempMin: 25, tempMax: 35, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'pod-development', name: 'Pod Development', duration: 35, criticalFactors: ['water', 'calcium'], idealConditions: { tempMin: 25, tempMax: 35, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'maturity', name: 'Maturity', duration: 21, criticalFactors: ['dry conditions'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'low', humidity: 'low' } }
  ],
  Sunflower: [
    { id: 'germination', name: 'Germination', duration: 7, criticalFactors: ['soil moisture', 'temperature'], idealConditions: { tempMin: 10, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'seedling', name: 'Seedling', duration: 14, criticalFactors: ['water', 'light'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'vegetative', name: 'Vegetative', duration: 30, criticalFactors: ['nutrients', 'pests'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'bud-formation', name: 'Bud Formation', duration: 14, criticalFactors: ['temperature', 'day length'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'flowering', name: 'Flowering', duration: 14, criticalFactors: ['pollination', 'water'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'seed-filling', name: 'Seed Filling', duration: 28, criticalFactors: ['nutrients', 'disease'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'low', humidity: 'medium' } },
    { id: 'maturity', name: 'Maturity', duration: 14, criticalFactors: ['dry conditions'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'low', humidity: 'low' } }
  ],
  Rapeseed: [
    { id: 'germination', name: 'Germination', duration: 7, criticalFactors: ['soil moisture', 'temperature'], idealConditions: { tempMin: 5, tempMax: 20, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'seedling', name: 'Seedling', duration: 14, criticalFactors: ['water', 'nutrients'], idealConditions: { tempMin: 10, tempMax: 20, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'rosette', name: 'Rosette', duration: 30, criticalFactors: ['cold tolerance', 'pests'], idealConditions: { tempMin: 5, tempMax: 15, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'bolting', name: 'Bolting', duration: 14, criticalFactors: ['temperature', 'day length'], idealConditions: { tempMin: 10, tempMax: 20, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'flowering', name: 'Flowering', duration: 21, criticalFactors: ['pollination', 'water'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'pod-development', name: 'Pod Development', duration: 28, criticalFactors: ['nutrients', 'disease'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'low', humidity: 'medium' } },
    { id: 'maturity', name: 'Maturity', duration: 14, criticalFactors: ['dry conditions'], idealConditions: { tempMin: 10, tempMax: 20, rainfall: 'low', humidity: 'low' } }
  ],
  Chickpea: [
    { id: 'germination', name: 'Germination', duration: 7, criticalFactors: ['soil moisture', 'temperature'], idealConditions: { tempMin: 10, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'seedling', name: 'Seedling', duration: 14, criticalFactors: ['water', 'nutrients'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'vegetative', name: 'Vegetative', duration: 30, criticalFactors: ['nitrogen', 'pests'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'flowering', name: 'Flowering', duration: 14, criticalFactors: ['pollination', 'temperature'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'pod-development', name: 'Pod Development', duration: 35, criticalFactors: ['water', 'disease'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'maturity', name: 'Maturity', duration: 21, criticalFactors: ['dry conditions'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'low', humidity: 'low' } }
  ],
  Lentil: [
    { id: 'germination', name: 'Germination', duration: 7, criticalFactors: ['soil moisture', 'temperature'], idealConditions: { tempMin: 5, tempMax: 20, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'seedling', name: 'Seedling', duration: 14, criticalFactors: ['water', 'nutrients'], idealConditions: { tempMin: 10, tempMax: 20, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'vegetative', name: 'Vegetative', duration: 25, criticalFactors: ['nitrogen', 'pests'], idealConditions: { tempMin: 10, tempMax: 20, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'flowering', name: 'Flowering', duration: 14, criticalFactors: ['pollination', 'temperature'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'pod-development', name: 'Pod Development', duration: 21, criticalFactors: ['water', 'disease'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'maturity', name: 'Maturity', duration: 14, criticalFactors: ['dry conditions'], idealConditions: { tempMin: 10, tempMax: 20, rainfall: 'low', humidity: 'low' } }
  ],
  Mustard: [
    { id: 'germination', name: 'Germination', duration: 7, criticalFactors: ['soil moisture', 'temperature'], idealConditions: { tempMin: 10, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'seedling', name: 'Seedling', duration: 14, criticalFactors: ['water', 'nutrients'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'vegetative', name: 'Vegetative', duration: 30, criticalFactors: ['nitrogen', 'pests'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'flowering', name: 'Flowering', duration: 14, criticalFactors: ['pollination', 'temperature'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'pod-development', name: 'Pod Development', duration: 21, criticalFactors: ['water', 'disease'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'maturity', name: 'Maturity', duration: 14, criticalFactors: ['dry conditions'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'low', humidity: 'low' } }
  ],
  Groundnut: [
    { id: 'germination', name: 'Germination', duration: 7, criticalFactors: ['soil moisture', 'temperature'], idealConditions: { tempMin: 20, tempMax: 35, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'seedling', name: 'Seedling', duration: 14, criticalFactors: ['water', 'nutrients'], idealConditions: { tempMin: 25, tempMax: 35, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'vegetative', name: 'Vegetative', duration: 30, criticalFactors: ['nitrogen', 'pests'], idealConditions: { tempMin: 25, tempMax: 35, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'flowering', name: 'Flowering', duration: 14, criticalFactors: ['pollination', 'temperature'], idealConditions: { tempMin: 25, tempMax: 35, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'pod-development', name: 'Pod Development', duration: 35, criticalFactors: ['water', 'calcium'], idealConditions: { tempMin: 25, tempMax: 35, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'maturity', name: 'Maturity', duration: 21, criticalFactors: ['dry conditions'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'low', humidity: 'low' } }
  ],
  Beans: [
    { id: 'germination', name: 'Germination', duration: 7, criticalFactors: ['soil moisture', 'temperature'], idealConditions: { tempMin: 15, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'seedling', name: 'Seedling', duration: 14, criticalFactors: ['water', 'light'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'vegetative', name: 'Vegetative', duration: 21, criticalFactors: ['nitrogen', 'pests'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'flowering', name: 'Flowering', duration: 14, criticalFactors: ['pollination', 'temperature'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'pod-development', name: 'Pod Development', duration: 21, criticalFactors: ['water', 'disease'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'moderate', humidity: 'medium' } },
    { id: 'pod-filling', name: 'Pod Filling', duration: 21, criticalFactors: ['nutrients'], idealConditions: { tempMin: 20, tempMax: 30, rainfall: 'low', humidity: 'medium' } },
    { id: 'maturity', name: 'Maturity', duration: 14, criticalFactors: ['dry conditions'], idealConditions: { tempMin: 15, tempMax: 25, rainfall: 'low', humidity: 'low' } }
  ],
};

export const checkInQuestions: ChecklistItem[] = [
  // Pest Management
  {
    id: 'pest-1',
    question: 'Have you noticed any unusual insect activity on leaves or stems?',
    category: 'pest',
    riskWeight: 8
  },
  {
    id: 'pest-2',
    question: 'Are there visible holes or damage on plant leaves?',
    category: 'pest',
    riskWeight: 7
  },
  {
    id: 'pest-3',
    question: 'Have you seen any caterpillars or larvae on the crop?',
    category: 'pest',
    riskWeight: 6
  },
  
  // Disease
  {
    id: 'disease-1',
    question: 'Are there any yellow or brown spots on the leaves?',
    category: 'disease',
    riskWeight: 9
  },
  {
    id: 'disease-2',
    question: 'Do you see any wilting or drooping of plants despite adequate water?',
    category: 'disease',
    riskWeight: 8
  },
  {
    id: 'disease-3',
    question: 'Is there any white powdery substance or mold on leaves?',
    category: 'disease',
    riskWeight: 7
  },
  {
    id: 'disease-4',
    question: 'Are there any rotting symptoms on stems or roots?',
    category: 'disease',
    riskWeight: 9
  },
  
  // Water Management
  {
    id: 'water-1',
    question: 'Is the soil too dry or cracked?',
    category: 'water',
    riskWeight: 8
  },
  {
    id: 'water-2',
    question: 'Is there waterlogging or standing water in the field?',
    category: 'water',
    riskWeight: 7
  },
  {
    id: 'water-3',
    question: 'Are irrigation channels or systems working properly?',
    category: 'water',
    riskWeight: 5
  },
  
  // Nutrient/Growth
  {
    id: 'nutrient-1',
    question: 'Are the leaves yellowing from the bottom up?',
    category: 'nutrient',
    riskWeight: 6
  },
  {
    id: 'nutrient-2',
    question: 'Is plant growth slower than expected for this stage?',
    category: 'nutrient',
    riskWeight: 7
  },
  {
    id: 'nutrient-3',
    question: 'Are leaves smaller or paler than normal?',
    category: 'nutrient',
    riskWeight: 6
  },
  
  // Growth Stage
  {
    id: 'growth-1',
    question: 'Is the crop developing at the expected rate?',
    category: 'growth',
    riskWeight: 5
  },
  {
    id: 'growth-2',
    question: 'Are there any plants that are significantly stunted?',
    category: 'growth',
    riskWeight: 7
  },
  
  // Weather Impact
  {
    id: 'weather-1',
    question: 'Has there been extreme heat (>35°C) in the past week?',
    category: 'weather',
    riskWeight: 8
  },
  {
    id: 'weather-2',
    question: 'Has there been heavy rainfall causing damage?',
    category: 'weather',
    riskWeight: 7
  },
  {
    id: 'weather-3',
    question: 'Has there been unexpected frost or cold?',
    category: 'weather',
    riskWeight: 9
  }
];
