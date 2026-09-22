export interface HealthRecord {
  id: string; // รหัสบุคคล เช่น H0001
  screenDate: string; // วันที่คัดกรอง เช่น 3/1/2026
  area: string; // พื้นที่ เช่น เมือง, เหนือ, ใต้, ตะวันออก, ตะวันตก
  gender: 'ชาย' | 'หญิง' | string; // เพศ
  age: number; // อายุ
  heightCm: number; // ส่วนสูง_cm
  weightKg: number; // น้ำหนัก_kg
  bmi: number; // BMI
  sbp: number; // SBP_mmHg
  dbp: number; // DBP_mmHg
  pulse: number; // ชีพจร_bpm
  bloodSugar: number; // น้ำตาล_mg_dL
  smoking: 'สูบ' | 'ไม่สูบ' | string; // สูบบุหรี่
  alcohol: 'ดื่ม' | 'ไม่ดื่ม' | string; // ดื่มแอลกอฮอล์
  exercise: 'สม่ำเสมอ' | 'บางครั้ง' | 'ไม่ออกกำลังกาย' | string; // การออกกำลังกาย
  diabetesRisk: 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง' | string; // เบาหวาน_คัดกรอง
  hypertensionRisk: 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง' | string; // ความดันโลหิตสูง_คัดกรอง
  riskScore: number; // คะแนนความเสี่ยง
  riskLevel: 'ต่ำ' | 'ปานกลาง' | 'สูง' | string; // ระดับความเสี่ยง
  month: string; // เดือน เช่น 2026-01
}

export interface FilterState {
  area: string; // 'ทั้งหมด' or specific area
  gender: string; // 'ทั้งหมด', 'ชาย', 'หญิง'
  ageGroup: string; // 'ทั้งหมด', '<35', '35-49', '50-59', '60+'
  minAge: number;
  maxAge: number;
  diabetesFilter: string; // 'ทั้งหมด', 'มีแนวโน้ม/เสี่ยง', 'ไม่มี'
  riskLevelFilter: string; // 'ทั้งหมด', 'ต่ำ', 'ปานกลาง', 'สูง'
  searchQuery: string;
}

export interface KpiSummary {
  totalCount: number;
  
  // Averages
  avgBloodSugar: number;
  avgBmi: number;
  avgAge: number;
  avgSbp: number;
  avgDbp: number;
  avgRiskScore: number;

  // Min values
  minBloodSugar: number;
  minBmi: number;
  minSbp: number;
  minDbp: number;
  minAge: number;

  // Max values
  maxBloodSugar: number;
  maxBmi: number;
  maxSbp: number;
  maxDbp: number;
  maxAge: number;

  // Proportions
  maleCount: number;
  femaleCount: number;
  genderRatio: string; // e.g. "16 : 15"
  
  // Percentages
  highRiskCount: number;
  highRiskPercentage: number;
  moderateRiskCount: number;
  moderateRiskPercentage: number;
  lowRiskCount: number;
  lowRiskPercentage: number;

  diabetesRiskCount: number;
  diabetesRiskPercentage: number;

  hypertensionRiskCount: number;
  hypertensionRiskPercentage: number;
}
