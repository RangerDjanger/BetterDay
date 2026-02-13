import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HabitProvider } from './context/HabitContext';
import { ReflectionProvider } from './context/ReflectionContext';
import { MoodProvider } from './context/MoodContext';
import { CoachProvider } from './context/CoachContext';
import AppShell from './components/layout/AppShell';
import TodayPage from './pages/TodayPage';
import ReportsPage from './pages/ReportsPage';
import ReflectPage from './pages/ReflectPage';
import SettingsPage from './pages/SettingsPage';
import ManageHabitsPage from './pages/ManageHabitsPage';
import HabitDetailPage from './pages/HabitDetailPage';
import HabitForm from './components/habits/HabitForm';

function ProtectedRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-warm flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading…</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<TodayPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/reflect" element={<ReflectPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/manage" element={<ManageHabitsPage />} />
        <Route path="/add" element={<HabitForm />} />
        <Route path="/habit/:id/edit" element={<HabitForm />} />
        <Route path="/habit/:id" element={<HabitDetailPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <HabitProvider>
          <ReflectionProvider>
            <MoodProvider>
              <CoachProvider>
                <ProtectedRoutes />
              </CoachProvider>
            </MoodProvider>
          </ReflectionProvider>
        </HabitProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
