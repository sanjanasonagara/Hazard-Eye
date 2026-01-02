using System.Text.Json.Serialization;

namespace HazardEye.API.DTOs;

public class CreateWorkTaskDto
{
    [JsonPropertyName("incidentId")]
    public int IncidentId { get; set; }
    [JsonPropertyName("assignedToUserId")]
    public int AssignedToUserId { get; set; }
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
    [JsonPropertyName("dueDate")]
    public DateTime? DueDate { get; set; }
    [JsonPropertyName("area")]
    public string? Area { get; set; }
    [JsonPropertyName("plant")]
    public string? Plant { get; set; }
    [JsonPropertyName("comments")]
    public string? Comments { get; set; }
}

public class WorkTaskDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("incidentId")]
    public int IncidentId { get; set; }
    [JsonPropertyName("assignedToUserId")]
    public int AssignedToUserId { get; set; }
    [JsonPropertyName("assignedToName")]
    public string AssignedToName { get; set; } = string.Empty;
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
    [JsonPropertyName("dueDate")]
    public DateTime? DueDate { get; set; }
    [JsonPropertyName("completedAt")]
    public DateTime? CompletedAt { get; set; }
    [JsonPropertyName("area")]
    public string? Area { get; set; }
    [JsonPropertyName("plant")]
    public string? Plant { get; set; }
    [JsonPropertyName("comments")]
    public string? Comments { get; set; }
}
