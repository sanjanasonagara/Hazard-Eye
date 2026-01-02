namespace HazardEye.API.DTOs;

public class UpdateUserDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Role { get; set; } // "Admin", "SafetyOfficer", "Auditor", "Viewer"
    public string? EmployeeId { get; set; }
    public string? Phone { get; set; }
    public string? Company { get; set; }
    public bool? IsActive { get; set; }
    
    // For Supervisor Permissions
    public List<int>? SupervisorDepartmentIds { get; set; }
}
