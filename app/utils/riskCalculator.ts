
import { Alert, ChecklistItem } from '../types/crop';

export function calculateSimpleRisk(
    data: {
        rainfall: number;
        irrigation: string;
        cropCondition: 'Good' | 'Average' | 'Poor';
        pestSeen: boolean;
        temp?: number;
        responses?: Record<string, string>; // { questionId: "Yes"/"No" }
        questions?: ChecklistItem[]; // The list of questions asked
    }
): { riskScore: number; riskLevel: 'Low' | 'Medium' | 'High'; alerts: Alert[]; suggestions: string[] } {
    let score = 0;
    const alerts: Alert[] = [];
    const suggestions: string[] = [];

    // --- 1. Base Factors ---
    
    // Crop Condition (Farmer Input)
    if (data.cropCondition === 'Average') {
        score += 2;
        suggestions.push('Monitor crop closely for signs of stress.');
    } else if (data.cropCondition === 'Poor') {
        score += 5;
        alerts.push({
            id: 'cond-poor',
            severity: 'high',
            category: 'growth',
            message: 'Crop condition reported as Poor.',
            action: 'Investigate root cause (water, pest, nutrient) immediately.'
        });
    }

    // Water Stress
    const lowRainfallThreshold = 10; // mm/week
    if (data.rainfall < lowRainfallThreshold && data.irrigation === 'No') {
        score += 3;
        alerts.push({
            id: 'water-deficit',
            severity: 'high',
            category: 'water',
            message: 'Low rainfall and no irrigation recorded.',
            action: 'Apply irrigation immediately to prevent drought stress.'
        });
    }

    // Pest/Disease Presence
    if (data.pestSeen) {
        score += 2;
        alerts.push({
            id: 'pest-seen',
            severity: 'medium',
            category: 'pest',
            message: 'Pest or disease presence reported.',
            action: 'Identify pest and apply appropriate control measures.'
        });
    }

    // Temperature (System Data)
    if (data.temp && data.temp > 35) {
        score += 2;
        alerts.push({
            id: 'heat-stress',
            severity: 'medium',
            category: 'weather',
            message: `High temperature detected (${data.temp}°C).`,
            action: 'Ensure adequate water to cool the canopy.'
        });
    }

    // --- 2. Specific Question Responses ---
    if (data.responses && data.questions) {
        data.questions.forEach(q => {
            const answer = data.responses![q.id];
            if (answer === 'Yes') {
                // If the answer is "Yes" to a risk question (assuming questions are phrased like "Do you see X problem?")
                // We add the risk weight directly.
                const weight = q.riskWeight >= 9 ? 4 : q.riskWeight >= 7 ? 3 : 2;
                score += weight;
                
                alerts.push({
                    id: `q-${q.id}`,
                    severity: q.riskWeight >= 8 ? 'high' : 'medium',
                    category: q.category,
                    message: `Issue Detected: ${q.question}`,
                    action: 'Consult "Suggestions" tab or local expert.'
                });
            }
        });
    }

    // Cap Score
    score = Math.min(10, Math.max(0, score));

    // Determine Level
    let level: 'Low' | 'Medium' | 'High' = 'Low';
    if (score >= 7) level = 'High';
    else if (score >= 4) level = 'Medium';

    // Auto-Suggestions based on Level
    if (level === 'High') {
        suggestions.push('Contact local agriculture officer for emergency advice.');
        suggestions.push('Consider supplemental irrigation or protective measures.');
    } else if (level === 'Medium') {
        suggestions.push('Increase frequency of field visits.');
    }

    return {
        riskScore: score,
        riskLevel: level,
        alerts,
        suggestions
    };
}
