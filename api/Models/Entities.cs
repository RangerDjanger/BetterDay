using Azure;
using Azure.Data.Tables;

namespace Api.Models;

public class HabitEntity : ITableEntity
{
    public string PartitionKey { get; set; } = string.Empty;  // UserId
    public string RowKey { get; set; } = string.Empty;        // HabitId
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }

    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
    public string? ReminderTime { get; set; }
    public string ActiveDays { get; set; } = string.Empty;    // JSON array: [0,1,2,3,4,5,6]
    public bool Archived { get; set; }
}

public class HabitLogEntity : ITableEntity
{
    public string PartitionKey { get; set; } = string.Empty;  // UserId_HabitId
    public string RowKey { get; set; } = string.Empty;        // Date (YYYY-MM-DD)
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }

    public string HabitId { get; set; } = string.Empty;
    public bool Completed { get; set; }
}

public class ReflectionEntity : ITableEntity
{
    public string PartitionKey { get; set; } = string.Empty;  // UserId
    public string RowKey { get; set; } = string.Empty;        // Date (YYYY-MM-DD)
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }

    public string WentWell { get; set; } = string.Empty;
    public string ToImprove { get; set; } = string.Empty;
}

public class MoodEntryEntity : ITableEntity
{
    public string PartitionKey { get; set; } = string.Empty;  // UserId
    public string RowKey { get; set; } = string.Empty;        // Date (YYYY-MM-DD)
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }

    public int? Morning { get; set; }
    public int? Evening { get; set; }
}

public class UserSettingsEntity : ITableEntity
{
    public string PartitionKey { get; set; } = string.Empty;  // UserId
    public string RowKey { get; set; } = "settings";
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }

    public string? CoachPersonality { get; set; }
    public bool RemindersEnabled { get; set; }
    public string MorningTime { get; set; } = "07:00";
    public string EveningTime { get; set; } = "21:00";
    public string? Email { get; set; }
}
