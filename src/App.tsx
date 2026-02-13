import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppShell from './components/layout/AppShell';
import LoginPage from './components/auth/LoginPage';
import TodayPage from './pages/TodayPage';
import ReportsPage from './pages/ReportsPage';
import ReflectPage from './pages/ReflectPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-warm flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading…</p>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<TodayPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/reflect" element={<ReflectPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProtectedRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
