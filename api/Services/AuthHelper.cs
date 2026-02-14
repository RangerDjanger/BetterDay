using System.Text.Json;
using Microsoft.Azure.Functions.Worker.Http;

namespace Api.Services;

public static class AuthHelper
{
    public static string? GetUserId(HttpRequestData req)
    {
        // Azure SWA injects x-ms-client-principal header with Base64-encoded JSON
        if (!req.Headers.TryGetValues("x-ms-client-principal", out var values))
            return null;

        var header = values.FirstOrDefault();
        if (string.IsNullOrEmpty(header))
            return null;

        try
        {
            var decoded = Convert.FromBase64String(header);
            var json = JsonSerializer.Deserialize<ClientPrincipal>(decoded);
            return json?.UserId;
        }
        catch
        {
            return null;
        }
    }

    private class ClientPrincipal
    {
        public string? IdentityProvider { get; set; }
        public string? UserId { get; set; }
        public string? UserDetails { get; set; }
        public string[]? UserRoles { get; set; }
    }
}
