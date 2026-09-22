import { useState, useEffect, useMemo, useCallback } from 'react';
import { HealthRecord, FilterState } from './types.ts';
import { DEFAULT_HEALTH_DATA } from './data/defaultData.ts';
import {
  fetchHealthRecords,
  calculateKpis,
  filterRecords,
  GOOGLE_SHEET_ID,
  GOOGLE_SHEET_URL,
} from './utils/sheetParser.ts';

import { Header } from './components/Header.tsx';
import { Navigation } from './components/Navigation.tsx';
import { FilterBar } from './components/FilterBar.tsx';
import { KpiOverview } from './components/KpiOverview.tsx';
import { HealthRiskSection } from './components/HealthRiskSection.tsx';
import { HealthTrendSection } from './components/HealthTrendSection.tsx';
import { HealthBehaviorSection } from './components/HealthBehaviorSection.tsx';
import { AreaRiskSection } from './components/AreaRiskSection.tsx';
import { DiabetesDetailTable } from './components/DiabetesDetailTable.tsx';

import { Activity, Database, ExternalLink, X, Heart } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  area: 'ทั้งหมด',
  gender: 'ทั้งหมด',
  ageGroup: 'ทั้งหมด',
  minAge: 0,
  maxAge: 120,
  diabetesFilter: 'ทั้งหมด',
  riskLevelFilter: 'ทั้งหมด',
  searchQuery: '',
};

export default function App() {
  const [records, setRecords] = useState<HealthRecord[]>(DEFAULT_HEALTH_DATA);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>(() =>
    new Date().toLocaleString('th-TH', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    })
  );
  const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);

  // Load data on initial mount
  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsLoading(true);
    try {
      const result = await fetchHealthRecords();
      setRecords(result.data);
      setIsLive(result.isLive);
      setLastUpdated(result.lastUpdated);
    } catch (err) {
      console.error('Failed to load records:', err);
    } finally {
      if (isRefresh) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // Compute filtered dataset
  const filteredRecords = useMemo(() => {
    return filterRecords(records, filters);
  }, [records, filters]);

  // Compute KPI summary
  const kpis = useMemo(() => {
    return calculateKpis(filteredRecords);
  }, [filteredRecords]);

  // Calculate active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.area !== 'ทั้งหมด') count++;
    if (filters.gender !== 'ทั้งหมด') count++;
    if (filters.ageGroup !== 'ทั้งหมด') count++;
    if (filters.diabetesFilter !== 'ทั้งหมด') count++;
    if (filters.riskLevelFilter !== 'ทั้งหมด') count++;
    if (filters.searchQuery.trim()) count++;
    return count;
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col antialiased">
      {/* 1. Header (ส่วนหัวและระบบควบคุม) */}
      <Header
        lastUpdated={lastUpdated}
        isLive={isLive}
        isLoading={isLoading}
        onRefresh={() => loadData(true)}
        totalRecords={records.length}
        filteredRecords={filteredRecords.length}
        onToggleMobileFilter={() => setShowMobileFilter(true)}
      />

      {/* 5. Navigation Controls (ระบบนำทาง & Responsive) */}
      <Navigation />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full grow">
        
        {/* Filter Bar (Section 1: ระบบควบคุมและตัวกรอง) */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          allRecords={filteredRecords}
          activeFilterCount={activeFilterCount}
        />

        {/* 2. Health Overview (KPI Cards / Summary Cards) */}
        <KpiOverview kpis={kpis} />

        {/* 3.1 Health Risk Visualizations */}
        <HealthRiskSection records={filteredRecords} />

        {/* 3.2 Health Trend Visualizations */}
        <HealthTrendSection records={filteredRecords} />

        {/* 3.3 Health Behavior Visualizations */}
        <HealthBehaviorSection records={filteredRecords} />

        {/* 3.4 Area High-Risk Analysis (พื้นที่ที่มีผู้เสี่ยงสูง) */}
        <AreaRiskSection records={filteredRecords} />

        {/* 4. Detail View / Data Table (เบาหวาน_คัดกรอง & Conditional Formatting) */}
        <DiabetesDetailTable records={filteredRecords} />

      </main>

      {/* Mobile Filter Drawer / Modal */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end md:hidden">
          <div className="w-full max-w-sm bg-white h-full p-5 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                <h3 className="font-bold text-purple-950 text-base">ตัวกรองข้อมูล</h3>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-4">
                {/* Area */}
                <div>
                  <label className="text-xs font-bold text-purple-950 block mb-1">พื้นที่ (Area)</label>
                  <select
                    value={filters.area}
                    onChange={(e) => handleFilterChange({ area: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-purple-200"
                  >
                    <option value="ทั้งหมด">ทั้งหมด</option>
                    {['เมือง', 'เหนือ', 'ตะวันออก', 'ตะวันตก', 'ใต้'].map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="text-xs font-bold text-purple-950 block mb-1">เพศ (Gender)</label>
                  <div className="grid grid-cols-3 gap-1">
                    {['ทั้งหมด', 'ชาย', 'หญิง'].map((g) => (
                      <button
                        key={g}
                        onClick={() => handleFilterChange({ gender: g })}
                        className={`py-2 text-xs font-semibold rounded-lg ${
                          filters.gender === g
                            ? 'bg-purple-800 text-amber-300'
                            : 'bg-purple-50 text-purple-900 border border-purple-200'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age Group */}
                <div>
                  <label className="text-xs font-bold text-purple-950 block mb-1">ช่วงอายุ</label>
                  <select
                    value={filters.ageGroup}
                    onChange={(e) => handleFilterChange({ ageGroup: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-purple-200"
                  >
                    <option value="ทั้งหมด">ทุกช่วงอายุ</option>
                    <option value="<35">&lt; 35 ปี</option>
                    <option value="35-49">35 - 49 ปี</option>
                    <option value="50-59">50 - 59 ปี</option>
                    <option value="60+">60 ปีขึ้นไป</option>
                  </select>
                </div>

                {/* Diabetes Filter */}
                <div>
                  <label className="text-xs font-bold text-purple-950 block mb-1">
                    สถานะคัดกรองเบาหวาน
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    {['ทั้งหมด', 'มีแนวโน้ม/เสี่ยง', 'ไม่มี'].map((d) => (
                      <button
                        key={d}
                        onClick={() => handleFilterChange({ diabetesFilter: d })}
                        className={`py-2 text-xs font-semibold rounded-lg ${
                          filters.diabetesFilter === d
                            ? 'bg-amber-400 text-purple-950'
                            : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-purple-100 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="w-1/2 py-2.5 rounded-xl border border-purple-200 text-xs font-medium text-purple-800"
              >
                รีเซ็ต
              </button>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="w-1/2 py-2.5 rounded-xl bg-purple-900 text-amber-300 text-xs font-bold shadow-xs"
              >
                ดูผลลัพธ์ ({filteredRecords.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer (Softer pastel palette) */}
      <footer className="bg-purple-100/70 text-purple-900 border-t border-purple-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-300 text-purple-950 flex items-center justify-center font-bold text-xs border border-amber-400/40">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-purple-950 text-sm">ข้อมูลสสุขภาพ</span>
              <span className="text-purple-700">| แบบคัดกรองข้อมูลสุขภาพ</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-purple-200 text-purple-900 shadow-2xs">
                ผู้จัดทำ: <strong className="text-purple-950 font-bold">ศุภากร พุทธรา</strong>
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-200/60 text-center text-[11px] text-purple-700 flex items-center justify-center gap-1">
            <span>แดชบอร์ดติดตามข้อมูลและเฝ้าระวังโรคไม่ติดต่อเรื้อรัง (NCDs)</span>
            <span>•</span>
            <span>ออกแบบโทนสีม่วง-เหลืองอ่อนสบายตา รองรับการแสดงผลทุกหน้าจอ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
