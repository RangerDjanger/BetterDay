using System.Text.Json.Serialization;

namespace Api.Models;

public class HabitDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("category")]
    public string? Category { get; set; }

    [JsonPropertyName("createdAt")]
    public string CreatedAt { get; set; } = string.Empty;

    [JsonPropertyName("reminderTime")]
    public string? ReminderTime { get; set; }

    [JsonPropertyName("activeDays")]
    public int[] ActiveDays { get; set; } = [];

    [JsonPropertyName("archived")]
    public bool Archived { get; set; }
}

public class HabitLogDto
{
    [JsonPropertyName("habitId")]
    public string HabitId { get; set; } = string.Empty;

    [JsonPropertyName("date")]
    public string Date { get; set; } = string.Empty;

    [JsonPropertyName("completed")]
    public bool Completed { get; set; }
}

public class ReflectionDto
{
    [JsonPropertyName("date")]
    public string Date { get; set; } = string.Empty;

    [JsonPropertyName("wentWell")]
    public string WentWell { get; set; } = string.Empty;

    [JsonPropertyName("toImprove")]
    public string ToImprove { get; set; } = string.Empty;
}

public class MoodEntryDto
{
    [JsonPropertyName("date")]
    public string Date { get; set; } = string.Empty;

    [JsonPropertyName("morning")]
    public int? Morning { get; set; }

    [JsonPropertyName("evening")]
    public int? Evening { get; set; }
}

public class UserSettingsDto
{
    [JsonPropertyName("coachPersonality")]
    public string? CoachPersonality { get; set; }

    [JsonPropertyName("remindersEnabled")]
    public bool RemindersEnabled { get; set; }

    [JsonPropertyName("morningTime")]
    public string MorningTime { get; set; } = "07:00";

    [JsonPropertyName("eveningTime")]
    public string EveningTime { get; set; } = "21:00";

    [JsonPropertyName("email")]
    public string? Email { get; set; }
}

public class HabitStatsDto
{
    [JsonPropertyName("habitId")]
    public string HabitId { get; set; } = string.Empty;

    [JsonPropertyName("totalCompletions")]
    public int TotalCompletions { get; set; }

    [JsonPropertyName("currentStreak")]
    public int CurrentStreak { get; set; }

    [JsonPropertyName("bestStreak")]
    public int BestStreak { get; set; }
}
