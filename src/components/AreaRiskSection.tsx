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
  Cell,
} from 'recharts';
import { MapPin, AlertOctagon, TrendingUp, Award, Compass } from 'lucide-react';
import { HealthRecord } from '../types.ts';

interface AreaRiskSectionProps {
  records: HealthRecord[];
}

export const AreaRiskSection: React.FC<AreaRiskSectionProps> = ({ records }) => {
  const uniqueAreas = Array.from(new Set(records.map((r) => r.area))).filter(Boolean);

  const areaStats = uniqueAreas.map((area) => {
    const areaRecords = records.filter((r) => r.area === area);
    const total = areaRecords.length;
    const highRiskCount = areaRecords.filter((r) => r.riskLevel === 'สูง').length;
    const highRiskPct = total > 0 ? Number(((highRiskCount / total) * 100).toFixed(1)) : 0;
    const avgScore = total > 0 ? Number((areaRecords.reduce((acc, r) => acc + r.riskScore, 0) / total).toFixed(1)) : 0;
    const avgSugar = total > 0 ? Number((areaRecords.reduce((acc, r) => acc + r.bloodSugar, 0) / total).toFixed(1)) : 0;
    const avgBmi = total > 0 ? Number((areaRecords.reduce((acc, r) => acc + r.bmi, 0) / total).toFixed(1)) : 0;
    const diabetesRiskCount = areaRecords.filter((r) => r.diabetesRisk === 'มีแนวโน้ม/เสี่ยง').length;

    return {
      area,
      total,
      highRiskCount,
      highRiskPct,
      avgScore,
      avgSugar,
      avgBmi,
      diabetesRiskCount,
    };
  });

  // Sort by highRiskPct descending
  const sortedAreaStats = [...areaStats].sort((a, b) => b.highRiskPct - a.highRiskPct);

  return (
    <section id="area-risk-section" className="mb-8 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-purple-700 inline-block"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950">
              วิเคราะห์พื้นที่ที่มีผู้เสี่ยงสูง (High-Risk Area Analysis)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
            เปรียบเทียบสัดส่วนกลุ่มเสี่ยงสูงและค่าเฉลี่ยสุขภาพตามแต่ละเขตพื้นที่
          </p>
        </div>
        <span className="text-xs bg-purple-100 text-purple-900 border border-purple-200 px-3 py-1.5 rounded-xl font-medium self-start sm:self-auto flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-purple-700" />
          <span>วิเคราะห์ครอบคลุม {uniqueAreas.length} พื้นที่</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart: High-risk percentage by Area */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-purple-100 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <span>ร้อยละผู้มีความเสี่ยงสูงจำแนกตามพื้นที่</span>
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-medium">
              Risk Rate %
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            อัตราส่วนผู้ที่มีผลการคัดกรองในระดับความเสี่ยง &quot;สูง&quot; ต่อจำนวนผู้คัดกรองในพื้นที่
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedAreaStats}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis dataKey="area" type="category" tick={{ fontSize: 12, fill: '#1e1b4b', fontWeight: 600 }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'อัตราผู้เสี่ยงสูง']}
                  contentStyle={{
                    backgroundColor: '#1e1b4b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="highRiskPct" radius={[0, 8, 8, 0]}>
                  {sortedAreaStats.map((entry, index) => (
                    <Cell
                      key={`area-cell-${index}`}
                      fill={
                        entry.highRiskPct >= 50
                          ? '#7c3aed' // purple-600
                          : entry.highRiskPct >= 30
                          ? '#d97706' // amber-600
                          : '#10b981' // emerald-500
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-auto pt-3 border-t border-purple-50 flex items-center justify-between text-xs text-slate-700">
            <span className="flex items-center gap-1.5 font-medium text-purple-950">
              <Award className="w-4 h-4 text-amber-500" />
              <span>พื้นที่เสี่ยงสูงที่สุด: <strong>{sortedAreaStats[0]?.area || '-'}</strong> ({sortedAreaStats[0]?.highRiskPct || 0}%)</span>
            </span>
            <span className="text-[11px] text-slate-600">
              พื้นที่เสี่ยงต่ำสุด: <strong>{sortedAreaStats[sortedAreaStats.length - 1]?.area || '-'}</strong>
            </span>
          </div>
        </div>

        {/* Area Ranking & Metrics Table */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-purple-100 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-700" />
              <span>ตารางจัดอันดับความเสี่ยงรายพื้นที่</span>
            </h3>
            <span className="text-[11px] text-slate-600">เรียงตาม % เสี่ยงสูง</span>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            แสดงคะแนนความเสี่ยงเฉลี่ย ค่าน้ำตาลเฉลี่ย และจำนวนกลุ่มเสี่ยง
          </p>

          <div className="overflow-x-auto my-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-purple-100 text-purple-950 bg-purple-50/50">
                  <th className="py-2.5 px-3 font-bold rounded-l-lg">พื้นที่</th>
                  <th className="py-2.5 px-2 font-bold text-center">คัดกรอง (คน)</th>
                  <th className="py-2.5 px-2 font-bold text-center">กลุ่มเสี่ยงสูง</th>
                  <th className="py-2.5 px-2 font-bold text-right">น้ำตาลเฉลี่ย</th>
                  <th className="py-2.5 px-3 font-bold text-right rounded-r-lg">คะแนนเฉลี่ย</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {sortedAreaStats.map((item, idx) => (
                  <tr
                    key={item.area}
                    className={`hover:bg-purple-50/40 transition-colors ${
                      idx === 0 ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-semibold text-purple-950 flex items-center gap-1.5">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          idx === 0
                            ? 'bg-amber-400 text-purple-950'
                            : idx === 1
                            ? 'bg-purple-200 text-purple-900'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span>{item.area}</span>
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono text-slate-700">
                      {item.total}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md font-bold text-[11px] ${
                          item.highRiskPct >= 50
                            ? 'bg-purple-100 text-purple-800'
                            : item.highRiskPct >= 30
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.highRiskCount} คน ({item.highRiskPct}%)
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono font-medium text-slate-700">
                      {item.avgSugar} <span className="text-[10px] text-slate-600">mg/dL</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-purple-950">
                      {item.avgScore} <span className="text-[10px] font-normal text-slate-600">/7</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-auto pt-3 border-t border-purple-50 flex items-center justify-between text-[11px] text-slate-600">
            <span>เกณฑ์ให้ความสำคัญ: พื้นที่เสี่ยงสูง &ge; 50% ต้องเฝ้าระวังและลงพื้นที่เชิงรุกทันที</span>
          </div>
        </div>

      </div>
    </section>
  );
};
