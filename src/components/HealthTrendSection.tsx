import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, Calendar, Clock, Activity, Users } from 'lucide-react';
import { HealthRecord } from '../types.ts';

interface HealthTrendSectionProps {
  records: HealthRecord[];
}

export const HealthTrendSection: React.FC<HealthTrendSectionProps> = ({ records }) => {
  const [trendView, setTrendView] = useState<'volume' | 'risk' | 'clinical'>('risk');

  // Group by Month (2026-01, 2026-02, 2026-03)
  const monthMap: Record<
    string,
    {
      monthName: string;
      total: number;
      highRisk: number;
      mediumRisk: number;
      lowRisk: number;
      avgBloodSugar: number;
      avgBmi: number;
      avgSbp: number;
      sumBloodSugar: number;
      sumBmi: number;
      sumSbp: number;
      records: HealthRecord[];
    }
  > = {};

  const MONTH_LABELS: Record<string, string> = {
    '2026-01': 'ม.ค. 2026',
    '2026-02': 'ก.พ. 2026',
    '2026-03': 'มี.ค. 2026',
  };

  records.forEach((r) => {
    const m = r.month || '2026-01';
    if (!monthMap[m]) {
      monthMap[m] = {
        monthName: MONTH_LABELS[m] || m,
        total: 0,
        highRisk: 0,
        mediumRisk: 0,
        lowRisk: 0,
        avgBloodSugar: 0,
        avgBmi: 0,
        avgSbp: 0,
        sumBloodSugar: 0,
        sumBmi: 0,
        sumSbp: 0,
        records: [],
      };
    }
    monthMap[m].total += 1;
    if (r.riskLevel === 'สูง') monthMap[m].highRisk += 1;
    else if (r.riskLevel === 'ปานกลาง') monthMap[m].mediumRisk += 1;
    else monthMap[m].lowRisk += 1;

    monthMap[m].sumBloodSugar += r.bloodSugar;
    monthMap[m].sumBmi += r.bmi;
    monthMap[m].sumSbp += r.sbp;
    monthMap[m].records.push(r);
  });

  const monthlyTrendData = Object.keys(monthMap)
    .sort()
    .map((key) => {
      const item = monthMap[key];
      const count = item.total || 1;
      return {
        month: key,
        monthName: item.monthName,
        total: item.total,
        เสี่ยงสูง: item.highRisk,
        เสี่ยงปานกลาง: item.mediumRisk,
        เสี่ยงต่ำ: item.lowRisk,
        น้ำตาลเฉลี่ย: Number((item.sumBloodSugar / count).toFixed(1)),
        BMIเฉลี่ย: Number((item.sumBmi / count).toFixed(1)),
        ความดันSBPเฉลี่ย: Number((item.sumSbp / count).toFixed(1)),
      };
    });

  // Timeline by screening date
  const timelineData = [...records]
    .sort((a, b) => {
      const [d1, m1, y1] = a.screenDate.split('/').map(Number);
      const [d2, m2, y2] = b.screenDate.split('/').map(Number);
      const dateA = new Date(y1, m1 - 1, d1).getTime();
      const dateB = new Date(y2, m2 - 1, d2).getTime();
      return dateA - dateB;
    })
    .map((r) => ({
      date: r.screenDate,
      id: r.id,
      bloodSugar: r.bloodSugar,
      riskScore: r.riskScore,
      sbp: r.sbp,
      area: r.area,
    }));

  return (
    <section id="health-trend-section" className="mb-8 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-purple-700 inline-block"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950">
              แนวโน้มสุขภาพตามช่วงเวลา (Health Trend)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
            วิเคราะห์แนวโน้มผลคัดกรองจำแนกตามเดือนและวันที่คัดกรอง
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-purple-100 shadow-xs self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => setTrendView('risk')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              trendView === 'risk'
                ? 'bg-purple-600 text-white shadow-2xs font-semibold'
                : 'text-purple-900/70 hover:text-purple-950 hover:bg-purple-50'
            }`}
          >
            ระดับความเสี่ยง
          </button>
          <button
            type="button"
            onClick={() => setTrendView('clinical')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              trendView === 'clinical'
                ? 'bg-purple-600 text-white shadow-2xs font-semibold'
                : 'text-purple-900/70 hover:text-purple-950 hover:bg-purple-50'
            }`}
          >
            น้ำตาล &amp; ความดัน
          </button>
          <button
            type="button"
            onClick={() => setTrendView('volume')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              trendView === 'volume'
                ? 'bg-purple-600 text-white shadow-2xs font-semibold'
                : 'text-purple-900/70 hover:text-purple-950 hover:bg-purple-50'
            }`}
          >
            ปริมาณคัดกรอง
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Monthly Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-purple-100 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-700" />
              <span>แนวโน้มการคัดกรองรายเดือน (ม.ค. - มี.ค. 2026)</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              3 เดือนต่อเนื่อง
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {trendView === 'risk' ? (
                <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="monthName" tick={{ fontSize: 11, fill: '#475569' }} />
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
                  <Bar dataKey="เสี่ยงสูง" stackId="a" fill="#7c3aed" radius={[0, 0, 0, 0]} name="กลุ่มเสี่ยงสูง" />
                  <Bar dataKey="เสี่ยงปานกลาง" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} name="กลุ่มเสี่ยงปานกลาง" />
                  <Bar dataKey="เสี่ยงต่ำ" stackId="a" fill="#10b981" radius={[6, 6, 0, 0]} name="กลุ่มเสี่ยงต่ำ" />
                </BarChart>
              ) : trendView === 'clinical' ? (
                <LineChart data={monthlyTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="monthName" tick={{ fontSize: 11, fill: '#475569' }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#475569' }} domain={['auto', 'auto']} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#475569' }} domain={['auto', 'auto']} />
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
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="น้ำตาลเฉลี่ย"
                    stroke="#d97706"
                    strokeWidth={2.5}
                    name="น้ำตาลเฉลี่ย (mg/dL)"
                    dot={{ fill: '#d97706', r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="ความดันSBPเฉลี่ย"
                    stroke="#7c3aed"
                    strokeWidth={2.5}
                    name="ความดัน SBP เฉลี่ย (mmHg)"
                    dot={{ fill: '#7c3aed', r: 4 }}
                  />
                </LineChart>
              ) : (
                <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="monthName" tick={{ fontSize: 11, fill: '#475569' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e1b4b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#7c3aed"
                    fill="#ede9fe"
                    strokeWidth={2}
                    name="จำนวนผู้คัดกรองสะสม"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Highlights */}
          <div className="mt-4 pt-3 border-t border-purple-50 grid grid-cols-3 gap-3 text-center text-xs">
            {monthlyTrendData.map((m) => (
              <div key={m.month} className="bg-purple-50/40 p-2 rounded-xl border border-purple-100">
                <span className="font-semibold text-purple-950 block">{m.monthName}</span>
                <span className="text-slate-600 block text-[11px]">
                  คัดกรอง {m.total} คน
                </span>
                <span className="font-medium text-amber-700 block text-[11px] mt-0.5">
                  เสี่ยงสูง {m.เสี่ยงสูง} คน ({((m.เสี่ยงสูง / m.total) * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline by Screening Date (วันที่คัดกรอง) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-purple-100 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>ลำดับวันที่คัดกรอง</span>
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-medium">
              Timeline
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            การกระจายตัวค่าน้ำตาลในแต่ละรอบคัดกรอง
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 5, right: 10, left: -25, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9, fill: '#64748b' }}
                  angle={-45}
                  textAnchor="end"
                  interval={3}
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={['auto', 'auto']} />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white text-purple-950 p-2.5 rounded-xl text-xs space-y-1 shadow-md border border-purple-200">
                        <p className="font-bold text-purple-900">วันที่: {d.date}</p>
                        <p>พื้นที่: <span className="font-medium text-slate-700">{d.area}</span></p>
                        <p>น้ำตาล: <strong className="text-amber-600">{d.bloodSugar}</strong> mg/dL</p>
                        <p>คะแนนความเสี่ยง: {d.riskScore} คะแนน</p>
                      </div>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="bloodSugar"
                  stroke="#d97706"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#d97706' }}
                  activeDot={{ r: 5, fill: '#7c3aed' }}
                  name="ระดับน้ำตาล"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-auto pt-3 border-t border-purple-50 text-xs text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-purple-600" />
              <span>ตรวจวัดสม่ำเสมอตลอดไตรมาส</span>
            </span>
            <span className="font-medium text-purple-950">31 รอบ</span>
          </div>
        </div>

      </div>
    </section>
  );
};
