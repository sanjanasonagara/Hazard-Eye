using System.Text.Json.Serialization;

namespace HazardEye.API.DTOs;

public class IncidentDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("serverIncidentId")]
    public string ServerIncidentId { get; set; } = string.Empty;
    [JsonPropertyName("deviceId")]
    public string DeviceId { get; set; } = string.Empty;
    [JsonPropertyName("incidentId")]
    public string? IncidentId { get; set; }
    [JsonPropertyName("capturedAt")]
    public DateTime CapturedAt { get; set; }
    [JsonPropertyName("severity")]
    public string Severity { get; set; } = string.Empty;
    [JsonPropertyName("category")]
    public string Category { get; set; } = string.Empty;
    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;
    [JsonPropertyName("assignedTo")]
    public int? AssignedTo { get; set; }
    [JsonPropertyName("assignedToName")]
    public string? AssignedToName { get; set; }
    [JsonPropertyName("createdBy")]
    public int CreatedBy { get; set; }
    [JsonPropertyName("createdByName")]
    public string CreatedByName { get; set; } = string.Empty;
    [JsonPropertyName("mediaUris")]
    public List<string> MediaUris { get; set; } = new();
    [JsonPropertyName("mlMetadata")]
    public Dictionary<string, object> MlMetadata { get; set; } = new();
    [JsonPropertyName("advisory")]
    public string? Advisory { get; set; }
    [JsonPropertyName("note")]
    public string? Note { get; set; }
    [JsonPropertyName("area")]
    public string? Area { get; set; }
    [JsonPropertyName("plant")]
    public string? Plant { get; set; }
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
    [JsonPropertyName("resolvedAt")]
    public DateTime? ResolvedAt { get; set; }
    [JsonPropertyName("closedAt")]
    public DateTime? ClosedAt { get; set; }
    [JsonPropertyName("comments")]
    public List<CommentDto> Comments { get; set; } = new();
    [JsonPropertyName("correctiveActions")]
    public List<CorrectiveActionDto> CorrectiveActions { get; set; } = new();
}

public class CreateIncidentRequest
{
    [JsonPropertyName("deviceId")]
    public string DeviceId { get; set; } = string.Empty;
    [JsonPropertyName("incidentId")]
    public string? IncidentId { get; set; }
    [JsonPropertyName("capturedAt")]
    public DateTime CapturedAt { get; set; }
    [JsonPropertyName("mediaUris")]
    public List<string> MediaUris { get; set; } = new();
    [JsonPropertyName("mlMetadata")]
    public Dictionary<string, object> MlMetadata { get; set; } = new();
    [JsonPropertyName("severity")]
    public string? Severity { get; set; }
    [JsonPropertyName("category")]
    public string? Category { get; set; }
    [JsonPropertyName("advisory")]
    public string? Advisory { get; set; }
    [JsonPropertyName("note")]
    public string? Note { get; set; }
    [JsonPropertyName("status")]
    public string? Status { get; set; }
    [JsonPropertyName("area")]
    public string? Area { get; set; }
    [JsonPropertyName("plant")]
    public string? Plant { get; set; }
}

public class UpdateIncidentRequest
{
    [JsonPropertyName("status")]
    public string? Status { get; set; }
    [JsonPropertyName("severity")]
    public string? Severity { get; set; }
    [JsonPropertyName("assignedTo")]
    public int? AssignedTo { get; set; }
    [JsonPropertyName("note")]
    public string? Note { get; set; }
    [JsonPropertyName("advisory")]
    public string? Advisory { get; set; }
}

public class IncidentFilterRequest
{
    [JsonPropertyName("startDate")]
    public DateTime? StartDate { get; set; }
    [JsonPropertyName("endDate")]
    public DateTime? EndDate { get; set; }
    [JsonPropertyName("severity")]
    public string? Severity { get; set; }
    [JsonPropertyName("category")]
    public string? Category { get; set; }
    [JsonPropertyName("status")]
    public string? Status { get; set; }
    [JsonPropertyName("deviceId")]
    public string? DeviceId { get; set; }
    [JsonPropertyName("assignedTo")]
    public int? AssignedTo { get; set; }
    [JsonPropertyName("page")]
    public int Page { get; set; } = 1;
    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; } = 25;
}

public class IncidentListResponse
{
    [JsonPropertyName("items")]
    public List<IncidentDto> Items { get; set; } = new();
    [JsonPropertyName("totalCount")]
    public int TotalCount { get; set; }
    [JsonPropertyName("page")]
    public int Page { get; set; }
    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; }
    [JsonPropertyName("totalPages")]
    public int TotalPages { get; set; }
}

public class CommentDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class AddCommentRequest
{
    [JsonPropertyName("comment")]
    public string Comment { get; set; } = string.Empty;
    [JsonPropertyName("text")]
    public string Text { get; set; } = string.Empty;
    [JsonPropertyName("author")]
    public string Author { get; set; } = string.Empty;
}

public class CorrectiveActionDto
{
    public int Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public bool Completed { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public class AddCorrectiveActionRequest
{
    public string Action { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
}


