using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HazardEye.API.Data;
using HazardEye.API.Models;

namespace HazardEye.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RolesController : ControllerBase
{
    private readonly HazardEyeDbContext _context;

    public RolesController(HazardEyeDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetRoles()
    {
        var roles = await _context.Roles.Where(r => r.IsActive).OrderBy(r => r.Name).ToListAsync();
        return Ok(roles);
    }
    
    [HttpGet("all")]
    public async Task<IActionResult> GetAllRoles()
    {
        var roles = await _context.Roles.OrderBy(r => r.Name).ToListAsync();
        return Ok(roles);
    }

    [HttpPost]
    public async Task<IActionResult> CreateRole([FromBody] AppRole role)
    {
        role.CreatedAt = DateTime.UtcNow;
        _context.Roles.Add(role);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetRoles), new { id = role.Id }, role);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRole(int id, [FromBody] AppRole role)
    {
        if (id != role.Id) return BadRequest();
        
        var existing = await _context.Roles.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Name = role.Name;
        existing.Description = role.Description;
        existing.IsActive = role.IsActive;
        
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRole(int id)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null) return NotFound();
        
        // Soft delete
        role.IsActive = false;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
