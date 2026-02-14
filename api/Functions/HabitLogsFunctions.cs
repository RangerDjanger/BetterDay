using System.Net;
using System.Text.Json;
using Api.Models;
using Api.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace Api.Functions;

public class HabitLogsFunctions
{
    private readonly TableStorageService _tables;
    private readonly ILogger<HabitLogsFunctions> _logger;

    public HabitLogsFunctions(TableStorageService tables, ILogger<HabitLogsFunctions> logger)
    {
        _tables = tables;
        _logger = logger;
    }

    [Function("GetHabitLogs")]
    public async Task<HttpResponseData> GetLogs(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "habits/{habitId}/logs")] HttpRequestData req,
        string habitId)
    {
        var userId = AuthHelper.GetUserId(req);
        if (userId == null) return req.CreateResponse(HttpStatusCode.Unauthorized);

        var partitionKey = $"{userId}_{habitId}";
        var table = _tables.GetHabitLogsTable();
        var entities = new List<HabitLogEntity>();
        await foreach (var entity in table.QueryAsync<HabitLogEntity>(e => e.PartitionKey == partitionKey))
        {
            entities.Add(entity);
        }

        var dtos = entities.Select(e => new HabitLogDto
        {
            HabitId = habitId,
            Date = e.RowKey,
            Completed = e.Completed
        }).ToList();

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(dtos);
        return response;
    }

    [Function("LogHabit")]
    public async Task<HttpResponseData> LogHabit(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "habits/{habitId}/logs")] HttpRequestData req,
        string habitId)
    {
        var userId = AuthHelper.GetUserId(req);
        if (userId == null) return req.CreateResponse(HttpStatusCode.Unauthorized);

        var dto = await req.ReadFromJsonAsync<HabitLogDto>();
        if (dto == null || string.IsNullOrEmpty(dto.Date))
            return req.CreateResponse(HttpStatusCode.BadRequest);

        var entity = new HabitLogEntity
        {
            PartitionKey = $"{userId}_{habitId}",
            RowKey = dto.Date,
            HabitId = habitId,
            Completed = dto.Completed
        };

        var table = _tables.GetHabitLogsTable();
        await table.UpsertEntityAsync(entity);

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(dto);
        return response;
    }

    [Function("GetHabitStats")]
    public async Task<HttpResponseData> GetStats(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "habits/{habitId}/stats")] HttpRequestData req,
        string habitId)
    {
        var userId = AuthHelper.GetUserId(req);
        if (userId == null) return req.CreateResponse(HttpStatusCode.Unauthorized);

        // Get habit to read active days
        var habitsTable = _tables.GetHabitsTable();
        HabitEntity? habit = null;
        try
        {
            var habitResponse = await habitsTable.GetEntityAsync<HabitEntity>(userId, habitId);
            habit = habitResponse.Value;
        }
        catch { }

        var activeDays = habit != null && !string.IsNullOrEmpty(habit.ActiveDays)
            ? JsonSerializer.Deserialize<int[]>(habit.ActiveDays) ?? []
            : Array.Empty<int>();

        // Get all logs
        var partitionKey = $"{userId}_{habitId}";
        var logsTable = _tables.GetHabitLogsTable();
        var logs = new List<HabitLogEntity>();
        await foreach (var log in logsTable.QueryAsync<HabitLogEntity>(e => e.PartitionKey == partitionKey))
        {
            logs.Add(log);
        }

        var stats = StatsCalculator.Calculate(habitId, activeDays, logs);

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(stats);
        return response;
    }
}
