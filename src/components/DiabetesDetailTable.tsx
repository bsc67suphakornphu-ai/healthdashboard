import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Droplets,
} from 'lucide-react';
import { HealthRecord } from '../types.ts';

interface DiabetesDetailTableProps {
  records: HealthRecord[];
}

type SortField = 'screenDate' | 'age' | 'bloodSugar' | 'bmi' | 'sbp' | 'riskScore';

export const DiabetesDetailTable: React.FC<DiabetesDetailTableProps> = ({ records }) => {
  const [filterDiabetes, setFilterDiabetes] = useState<string>('ทั้งหมด');
  const [search, setSearch] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('bloodSugar');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Filtered dataset (excluding person ID from matching)
  const filtered = useMemo(() => {
    return records.filter((r) => {
      // Diabetes filter
      if (filterDiabetes !== 'ทั้งหมด' && r.diabetesRisk !== filterDiabetes) {
        return false;
      }
      // Search by area, gender, or month
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchArea = r.area.toLowerCase().includes(q);
        const matchGender = r.gender.toLowerCase().includes(q);
        const matchMonth = r.month.toLowerCase().includes(q);
        if (!matchArea && !matchGender && !matchMonth) return false;
      }
      return true;
    });
  }, [records, filterDiabetes, search]);

  // Sorted dataset
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'screenDate') {
        const [d1, m1, y1] = a.screenDate.split('/').map(Number);
        const [d2, m2, y2] = b.screenDate.split('/').map(Number);
        valA = new Date(y1, m1 - 1, d1).getTime();
        valB = new Date(y2, m2 - 1, d2).getTime();
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = useMemo(() => {
    if (pageSize >= 1000) return sorted;
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for metrics
    }
  };

  // Export CSV (excluding person ID for privacy)
  const handleExportCsv = () => {
    const headers = [
      'ลำดับ',
      'วันที่คัดกรอง',
      'พื้นที่',
      'เพศ',
      'อายุ',
      'ส่วนสูง_cm',
      'น้ำหนัก_kg',
      'BMI',
      'SBP_mmHg',
      'DBP_mmHg',
      'ชีพจร_bpm',
      'น้ำตาล_mg_dL',
      'สูบบุหรี่',
      'ดื่มแอลกอฮอล์',
      'การออกกำลังกาย',
      'เบาหวาน_คัดกรอง',
      'ความดันโลหิตสูง_คัดกรอง',
      'คะแนนความเสี่ยง',
      'ระดับความเสี่ยง',
      'เดือน',
    ];

    const rows = sorted.map((r, index) => [
      index + 1,
      r.screenDate,
      r.area,
      r.gender,
      r.age,
      r.heightCm,
      r.weightKg,
      r.bmi,
      r.sbp,
      r.dbp,
      r.pulse,
      r.bloodSugar,
      r.smoking,
      r.alcohol,
      r.exercise,
      r.diabetesRisk,
      r.hypertensionRisk,
      r.riskScore,
      r.riskLevel,
      r.month,
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diabetes_screening_data_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="diabetes-detail-table" className="mb-8 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-amber-400 inline-block"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950">
              รายละเอียดเชิงลึก: เบาหวาน_คัดกรอง (Diabetes Detail View)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-purple-900/70 mt-0.5">
            แสดงข้อมูลคัดกรอง พร้อมการเน้นสีตามเกณฑ์ทางคลินิก (Conditional Formatting)
          </p>
        </div>

        {/* Export Button (soft amber style) */}
        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-300 hover:bg-amber-400 text-purple-950 font-semibold text-xs transition-colors self-start sm:self-auto border border-amber-400/60 shadow-2xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>ส่งออก CSV (Export)</span>
        </button>
      </div>

      {/* Main Table Card with soft border */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-xs overflow-hidden">
        
        {/* Controls Bar */}
        <div className="p-4 border-b border-purple-100/80 bg-purple-50/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Diabetes Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-purple-900 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-amber-500" />
              <span>กลุ่มเบาหวาน:</span>
            </span>
            {[
              { id: 'ทั้งหมด', label: 'ทั้งหมด' },
              { id: 'มีแนวโน้ม/เสี่ยง', label: 'มีแนวโน้ม/เสี่ยงเบาหวาน' },
              { id: 'ไม่มี', label: 'ปกติ / ไม่มีความเสี่ยง' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setFilterDiabetes(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterDiabetes === tab.id
                    ? 'bg-purple-600 text-white shadow-2xs font-semibold'
                    : 'bg-white text-purple-900 hover:bg-purple-100/70 border border-purple-200/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search by Area and Page Size */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาพื้นที่..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-white border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-lg px-3 py-1.5 pl-8 text-purple-950 placeholder-purple-400 outline-hidden"
              />
              <Search className="w-3.5 h-3.5 text-purple-400 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-xs bg-white border border-purple-200 rounded-lg px-2.5 py-1.5 text-purple-900 outline-hidden"
            >
              <option value={10}>10 รายการ/หน้า</option>
              <option value={20}>20 รายการ/หน้า</option>
              <option value={9999}>ทั้งหมด ({sorted.length})</option>
            </select>
          </div>
        </div>

        {/* Color Legend (Conditional Formatting Guide - soft palette) */}
        <div className="px-4 py-2.5 bg-amber-50/50 border-b border-purple-100/60 flex flex-wrap items-center gap-4 text-xs">
          <span className="font-semibold text-purple-950 flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-amber-500" />
            <span>เกณฑ์สีค่าน้ำตาล:</span>
          </span>
          <span className="flex items-center gap-1 text-emerald-800 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            &lt; 100 mg/dL (ระดับปกติ)
          </span>
          <span className="flex items-center gap-1 text-amber-900 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            100 - 125 mg/dL (กลุ่มเสี่ยง IFG)
          </span>
          <span className="flex items-center gap-1 text-rose-800 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            &ge; 126 mg/dL (สงสัยเบาหวาน)
          </span>
        </div>

        {/* Table Content (Softer table header & no person ID column) */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-purple-200 bg-purple-100/80 text-purple-950 select-none">
                <th className="py-3 px-3.5 font-bold text-center w-12">
                  ลำดับ
                </th>
                <th
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-purple-700"
                  onClick={() => handleSort('screenDate')}
                >
                  <div className="flex items-center gap-1">
                    <span>วันที่</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold">พื้นที่</th>
                <th className="py-3 px-3 font-semibold">เพศ/อายุ</th>
                <th
                  className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-purple-700"
                  onClick={() => handleSort('bloodSugar')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>น้ำตาล (mg/dL)</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  className="py-3 px-3 font-semibold text-center cursor-pointer hover:text-purple-700"
                  onClick={() => handleSort('bmi')}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>BMI</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  className="py-3 px-3 font-semibold text-center cursor-pointer hover:text-purple-700"
                  onClick={() => handleSort('sbp')}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>ความดัน (mmHg)</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold text-center">
                  <span>เบาหวาน_คัดกรอง</span>
                </th>
                <th className="py-3 px-3 font-semibold text-center">
                  <span>ความดัน_คัดกรอง</span>
                </th>
                <th
                  className="py-3 px-3 font-semibold text-center cursor-pointer hover:text-purple-700"
                  onClick={() => handleSort('riskScore')}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>คะแนน</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-3.5 font-semibold text-center">
                  <span>ระดับความเสี่ยง</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-purple-50">
              {paginated.length > 0 ? (
                paginated.map((r, index) => {
                  const isHighSugar = r.bloodSugar >= 126;
                  const isWarningSugar = r.bloodSugar >= 100 && r.bloodSugar < 126;
                  const isDiabetesRisk = r.diabetesRisk === 'มีแนวโน้ม/เสี่ยง';
                  const rowNumber = (currentPage - 1) * pageSize + index + 1;

                  return (
                    <tr
                      key={`row-${index}`}
                      className={`hover:bg-purple-50/50 transition-colors ${
                        isHighSugar
                          ? 'bg-rose-50/25'
                          : isWarningSugar
                          ? 'bg-amber-50/20'
                          : index % 2 === 0
                          ? 'bg-white'
                          : 'bg-purple-50/15'
                      }`}
                    >
                      {/* Row Index */}
                      <td className="py-3 px-3.5 text-center font-mono text-purple-700 font-medium">
                        {rowNumber}
                      </td>

                      {/* Screen Date */}
                      <td className="py-3 px-3 text-purple-900 font-mono">
                        {r.screenDate}
                      </td>

                      {/* Area */}
                      <td className="py-3 px-3 font-medium text-purple-950">
                        {r.area}
                      </td>

                      {/* Gender & Age */}
                      <td className="py-3 px-3 text-purple-900">
                        <span>{r.gender}</span>, <span className="font-mono">{r.age}</span> ปี
                      </td>

                      {/* Blood Sugar (Conditional Formatting) */}
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded-md text-xs ${
                              isHighSugar
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : isWarningSugar
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {r.bloodSugar}
                          </span>
                        </div>
                      </td>

                      {/* BMI */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`font-mono font-semibold px-2 py-0.5 rounded-md ${
                            r.bmi >= 30
                              ? 'bg-rose-50 text-rose-700'
                              : r.bmi >= 25
                              ? 'bg-amber-50 text-amber-800'
                              : 'text-purple-900'
                          }`}
                        >
                          {r.bmi}
                        </span>
                      </td>

                      {/* BP (SBP / DBP) */}
                      <td className="py-3 px-3 text-center font-mono">
                        <span
                          className={
                            r.sbp >= 140 || r.dbp >= 90
                              ? 'text-rose-700 font-bold'
                              : 'text-purple-900'
                          }
                        >
                          {r.sbp}/{r.dbp}
                        </span>
                      </td>

                      {/* เบาหวาน_คัดกรอง (Highlight Badge) */}
                      <td className="py-3 px-3 text-center">
                        {isDiabetesRisk ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-200/90 text-purple-950 border border-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-700" />
                            <span>มีแนวโน้ม/เสี่ยง</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>ไม่มี</span>
                          </span>
                        )}
                      </td>

                      {/* ความดัน_คัดกรอง */}
                      <td className="py-3 px-3 text-center">
                        {r.hypertensionRisk === 'มีแนวโน้ม/เสี่ยง' ? (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-100 text-purple-800 border border-purple-200">
                            มีแนวโน้ม/เสี่ยง
                          </span>
                        ) : (
                          <span className="text-purple-500 text-[11px]">ไม่มี</span>
                        )}
                      </td>

                      {/* Risk Score */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-purple-950">
                        {r.riskScore}
                      </td>

                      {/* Risk Level */}
                      <td className="py-3 px-3.5 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            r.riskLevel === 'สูง'
                              ? 'bg-purple-200 text-purple-950 border border-purple-300'
                              : r.riskLevel === 'ปานกลาง'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {r.riskLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-purple-500">
                    ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="p-4 border-t border-purple-100 bg-purple-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-purple-800">
          <div>
            แสดง {sorted.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} ถึง{' '}
            {Math.min(currentPage * pageSize, sorted.length)} จากทั้งหมด{' '}
            <strong className="text-purple-950 font-bold">{sorted.length}</strong> รายการ
          </div>

          <div className="flex items-center gap-1.5 self-center sm:self-auto">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-1.5 rounded-lg border border-purple-200 text-purple-800 hover:bg-purple-100 disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-medium text-purple-950">
              หน้า {currentPage} จาก {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-1.5 rounded-lg border border-purple-200 text-purple-800 hover:bg-purple-100 disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
