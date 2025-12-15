export interface CropStage {
  id: string;
  name: string;
  duration: number; // days
  criticalFactors: string[];
  idealConditions: {
    tempMin: number;
    tempMax: number;
    rainfall: string;
    humidity: string;
  };
}

export interface ChecklistItem {
  id: string;
  question: string;
  category: 'pest' | 'disease' | 'water' | 'nutrient' | 'weather' | 'growth';
  riskWeight: number; // 1-10
}

export interface WeeklyCheckIn {
  id: string;
  farmerId: string;
  cropType: string;
  currentStage: string;
  date: string;
  responses: Record<string, boolean | string>;
  weatherConditions: {
    avgTemp: number;
    rainfall: number;
    humidity: number;
  };
  riskScore: number;
  alerts: Alert[];
}

export interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  message: string;
  action: string;
}

export interface RiskAssessment {
  overallRisk: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: {
    pest: number;
    disease: number;
    water: number;
    nutrient: number;
    weather: number;
    growth: number;
  };
  alerts: Alert[];
  recommendations: string[];
}
