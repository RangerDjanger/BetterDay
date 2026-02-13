export default function TodayPage() {
  const today = new Date().toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-soft-dark">Today</h1>
      <p className="text-gray-400 text-sm mt-1">{today}</p>
      <div className="mt-6 text-center text-gray-400 py-12">
        <p className="text-lg">No habits yet</p>
        <p className="text-sm mt-1">Add your first habit to get started</p>
      </div>
    </div>
  );
}
