
import { RiskAssessment, WeeklyCheckIn, Alert } from '../types/crop';

export interface MockScenario {
  id: string;
  description: string;
  location: { region: string; lat: number; lon: number };
  crop_data: { crop_name: string; variety: string; sowing_date: string; current_date: string; stage: string };
  risk_signals: {
    rainfall_30d_mm?: number;
    rainfall_anomaly_pct: number;
    tmax_avg_14d_c?: number;
    heat_stress_days: number;
    ndvi_current?: number;
    ndvi_anomaly: number;
    soil_moisture_index?: number;
  };
  assessment: { risk_level: string; score: number };
}

export function mapScenarioToApp(scenario: MockScenario): { checkIn: WeeklyCheckIn; assessment: RiskAssessment } {
  // Map Score 0-100 -> 0-10
  const riskScore = scenario.assessment.score / 10;
  
  // Map Risk Level
  const riskLevel = scenario.assessment.risk_level.toLowerCase() as 'low' | 'medium' | 'high';
  
  // Create Alerts
  const alerts: Alert[] = [];
  if (scenario.risk_signals.rainfall_anomaly_pct < -20) {
    alerts.push({
      id: `alert-${scenario.id}-rain`,
      severity: scenario.risk_signals.rainfall_anomaly_pct < -50 ? 'critical' : 'high',
      category: 'water',
      message: `Severe Rainfall Deficit: ${scenario.risk_signals.rainfall_anomaly_pct}% anomaly`,
      action: 'Check soil moisture and consider supplemental irrigation.'
    });
  }
  if (scenario.risk_signals.heat_stress_days > 0) {
    alerts.push({
      id: `alert-${scenario.id}-heat`,
      severity: scenario.risk_signals.heat_stress_days > 5 ? 'critical' : 'medium',
      category: 'weather',
      message: `Heat Stress Detected: ${scenario.risk_signals.heat_stress_days} days above threshold`,
      action: 'Apply irrigation to cool canopy if possible.'
    });
  }
  if (scenario.risk_signals.ndvi_anomaly < -0.10) {
    alerts.push({
      id: `alert-${scenario.id}-ndvi`,
      severity: scenario.risk_signals.ndvi_anomaly < -0.20 ? 'high' : 'medium',
      category: 'growth',
      message: `Vegetation Health (NDVI) below normal: ${scenario.risk_signals.ndvi_anomaly}`,
      action: 'Scout for pests or diseases.'
    });
  }

  // Factors mapping (0-10)
  // We approximate based on the signals
  const waterRisk = Math.min(10, Math.max(0, -scenario.risk_signals.rainfall_anomaly_pct / 10 + (scenario.risk_signals.soil_moisture_index ? (1 - scenario.risk_signals.soil_moisture_index) * 5 : 0)));
  const weatherRisk = Math.min(10, Math.max(0, scenario.risk_signals.heat_stress_days * 1.5));
  const growthRisk = Math.min(10, Math.max(0, -scenario.risk_signals.ndvi_anomaly * 20));
  
  // Construct WeeklyCheckIn
  const checkIn: WeeklyCheckIn = {
    id: scenario.id,
    farmerId: 'demo-farmer',
    cropType: scenario.crop_data.crop_name,
    currentStage: scenario.crop_data.stage,
    date: scenario.crop_data.current_date,
    responses: {}, // Empty as this is simulation
    weatherConditions: {
      avgTemp: scenario.risk_signals.tmax_avg_14d_c || 25,
      rainfall: scenario.risk_signals.rainfall_30d_mm || 0,
      humidity: 60 // default
    },
    riskScore: riskScore,
    alerts: alerts
  };

  // Construct RiskAssessment
  const assessment: RiskAssessment = {
    overallRisk: riskScore,
    riskLevel: riskScore >= 7 ? 'critical' : riskScore >= 5 ? 'high' : riskScore >= 3 ? 'medium' : 'low',
    factors: {
      pest: 2, // default low
      disease: 2,
      water: waterRisk,
      nutrient: 3,
      weather: weatherRisk,
      growth: growthRisk
    },
    alerts: alerts,
    recommendations: [
      alerts.length > 0 ? alerts[0].action : 'Monitor crop regularly.',
      'Check local weather indices.',
      'Maintain standard fertilization schedule.'
    ]
  };

  return { checkIn, assessment };
}
