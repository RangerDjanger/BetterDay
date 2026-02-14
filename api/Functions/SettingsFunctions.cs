using System.Net;
using Api.Models;
using Api.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace Api.Functions;

public class SettingsFunctions
{
    private readonly TableStorageService _tables;
    private readonly ILogger<SettingsFunctions> _logger;

    public SettingsFunctions(TableStorageService tables, ILogger<SettingsFunctions> logger)
    {
        _tables = tables;
        _logger = logger;
    }

    [Function("GetSettings")]
    public async Task<HttpResponseData> GetSettings(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "settings")] HttpRequestData req)
    {
        var userId = AuthHelper.GetUserId(req);
        if (userId == null) return req.CreateResponse(HttpStatusCode.Unauthorized);

        var table = _tables.GetUserSettingsTable();
        UserSettingsEntity? entity = null;
        try
        {
            var result = await table.GetEntityAsync<UserSettingsEntity>(userId, "settings");
            entity = result.Value;
        }
        catch { }

        var dto = entity != null
            ? new UserSettingsDto
            {
                CoachPersonality = entity.CoachPersonality,
                RemindersEnabled = entity.RemindersEnabled,
                MorningTime = entity.MorningTime,
                EveningTime = entity.EveningTime,
                Email = entity.Email
            }
            : new UserSettingsDto();

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(dto);
        return response;
    }

    [Function("SaveSettings")]
    public async Task<HttpResponseData> SaveSettings(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "settings")] HttpRequestData req)
    {
        var userId = AuthHelper.GetUserId(req);
        if (userId == null) return req.CreateResponse(HttpStatusCode.Unauthorized);

        var dto = await req.ReadFromJsonAsync<UserSettingsDto>();
        if (dto == null) return req.CreateResponse(HttpStatusCode.BadRequest);

        var entity = new UserSettingsEntity
        {
            PartitionKey = userId,
            RowKey = "settings",
            CoachPersonality = dto.CoachPersonality,
            RemindersEnabled = dto.RemindersEnabled,
            MorningTime = dto.MorningTime,
            EveningTime = dto.EveningTime,
            Email = dto.Email
        };

        var table = _tables.GetUserSettingsTable();
        await table.UpsertEntityAsync(entity);

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(dto);
        return response;
    }
}
