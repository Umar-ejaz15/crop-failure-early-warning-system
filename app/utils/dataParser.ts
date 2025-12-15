import * as XLSX from 'xlsx';

export interface CropCalendarData {
  country: string;
  crop: string;
  season: string;
  plantingStart: string;
  plantingEnd: string;
  harvestStart: string;
  harvestEnd: string;
  [key: string]: string | number;
}

export interface WeatherData {
  date: string;
  tavg: number | null;
  tmin: number | null;
  tmax: number | null;
  prcp: number | null;
  snow: number | null;
  wdir: number | null;
  wspd: number | null;
  wpgt: number | null;
  pres: number | null;
  tsun: number | null;
}

export async function parseExcelFile(filePath: string): Promise<any[]> {
  try {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(firstSheet);
    return data;
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    return [];
  }
}

export function processCropCalendarData(data: any[]): CropCalendarData[] {
  return data.map((row: any) => ({
    country: row.Country || row.country || '',
    crop: row.Crop || row.crop || '',
    season: row.Season || row.season || '',
    plantingStart: row['Planting Start'] || row.plantingStart || '',
    plantingEnd: row['Planting End'] || row.plantingEnd || '',
    harvestStart: row['Harvest Start'] || row.harvestStart || '',
    harvestEnd: row['Harvest End'] || row.harvestEnd || '',
    ...row
  }));
}

export function processWeatherData(data: any): WeatherData[] {
  if (!data || !data.data) return [];
  
  return data.data.map((entry: any) => ({
    date: entry.date,
    tavg: entry.tavg,
    tmin: entry.tmin,
    tmax: entry.tmax,
    prcp: entry.prcp,
    snow: entry.snow,
    wdir: entry.wdir,
    wspd: entry.wspd,
    wpgt: entry.wpgt,
    pres: entry.pres,
    tsun: entry.tsun
  }));
}

export function exportToJSON(data: any, filename: string) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
