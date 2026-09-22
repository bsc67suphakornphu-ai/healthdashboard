import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  TrendingUp,
  Activity,
  MapPin,
  Table,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'health-overview-kpis', label: 'ภาพรวม (Overview)', icon: LayoutDashboard },
  { id: 'health-risk-section', label: 'ความเสี่ยงสุขภาพ (Risk)', icon: ShieldAlert },
  { id: 'health-trend-section', label: 'แนวโน้ม (Trend)', icon: TrendingUp },
  { id: 'health-behavior-section', label: 'พฤติกรรม (Behavior)', icon: Activity },
  { id: 'area-risk-section', label: 'พื้นที่เสี่ยง (Area)', icon: MapPin },
  { id: 'diabetes-detail-table', label: 'คัดกรองเบาหวาน (Detail)', icon: Table },
];

export const Navigation: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('health-overview-kpis');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveId(id);
    }
  };

  return (
    <nav
      id="main-nav-bar"
      aria-label="เมนูหลัก"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-xs transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2 py-2.5 overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => scrollToSection(item.id)}
                className={`whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-2xs font-bold'
                    : 'text-purple-900/70 hover:text-purple-950 hover:bg-purple-100/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-amber-200' : 'text-purple-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
