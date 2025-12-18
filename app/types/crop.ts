
export interface FarmProfile {
  id: string;
  farmerName: string;
  location: string;
  cropType: string;
  fieldSize: number;
  sowingDate: string; // ISO string
}

export interface WeeklyRecord {
  id: string;
  date: string; // ISO string
  rainfall: number;
  irrigation: string;
  cropCondition: 'Good' | 'Average' | 'Poor';
  pestSeen: boolean;
  notes?: string;
  
  // System Data
  avgTemp?: number;
  ndviScore?: number;
  
  // Risk & Assessment
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  alerts: Alert[]; // Stored as JSON string in DB, parsed in app
  suggestions: string[]; // Stored as JSON string in DB
}

export interface MonthlyRecord {
  id: string;
  monthDate: string; // ISO string (e.g., 2025-01-01)
  growthStage: string;
  fertilizer?: string;
  yieldExpected?: number;
  lossesFaced?: string;
}

export interface FailureRecord {
  id: string;
  date: string;
  failureType: 'Drought' | 'Pest' | 'Heat' | 'Flood' | 'Other';
  lossPercentage: number;
  notes?: string;
}

export interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  message: string;
  action: string;
}

// Deprecated inputs (keeping for compatibility if needed temporarily)
// Visual Adapter Types (used by RiskDashboard)
export interface RiskAssessment {
    overallRisk: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    factors: {
        water: number;
        pest: number;
        weather: number;
        growth: number;
        disease: number;
        nutrient: number;
    };
    alerts: Alert[];
    recommendations: string[];
}

export interface WeeklyCheckIn {
    id: string;
    date: string;
    riskScore: number;
    riskLevel: string;
    weatherConditions: {
        avgTemp: number;
        rainfall: number;
        humidity: number;
    };
    responses?: Record<string, string>;
    factors?: {
        water?: number;
        pest?: number;
        weather?: number;
        growth?: number;
        disease?: number;
        nutrient?: number;
    };
    cropType: string; // Needed for historical chart recalculation context
    currentStage: string; // Needed for historical chart recalculation context
}

export interface ChecklistItem {
    id: string;
    question: string;
    category: 'water' | 'pest' | 'weather' | 'growth' | 'disease' | 'nutrient';
    riskWeight: number;
}
