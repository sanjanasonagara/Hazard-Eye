using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HazardEye.API.Data;
using HazardEye.API.Models;

namespace HazardEye.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DepartmentsController : ControllerBase
{
    private readonly HazardEyeDbContext _context;

    public DepartmentsController(HazardEyeDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetDepartments()
    {
        var departments = await _context.Departments.Where(d => d.IsActive).OrderBy(d => d.Name).ToListAsync();
        return Ok(departments);
    }
    
    [HttpGet("all")]
    public async Task<IActionResult> GetAllDepartments()
    {
        var departments = await _context.Departments.OrderBy(d => d.Name).ToListAsync();
        return Ok(departments);
    }

    [HttpPost]
    public async Task<IActionResult> CreateDepartment([FromBody] Department department)
    {
        department.CreatedAt = DateTime.UtcNow;
        _context.Departments.Add(department);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetDepartments), new { id = department.Id }, department);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDepartment(int id, [FromBody] Department department)
    {
        if (id != department.Id) return BadRequest();
        
        var existing = await _context.Departments.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Name = department.Name;
        existing.Description = department.Description;
        existing.IsActive = department.IsActive;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDepartment(int id)
    {
        var department = await _context.Departments.FindAsync(id);
        if (department == null) return NotFound();
        
        // Soft delete
        department.IsActive = false;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
