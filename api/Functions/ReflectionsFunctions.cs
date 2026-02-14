using System.Net;
using Api.Models;
using Api.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace Api.Functions;

public class ReflectionsFunctions
{
    private readonly TableStorageService _tables;
    private readonly ILogger<ReflectionsFunctions> _logger;

    public ReflectionsFunctions(TableStorageService tables, ILogger<ReflectionsFunctions> logger)
    {
        _tables = tables;
        _logger = logger;
    }

    [Function("GetReflections")]
    public async Task<HttpResponseData> GetReflections(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "reflections")] HttpRequestData req)
    {
        var userId = AuthHelper.GetUserId(req);
        if (userId == null) return req.CreateResponse(HttpStatusCode.Unauthorized);

        var table = _tables.GetReflectionsTable();
        var entities = new List<ReflectionEntity>();
        await foreach (var entity in table.QueryAsync<ReflectionEntity>(e => e.PartitionKey == userId))
        {
            entities.Add(entity);
        }

        var dtos = entities.Select(e => new ReflectionDto
        {
            Date = e.RowKey,
            WentWell = e.WentWell,
            ToImprove = e.ToImprove
        }).ToList();

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(dtos);
        return response;
    }

    [Function("SaveReflection")]
    public async Task<HttpResponseData> SaveReflection(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "reflections")] HttpRequestData req)
    {
        var userId = AuthHelper.GetUserId(req);
        if (userId == null) return req.CreateResponse(HttpStatusCode.Unauthorized);

        var dto = await req.ReadFromJsonAsync<ReflectionDto>();
        if (dto == null || string.IsNullOrEmpty(dto.Date))
            return req.CreateResponse(HttpStatusCode.BadRequest);

        var entity = new ReflectionEntity
        {
            PartitionKey = userId,
            RowKey = dto.Date,
            WentWell = dto.WentWell,
            ToImprove = dto.ToImprove
        };

        var table = _tables.GetReflectionsTable();
        await table.UpsertEntityAsync(entity);

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(dto);
        return response;
    }
}
