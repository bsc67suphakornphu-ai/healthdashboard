import React from 'react';
import { RefreshCw, Activity, Sparkles, Filter } from 'lucide-react';

interface HeaderProps {
  lastUpdated: string;
  isLive: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  totalRecords: number;
  filteredRecords: number;
  onToggleMobileFilter?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  isLive,
  isLoading,
  onRefresh,
  filteredRecords,
  onToggleMobileFilter,
}) => {
  return (
    <header
      id="header-section"
      className="bg-gradient-to-r from-purple-100/90 via-purple-50/80 to-amber-50/70 text-purple-950 border-b border-purple-200/80 shadow-xs"
    >
      {/* Top utility accent bar - soft amber */}
      <div className="bg-gradient-to-r from-amber-300 via-amber-200 to-purple-300 h-1.5 w-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Title & Author block */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-300 text-purple-900 flex items-center justify-center shadow-2xs shrink-0 border border-amber-400/40">
                <Activity className="w-6 h-6 text-purple-950" strokeWidth={2.5} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-purple-950 flex items-center gap-2">
                    ข้อมูลสสุขภาพ
                  </h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-200/70 text-purple-900 border border-purple-300/60">
                    <Sparkles className="w-3 h-3 mr-1 text-amber-600" /> Health Screening
                  </span>
                </div>
                <p className="text-sm text-purple-800/80">
                  แบบคัดกรองข้อมูลสุขภาพ
                </p>
              </div>
            </div>

            {/* Author badge */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-purple-900">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 border border-purple-200 text-purple-900 shadow-2xs font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                ผู้จัดทำ: <strong className="text-purple-950 font-bold">ศุภากร พุทธรา</strong>
              </span>
            </div>
          </div>

          {/* Sync status & Refresh action */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Record count pill */}
            <div className="px-3 py-1.5 rounded-xl bg-white/90 border border-purple-200 text-xs flex items-center gap-1.5 shadow-2xs">
              <span className="text-purple-700">แสดงผล:</span>
              <span className="font-bold text-purple-950 font-mono">{filteredRecords}</span>
              <span className="text-purple-600">รายการ</span>
            </div>

            {/* Live status badge */}
            <div className="px-3 py-1.5 rounded-xl bg-white/90 border border-purple-200 text-xs flex items-center gap-2 shadow-2xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                }`}
              ></span>
              <span className="text-purple-900 font-medium">
                {isLive ? 'ซิงค์ข้อมูลแล้ว' : 'ข้อมูลพร้อมใช้'}
              </span>
            </div>

            {/* Refresh Button */}
            <button
              id="btn-refresh-data"
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-300 hover:bg-amber-400 active:scale-95 text-purple-950 font-semibold text-xs sm:text-sm transition-all shadow-2xs disabled:opacity-50 border border-amber-400/50 cursor-pointer"
              title="ดึงข้อมูลล่าสุด"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-purple-950' : ''}`} />
              <span>{isLoading ? 'กำลังซิงค์...' : 'รีเฟรช'}</span>
            </button>

            {/* Mobile Filter Toggle */}
            {onToggleMobileFilter && (
              <button
                id="btn-mobile-filter-toggle"
                onClick={onToggleMobileFilter}
                className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-200 hover:bg-purple-300 text-purple-950 text-xs font-semibold border border-purple-300"
              >
                <Filter className="w-4 h-4 text-purple-800" />
                <span>ตัวกรอง</span>
              </button>
            )}
          </div>

        </div>

        {/* Timestamp footer row */}
        <div className="mt-3 pt-2 border-t border-purple-200/60 flex flex-wrap items-center justify-between text-xs text-purple-800">
          <div className="flex items-center gap-1.5">
            <span className="text-purple-700">อัปเดตข้อมูลล่าสุด:</span>
            <span className="font-semibold text-purple-950">{lastUpdated}</span>
          </div>
          <div className="hidden sm:block text-purple-700 text-[11px]">
            ระบบคัดกรองโรคไม่ติดต่อเรื้อรัง (NCDs Screening)
          </div>
        </div>
      </div>
    </header>
  );
};
