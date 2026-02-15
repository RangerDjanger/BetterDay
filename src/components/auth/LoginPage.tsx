import { loginUrl } from '../../services/auth';

export default function LoginPage() {
  const isDev = import.meta.env.DEV;

  const handleClick = (e: React.MouseEvent) => {
    if (isDev) {
      e.preventDefault();
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-surface rounded-2xl shadow-lg border border-border p-8 max-w-sm w-full text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-2">BetterDay</h1>
        <p className="text-text-muted mb-8">
          Track your habits. Build your streaks. Be more present.
        </p>
        <a
          href={loginUrl()}
          onClick={handleClick}
          className="inline-flex items-center gap-2 bg-blue-soft text-white font-medium px-6 py-3 rounded-xl hover:bg-blue-soft-dark transition-colors"
        >
          Sign in with Microsoft
        </a>
      </div>
    </div>
  );
}
