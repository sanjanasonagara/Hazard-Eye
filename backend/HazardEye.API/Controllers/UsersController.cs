using HazardEye.API.DTOs;
using HazardEye.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HazardEye.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,SafetyOfficer,Supervisor,Worker")] 
// Adjusting roles to be broad enough, mostly Admin though
public class UsersController : ControllerBase
{
    private readonly IAuthService _authService;

    public UsersController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpGet]
    public async Task<ActionResult<List<UserDto>>> GetUsers([FromQuery] string? role = null)
    {
        // Ideally filter by role in DB, but for now filtering in memory as per existing service
        var users = await _authService.GetAllUsersAsync();
        if (!string.IsNullOrEmpty(role))
        {
            users = users.Where(u => u.Role.Equals(role, StringComparison.OrdinalIgnoreCase)).ToList();
        }
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUserById(int id)
    {
        var user = await _authService.GetUserByIdAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> GetMe()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var user = await _authService.GetUserByIdAsync(userId);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,SafetyOfficer")]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var createdUser = await _authService.CreateUserAsync(request);
        if (createdUser == null)
        {
            return Conflict(new { message = "User with this email already exists." });
        }

        return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, createdUser);
    }

    [HttpPatch("{id}")] // Using Patch for partial updates
    [Authorize(Roles = "Admin,SafetyOfficer")]
    public async Task<ActionResult<UserDto>> UpdateUser(int id, [FromBody] UpdateUserDto request)
    {
        var updatedUser = await _authService.UpdateUserAsync(id, request);
        if (updatedUser == null) return NotFound();
        return Ok(updatedUser);
    }
    
    // Separate endpoint specifically for permissions if frontend distinguishes them, 
    // but the above Patch handles it. 
    // The frontend code uses PATCH /users/{id}/permissions. 
    // I should support that specific route to match frontend or change frontend.
    // Changing frontend to use standard PATCH /users/{id} is cleaner, but I'll add the route to be safe.
    
    [HttpPatch("{id}/permissions")]
    [Authorize(Roles = "Admin,SafetyOfficer")]
    public async Task<ActionResult<UserDto>> UpdatePermissions(int id, [FromBody] UpdateUserDto request)
    {
        // Re-use the same update logic since UpdateUserDto covers permissions
        return await UpdateUser(id, request);
    }
    
    [HttpPatch("{id}/role")]
    [Authorize(Roles = "Admin,SafetyOfficer")]
    public async Task<ActionResult<UserDto>> UpdateRole(int id, [FromBody] UpdateUserDto request)
    {
        // Re-use logic for role/status updates
        return await UpdateUser(id, request);
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin,SafetyOfficer")]
    public async Task<ActionResult<UserDto>> UpdateStatus(int id, [FromBody] UpdateUserDto request)
    {
        return await UpdateUser(id, request);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,SafetyOfficer")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var success = await _authService.DeleteUserAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}
