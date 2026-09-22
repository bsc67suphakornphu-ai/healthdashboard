import React from 'react';
import { Users, Droplets, HeartPulse, Scale, ShieldAlert, TrendingUp } from 'lucide-react';
import { KpiSummary } from '../types.ts';

interface KpiOverviewProps {
  kpis: KpiSummary;
}

export const KpiOverview: React.FC<KpiOverviewProps> = ({ kpis }) => {
  return (
    <section id="health-overview-kpis" className="mb-8 scroll-mt-20">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-purple-700 inline-block"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950">
              ภาพรวมสุขภาพ (Health Overview)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
            สรุปตัวชี้วัดสำคัญ: จำนวน ค่าเฉลี่ย ค่าต่ำสุด-สูงสุด สัดส่วน และร้อยละ
          </p>
        </div>
        <div className="text-xs bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl font-medium self-start sm:self-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>สรุปจาก {kpis.totalCount} คนที่ผ่านการคัดกรอง</span>
        </div>
      </div>

      {/* Primary KPI Grid (6 comprehensive cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* KPI 1: จำนวน (Total Count) & สัดส่วน (Proportion: ชาย : หญิง) */}
        <div
          id="kpi-card-total-count"
          className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                1. จำนวน &amp; สัดส่วน
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-800">ผู้รับการคัดกรองทั้งหมด</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-purple-950 font-mono">
                {kpis.totalCount}
              </span>
              <span className="text-sm font-semibold text-slate-700">คน</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-50">
            <div className="flex items-center justify-between text-xs text-slate-800 mb-1.5">
              <span>สัดส่วนเพศ (ชาย : หญิง):</span>
              <span className="font-bold text-purple-900 font-mono">{kpis.genderRatio}</span>
            </div>
            {/* Visual bar proportion */}
            <div className="h-2 w-full bg-purple-100 rounded-full overflow-hidden flex">
              <div
                className="bg-purple-700 h-full"
                style={{ width: `${(kpis.maleCount / (kpis.totalCount || 1)) * 100}%` }}
                title={`ชาย: ${kpis.maleCount} คน`}
              ></div>
              <div
                className="bg-amber-400 h-full"
                style={{ width: `${(kpis.femaleCount / (kpis.totalCount || 1)) * 100}%` }}
                title={`หญิง: ${kpis.femaleCount} คน`}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-700 mt-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-700"></span>
                ชาย {kpis.maleCount} คน ({((kpis.maleCount / (kpis.totalCount || 1)) * 100).toFixed(0)}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                หญิง {kpis.femaleCount} คน ({((kpis.femaleCount / (kpis.totalCount || 1)) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2: ค่าเฉลี่ย (Average) & Min-Max: ระดับน้ำตาลในเลือด */}
        <div
          id="kpi-card-blood-sugar"
          className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                2. ค่าเฉลี่ย &amp; ต่ำสุด-สูงสุด
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-800">ค่าน้ำตาลในเลือดเฉลี่ย (FPG)</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-600 font-mono">
                {kpis.avgBloodSugar}
              </span>
              <span className="text-xs font-semibold text-slate-700">mg/dL</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-50 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-emerald-50/80 p-2 rounded-xl border border-emerald-200">
                <span className="text-emerald-700 block text-[11px] font-medium">ค่าต่ำสุด (Min)</span>
                <span className="font-bold text-emerald-900 font-mono text-sm">
                  {kpis.minBloodSugar} <span className="text-[10px] font-normal">mg/dL</span>
                </span>
              </div>
              <div className="bg-rose-50/80 p-2 rounded-xl border border-rose-200">
                <span className="text-rose-700 block text-[11px] font-medium">ค่าสูงสุด (Max)</span>
                <span className="font-bold text-rose-900 font-mono text-sm">
                  {kpis.maxBloodSugar} <span className="text-[10px] font-normal">mg/dL</span>
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-700 text-center">
              เกณฑ์ปกติ: &lt; 100 | เสี่ยง: 100-125 | เบาหวาน: &ge; 126 mg/dL
            </p>
          </div>
        </div>

        {/* KPI 3: ค่าเฉลี่ย BMI & Min-Max */}
        <div
          id="kpi-card-bmi"
          className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                3. ดัชนีมวลกาย (BMI)
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-800">ค่าเฉลี่ย BMI</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-purple-950 font-mono">
                {kpis.avgBmi}
              </span>
              <span className="text-xs font-semibold text-slate-700">kg/m²</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-medium ml-auto">
                {kpis.avgBmi >= 25 ? 'ท้วม/เกินเกณฑ์' : 'สมส่วน'}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-50">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-purple-50 p-2 rounded-xl border border-purple-200">
                <span className="text-purple-700 block text-[11px] font-medium">ต่ำสุด (Min BMI)</span>
                <span className="font-bold text-purple-950 font-mono text-sm">
                  {kpis.minBmi}
                </span>
              </div>
              <div className="bg-amber-50 p-2 rounded-xl border border-amber-200">
                <span className="text-amber-800 block text-[11px] font-medium">สูงสุด (Max BMI)</span>
                <span className="font-bold text-amber-900 font-mono text-sm">
                  {kpis.maxBmi}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-700 text-center mt-2">
              ค่าเฉลี่ยอายุ: {kpis.avgAge} ปี (ช่วง {kpis.minAge} - {kpis.maxAge} ปี)
            </p>
          </div>
        </div>

        {/* KPI 4: ร้อยละผู้มีความเสี่ยงสูง (High Risk Percentage) */}
        <div
          id="kpi-card-high-risk-pct"
          className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                4. ร้อยละ (Percentage)
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-800">ร้อยละผู้มีความเสี่ยงสูง</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-rose-600 font-mono">
                {kpis.highRiskPercentage}%
              </span>
              <span className="text-xs font-semibold text-slate-700">
                ({kpis.highRiskCount} จาก {kpis.totalCount} คน)
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-50 space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-rose-700">สูง: {kpis.highRiskCount} คน</span>
              <span className="text-amber-700">ปานกลาง: {kpis.moderateRiskCount} คน</span>
              <span className="text-emerald-700">ต่ำ: {kpis.lowRiskCount} คน</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="bg-rose-500 h-full"
                style={{ width: `${kpis.highRiskPercentage}%` }}
                title={`สูง: ${kpis.highRiskPercentage}%`}
              ></div>
              <div
                className="bg-amber-400 h-full"
                style={{ width: `${kpis.moderateRiskPercentage}%` }}
                title={`ปานกลาง: ${kpis.moderateRiskPercentage}%`}
              ></div>
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${kpis.lowRiskPercentage}%` }}
                title={`ต่ำ: ${kpis.lowRiskPercentage}%`}
              ></div>
            </div>
            <div className="text-[11px] text-slate-700 text-right">
              สัดส่วน (สูง:กลาง:ต่ำ) = {kpis.highRiskCount}:{kpis.moderateRiskCount}:{kpis.lowRiskCount}
            </div>
          </div>
        </div>

        {/* KPI 5: ร้อยละผู้มีแนวโน้ม/เสี่ยงเบาหวาน (Diabetes Screening Risk %) */}
        <div
          id="kpi-card-diabetes-pct"
          className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                5. ร้อยละความเสี่ยงเบาหวาน
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-800">ผู้คัดกรองเสี่ยงเบาหวาน</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-600 font-mono">
                {kpis.diabetesRiskPercentage}%
              </span>
              <span className="text-xs font-semibold text-slate-700">
                ({kpis.diabetesRiskCount} คน)
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-50">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="bg-amber-500 h-full transition-all"
                style={{ width: `${kpis.diabetesRiskPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-700 mt-2">
              <span className="text-amber-800 font-medium">
                มีแนวโน้ม/เสี่ยง: {kpis.diabetesRiskCount} คน
              </span>
              <span className="text-emerald-700 font-medium">
                ไม่มี: {kpis.totalCount - kpis.diabetesRiskCount} คน
              </span>
            </div>
            <p className="text-[11px] text-slate-700 mt-1">
              ผู้ที่มีน้ำตาล &ge; 100 mg/dL หรือมีความเสี่ยงพฤติกรรม
            </p>
          </div>
        </div>

        {/* KPI 6: ความดันโลหิตเฉลี่ย & ร้อยละเสี่ยงความดัน (Avg BP & Hypertension Risk %) */}
        <div
          id="kpi-card-bp"
          className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                6. ความดันโลหิต (BP mmHg)
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-800">ค่าเฉลี่ยความดัน (SBP / DBP)</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-purple-950 font-mono">
                {kpis.avgSbp} / {kpis.avgDbp}
              </span>
              <span className="text-xs font-semibold text-slate-700">mmHg</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-50">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-800">เสี่ยงความดันสูง:</span>
              <span className="font-bold text-purple-900 font-mono">
                {kpis.hypertensionRiskPercentage}% ({kpis.hypertensionRiskCount} คน)
              </span>
            </div>
            <div className="h-2 w-full bg-purple-100 rounded-full overflow-hidden">
              <div
                className="bg-purple-700 h-full transition-all"
                style={{ width: `${kpis.hypertensionRiskPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-700 mt-1.5">
              <span>ช่วง SBP: {kpis.minSbp} - {kpis.maxSbp}</span>
              <span>ช่วง DBP: {kpis.minDbp} - {kpis.maxDbp}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
