
// app/utils/simpleRiskEngine.ts

import { ChecklistItem, Alert } from '../types/crop';

/**
 * Universal Simple Risk Engine
 * 
 * Combines 3 Core Signals:
 * 1. Physical Checks (What the farmer sees) -> High Confidence
 * 2. Weather Data (Temp/Rain) -> Contextual Risk
 * 3. Recent History (Trends) -> Predictive Risk
 */

interface RiskInput {
    // 1. Physical Signals (Question Responses)
    responses: Record<string, string>; // { "q-id": "Yes" }
    questions: ChecklistItem[];

    // 2. Environmental Signals
    rainfall: number;       // mm
    irrigation: string;     // Yes/No/Type
    temp: number;           // Celsius

    // 3. User Perception
    cropCondition: 'Good' | 'Average' | 'Poor';
    pstSeen: boolean;
}

interface RiskOutput {
    score: number;          // 1-10
    level: 'Low' | 'Medium' | 'High';
    alerts: Alert[];
    actions: string[];
}

export function analyzeCropRisk(input: RiskInput): RiskOutput {
    let riskScore = 0;
    const alerts: Alert[] = [];
    const actions: string[] = [];

    // --- SIGNAL 1: FARMER'S DIRECT OBSERVATIONS (Most Critical) ---
    // If a farmer explicitly says "Yes" to a known problem question, it's an immediate risk.
    input.questions.forEach(q => {
        if (input.responses[q.id] === 'Yes') {
            const weight = q.riskWeight || 5; 
            // Normalize weight impact (max 3 points per strong signal)
            const impact = weight >= 8 ? 3 : weight >= 6 ? 2 : 1;
            riskScore += impact;

            alerts.push({
                id: `risk-${q.id}`,
                severity: weight >= 8 ? 'high' : 'medium',
                category: q.category,
                message: `Observed issue: ${q.question}`,
                action: 'Check suggestions for immediate control measures.'
            });
        }
    });

    // --- SIGNAL 2: WATER STRESS (Rainfall + Irrigation) ---
    // Rule: Low rain (<10mm) AND No Irrigation = Drought Risk
    if (input.rainfall < 10 && input.irrigation === 'No') {
        riskScore += 3;
        alerts.push({
            id: 'water-stress',
            severity: 'high',
            category: 'water',
            message: 'Critical Water Deficit Detected',
            action: 'Start irrigation immediately. Soil moisture is critically low.'
        });
        actions.push('Apply emergency irrigation (5cm depth).');
    }

    // --- SIGNAL 3: PEST/DISEASE (General) ---
    if (input.pstSeen) {
        riskScore += 2;
         // Note: Specific pest details usually come from Questions, so this is a general flag
         actions.push('Scout field in zig-zag pattern to identify specific pest.');
    }

    // --- SIGNAL 4: THERMAL STRESS (Temperature) ---
    if (input.temp > 35) {
        riskScore += 2;
        alerts.push({
            id: 'heat-stress',
            severity: 'medium',
            category: 'weather',
            message: 'Heat Stress Warning (>35°C)',
            action: 'Maintain higher water level to cool the crop.'
        });
    }

    // --- FINAL SCORING & ACTIONS ---
    
    // Condition Multiplier
    if (input.cropCondition === 'Poor') riskScore += 2;
    if (input.cropCondition === 'Average') riskScore += 1;

    // Cap Score
    riskScore = Math.min(10, Math.max(1, riskScore));

    // Determine Level
    let level: 'Low' | 'Medium' | 'High' = 'Low';
    if (riskScore >= 7) {
        level = 'High';
        actions.unshift(' CONSULT EXPERT IMMEDIATELY.');
    } else if (riskScore >= 4) {
        level = 'Medium';
         actions.push('Monitor field daily for next 3 days.');
    } else {
        actions.push('Continue routine monitoring.');
    }

    return {
        score: riskScore,
        level,
        alerts,
        actions: [...new Set(actions)] // Dedupe
    };
}
