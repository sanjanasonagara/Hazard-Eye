using System.Text.Json.Serialization;

namespace HazardEye.API.Services;

public interface IAuditService
{
    Task LogAsync(int? userId, string action, string entityType, int? entityId, Dictionary<string, object> details, string ipAddress, string userAgent);
    Task<List<AuditLogDto>> GetAuditLogsAsync(AuditLogFilterRequest filter);
}

public class AuditLogDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("userId")]
    public int? UserId { get; set; }
    [JsonPropertyName("userName")]
    public string? UserName { get; set; }
    [JsonPropertyName("action")]
    public string Action { get; set; } = string.Empty;
    [JsonPropertyName("entityType")]
    public string EntityType { get; set; } = string.Empty;
    [JsonPropertyName("entityId")]
    public int? EntityId { get; set; }
    [JsonPropertyName("details")]
    public Dictionary<string, object> Details { get; set; } = new();
    [JsonPropertyName("ipAddress")]
    public string IpAddress { get; set; } = string.Empty;
    [JsonPropertyName("timestamp")]
    public DateTime Timestamp { get; set; }
}

public class AuditLogFilterRequest
{
    [JsonPropertyName("startDate")]
    public DateTime? StartDate { get; set; }
    [JsonPropertyName("endDate")]
    public DateTime? EndDate { get; set; }
    [JsonPropertyName("userId")]
    public int? UserId { get; set; }
    [JsonPropertyName("action")]
    public string? Action { get; set; }
    [JsonPropertyName("entityType")]
    public string? EntityType { get; set; }
    [JsonPropertyName("page")]
    public int Page { get; set; } = 1;
    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; } = 50;
}


