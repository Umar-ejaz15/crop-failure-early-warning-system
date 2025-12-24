import { CropStage, ChecklistItem } from '../types/crop';
import { riceStages, riceCheckInQuestions, riceRiskAssessment } from './crops/rice';
import { wheatStages, wheatCheckInQuestions, wheatRiskAssessment } from './crops/wheat';
import { maizeStages, maizeCheckInQuestions, maizeRiskAssessment } from './crops/maize';

export const cropTypes = [
  'Rice',
  'Wheat',
  'Maize'
];

export const cropStages: Record<string, CropStage[]> = {
  Rice: riceStages,
  Wheat: wheatStages,
  Maize: maizeStages
};

export const checkInQuestions: Record<string, ChecklistItem[]> = {
  Rice: riceCheckInQuestions,
  Wheat: wheatCheckInQuestions,
  Maize: maizeCheckInQuestions
};

export const cropRiskAssessments: Record<string, any> = {
    Rice: riceRiskAssessment,
    Wheat: wheatRiskAssessment,
    Maize: maizeRiskAssessment
};