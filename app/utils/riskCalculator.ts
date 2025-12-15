import { ChecklistItem, RiskAssessment, Alert } from '../types/crop';
import { cropTypes, cropStages } from '../data/cropData';

export function calculateRiskScore(
  responses: Record<string, boolean | string>,
  questions: ChecklistItem[],
  cropType?: string,
  currentStage?: string,
  weatherData?: { avgTemp: number; rainfall: number; humidity: number },
  historicalData?: any[]
): RiskAssessment {
  const categoryScores: Record<string, number[]> = {
    pest: [],
    disease: [],
    water: [],
    nutrient: [],
    weather: [],
    growth: []
  };

  const alerts: Alert[] = [];
  const recommendations: string[] = [];

  // Get crop-specific risk multipliers
  const cropRiskMultiplier = getCropRiskMultiplier(cropType);
  const stageRiskMultiplier = getStageRiskMultiplier(currentStage);

  // Calculate scores by category with dynamic weighting
  questions.forEach(question => {
    const response = responses[question.id];

    if (response === true || response === 'yes') {
      let riskContribution = question.riskWeight;

      // Apply crop and stage specific multipliers
      riskContribution *= cropRiskMultiplier[question.category] || 1;
      riskContribution *= stageRiskMultiplier[question.category] || 1;

      // Apply weather-based adjustments
      if (weatherData) {
        riskContribution *= getWeatherRiskMultiplier(question.category, weatherData);
      }

      // Apply historical trend adjustments
      if (historicalData && historicalData.length > 0) {
        riskContribution *= getHistoricalRiskMultiplier(question.category, historicalData);
      }

      categoryScores[question.category].push(riskContribution);

      // Generate alerts for high-risk responses with more context
      if (riskContribution >= 8) {
        alerts.push(generateAlert(question, cropType, currentStage));
      }
    }
  });

  // Calculate average risk per category with dynamic weighting
  const factors = {
    pest: calculateAverage(categoryScores.pest),
    disease: calculateAverage(categoryScores.disease),
    water: calculateAverage(categoryScores.water),
    nutrient: calculateAverage(categoryScores.nutrient),
    weather: calculateAverage(categoryScores.weather),
    growth: calculateAverage(categoryScores.growth)
  };

  // Dynamic weighting based on crop type and current conditions
  const weights = getDynamicWeights(cropType, currentStage, weatherData);

  let totalWeightedRisk = 0;
  let totalWeight = 0;

  Object.entries(factors).forEach(([category, score]) => {
    if (score > 0) {
      totalWeightedRisk += score * weights[category as keyof typeof weights];
      totalWeight += weights[category as keyof typeof weights];
    }
  });

  const overallRisk = totalWeight > 0 ? totalWeightedRisk / totalWeight : 0;
  const riskLevel = getRiskLevel(overallRisk);

  // Generate context-aware recommendations
  Object.entries(factors).forEach(([category, score]) => {
    if (score > 5) {
      recommendations.push(...getRecommendations(category, score, cropType, currentStage));
    }
  });

  // Add predictive alerts based on trends
  if (historicalData && historicalData.length >= 3) {
    const trendAlerts = analyzeTrends(historicalData, factors);
    alerts.push(...trendAlerts);
  }

  return {
    overallRisk: Math.round(overallRisk * 10) / 10,
    riskLevel,
    factors,
    alerts,
    recommendations
  };
}

function calculateAverage(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((a, b) => a + b, 0);
  return sum / scores.length;
}

function getCropRiskMultiplier(cropType?: string): Record<string, number> {
  const multipliers: Record<string, Record<string, number>> = {
    Rice: { pest: 1.3, disease: 1.4, water: 1.5, nutrient: 1.0, weather: 1.2, growth: 1.1 },
    Wheat: { pest: 1.1, disease: 1.2, water: 1.2, nutrient: 1.3, weather: 1.4, growth: 1.0 },
    Maize: { pest: 1.4, disease: 1.1, water: 1.3, nutrient: 1.2, weather: 1.1, growth: 1.2 },
    Cotton: { pest: 1.5, disease: 1.3, water: 1.1, nutrient: 1.4, weather: 1.0, growth: 1.2 },
    Sugarcane: { pest: 1.2, disease: 1.5, water: 1.4, nutrient: 1.3, weather: 1.1, growth: 1.1 },
    Millet: { pest: 1.0, disease: 1.1, water: 1.4, nutrient: 1.2, weather: 1.3, growth: 1.0 },
    Sorghum: { pest: 1.1, disease: 1.0, water: 1.3, nutrient: 1.1, weather: 1.4, growth: 1.1 },
    Barley: { pest: 1.0, disease: 1.2, water: 1.1, nutrient: 1.3, weather: 1.4, growth: 1.0 },
    Chickpea: { pest: 1.3, disease: 1.4, water: 1.2, nutrient: 1.1, weather: 1.0, growth: 1.2 },
    Lentil: { pest: 1.2, disease: 1.3, water: 1.1, nutrient: 1.0, weather: 1.1, growth: 1.4 },
    Groundnut: { pest: 1.4, disease: 1.2, water: 1.3, nutrient: 1.1, weather: 1.0, growth: 1.2 },
    Mustard: { pest: 1.1, disease: 1.3, water: 1.0, nutrient: 1.4, weather: 1.2, growth: 1.1 },
    Potato: { pest: 1.3, disease: 1.5, water: 1.2, nutrient: 1.1, weather: 1.0, growth: 1.2 },
    Tomato: { pest: 1.4, disease: 1.5, water: 1.1, nutrient: 1.2, weather: 1.0, growth: 1.1 },
    Onion: { pest: 1.2, disease: 1.3, water: 1.0, nutrient: 1.1, weather: 1.4, growth: 1.1 },
    Garlic: { pest: 1.1, disease: 1.4, water: 1.0, nutrient: 1.2, weather: 1.3, growth: 1.1 },
    Cauliflower: { pest: 1.3, disease: 1.4, water: 1.1, nutrient: 1.2, weather: 1.0, growth: 1.1 },
    Cabbage: { pest: 1.2, disease: 1.3, water: 1.0, nutrient: 1.1, weather: 1.4, growth: 1.1 },
    Spinach: { pest: 1.4, disease: 1.2, water: 1.3, nutrient: 1.0, weather: 1.1, growth: 1.1 },
    Carrot: { pest: 1.1, disease: 1.3, water: 1.2, nutrient: 1.0, weather: 1.4, growth: 1.1 }
  };

  return multipliers[cropType || 'Rice'] || { pest: 1, disease: 1, water: 1, nutrient: 1, weather: 1, growth: 1 };
}

function getStageRiskMultiplier(stage?: string): Record<string, number> {
  const stageMultipliers: Record<string, Record<string, number>> = {
    germination: { pest: 1.5, disease: 1.4, water: 1.3, nutrient: 1.2, weather: 1.4, growth: 1.5 },
    seedling: { pest: 1.4, disease: 1.3, water: 1.4, nutrient: 1.3, weather: 1.3, growth: 1.4 },
    vegetative: { pest: 1.3, disease: 1.2, water: 1.2, nutrient: 1.4, weather: 1.2, growth: 1.1 },
    flowering: { pest: 1.5, disease: 1.4, water: 1.3, nutrient: 1.5, weather: 1.4, growth: 1.2 },
    'grain-filling': { pest: 1.2, disease: 1.3, water: 1.4, nutrient: 1.5, weather: 1.3, growth: 1.1 },
    maturity: { pest: 1.1, disease: 1.2, water: 1.2, nutrient: 1.3, weather: 1.4, growth: 1.0 }
  };

  return stageMultipliers[stage || 'vegetative'] || { pest: 1, disease: 1, water: 1, nutrient: 1, weather: 1, growth: 1 };
}

function getWeatherRiskMultiplier(category: string, weatherData: { avgTemp: number; rainfall: number; humidity: number }): number {
  const { avgTemp, rainfall, humidity } = weatherData;
  let multiplier = 1;

  switch (category) {
    case 'pest':
      if (avgTemp > 30) multiplier *= 1.3; // Higher temps increase pest activity
      if (humidity > 80) multiplier *= 1.2; // High humidity favors pests
      break;
    case 'disease':
      if (humidity > 85) multiplier *= 1.4; // High humidity increases disease risk
      if (avgTemp > 25 && avgTemp < 30) multiplier *= 1.3; // Optimal temp for fungal growth
      break;
    case 'water':
      if (avgTemp > 35) multiplier *= 1.5; // Heat increases water stress
      if (rainfall < 5) multiplier *= 1.3; // Low rainfall increases water risk
      break;
    case 'weather':
      if (avgTemp > 40 || avgTemp < 5) multiplier *= 1.5; // Extreme temps
      if (rainfall > 50) multiplier *= 1.3; // Heavy rain risk
      break;
  }

  return multiplier;
}

function getHistoricalRiskMultiplier(category: string, historicalData: any[]): number {
  if (historicalData.length < 3) return 1;

  // Calculate trend for the specific category
  const recentScores = historicalData.slice(-3).map(item => {
    const factors = item.factors || {};
    return factors[category] || 0;
  });

  const avgRecent = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
  const trend = recentScores[recentScores.length - 1] - recentScores[0];

  // If trending upward, increase risk multiplier
  if (trend > 1) return 1.2;
  if (trend > 0.5) return 1.1;
  if (trend < -1) return 0.9; // Trending downward reduces risk

  return 1;
}

function getDynamicWeights(cropType?: string, currentStage?: string, weatherData?: { avgTemp: number; rainfall: number; humidity: number }) {
  let weights = {
    pest: 1.2,
    disease: 1.5,
    water: 1.3,
    nutrient: 1.0,
    weather: 1.4,
    growth: 1.1
  };

  // Adjust weights based on crop type
  if (cropType === 'Rice') {
    weights = { ...weights, water: 1.6, disease: 1.7 }; // Rice is water-intensive and disease-prone
  } else if (cropType === 'Cotton') {
    weights = { ...weights, pest: 1.5, nutrient: 1.3 }; // Cotton has pest and nutrient issues
  }

  // Adjust weights based on growth stage
  if (currentStage === 'flowering' || currentStage === 'grain-filling') {
    weights = { ...weights, nutrient: 1.4, water: 1.5 }; // Critical stages need more nutrients and water
  }

  // Adjust weights based on weather
  if (weatherData) {
    if (weatherData.avgTemp > 35) {
      weights = { ...weights, water: weights.water * 1.3, weather: weights.weather * 1.2 };
    }
    if (weatherData.humidity > 85) {
      weights = { ...weights, disease: weights.disease * 1.3 };
    }
  }

  return weights;
}

function analyzeTrends(historicalData: any[], currentFactors: Record<string, number>): Alert[] {
  const alerts: Alert[] = [];
  const recentData = historicalData.slice(-5); // Last 5 check-ins

  Object.entries(currentFactors).forEach(([category, currentScore]) => {
    if (currentScore < 3) return; // Only analyze trends for concerning scores

    const categoryScores = recentData.map(item => item.factors?.[category] || 0);
    const avgHistorical = categoryScores.reduce((a, b) => a + b, 0) / categoryScores.length;
    const trend = currentScore - avgHistorical;

    if (trend > 2) {
      alerts.push({
        id: `trend-${category}-${Date.now()}`,
        severity: trend > 3 ? 'critical' : 'high',
        category: category as any,
        message: `${category.charAt(0).toUpperCase() + category.slice(1)} risk is trending significantly upward`,
        action: `Review recent ${category} management practices and implement immediate corrective measures`
      });
    }
  });

  return alerts;
}

function getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score < 3) return 'low';
  if (score < 5) return 'medium';
  if (score < 7) return 'high';
  return 'critical';
}

function generateAlert(question: ChecklistItem, cropType?: string, currentStage?: string): Alert {
  const alertMessages: Record<string, { message: string; action: string; severity: Alert['severity'] }> = {
    'pest-1': {
      message: `Unusual insect activity detected in ${cropType || 'crop'} during ${currentStage || 'current stage'}`,
      action: 'Inspect crop closely and consider applying organic pesticides appropriate for this crop stage',
      severity: 'high'
    },
    'disease-1': {
      message: `Leaf spots indicate potential fungal infection in ${cropType || 'crop'}`,
      action: 'Remove affected leaves and apply appropriate fungicide for this crop type',
      severity: 'critical'
    },
    'disease-2': {
      message: `Wilting detected despite adequate water in ${cropType || 'crop'}`,
      action: 'Check for root rot or vascular disease. Consult agricultural extension officer immediately',
      severity: 'critical'
    },
    'disease-4': {
      message: `Rotting symptoms observed in ${cropType || 'crop'} ${currentStage || 'stage'}`,
      action: 'Isolate affected plants and improve drainage. Apply fungicide immediately',
      severity: 'critical'
    },
    'water-1': {
      message: `Severe water stress detected in ${cropType || 'crop'} during ${currentStage || 'stage'}`,
      action: 'Increase irrigation frequency immediately and monitor soil moisture',
      severity: 'high'
    },
    'weather-1': {
      message: `Extreme heat stress on ${cropType || 'crop'} (${currentStage || 'current stage'})`,
      action: 'Provide shade if possible, increase irrigation, apply mulch to conserve moisture',
      severity: 'high'
    },
    'weather-3': {
      message: `Frost damage risk for ${cropType || 'crop'} in ${currentStage || 'stage'}`,
      action: 'Cover crops at night, use irrigation to prevent frost formation',
      severity: 'critical'
    }
  };

  const alertInfo = alertMessages[question.id] || {
    message: question.question.replace('?', ` detected in ${cropType || 'crop'}`),
    action: 'Monitor closely and take corrective action appropriate for this crop and stage',
    severity: question.riskWeight >= 8 ? 'high' : 'medium' as Alert['severity']
  };

  return {
    id: `alert-${question.id}-${Date.now()}`,
    severity: alertInfo.severity,
    category: question.category,
    message: alertInfo.message,
    action: alertInfo.action
  };
}

function getRecommendations(category: string, score: number, cropType?: string, currentStage?: string): string[] {
  const cropSpecificAdvice: Record<string, Record<string, string[]>> = {
    Rice: {
      pest: ['Use integrated pest management specific to rice crops', 'Monitor for rice-specific pests like stem borers'],
      disease: ['Ensure proper water management to prevent fungal diseases', 'Use rice-specific fungicides when needed'],
      water: ['Maintain consistent flooding for rice cultivation', 'Monitor water levels carefully during critical stages']
    },
    Cotton: {
      pest: ['Implement bollworm management strategies', 'Use pheromone traps for early detection'],
      nutrient: ['Apply potassium-rich fertilizers for better fiber quality', 'Test soil pH for cotton-specific requirements']
    },
    Wheat: {
      disease: ['Apply fungicides preventively during heading stage', 'Practice crop rotation to break disease cycles'],
      nutrient: ['Ensure adequate nitrogen application during tillering', 'Apply micronutrients if deficiency symptoms appear']
    }
  };

  const stageSpecificAdvice: Record<string, Record<string, string[]>> = {
    germination: {
      water: ['Ensure adequate soil moisture for seed germination', 'Avoid waterlogging during early emergence'],
      disease: ['Use seed treatment fungicides', 'Ensure good seed quality and treatment']
    },
    flowering: {
      pest: ['Intensify pest monitoring during reproductive stages', 'Avoid broad-spectrum insecticides that harm pollinators'],
      nutrient: ['Apply fertilizers based on flowering requirements', 'Monitor for nutrient deficiencies affecting flower development']
    },
    'grain-filling': {
      water: ['Maintain adequate water during grain filling', 'Avoid water stress that reduces yield'],
      nutrient: ['Ensure sufficient nutrients for grain development', 'Monitor for nutrient remobilization issues']
    }
  };

  const baseRecommendations: Record<string, string[]> = {
    pest: [
      'Conduct regular field scouting (2-3 times per week)',
      'Install pest traps to monitor population',
      'Consider integrated pest management (IPM) approach',
      'Apply neem-based organic pesticides',
      'Consult with local agricultural extension for pest identification'
    ],
    disease: [
      'Remove and destroy infected plant parts immediately',
      'Improve air circulation between plants',
      'Avoid overhead irrigation to reduce leaf wetness',
      'Apply appropriate fungicides or bactericides',
      'Practice crop rotation in next season'
    ],
    water: [
      'Check and repair irrigation system',
      'Implement drip irrigation for better water management',
      'Apply mulch to conserve soil moisture',
      'Create proper drainage channels if waterlogging occurs',
      'Monitor soil moisture regularly'
    ],
    nutrient: [
      'Conduct soil testing to identify nutrient deficiencies',
      'Apply balanced NPK fertilizer as per soil test results',
      'Consider foliar application for quick nutrient uptake',
      'Add organic matter to improve soil health',
      'Maintain proper pH levels for nutrient availability'
    ],
    weather: [
      'Monitor weather forecasts daily',
      'Prepare for extreme weather events in advance',
      'Use protective measures like shade nets during heat waves',
      'Plan irrigation based on rainfall predictions',
      'Consider crop insurance for weather-related risks'
    ],
    growth: [
      'Review and adjust fertilizer application',
      'Ensure proper plant spacing for growth',
      'Check for pest or disease affecting growth',
      'Verify adequate water supply',
      'Compare with expected growth milestones for the crop stage'
    ]
  };

  let recommendations = [...(baseRecommendations[category] || [])];

  // Add crop-specific recommendations
  if (cropType && cropSpecificAdvice[cropType]?.[category]) {
    recommendations.unshift(...cropSpecificAdvice[cropType][category]);
  }

  // Add stage-specific recommendations
  if (currentStage && stageSpecificAdvice[currentStage]?.[category]) {
    recommendations.unshift(...stageSpecificAdvice[currentStage][category]);
  }

  // Adjust number of recommendations based on risk score
  const maxRecommendations = score > 7 ? 5 : score > 5 ? 4 : 3;

  return recommendations.slice(0, maxRecommendations);
}

export function compareWithIdealConditions(
  currentStage: any,
  weatherData: { avgTemp: number; rainfall: number; humidity: number }
): { warnings: string[]; riskAdjustment: number } {
  const warnings: string[] = [];
  let riskAdjustment = 0;

  if (!currentStage) return { warnings, riskAdjustment };

  const { tempMin, tempMax } = currentStage.idealConditions;

  if (weatherData.avgTemp < tempMin) {
    warnings.push(`Temperature (${weatherData.avgTemp}°C) is below optimal range (${tempMin}-${tempMax}°C)`);
    riskAdjustment += 1.5;
  }

  if (weatherData.avgTemp > tempMax) {
    warnings.push(`Temperature (${weatherData.avgTemp}°C) is above optimal range (${tempMin}-${tempMax}°C)`);
    riskAdjustment += 2;
  }

  if (weatherData.humidity < 50) {
    warnings.push(`Low humidity (${weatherData.humidity}%) may stress plants`);
    riskAdjustment += 1;
  }

  if (weatherData.humidity > 90) {
    warnings.push(`High humidity (${weatherData.humidity}%) increases disease risk`);
    riskAdjustment += 1.5;
  }

  return { warnings, riskAdjustment };
}
