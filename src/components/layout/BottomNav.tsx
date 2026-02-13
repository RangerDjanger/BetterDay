import { NavLink } from 'react-router-dom';
import { CalendarCheck, BarChart3, Settings } from 'lucide-react';

const tabs = [
  { to: '/', label: 'Today', icon: CalendarCheck },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-sm shadow-[0_-1px_3px_rgba(0,0,0,0.3)] flex justify-around py-2.5 z-50">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-xs transition-colors ${
              isActive ? 'text-blue-soft-light font-bold' : 'text-text-muted hover:text-text-secondary'
            }`
          }
        >
          <Icon size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
