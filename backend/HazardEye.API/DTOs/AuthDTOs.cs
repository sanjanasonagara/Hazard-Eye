namespace HazardEye.API.DTOs;

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}

public class UserDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? EmployeeId { get; set; }
    public string? Phone { get; set; }
    public string? Company { get; set; }
    public bool IsActive { get; set; }
    public List<int> SupervisorDepartmentIds { get; set; } = new();
    public List<string> SupervisorDepartments { get; set; } = new();
    public DateTime? LastLoginAt { get; set; }
    public DateTime CreatedAt { get; set; }
}


