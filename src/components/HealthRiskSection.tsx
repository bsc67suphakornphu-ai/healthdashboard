import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
} from 'recharts';
import { ShieldAlert, AlertTriangle, CheckCircle, HeartPulse, Activity } from 'lucide-react';
import { HealthRecord } from '../types.ts';

interface HealthRiskSectionProps {
  records: HealthRecord[];
}

const RISK_COLORS: Record<string, string> = {
  ต่ำ: '#10b981', // emerald-500
  ปานกลาง: '#f59e0b', // amber-500
  สูง: '#8b5cf6', // purple-500
};

export const HealthRiskSection: React.FC<HealthRiskSectionProps> = ({ records }) => {
  // 1. ระดับความเสี่ยง (ต่ำ, ปานกลาง, สูง)
  const riskCounts = {
    ต่ำ: records.filter((r) => r.riskLevel === 'ต่ำ').length,
    ปานกลาง: records.filter((r) => r.riskLevel === 'ปานกลาง').length,
    สูง: records.filter((r) => r.riskLevel === 'สูง').length,
  };

  const riskPieData = [
    { name: 'ต่ำ', value: riskCounts['ต่ำ'], color: RISK_COLORS['ต่ำ'] },
    { name: 'ปานกลาง', value: riskCounts['ปานกลาง'], color: RISK_COLORS['ปานกลาง'] },
    { name: 'สูง', value: riskCounts['สูง'], color: '#7c3aed' },
  ];

  // 2. เบาหวาน_คัดกรอง และ ความดันโลหิตสูง_คัดกรอง
  const diseaseComparisonData = [
    {
      category: 'โรคเบาหวาน (DM)',
      มีแนวโน้มหรือเสี่ยง: records.filter((r) => r.diabetesRisk === 'มีแนวโน้ม/เสี่ยง').length,
      ไม่มีความเสี่ยง: records.filter((r) => r.diabetesRisk === 'ไม่มี').length,
    },
    {
      category: 'โรคความดันโลหิตสูง (HT)',
      มีแนวโน้มหรือเสี่ยง: records.filter((r) => r.hypertensionRisk === 'มีแนวโน้ม/เสี่ยง').length,
      ไม่มีความเสี่ยง: records.filter((r) => r.hypertensionRisk === 'ไม่มี').length,
    },
  ];

  // 3. BMI vs น้ำตาล_mg_dL scatter data with SBP/DBP in tooltip
  const scatterData = records.map((r) => ({
    id: r.id,
    bmi: r.bmi,
    bloodSugar: r.bloodSugar,
    sbp: r.sbp,
    dbp: r.dbp,
    riskLevel: r.riskLevel,
    diabetesRisk: r.diabetesRisk,
    area: r.area,
  }));

  return (
    <section id="health-risk-section" className="mb-8 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-amber-500 inline-block"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950">
              การวิเคราะห์ความเสี่ยงสุขภาพ (Health Risk)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
            จำแนกระดับความเสี่ยง, ผลคัดกรองเบาหวาน-ความดัน, ระดับน้ำตาลในเลือด (mg/dL), BMI และ Blood Pressure
          </p>
        </div>
      </div>

      {/* Grid of Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: สัดส่วนระดับความเสี่ยง (Pie / Donut Chart) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-purple-100 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-700" />
              <span>สัดส่วนระดับความเสี่ยง</span>
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 font-medium">
              3 ระดับ
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-2">
            ประเมินจากคะแนนความเสี่ยง (Risk Score 0-7)
          </p>

          <div className="h-56 w-full relative flex items-center justify-center">
            {records.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [
                      `${val} คน (${((Number(val) / (records.length || 1)) * 100).toFixed(1)}%)`,
                      `ความเสี่ยงระดับ${name}`,
                    ]}
                    contentStyle={{
                      backgroundColor: '#1e1b4b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-600">ไม่มีข้อมูลที่ตรงกับตัวกรอง</p>
            )}
          </div>

          {/* Legend Details */}
          <div className="mt-auto pt-3 border-t border-purple-50 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-purple-50/70 p-2 rounded-xl border border-purple-200">
              <span className="flex items-center justify-center gap-1 text-[11px] text-purple-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span> เสี่ยงสูง
              </span>
              <span className="text-base font-bold text-purple-950 font-mono block mt-0.5">
                {riskCounts['สูง']}
              </span>
              <span className="text-[10px] text-slate-600">
                {((riskCounts['สูง'] / (records.length || 1)) * 100).toFixed(0)}%
              </span>
            </div>

            <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-200">
              <span className="flex items-center justify-center gap-1 text-[11px] text-amber-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> ปานกลาง
              </span>
              <span className="text-base font-bold text-amber-950 font-mono block mt-0.5">
                {riskCounts['ปานกลาง']}
              </span>
              <span className="text-[10px] text-slate-600">
                {((riskCounts['ปานกลาง'] / (records.length || 1)) * 100).toFixed(0)}%
              </span>
            </div>

            <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-200">
              <span className="flex items-center justify-center gap-1 text-[11px] text-emerald-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> เสี่ยงต่ำ
              </span>
              <span className="text-base font-bold text-emerald-950 font-mono block mt-0.5">
                {riskCounts['ต่ำ']}
              </span>
              <span className="text-[10px] text-slate-600">
                {((riskCounts['ต่ำ'] / (records.length || 1)) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Chart 2: เปรียบเทียบผลคัดกรองเบาหวาน vs ความดัน (Grouped Bar Chart) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-purple-100 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-amber-600" />
              <span>คัดกรองเบาหวาน &amp; ความดันโลหิต</span>
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-medium">
              DM vs HT
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-2">
            เปรียบเทียบจำนวนผู้มีแนวโน้ม/เสี่ยง กับกลุ่มปกติ
          </p>

          <div className="h-56 w-full">
            {records.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diseaseComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#475569' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e1b4b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar
                    dataKey="มีแนวโน้มหรือเสี่ยง"
                    fill="#d97706" // amber-600
                    radius={[6, 6, 0, 0]}
                    name="มีแนวโน้ม/เสี่ยง"
                  />
                  <Bar
                    dataKey="ไม่มีความเสี่ยง"
                    fill="#7c3aed" // purple-600
                    radius={[6, 6, 0, 0]}
                    name="ปกติ/ไม่มี"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>

          <div className="mt-auto pt-3 border-t border-purple-50 text-xs text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>เสี่ยงเบาหวาน: <strong>{diseaseComparisonData[0].มีแนวโน้มหรือเสี่ยง} คน</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-purple-600" />
              <span>เสี่ยงความดัน: <strong>{diseaseComparisonData[1].มีแนวโน้มหรือเสี่ยง} คน</strong></span>
            </span>
          </div>
        </div>

        {/* Chart 3: ความสัมพันธ์ BMI vs น้ำตาล_mg_dL & ความดัน (Scatter / Distribution) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-purple-100 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-700" />
              <span>ความสัมพันธ์ BMI vs ค่าน้ำตาล</span>
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-medium">
              Scatter Plot
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-2">
            แกน X = BMI | แกน Y = น้ำตาล (mg/dL) พร้อมเกณฑ์เตือน
          </p>

          <div className="h-56 w-full">
            {records.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 5, left: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    dataKey="bmi"
                    name="BMI"
                    unit=" "
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 10, fill: '#475569' }}
                    label={{ value: 'BMI', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis
                    type="number"
                    dataKey="bloodSugar"
                    name="น้ำตาล"
                    unit=" mg/dL"
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 10, fill: '#475569' }}
                  />
                  <ZAxis range={[50, 50]} />
                  <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'เกณฑ์เสี่ยง 100', fill: '#d97706', fontSize: 10 }} />
                  <ReferenceLine y={126} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'เกณฑ์เบาหวาน 126', fill: '#dc2626', fontSize: 10 }} />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white text-purple-950 p-2.5 rounded-xl text-xs space-y-1 shadow-md border border-purple-200">
                          <p className="font-bold text-purple-900">พื้นที่: {data.area} ({data.gender}, {data.age} ปี)</p>
                          <p>BMI: <span className="font-mono text-slate-700">{data.bmi}</span> kg/m²</p>
                          <p>น้ำตาล: <span className="font-mono font-bold text-amber-600">{data.bloodSugar}</span> mg/dL</p>
                          <p>ความดัน: <span className="font-mono text-slate-700">{data.sbp}/{data.dbp}</span> mmHg</p>
                          <p>ระดับความเสี่ยง: <span className="font-semibold text-purple-700">{data.riskLevel}</span></p>
                        </div>
                      );
                    }}
                  />
                  <Scatter
                    name="ผู้รับการคัดกรอง"
                    data={scatterData}
                    fill="#7c3aed"
                  >
                    {scatterData.map((entry, index) => (
                      <Cell
                        key={`scatter-cell-${index}`}
                        fill={
                          entry.bloodSugar >= 126
                            ? '#dc2626'
                            : entry.bloodSugar >= 100
                            ? '#f59e0b'
                            : '#10b981'
                        }
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            ) : null}
          </div>

          <div className="mt-auto pt-3 border-t border-purple-50 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-emerald-800 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> ปกติ (&lt;100)
            </span>
            <span className="flex items-center gap-1 text-amber-800 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> เสี่ยง (100-125)
            </span>
            <span className="flex items-center gap-1 text-rose-800 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> สูง (&ge;126)
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
