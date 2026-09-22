import { HealthRecord, FilterState, KpiSummary } from '../types.ts';
import { DEFAULT_HEALTH_DATA } from '../data/defaultData.ts';

export const GOOGLE_SHEET_ID = '15RviumsJn4heZneTbaJj3XNs02zH0RyEn_Nv16413UA';
export const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit`;

export function normalizeThaiText(text: string): string {
  if (!text) return '';
  return text.trim();
}

export function parseCSV(csvText: string): HealthRecord[] {
  if (!csvText || typeof csvText !== 'string') return [];
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const records: HealthRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Split by comma taking basic quoting into account
    const parts = line.split(',').map((item) => item.replace(/^["']|["']$/g, '').trim());
    if (parts.length < 17) continue;

    let smoking = parts[12] || '';
    if (smoking.includes('ไม่สู')) smoking = 'ไม่สูบ';
    else if (smoking.includes('สูบ')) smoking = 'สูบ';

    let alcohol = parts[13] || '';
    if (alcohol.includes('ไม่ดื่ม') || alcohol.includes('ไม่ดื่')) alcohol = 'ไม่ดื่ม';
    else if (alcohol.includes('ดื่ม')) alcohol = 'ดื่ม';

    let exercise = parts[14] || '';
    if (exercise.includes('สม่ำเสมอ')) exercise = 'สม่ำเสมอ';
    else if (exercise.includes('บางครั้ง') || exercise.includes('บางครั้')) exercise = 'บางครั้ง';
    else if (exercise.includes('ไม่ออก')) exercise = 'ไม่ออกกำลังกาย';

    let month = parts[19] ? parts[19].replace(/\r/g, '').trim() : '';
    if (!month) {
      const dParts = (parts[1] || '').split('/');
      if (dParts.length === 3) {
        month = `${dParts[2]}-${dParts[1].padStart(2, '0')}`;
      }
    }

    records.push({
      id: parts[0] || `H${String(i).padStart(4, '0')}`,
      screenDate: parts[1] || '',
      area: parts[2] || 'ไม่ระบุ',
      gender: parts[3] || 'ไม่ระบุ',
      age: Number(parts[4]) || 0,
      heightCm: Number(parts[5]) || 0,
      weightKg: Number(parts[6]) || 0,
      bmi: Number(parts[7]) || 0,
      sbp: Number(parts[8]) || 0,
      dbp: Number(parts[9]) || 0,
      pulse: Number(parts[10]) || 0,
      bloodSugar: Number(parts[11]) || 0,
      smoking: smoking || 'ไม่สูบ',
      alcohol: alcohol || 'ไม่ดื่ม',
      exercise: exercise || 'บางครั้ง',
      diabetesRisk: parts[15] || 'ไม่มี',
      hypertensionRisk: parts[16] || 'ไม่มี',
      riskScore: Number(parts[17]) || 0,
      riskLevel: parts[18] || 'ต่ำ',
      month: month || '2026-01',
    });
  }

  return records.length > 0 ? records : DEFAULT_HEALTH_DATA;
}

export async function fetchHealthRecords(): Promise<{ data: HealthRecord[]; isLive: boolean; lastUpdated: string }> {
  const now = new Date().toLocaleString('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  });

  try {
    // Attempt local API proxy first
    const apiRes = await fetch('/api/health-data', { cache: 'no-store' });
    if (apiRes.ok) {
      const text = await apiRes.text();
      const parsed = parseCSV(text);
      if (parsed.length > 0) {
        return { data: parsed, isLive: true, lastUpdated: now };
      }
    }
  } catch {
    // API failed, try fallback
  }

  try {
    // Attempt direct Google Sheet fetch (in case CORS is permissible)
    const directRes = await fetch(`https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv`);
    if (directRes.ok) {
      const text = await directRes.text();
      const parsed = parseCSV(text);
      if (parsed.length > 0) {
        return { data: parsed, isLive: true, lastUpdated: now };
      }
    }
  } catch {
    // Fallback to default
  }

  return {
    data: DEFAULT_HEALTH_DATA,
    isLive: false,
    lastUpdated: now,
  };
}

export function calculateKpis(data: HealthRecord[]): KpiSummary {
  if (data.length === 0) {
    return {
      totalCount: 0,
      avgBloodSugar: 0,
      avgBmi: 0,
      avgAge: 0,
      avgSbp: 0,
      avgDbp: 0,
      avgRiskScore: 0,
      minBloodSugar: 0,
      minBmi: 0,
      minSbp: 0,
      minDbp: 0,
      minAge: 0,
      maxBloodSugar: 0,
      maxBmi: 0,
      maxSbp: 0,
      maxDbp: 0,
      maxAge: 0,
      maleCount: 0,
      femaleCount: 0,
      genderRatio: '0 : 0',
      highRiskCount: 0,
      highRiskPercentage: 0,
      moderateRiskCount: 0,
      moderateRiskPercentage: 0,
      lowRiskCount: 0,
      lowRiskPercentage: 0,
      diabetesRiskCount: 0,
      diabetesRiskPercentage: 0,
      hypertensionRiskCount: 0,
      hypertensionRiskPercentage: 0,
    };
  }

  const n = data.length;
  const bloodSugars = data.map((d) => d.bloodSugar);
  const bmis = data.map((d) => d.bmi);
  const ages = data.map((d) => d.age);
  const sbps = data.map((d) => d.sbp);
  const dbps = data.map((d) => d.dbp);
  const riskScores = data.map((d) => d.riskScore);

  const sum = (arr: number[]) => arr.reduce((acc, v) => acc + v, 0);

  const maleCount = data.filter((d) => d.gender === 'ชาย').length;
  const femaleCount = data.filter((d) => d.gender === 'หญิง').length;

  const highRiskCount = data.filter((d) => d.riskLevel === 'สูง').length;
  const moderateRiskCount = data.filter((d) => d.riskLevel === 'ปานกลาง').length;
  const lowRiskCount = data.filter((d) => d.riskLevel === 'ต่ำ').length;

  const diabetesRiskCount = data.filter((d) => d.diabetesRisk === 'มีแนวโน้ม/เสี่ยง').length;
  const hypertensionRiskCount = data.filter((d) => d.hypertensionRisk === 'มีแนวโน้ม/เสี่ยง').length;

  return {
    totalCount: n,
    avgBloodSugar: Number((sum(bloodSugars) / n).toFixed(1)),
    avgBmi: Number((sum(bmis) / n).toFixed(1)),
    avgAge: Number((sum(ages) / n).toFixed(1)),
    avgSbp: Number((sum(sbps) / n).toFixed(1)),
    avgDbp: Number((sum(dbps) / n).toFixed(1)),
    avgRiskScore: Number((sum(riskScores) / n).toFixed(1)),

    minBloodSugar: Math.min(...bloodSugars),
    minBmi: Math.min(...bmis),
    minSbp: Math.min(...sbps),
    minDbp: Math.min(...dbps),
    minAge: Math.min(...ages),

    maxBloodSugar: Math.max(...bloodSugars),
    maxBmi: Math.max(...bmis),
    maxSbp: Math.max(...sbps),
    maxDbp: Math.max(...dbps),
    maxAge: Math.max(...ages),

    maleCount,
    femaleCount,
    genderRatio: `${maleCount} : ${femaleCount}`,

    highRiskCount,
    highRiskPercentage: Number(((highRiskCount / n) * 100).toFixed(1)),
    moderateRiskCount,
    moderateRiskPercentage: Number(((moderateRiskCount / n) * 100).toFixed(1)),
    lowRiskCount,
    lowRiskPercentage: Number(((lowRiskCount / n) * 100).toFixed(1)),

    diabetesRiskCount,
    diabetesRiskPercentage: Number(((diabetesRiskCount / n) * 100).toFixed(1)),

    hypertensionRiskCount,
    hypertensionRiskPercentage: Number(((hypertensionRiskCount / n) * 100).toFixed(1)),
  };
}

export function filterRecords(data: HealthRecord[], filters: FilterState): HealthRecord[] {
  return data.filter((item) => {
    // Area filter
    if (filters.area !== 'ทั้งหมด' && item.area !== filters.area) {
      return false;
    }

    // Gender filter
    if (filters.gender !== 'ทั้งหมด' && item.gender !== filters.gender) {
      return false;
    }

    // Age group filter
    if (filters.ageGroup !== 'ทั้งหมด') {
      if (filters.ageGroup === '<35' && item.age >= 35) return false;
      if (filters.ageGroup === '35-49' && (item.age < 35 || item.age > 49)) return false;
      if (filters.ageGroup === '50-59' && (item.age < 50 || item.age > 59)) return false;
      if (filters.ageGroup === '60+' && item.age < 60) return false;
    }

    // Min / Max age
    if (item.age < filters.minAge || item.age > filters.maxAge) {
      return false;
    }

    // Diabetes filter
    if (filters.diabetesFilter !== 'ทั้งหมด' && item.diabetesRisk !== filters.diabetesFilter) {
      return false;
    }

    // Risk level filter
    if (filters.riskLevelFilter !== 'ทั้งหมด' && item.riskLevel !== filters.riskLevelFilter) {
      return false;
    }

    // Search query (id or area)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchId = item.id.toLowerCase().includes(q);
      const matchArea = item.area.toLowerCase().includes(q);
      if (!matchId && !matchArea) return false;
    }

    return true;
  });
}
