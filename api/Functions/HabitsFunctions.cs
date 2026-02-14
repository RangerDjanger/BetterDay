using System.Net;
using System.Text.Json;
using Api.Models;
using Api.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace Api.Functions;

public class HabitsFunctions
{
    private readonly TableStorageService _tables;
    private readonly ILogger<HabitsFunctions> _logger;

    public HabitsFunctions(TableStorageService tables, ILogger<HabitsFunctions> logger)
    {
        _tables = tables;
        _logger = logger;
    }

    [Function("GetHabits")]
    public async Task<HttpResponseData> GetHabits(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "habits")] HttpRequestData req)
    {
        var userId = AuthHelper.GetUserId(req);
        if (userId == null) return req.CreateResponse(HttpStatusCode.Unauthorized);

        var table = _tables.GetHabitsTable();
        var entities = new List<HabitEntity>();
        await foreach (var entity in table.QueryAsync<HabitEntity>(e => e.PartitionKey == userId))
        {
            entities.Add(entity);
        }

        var dtos = entities.Select(e => new HabitDto
        {
            Id = e.RowKey,
            Name = e.Name,
            Description = e.Description,
            Category = e.Category,
            CreatedAt = e.CreatedAt,
            ReminderTime = e.ReminderTime,
            ActiveDays = string.IsNullOrEmpty(e.ActiveDays) ? [] : JsonSerializer.Deserialize<int[]>(e.ActiveDays) ?? [],
            Archived = e.Archived
        }).ToList();

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(dtos);
        return response;
    }

    [Function("CreateHabit")]
    public async Task<HttpResponseData> CreateHabit(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "habits")] HttpRequestData req)
    {
        var userId = AuthHelper.GetUserId(req);
        if (userId == null) return req.CreateResponse(HttpStatusCode.Unauthorized);

        var dto = await req.ReadFromJsonAsync<HabitDto>();
        if (dto == null || string.IsNullOrEmpty(dto.Name))
            return req.CreateResponse(HttpStatusCode.BadRequest);

        var entity = new HabitEntity
        {
            PartitionKey = userId,
            RowKey = string.IsNullOrEmpty(dto.Id) ? Guid.NewGuid().ToString() : dto.Id,
            Name = dto.Name,
            Description = dto.Description,
            Category = dto.Category,
            CreatedAt = dto.CreatedAt ?? DateTime.UtcNow.ToString("o"),
            ReminderTime = dto.ReminderTime,
            ActiveDays = JsonSerializer.Serialize(dto.ActiveDays ?? []),
            Archived = dto.Archived
        };

        var table = _tables.GetHabitsTable();
        await table.UpsertEntityAsync(entity);

        var result = new HabitDto
        {
            Id = entity.RowKey,
            Name = entity.Name,
            Description = entity.Description,
            Category = entity.Category,
            CreatedAt = entity.CreatedAt,
            ReminderTime = entity.ReminderTime,
            ActiveDays = dto.ActiveDays ?? [],
            Archived = entity.Archived
        };

        var response = req.CreateResponse(HttpStatusCode.Created);
        await response.WriteAsJsonAsync(result);
        return response;
    }

    [Function("UpdateHabit")]
    public async Task<HttpResponseData> UpdateHabit(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "habits/{habitId}")] HttpRequestData req,
        string habitId)
    {
        var userId = AuthHelper.GetUserId(req);
        if (userId == null) return req.CreateResponse(HttpStatusCode.Unauthorized);

        var dto = await req.ReadFromJsonAsync<HabitDto>();
        if (dto == null) return req.CreateResponse(HttpStatusCode.BadRequest);

        var entity = new HabitEntity
        {
            PartitionKey = userId,
            RowKey = habitId,
            Name = dto.Name,
            Description = dto.Description,
            Category = dto.Category,
            CreatedAt = dto.CreatedAt,
            ReminderTime = dto.ReminderTime,
            ActiveDays = JsonSerializer.Serialize(dto.ActiveDays ?? []),
            Archived = dto.Archived
        };

        var table = _tables.GetHabitsTable();
        await table.UpsertEntityAsync(entity);

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(dto);
        return response;
    }

    [Function("DeleteHabit")]
    public async Task<HttpResponseData> DeleteHabit(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "habits/{habitId}")] HttpRequestData req,
        string habitId)
    {
        var userId = AuthHelper.GetUserId(req);
        if (userId == null) return req.CreateResponse(HttpStatusCode.Unauthorized);

        var table = _tables.GetHabitsTable();
        await table.DeleteEntityAsync(userId, habitId);

        return req.CreateResponse(HttpStatusCode.NoContent);
    }
}
