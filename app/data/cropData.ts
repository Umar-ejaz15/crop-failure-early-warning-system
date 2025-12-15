import { CropStage, ChecklistItem } from '../types/crop';

export const cropTypes = [
  'Rice',
  'Wheat',
  'Maize'
  
];

export const cropStages: Record<string, CropStage[]> = {
  Rice: [
    { id: 'germination', name: 'Germination', duration: 7, criticalFactors: ['water', 'temperature'], idealConditions: { tempMin: 10, tempMax: 32, rainfallMin: 1000, rainfallMax: 1500, humidity: 'high' } }, // rice needs high rainfall ~100-150 cm annually :contentReference[oaicite:1]{index=1}
    { id: 'seedling', name: 'Seedling', duration: 14, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 16, tempMax: 30, rainfallMin: 1000, rainfallMax: 1500, humidity: 'high' } },
    { id: 'tillering', name: 'Tillering', duration: 20, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 18, tempMax: 32, rainfallMin: 1000, rainfallMax: 1500, humidity: 'high' } },
    { id: 'panicle-initiation', name: 'Panicle Initiation', duration: 15, criticalFactors: ['water'], idealConditions: { tempMin: 20, tempMax: 32, rainfallMin: 1000, rainfallMax: 1500, humidity: 'high' } },
    { id: 'flowering', name: 'Flowering', duration: 10, criticalFactors: ['temperature', 'water'], idealConditions: { tempMin: 22, tempMax: 30, rainfallMin: 800, rainfallMax: 1200, humidity: 'medium' } },
    { id: 'grain-filling', name: 'Grain Filling', duration: 15, criticalFactors: ['temperature'], idealConditions: { tempMin: 20, tempMax: 30, rainfallMin: 600, rainfallMax: 1000, humidity: 'medium' } },
    { id: 'maturity', name: 'Maturity', duration: 10, criticalFactors: ['temperature'], idealConditions: { tempMin: 18, tempMax: 28, rainfallMin: 400, rainfallMax: 800, humidity: 'low' } }
  ],

  Wheat: [
    { id: 'germination', name: 'Germination', duration: 6, criticalFactors: ['temperature', 'water'], idealConditions: { tempMin: 4, tempMax: 25, rainfallMin: 500, rainfallMax: 800, humidity: 'medium' } }, // wheat optimal ~15-20°C range :contentReference[oaicite:2]{index=2}
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
    { id: 'germination', name: 'Germination', duration: 5, criticalFactors: ['temperature', 'water'], idealConditions: { tempMin: 8, tempMax: 30, rainfallMin: 500, rainfallMax: 800, humidity: 'medium' } }, // maize tolerant wide range :contentReference[oaicite:3]{index=3}
    { id: 'seedling', name: 'Seedling', duration: 12, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 15, tempMax: 28, rainfallMin: 500, rainfallMax: 800, humidity: 'medium' } },
    { id: 'vegetative', name: 'Vegetative', duration: 30, criticalFactors: ['water', 'nutrient'], idealConditions: { tempMin: 18, tempMax: 30, rainfallMin: 500, rainfallMax: 800, humidity: 'medium' } },
    { id: 'tasseling', name: 'Tasseling', duration: 8, criticalFactors: ['temperature'], idealConditions: { tempMin: 20, tempMax: 30, rainfallMin: 400, rainfallMax: 700, humidity: 'medium' } },
    { id: 'silking', name: 'Silking', duration: 7, criticalFactors: ['temperature'], idealConditions: { tempMin: 20, tempMax: 30, rainfallMin: 400, rainfallMax: 700, humidity: 'medium' } },
    { id: 'grain-filling', name: 'Grain Filling', duration: 20, criticalFactors: ['temperature'], idealConditions: { tempMin: 18, tempMax: 28, rainfallMin: 300, rainfallMax: 600, humidity: 'low' } },
    { id: 'maturity', name: 'Maturity', duration: 10, criticalFactors: ['temperature'], idealConditions: { tempMin: 18, tempMax: 28, rainfallMin: 200, rainfallMax: 400, humidity: 'low' } }
  ]
};


// COMPREHENSIVE QUESTIONS FOR TOP 4 CROPS
// 54+ questions per crop for maximum accuracy
// Risk weights: 10=Critical/Immediate action, 9=Severe, 8=High, 7=Moderate, 6=Low-Moderate

export const checkInQuestions: Record<string, ChecklistItem[]> = {
  Rice: [
    // === PEST (12 questions) ===
    { id: 'rice-pest-1', question: 'Do you see holes or window-like feeding marks on leaves?', category: 'pest', riskWeight: 8 },
    { id: 'rice-pest-2', question: 'Are there small brown insects on lower stems near water?', category: 'pest', riskWeight: 9 },
    { id: 'rice-pest-3', question: 'Do you see leaves rolled/folded with white streaks inside?', category: 'pest', riskWeight: 7 },
    { id: 'rice-pest-4', question: 'Are central shoots of young plants dried and brown (dead hearts)?', category: 'pest', riskWeight: 9 },
    { id: 'rice-pest-5', question: 'Are panicles empty and turning white prematurely (white heads)?', category: 'pest', riskWeight: 10 },
    { id: 'rice-pest-6', question: 'Do you see blue-green beetles making parallel white lines on leaves?', category: 'pest', riskWeight: 7 },
    { id: 'rice-pest-7', question: 'Are there onion-shaped swellings on stems (silver shoots)?', category: 'pest', riskWeight: 8 },
    { id: 'rice-pest-8', question: 'Do you see small green hoppers jumping when you touch plants?', category: 'pest', riskWeight: 8 },
    { id: 'rice-pest-9', question: 'Are there shield-shaped bugs on grain heads?', category: 'pest', riskWeight: 7 },
    { id: 'rice-pest-10', question: 'Is the central leaf yellowing with small larvae visible?', category: 'pest', riskWeight: 7 },
    { id: 'rice-pest-11', question: 'Are there rats or birds damaging more than 5% of crop?', category: 'pest', riskWeight: 8 },
    { id: 'rice-pest-12', question: 'Do you see caterpillars cutting leaves at night?', category: 'pest', riskWeight: 7 },
    
    // === DISEASE (12 questions) ===
    { id: 'rice-disease-1', question: 'Are there diamond/spindle-shaped gray-brown spots on leaves?', category: 'disease', riskWeight: 10 },
    { id: 'rice-disease-2', question: 'Do you see large irregular brown/gray patches on leaf sheaths?', category: 'disease', riskWeight: 9 },
    { id: 'rice-disease-3', question: 'Are plants yellowing with mosaic patterns and stunted growth?', category: 'disease', riskWeight: 9 },
    { id: 'rice-disease-4', question: 'Do leaves have water-soaked lesions turning yellow then brown?', category: 'disease', riskWeight: 9 },
    { id: 'rice-disease-5', question: 'Are there small circular brown spots with yellow halos on leaves?', category: 'disease', riskWeight: 8 },
    { id: 'rice-disease-6', question: 'Is the panicle neck rotting or browning (blast on neck)?', category: 'disease', riskWeight: 10 },
    { id: 'rice-disease-7', question: 'Do grains have yellowish-green balls/powder (false smut)?', category: 'disease', riskWeight: 7 },
    { id: 'rice-disease-8', question: 'Are there narrow brown streaks between leaf veins?', category: 'disease', riskWeight: 7 },
    { id: 'rice-disease-9', question: 'Are seedlings wilting or rotting at the base?', category: 'disease', riskWeight: 8 },
    { id: 'rice-disease-10', question: 'Do you see white powdery growth inside leaf sheaths?', category: 'disease', riskWeight: 7 },
    { id: 'rice-disease-11', question: 'Are roots blackened or rotting (root rot)?', category: 'disease', riskWeight: 8 },
    { id: 'rice-disease-12', question: 'Do leaves show orange-red discoloration (physiological disorder)?', category: 'disease', riskWeight: 6 },
    
    // === WATER (10 questions) ===
    { id: 'rice-water-1', question: 'Is standing water less than 5cm deep in field?', category: 'water', riskWeight: 8 },
    { id: 'rice-water-2', question: 'Is water deeper than 15cm submerging plant parts?', category: 'water', riskWeight: 8 },
    { id: 'rice-water-3', question: 'Are soil cracks visible in the field?', category: 'water', riskWeight: 9 },
    { id: 'rice-water-4', question: 'Has water been stagnant for more than 3 days?', category: 'water', riskWeight: 7 },
    { id: 'rice-water-5', question: 'Has field been completely dry for more than 2 days during growth?', category: 'water', riskWeight: 9 },
    { id: 'rice-water-6', question: 'Does water smell bad or look discolored (poor quality)?', category: 'water', riskWeight: 7 },
    { id: 'rice-water-7', question: 'Are plants wilting despite water in field?', category: 'water', riskWeight: 8 },
    { id: 'rice-water-8', question: 'Is half the field dry while other half is flooded?', category: 'water', riskWeight: 7 },
    { id: 'rice-water-9', question: 'Has there been no water for 5+ days during flowering?', category: 'water', riskWeight: 10 },
    { id: 'rice-water-10', question: 'Is drainage completely blocked causing waterlogging?', category: 'water', riskWeight: 8 },
    
    // === NUTRIENT (12 questions) ===
    { id: 'rice-nutrient-1', question: 'Are lower/older leaves uniformly pale yellow-green?', category: 'nutrient', riskWeight: 8 },
    { id: 'rice-nutrient-2', question: 'Are leaf tips and margins brown, dry, or burnt-looking?', category: 'nutrient', riskWeight: 7 },
    { id: 'rice-nutrient-3', question: 'Are plants very dark green but short and stunted?', category: 'nutrient', riskWeight: 7 },
    { id: 'rice-nutrient-4', question: 'Do leaves show purple or reddish coloration?', category: 'nutrient', riskWeight: 7 },
    { id: 'rice-nutrient-5', question: 'Are younger leaves pale yellow while old leaves stay green?', category: 'nutrient', riskWeight: 6 },
    { id: 'rice-nutrient-6', question: 'Are middle leaves showing brown spots or rusty patches?', category: 'nutrient', riskWeight: 7 },
    { id: 'rice-nutrient-7', question: 'Does each plant have fewer than 10 tillers at maximum tillering?', category: 'nutrient', riskWeight: 8 },
    { id: 'rice-nutrient-8', question: 'Do leaves break easily or feel brittle?', category: 'nutrient', riskWeight: 6 },
    { id: 'rice-nutrient-9', question: 'Are yellow stripes visible between green leaf veins?', category: 'nutrient', riskWeight: 6 },
    { id: 'rice-nutrient-10', question: 'Are more than 30% of grains unfilled or chalky white?', category: 'nutrient', riskWeight: 8 },
    { id: 'rice-nutrient-11', question: 'Are panicles very light with few filled grains?', category: 'nutrient', riskWeight: 8 },
    { id: 'rice-nutrient-12', question: 'Is the field color uneven with yellow and green patches?', category: 'nutrient', riskWeight: 7 },
    
    // === GROWTH (10 questions) ===
    { id: 'rice-growth-1', question: 'Are plants shorter than 60% of expected variety height?', category: 'growth', riskWeight: 7 },
    { id: 'rice-growth-2', question: 'Is tillering less than half the normal count?', category: 'growth', riskWeight: 8 },
    { id: 'rice-growth-3', question: 'Are panicles emerging at different times across the field?', category: 'growth', riskWeight: 7 },
    { id: 'rice-growth-4', question: 'Is less than 50% of field flowering after one week?', category: 'growth', riskWeight: 8 },
    { id: 'rice-growth-5', question: 'Are more than 20% of grains empty or unfilled?', category: 'growth', riskWeight: 8 },
    { id: 'rice-growth-6', question: 'Are panicles shorter than 12cm?', category: 'growth', riskWeight: 7 },
    { id: 'rice-growth-7', question: 'Is grain filling taking more than 25 days?', category: 'growth', riskWeight: 7 },
    { id: 'rice-growth-8', question: 'Are more than 10% of plants fallen/lodged?', category: 'growth', riskWeight: 8 },
    { id: 'rice-growth-9', question: 'Are tillers uneven with some very tall and others short?', category: 'growth', riskWeight: 6 },
    { id: 'rice-growth-10', question: 'Has heading been delayed by more than one week?', category: 'growth', riskWeight: 7 },
    
    // === WEATHER (8 questions) ===
    { id: 'rice-weather-1', question: 'Has it rained continuously for more than 4 days?', category: 'weather', riskWeight: 8 },
    { id: 'rice-weather-2', question: 'Have daily temperatures been above 38°C for 3+ days?', category: 'weather', riskWeight: 9 },
    { id: 'rice-weather-3', question: 'Has there been no rain for more than 2 weeks?', category: 'weather', riskWeight: 8 },
    { id: 'rice-weather-4', question: 'Have strong winds knocked down plants?', category: 'weather', riskWeight: 8 },
    { id: 'rice-weather-5', question: 'Was there hail or storm in the past week?', category: 'weather', riskWeight: 9 },
    { id: 'rice-weather-6', question: 'Are night temperatures below 18°C during flowering?', category: 'weather', riskWeight: 8 },
    { id: 'rice-weather-7', question: 'Did flooding submerge entire plants for more than one day?', category: 'weather', riskWeight: 9 },
    { id: 'rice-weather-8', question: 'Is morning dew staying on leaves past 10 AM daily?', category: 'weather', riskWeight: 6 },
  ],
  
  Wheat: [
    // === PEST (12 questions) ===
    { id: 'wheat-pest-1', question: 'Do you see tiny green or black insects in clusters on leaves?', category: 'pest', riskWeight: 8 },
    { id: 'wheat-pest-2', question: 'Are there green caterpillars marching in groups eating leaves?', category: 'pest', riskWeight: 9 },
    { id: 'wheat-pest-3', question: 'Are young plants cut at ground level overnight?', category: 'pest', riskWeight: 8 },
    { id: 'wheat-pest-4', question: 'Do you see central shoots dying in seedling stage?', category: 'pest', riskWeight: 8 },
    { id: 'wheat-pest-5', question: 'Are there white/yellow wavy lines inside leaves?', category: 'pest', riskWeight: 7 },
    { id: 'wheat-pest-6', question: 'Do you see soil tubes near stems or root damage?', category: 'pest', riskWeight: 7 },
    { id: 'wheat-pest-7', question: 'Are grasshoppers eating leaf edges or shoots?', category: 'pest', riskWeight: 6 },
    { id: 'wheat-pest-8', question: 'Are there tiny orange/pink larvae in developing grains?', category: 'pest', riskWeight: 8 },
    { id: 'wheat-pest-9', question: 'Are stems hollow with sawdust-like material inside?', category: 'pest', riskWeight: 7 },
    { id: 'wheat-pest-10', question: 'Do leaves look silvery or bronzed with tiny specks?', category: 'pest', riskWeight: 6 },
    { id: 'wheat-pest-11', question: 'Are there white fly-like insects on undersides of leaves?', category: 'pest', riskWeight: 7 },
    { id: 'wheat-pest-12', question: 'Is bird or rat damage visible on grain heads?', category: 'pest', riskWeight: 7 },
    
    // === DISEASE (12 questions) ===
    { id: 'wheat-disease-1', question: 'Are there yellow-orange powdery stripes on leaves?', category: 'disease', riskWeight: 10 },
    { id: 'wheat-disease-2', question: 'Do you see reddish-brown powder/pustules on leaves or stems?', category: 'disease', riskWeight: 9 },
    { id: 'wheat-disease-3', question: 'Is there white fluffy powder on upper leaf surfaces?', category: 'disease', riskWeight: 8 },
    { id: 'wheat-disease-4', question: 'Are grain heads partially or fully black/covered in powder?', category: 'disease', riskWeight: 9 },
    { id: 'wheat-disease-5', question: 'Do you see tan spots with dark dots on leaves?', category: 'disease', riskWeight: 8 },
    { id: 'wheat-disease-6', question: 'Are grain heads showing pink/orange discoloration?', category: 'disease', riskWeight: 9 },
    { id: 'wheat-disease-7', question: 'Are lower leaves yellowing with dark fruiting bodies?', category: 'disease', riskWeight: 8 },
    { id: 'wheat-disease-8', question: 'Are plants yellowing and dying in patches?', category: 'disease', riskWeight: 8 },
    { id: 'wheat-disease-9', question: 'Is the stem base darkened or rotting at crown?', category: 'disease', riskWeight: 8 },
    { id: 'wheat-disease-10', question: 'Do leaves have tan-brown spots with yellow borders?', category: 'disease', riskWeight: 7 },
    { id: 'wheat-disease-11', question: 'Are flag leaves showing small purple-brown spots?', category: 'disease', riskWeight: 7 },
    { id: 'wheat-disease-12', question: 'Are kernels shriveled, pink, or moldy?', category: 'disease', riskWeight: 8 },
    
    // === WATER (10 questions) ===
    { id: 'wheat-water-1', question: 'Is soil powdery and dry when you dig 10cm deep?', category: 'water', riskWeight: 9 },
    { id: 'wheat-water-2', question: 'Is water standing in field for more than one day?', category: 'water', riskWeight: 8 },
    { id: 'wheat-water-3', question: 'Do plants droop or curl leaves by afternoon?', category: 'weather', riskWeight: 8 },
    { id: 'wheat-water-4', question: 'Did you miss watering during active tillering phase?', category: 'water', riskWeight: 8 },
    { id: 'wheat-water-5', question: 'Is soil dry during flowering or grain filling stage?', category: 'water', riskWeight: 10 },
    { id: 'wheat-water-6', question: 'Are there yellow patches due to poor drainage?', category: 'water', riskWeight: 7 },
    { id: 'wheat-water-7', question: 'Has it been more than 20 days without rain or irrigation?', category: 'water', riskWeight: 9 },
    { id: 'wheat-water-8', question: 'Does soil feel hard and compacted?', category: 'water', riskWeight: 7 },
    { id: 'wheat-water-9', question: 'Is one side of field greener than the other (uneven water)?', category: 'water', riskWeight: 7 },
    { id: 'wheat-water-10', question: 'Are lower leaves dying due to waterlogging stress?', category: 'water', riskWeight: 7 },
    
    // === NUTRIENT (12 questions) ===
    { id: 'wheat-nutrient-1', question: 'Are older leaves pale yellow starting from tip?', category: 'nutrient', riskWeight: 8 },
    { id: 'wheat-nutrient-2', question: 'Are leaf edges and tips brown and burnt looking?', category: 'nutrient', riskWeight: 7 },
    { id: 'wheat-nutrient-3', question: 'Are plants deep green but very short and bushy?', category: 'nutrient', riskWeight: 7 },
    { id: 'wheat-nutrient-4', question: 'Do older leaves show purple/reddish tinting?', category: 'nutrient', riskWeight: 7 },
    { id: 'wheat-nutrient-5', question: 'Are younger leaves yellow while older stay dark green?', category: 'nutrient', riskWeight: 6 },
    { id: 'wheat-nutrient-6', question: 'Does each plant have fewer than 3-4 tillers?', category: 'nutrient', riskWeight: 8 },
    { id: 'wheat-nutrient-7', question: 'Are there less than 35 grains per spike/head?', category: 'nutrient', riskWeight: 7 },
    { id: 'wheat-nutrient-8', question: 'Are grains small, lightweight or shriveled?', category: 'nutrient', riskWeight: 8 },
    { id: 'wheat-nutrient-9', question: 'Are some heads completely empty (white heads)?', category: 'nutrient', riskWeight: 9 },
    { id: 'wheat-nutrient-10', question: 'Do you see yellow stripes between green leaf veins?', category: 'nutrient', riskWeight: 6 },
    { id: 'wheat-nutrient-11', question: 'Are new leaves pale or whitish (iron deficiency)?', category: 'nutrient', riskWeight: 6 },
    { id: 'wheat-nutrient-12', question: 'Is overall crop color very light green or yellowish?', category: 'nutrient', riskWeight: 7 },
    
    // === GROWTH (10 questions) ===
    { id: 'wheat-growth-1', question: 'Are plants less than 50cm tall when they should be taller?', category: 'growth', riskWeight: 7 },
    { id: 'wheat-growth-2', question: 'Is stem elongation 7-10 days behind schedule?', category: 'growth', riskWeight: 7 },
    { id: 'wheat-growth-3', question: 'Are heads emerging at very different times?', category: 'growth', riskWeight: 7 },
    { id: 'wheat-growth-4', question: 'Is less than 60% of field in flower after one week?', category: 'growth', riskWeight: 8 },
    { id: 'wheat-growth-5', question: 'Are more than 20% of grains undeveloped or empty?', category: 'growth', riskWeight: 8 },
    { id: 'wheat-growth-6', question: 'Are spikes/heads shorter than 7cm?', category: 'growth', riskWeight: 7 },
    { id: 'wheat-growth-7', question: 'Is grain filling completed in less than 20 days?', category: 'growth', riskWeight: 7 },
    { id: 'wheat-growth-8', question: 'Are more than 10% of plants lying flat (lodged)?', category: 'growth', riskWeight: 8 },
    { id: 'wheat-growth-9', question: 'Are awns (spikes) missing or broken on many heads?', category: 'growth', riskWeight: 6 },
    { id: 'wheat-growth-10', question: 'Is there wide variation in plant height across field?', category: 'growth', riskWeight: 6 },
    
    // === WEATHER (8 questions) ===
    { id: 'wheat-weather-1', question: 'Did temperature drop below -2°C (frost) recently?', category: 'weather', riskWeight: 10 },
    { id: 'wheat-weather-2', question: 'Have temperatures been above 35°C during grain formation?', category: 'weather', riskWeight: 9 },
    { id: 'wheat-weather-3', question: 'Did hail damage leaves, stems or grain heads?', category: 'weather', riskWeight: 9 },
    { id: 'wheat-weather-4', question: 'Have strong winds flattened parts of your crop?', category: 'weather', riskWeight: 8 },
    { id: 'wheat-weather-5', question: 'Has there been 3+ weeks without rain during critical growth?', category: 'weather', riskWeight: 8 },
    { id: 'wheat-weather-6', question: 'Is humidity very high (above 85%) for many days?', category: 'weather', riskWeight: 7 },
    { id: 'wheat-weather-7', question: 'Are temperatures below 12°C during flowering?', category: 'weather', riskWeight: 8 },
    { id: 'wheat-weather-8', question: 'Has unseasonal rain occurred during harvest readiness?', category: 'weather', riskWeight: 8 },
  ],
  
  Maize: [
    // === PEST (12 questions) ===
    { id: 'maize-pest-1', question: 'Are there caterpillars with inverted Y mark on head in whorls?', category: 'pest', riskWeight: 10 },
    { id: 'maize-pest-2', question: 'Do you see holes in stems with sawdust coming out?', category: 'pest', riskWeight: 9 },
    { id: 'maize-pest-3', question: 'Are seedlings cut off at soil level overnight?', category: 'pest', riskWeight: 8 },
    { id: 'maize-pest-4', question: 'Is the central whorl dried out in young plants?', category: 'pest', riskWeight: 8 },
    { id: 'maize-pest-5', question: 'Do you see beetles with black spots eating leaves?', category: 'pest', riskWeight: 7 },
    { id: 'maize-pest-6', question: 'Are plants stunted with roots looking chewed or damaged?', category: 'pest', riskWeight: 8 },
    { id: 'maize-pest-7', question: 'Are seeds or young roots being eaten by soil insects?', category: 'pest', riskWeight: 7 },
    { id: 'maize-pest-8', question: 'Are silks cut short or missing from ears?', category: 'pest', riskWeight: 8 },
    { id: 'maize-pest-9', question: 'Do you see worms inside ears eating kernels?', category: 'pest', riskWeight: 8 },
    { id: 'maize-pest-10', question: 'Are there tiny insects on tassels or upper leaves?', category: 'pest', riskWeight: 7 },
    { id: 'maize-pest-11', question: 'Are plants wilting from root damage by white grubs?', category: 'pest', riskWeight: 8 },
    { id: 'maize-pest-12', question: 'Is bird damage visible on developing ears?', category: 'pest', riskWeight: 7 },
    
    // === DISEASE (12 questions) ===
    { id: 'maize-disease-1', question: 'Are there long yellow-gray spots on leaves (leaf blight)?', category: 'disease', riskWeight: 9 },
    { id: 'maize-disease-2', question: 'Do you see white/gray fuzzy mold on ears?', category: 'disease', riskWeight: 9 },
    { id: 'maize-disease-3', question: 'Are there small orange/rust-colored bumps on leaves?', category: 'disease', riskWeight: 8 },
    { id: 'maize-disease-4', question: 'Do leaves show yellow stripes and stunted plants?', category: 'disease', riskWeight: 9 },
    { id: 'maize-disease-5', question: 'Is there white downy growth on undersides of leaves?', category: 'disease', riskWeight: 8 },
    { id: 'maize-disease-6', question: 'Are there large black tumor-like growths on ears/tassels?', category: 'disease', riskWeight: 7 },
    { id: 'maize-disease-7', question: 'Do leaves have rectangular gray lesions with brown borders?', category: 'disease', riskWeight: 8 },
    { id: 'maize-disease-8', question: 'Are plants wilting despite having enough water?', category: 'disease', riskWeight: 9 },
    { id: 'maize-disease-9', question: 'Are ears showing pink, red or white mold growth?', category: 'disease', riskWeight: 9 },
    { id: 'maize-disease-10', question: 'Do leaves have circular spots with tan centers?', category: 'disease', riskWeight: 7 },
    { id: 'maize-disease-11', question: 'Are stalks rotting at base or breaking easily?', category: 'disease', riskWeight: 8 },
    { id: 'maize-disease-12', question: 'Do tassels or ears show fungal growth?', category: 'disease', riskWeight: 7 },
    
    // === WATER (10 questions) ===
    { id: 'maize-water-1', question: 'Are leaves rolling inward like tubes?', category: 'water', riskWeight: 9 },
    { id: 'maize-water-2', question: 'Is soil completely dry when you dig 15cm deep?', category: 'water', riskWeight: 9 },
    { id: 'maize-water-3', question: 'Is water standing around plants for 2+ days?', category: 'water', riskWeight: 8 },
    { id: 'maize-water-4', question: 'Has there been no water for a week during silk emergence?', category: 'water', riskWeight: 10 },
    { id: 'maize-water-5', question: 'Do plants wilt and droop by mid-afternoon?', category: 'water', riskWeight: 8 },
    { id: 'maize-water-6', question: 'Is irrigation schedule irregular or inconsistent?', category: 'water', riskWeight: 7 },
    { id: 'maize-water-7', question: 'Did drought occur when tassels were emerging?', category: 'water', riskWeight: 10 },
    { id: 'maize-water-8', question: 'Is some of the field much drier than other parts?', category: 'water', riskWeight: 7 },
    { id: 'maize-water-9', question: 'Are lower leaves dying from waterlogged conditions?', category: 'water', riskWeight: 7 },
    { id: 'maize-water-10', question: 'Has soil been dry for 10+ days without irrigation?', category: 'water', riskWeight: 9 },
    
    // === NUTRIENT (12 questions) ===
    { id: 'maize-nutrient-1', question: 'Are lower leaves yellowing in a V-shape from tip?', category: 'nutrient', riskWeight: 8 },
    { id: 'maize-nutrient-2', question: 'Are leaf edges turning yellow then brown and crispy?', category: 'nutrient', riskWeight: 7 },
    { id: 'maize-nutrient-3', question: 'Are plants short with reddish-purple leaves?', category: 'nutrient', riskWeight: 7 },
    { id: 'maize-nutrient-4', question: 'Do younger leaves have pale yellow stripes?', category: 'nutrient', riskWeight: 6 },
    { id: 'maize-nutrient-5', question: 'Are there white/yellow bands or stripes on young leaves?', category: 'nutrient', riskWeight: 7 },
    { id: 'maize-nutrient-6', question: 'Do young leaves show yellow between green veins?', category: 'nutrient', riskWeight: 6 },
    { id: 'maize-nutrient-7', question: 'Are ears less than half filled with kernels?', category: 'nutrient', riskWeight: 8 },
    { id: 'maize-nutrient-8', question: 'Are tassels very small or delayed in emergence?', category: 'nutrient', riskWeight: 7 },
    { id: 'maize-nutrient-9', question: 'Are plants less than 1 meter tall at tasseling?', category: 'nutrient', riskWeight: 8 },
    { id: 'maize-nutrient-10', question: 'Are ears smaller than 12cm in length?', category: 'nutrient', riskWeight: 7 },
    { id: 'maize-nutrient-11', question: 'Are there gaps or missing rows of kernels on ears?', category: 'nutrient', riskWeight: 7 },
    { id: 'maize-nutrient-12', question: 'Is the overall crop color uneven with yellow and green patches?', category: 'nutrient', riskWeight: 7 }
  ]
};