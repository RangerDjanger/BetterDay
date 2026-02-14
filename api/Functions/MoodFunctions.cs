using System.Net;
using Api.Models;
using Api.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace Api.Functions;

public class MoodFunctions
{
    private readonly TableStorageService _tables;
    private readonly ILogger<MoodFunctions> _logger;

    public MoodFunctions(TableStorageService tables, ILogger<MoodFunctions> logger)
    {
        _tables = tables;
        _logger = logger;
    }

    [Function("GetMoodEntries")]
    public async Task<HttpResponseData> GetMoodEntries(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "mood")] HttpRequestData req)
    {
        var userId = AuthHelper.GetUserId(req);
        if (userId == null) return req.CreateResponse(HttpStatusCode.Unauthorized);

        var table = _tables.GetMoodEntriesTable();
        var entities = new List<MoodEntryEntity>();
        await foreach (var entity in table.QueryAsync<MoodEntryEntity>(e => e.PartitionKey == userId))
        {
            entities.Add(entity);
        }

        var dtos = entities.Select(e => new MoodEntryDto
        {
            Date = e.RowKey,
            Morning = e.Morning,
            Evening = e.Evening
        }).ToList();

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(dtos);
        return response;
    }

    [Function("SaveMoodEntry")]
    public async Task<HttpResponseData> SaveMoodEntry(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "mood")] HttpRequestData req)
    {
        var userId = AuthHelper.GetUserId(req);
        if (userId == null) return req.CreateResponse(HttpStatusCode.Unauthorized);

        var dto = await req.ReadFromJsonAsync<MoodEntryDto>();
        if (dto == null || string.IsNullOrEmpty(dto.Date))
            return req.CreateResponse(HttpStatusCode.BadRequest);

        var entity = new MoodEntryEntity
        {
            PartitionKey = userId,
            RowKey = dto.Date,
            Morning = dto.Morning,
            Evening = dto.Evening
        };

        var table = _tables.GetMoodEntriesTable();
        await table.UpsertEntityAsync(entity);

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(dto);
        return response;
    }
}
