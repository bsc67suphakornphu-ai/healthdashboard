import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Flame, Wine, Dumbbell, Scale } from 'lucide-react';
import { HealthRecord } from '../types.ts';

interface HealthBehaviorSectionProps {
  records: HealthRecord[];
}

export const HealthBehaviorSection: React.FC<HealthBehaviorSectionProps> = ({ records }) => {
  // 1. พฤติกรรมการสูบบุหรี่
  const smokingStats = {
    สูบ: records.filter((r) => r.smoking === 'สูบ'),
    ไม่สูบ: records.filter((r) => r.smoking === 'ไม่สูบ'),
  };

  // 2. พฤติกรรมการดื่มแอลกอฮอล์
  const alcoholStats = {
    ดื่ม: records.filter((r) => r.alcohol === 'ดื่ม'),
    ไม่ดื่ม: records.filter((r) => r.alcohol === 'ไม่ดื่ม'),
  };

  // 3. พฤติกรรมการออกกำลังกาย
  const exerciseStats = {
    สม่ำเสมอ: records.filter((r) => r.exercise === 'สม่ำเสมอ'),
    บางครั้ง: records.filter((r) => r.exercise === 'บางครั้ง'),
    ไม่ออกกำลังกาย: records.filter((r) => r.exercise === 'ไม่ออกกำลังกาย'),
  };

  // Compute stats per exercise group
  const getGroupStats = (group: HealthRecord[]) => {
    if (!group.length) return { avgBmi: 0, avgBloodSugar: 0, avgWeight: 0, avgHeight: 0, count: 0, highRiskPct: 0 };
    const avgBmi = Number((group.reduce((acc, r) => acc + r.bmi, 0) / group.length).toFixed(1));
    const avgBloodSugar = Number((group.reduce((acc, r) => acc + r.bloodSugar, 0) / group.length).toFixed(1));
    const avgWeight = Number((group.reduce((acc, r) => acc + r.weightKg, 0) / group.length).toFixed(1));
    const avgHeight = Number((group.reduce((acc, r) => acc + r.heightCm, 0) / group.length).toFixed(1));
    const highRiskCount = group.filter((r) => r.riskLevel === 'สูง').length;
    const highRiskPct = Number(((highRiskCount / group.length) * 100).toFixed(0));
    return { avgBmi, avgBloodSugar, avgWeight, avgHeight, count: group.length, highRiskPct };
  };

  const exerciseComparisonData = [
    {
      group: 'สม่ำเสมอ',
      ...getGroupStats(exerciseStats['สม่ำเสมอ']),
    },
    {
      group: 'บางครั้ง',
      ...getGroupStats(exerciseStats['บางครั้ง']),
    },
    {
      group: 'ไม่ออกกำลังกาย',
      ...getGroupStats(exerciseStats['ไม่ออกกำลังกาย']),
    },
  ];

  return (
    <section id="health-behavior-section" className="mb-8 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-amber-500 inline-block"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950">
              พฤติกรรมสุขภาพ &amp; ปัจจัยเสี่ยง (Health Behavior)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
            วิเคราะห์พฤติกรรมการสูบบุหรี่, ดื่มแอลกอฮอล์, การออกกำลังกาย และความสัมพันธ์กับ น้ำหนัก-ส่วนสูง และ BMI
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Behavior 1: ผลของการออกกำลังกายต่อ BMI และระดับน้ำตาล */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-purple-100 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-purple-700" />
              <span>การออกกำลังกาย สัมพันธ์กับ BMI &amp; น้ำตาล</span>
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-medium">
              Exercise vs Biomarkers
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            เปรียบเทียบค่าเฉลี่ย BMI (kg/m²) และระดับน้ำตาล (mg/dL) ตามความถี่การออกกำลังกาย
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exerciseComparisonData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="group" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis yAxisId="bmi" domain={[15, 35]} tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis yAxisId="sugar" orientation="right" domain={[70, 160]} tick={{ fontSize: 11, fill: '#475569' }} />
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
                <Bar yAxisId="bmi" dataKey="avgBmi" fill="#7c3aed" radius={[6, 6, 0, 0]} name="BMI เฉลี่ย (kg/m²)" />
                <Bar yAxisId="sugar" dataKey="avgBloodSugar" fill="#d97706" radius={[6, 6, 0, 0]} name="น้ำตาลเฉลี่ย (mg/dL)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-auto pt-3 border-t border-purple-50 grid grid-cols-3 gap-2 text-center text-xs">
            {exerciseComparisonData.map((ex) => (
              <div key={ex.group} className="bg-purple-50/50 p-2 rounded-xl border border-purple-100">
                <span className="font-bold text-purple-950 block">{ex.group}</span>
                <span className="text-[11px] text-slate-600 block">{ex.count} คน</span>
                <span className="text-[11px] font-semibold text-rose-700 block mt-0.5">
                  เสี่ยงสูง {ex.highRiskPct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Behavior 2: สูบบุหรี่ & ดื่มแอลกอฮอล์ */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-purple-100 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-600" />
              <span>พฤติกรรมเสี่ยง: บุหรี่ &amp; สุรา</span>
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-medium">
              Smoking &amp; Alcohol
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            สัดส่วนผู้มีพฤติกรรมเสี่ยงและผลกระทบต่อระดับน้ำตาล
          </p>

          <div className="space-y-4 my-auto">
            {/* Smoking Card */}
            <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-1.5 text-purple-950">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>การสูบบุหรี่</span>
                </span>
                <span className="text-rose-700 font-mono font-bold">
                  สูบ {smokingStats['สูบ'].length} คน ({((smokingStats['สูบ'].length / (records.length || 1)) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="h-2 w-full bg-purple-200/60 rounded-full overflow-hidden flex">
                <div
                  className="bg-rose-500 h-full"
                  style={{ width: `${(smokingStats['สูบ'].length / (records.length || 1)) * 100}%` }}
                ></div>
                <div
                  className="bg-emerald-500 h-full"
                  style={{ width: `${(smokingStats['ไม่สูบ'].length / (records.length || 1)) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600 mt-2">
                <span>น้ำตาลเฉลี่ยกลุ่มสูบ: <strong className="text-rose-700">{getGroupStats(smokingStats['สูบ']).avgBloodSugar}</strong> mg/dL</span>
                <span>ไม่สูบ: <strong className="text-emerald-700">{getGroupStats(smokingStats['ไม่สูบ']).avgBloodSugar}</strong> mg/dL</span>
              </div>
            </div>

            {/* Alcohol Card */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-1.5 text-amber-950">
                  <Wine className="w-4 h-4 text-amber-600" />
                  <span>การดื่มแอลกอฮอล์</span>
                </span>
                <span className="text-amber-800 font-mono font-bold">
                  ดื่ม {alcoholStats['ดื่ม'].length} คน ({((alcoholStats['ดื่ม'].length / (records.length || 1)) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="h-2 w-full bg-amber-200/60 rounded-full overflow-hidden flex">
                <div
                  className="bg-amber-500 h-full"
                  style={{ width: `${(alcoholStats['ดื่ม'].length / (records.length || 1)) * 100}%` }}
                ></div>
                <div
                  className="bg-emerald-500 h-full"
                  style={{ width: `${(alcoholStats['ไม่ดื่ม'].length / (records.length || 1)) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600 mt-2">
                <span>น้ำตาลเฉลี่ยกลุ่มดื่ม: <strong className="text-amber-800">{getGroupStats(alcoholStats['ดื่ม']).avgBloodSugar}</strong> mg/dL</span>
                <span>ไม่ดื่ม: <strong className="text-emerald-700">{getGroupStats(alcoholStats['ไม่ดื่ม']).avgBloodSugar}</strong> mg/dL</span>
              </div>
            </div>

            {/* Physical Profile Summary */}
            <div className="p-3 rounded-xl bg-white border border-purple-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-purple-700" />
                <span className="text-slate-700">สรีระเฉลี่ยรวม:</span>
              </div>
              <div className="flex items-center gap-3 font-semibold text-purple-950">
                <span>น้ำหนัก: {Number((records.reduce((acc, r) => acc + r.weightKg, 0) / (records.length || 1)).toFixed(1))} kg</span>
                <span>|</span>
                <span>ส่วนสูง: {Number((records.reduce((acc, r) => acc + r.heightCm, 0) / (records.length || 1)).toFixed(1))} cm</span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-purple-50 text-[11px] text-slate-600 text-center">
            ข้อสรุป: ผู้ที่ดื่มแอลกอฮอล์และสูบบุหรี่มีอัตราน้ำตาลในเลือดและค่า BMI สูงกว่ากลุ่มทั่วไปอย่างเห็นได้ชัด
          </div>
        </div>

      </div>
    </section>
  );
};
