using System.Text.Json.Serialization;

namespace HazardEye.API.DTOs;

public class UpdateUserDto
{
    [JsonPropertyName("firstName")]
    public string? FirstName { get; set; }

    [JsonPropertyName("lastName")]
    public string? LastName { get; set; }

    [JsonPropertyName("role")]
    public string? Role { get; set; } 

    [JsonPropertyName("employeeId")]
    public string? EmployeeId { get; set; }

    [JsonPropertyName("phone")]
    public string? Phone { get; set; }

    [JsonPropertyName("company")]
    public string? Company { get; set; }

    [JsonPropertyName("isActive")]
    public bool? IsActive { get; set; }
    
    [JsonPropertyName("supervisorDepartmentIds")]
    public List<int>? SupervisorDepartmentIds { get; set; }
}
