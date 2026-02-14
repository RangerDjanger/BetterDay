using Api.Models;

namespace Api.Services;

public static class StatsCalculator
{
    public static HabitStatsDto Calculate(string habitId, int[] activeDays, List<HabitLogEntity> logs)
    {
        var completedDates = logs
            .Where(l => l.Completed)
            .Select(l => l.RowKey)
            .OrderByDescending(d => d)
            .ToList();

        var totalCompletions = completedDates.Count;
        var currentStreak = CalcCurrentStreak(activeDays, completedDates);
        var bestStreak = CalcBestStreak(activeDays, completedDates);

        return new HabitStatsDto
        {
            HabitId = habitId,
            TotalCompletions = totalCompletions,
            CurrentStreak = currentStreak,
            BestStreak = Math.Max(bestStreak, currentStreak)
        };
    }

    private static int CalcCurrentStreak(int[] activeDays, List<string> completedDatesDesc)
    {
        if (completedDatesDesc.Count == 0) return 0;

        var completedSet = new HashSet<string>(completedDatesDesc);
        var streak = 0;
        var date = DateOnly.FromDateTime(DateTime.UtcNow);

        // If today is an active day and not completed, start from yesterday
        if (IsActiveDay(activeDays, date) && !completedSet.Contains(date.ToString("yyyy-MM-dd")))
            date = date.AddDays(-1);

        while (true)
        {
            if (!IsActiveDay(activeDays, date))
            {
                date = date.AddDays(-1);
                continue;
            }

            if (completedSet.Contains(date.ToString("yyyy-MM-dd")))
            {
                streak++;
                date = date.AddDays(-1);
            }
            else
            {
                break;
            }
        }

        return streak;
    }

    private static int CalcBestStreak(int[] activeDays, List<string> completedDatesDesc)
    {
        if (completedDatesDesc.Count == 0) return 0;

        var sorted = completedDatesDesc.OrderBy(d => d).ToList();
        var completedSet = new HashSet<string>(sorted);
        var best = 0;
        var current = 0;

        var startDate = DateOnly.Parse(sorted[0]);
        var endDate = DateOnly.Parse(sorted[^1]);

        for (var date = startDate; date <= endDate; date = date.AddDays(1))
        {
            if (!IsActiveDay(activeDays, date)) continue;

            if (completedSet.Contains(date.ToString("yyyy-MM-dd")))
            {
                current++;
                best = Math.Max(best, current);
            }
            else
            {
                current = 0;
            }
        }

        return best;
    }

    private static bool IsActiveDay(int[] activeDays, DateOnly date)
    {
        if (activeDays.Length == 0) return true;
        return activeDays.Contains((int)date.DayOfWeek);
    }
}
