import { NavLink } from 'react-router-dom';
import { CalendarCheck, BarChart3, BookHeart, Settings } from 'lucide-react';

const tabs = [
  { to: '/', label: 'Today', icon: CalendarCheck },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/reflect', label: 'Reflect', icon: BookHeart },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-warm-dark flex justify-around py-2 z-50">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-xs transition-colors ${
              isActive ? 'text-blue-soft-dark font-semibold' : 'text-gray-400'
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
