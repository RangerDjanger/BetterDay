using Azure.Data.Tables;

namespace Api.Services;

public class TableStorageService
{
    private readonly TableServiceClient _serviceClient;

    public TableStorageService(TableServiceClient serviceClient)
    {
        _serviceClient = serviceClient;
    }

    public TableClient GetHabitsTable() => _serviceClient.GetTableClient("Habits");
    public TableClient GetHabitLogsTable() => _serviceClient.GetTableClient("HabitLogs");
    public TableClient GetReflectionsTable() => _serviceClient.GetTableClient("Reflections");
    public TableClient GetMoodEntriesTable() => _serviceClient.GetTableClient("MoodEntries");
    public TableClient GetUserSettingsTable() => _serviceClient.GetTableClient("UserSettings");
}
