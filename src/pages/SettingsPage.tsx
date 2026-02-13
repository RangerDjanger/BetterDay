import { useAuth } from '../context/AuthContext';
import { logoutUrl } from '../services/auth';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-soft-dark">Settings</h1>
      <p className="text-gray-400 text-sm mt-1">Manage your account</p>

      <div className="mt-6 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-400">Signed in as</p>
          <p className="font-medium text-gray-700">{user?.userDetails ?? 'Unknown'}</p>
        </div>

        <a
          href={logoutUrl()}
          className="block w-full text-center bg-red-50 text-red-600 font-medium py-3 rounded-xl hover:bg-red-100 transition-colors"
        >
          Sign out
        </a>
      </div>
    </div>
  );
}
