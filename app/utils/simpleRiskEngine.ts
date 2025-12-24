
import { ChecklistItem, Alert } from '../types/crop';
import { cropRiskAssessments } from '../data/cropData';

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
    cropType?: string;

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

    const cropMeta = input.cropType ? cropRiskAssessments[input.cropType] : null;

    // --- SIGNAL 1: FARMER'S DIRECT OBSERVATIONS (Most Critical) ---
    input.questions.forEach(q => {
        if (input.responses[q.id] === 'Yes') {
            const weight = q.riskWeight || 5; 
            const impact = weight >= 8 ? 3 : weight >= 6 ? 2 : 1;
            riskScore += impact;

            alerts.push({
                id: `risk-${q.id}`,
                severity: weight >= 8 ? 'high' : 'medium',
                category: q.category,
                message: `Observed issue: ${q.question}`,
                action: 'Follow crop-specific management guide.'
            });
        }
    });

    // --- SIGNAL 2: WATER STRESS (Rainfall + Irrigation) ---
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
         actions.push('Scout field in zig-zag pattern to identify specific pest.');
         if (cropMeta) {
             const pestRisk = cropMeta.commonRisks.find((r: any) => r.type.toLowerCase().includes('pest') || r.type.toLowerCase().includes('worm') || r.type.toLowerCase().includes('army'));
             if (pestRisk) actions.push(`Risk Alert: ${pestRisk.type} is common. ${pestRisk.mitigation}`);
         }
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
        if (cropMeta) {
             const heatRisk = cropMeta.commonRisks.find((r: any) => r.type.toLowerCase().includes('heat'));
             if (heatRisk) actions.push(`Mitigation: ${heatRisk.mitigation}`);
        }
    }

    // --- FINAL SCORING & ACTIONS ---
    if (input.cropCondition === 'Poor') riskScore += 2;
    if (input.cropCondition === 'Average') riskScore += 1;

    riskScore = Math.min(10, Math.max(1, riskScore));

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

    if (cropMeta && riskScore > 5) {
        actions.push(`Analysis: ${cropMeta.analysis}`);
    }

    return {
        score: riskScore,
        level,
        alerts,
        actions: [...new Set(actions)] // Dedupe
    };
}
