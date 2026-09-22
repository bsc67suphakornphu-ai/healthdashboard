import React from 'react';
import { Filter, RotateCcw, MapPin, Users, Calendar, AlertCircle } from 'lucide-react';
import { FilterState, HealthRecord } from '../types.ts';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  allRecords: HealthRecord[];
  activeFilterCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  allRecords,
  activeFilterCount,
}) => {
  const uniqueAreas = Array.from(new Set(allRecords.map((r) => r.area))).filter(Boolean);

  return (
    <section id="filter-controls-bar" className="bg-white/90 border border-purple-100 rounded-2xl p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex flex-col space-y-4">
        
        {/* Top Header of Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-purple-100/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200/60">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-purple-950 text-sm sm:text-base">
                ระบบควบคุมและตัวกรองข้อมูล (Filters)
              </span>
              <span className="text-xs text-purple-800/70 ml-2 block sm:inline">
                เลือกเงื่อนไขเพื่อวิเคราะห์กลุ่มเป้าหมายเฉพาะเจาะจง
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                ตัวกรองทำงานอยู่: {activeFilterCount}
              </span>
            )}
            <button
              id="btn-reset-filters"
              onClick={onResetFilters}
              disabled={activeFilterCount === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-purple-800 bg-purple-50 hover:bg-purple-100 disabled:opacity-40 disabled:hover:bg-purple-50 transition-colors border border-purple-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
              <span>รีเซ็ตตัวกรอง</span>
            </button>
          </div>
        </div>

        {/* Filter Inputs Grid: 4 items (Area, Gender, Age, Diabetes Risk) - No Person ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Area Filter (พื้นที่) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-purple-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>พื้นที่ (Area)</span>
            </label>
            <div className="relative">
              <select
                id="filter-select-area"
                value={filters.area}
                onChange={(e) => onFilterChange({ area: e.target.value })}
                className="w-full text-xs sm:text-sm font-medium bg-purple-50/30 hover:bg-purple-50/60 border border-purple-200/80 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl px-3 py-2 text-purple-950 outline-hidden transition-all"
              >
                <option value="ทั้งหมด">ทั้งหมด (ทุกพื้นที่)</option>
                {uniqueAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Gender Filter (เพศ) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-purple-900 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>เพศ (Gender)</span>
            </label>
            <div className="grid grid-cols-3 gap-1 bg-purple-50/50 p-1 rounded-xl border border-purple-200/80">
              {['ทั้งหมด', 'ชาย', 'หญิง'].map((g) => (
                <button
                  key={g}
                  id={`filter-gender-${g}`}
                  type="button"
                  onClick={() => onFilterChange({ gender: g })}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-all text-center ${
                    filters.gender === g
                      ? 'bg-purple-600 text-white shadow-2xs font-bold'
                      : 'text-purple-900 hover:bg-purple-100/70'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Age Group Filter (อายุ) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-purple-900 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>ช่วงอายุ (Age Group)</span>
            </label>
            <select
              id="filter-select-age-group"
              value={filters.ageGroup}
              onChange={(e) => onFilterChange({ ageGroup: e.target.value })}
              className="w-full text-xs sm:text-sm font-medium bg-purple-50/30 hover:bg-purple-50/60 border border-purple-200/80 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl px-3 py-2 text-purple-950 outline-hidden transition-all"
            >
              <option value="ทั้งหมด">ทุกช่วงอายุ (20 - 70 ปี)</option>
              <option value="<35">อายุน้อยกว่า 35 ปี (&lt; 35)</option>
              <option value="35-49">วัยทำงาน 35 - 49 ปี</option>
              <option value="50-59">วัยกลางคน 50 - 59 ปี</option>
              <option value="60+">ผู้สูงอายุ 60 ปีขึ้นไป (60+)</option>
            </select>
          </div>

          {/* 4. Diabetes Filter (คัดกรองเบาหวาน) - Replaced Person ID input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-purple-900 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>คัดกรองเบาหวาน</span>
            </label>
            <div className="relative">
              <select
                id="filter-select-diabetes"
                value={filters.diabetesFilter}
                onChange={(e) => onFilterChange({ diabetesFilter: e.target.value })}
                className="w-full text-xs sm:text-sm font-medium bg-purple-50/30 hover:bg-purple-50/60 border border-purple-200/80 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl px-3 py-2 text-purple-950 outline-hidden transition-all"
              >
                <option value="ทั้งหมด">ทั้งหมด (ทุกระดับ)</option>
                <option value="มีแนวโน้ม/เสี่ยง">เฉพาะกลุ่มเสี่ยงเบาหวาน</option>
                <option value="ไม่มี">เฉพาะกลุ่มปกติ / ไม่มีความเสี่ยง</option>
              </select>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
