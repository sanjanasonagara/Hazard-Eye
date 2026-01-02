using HazardEye.API.Data;
using HazardEye.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace HazardEye.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LocationsController : ControllerBase
{
    private readonly HazardEyeDbContext _context;

    public LocationsController(HazardEyeDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LocationDto>>> GetLocations()
    {
        var locations = await _context.Locations
            .Include(l => l.Parent)
            .Select(l => new LocationDto
            {
                Id = l.Id,
                Name = l.Name,
                Description = l.Description,
                Latitude = l.Latitude,
                Longitude = l.Longitude,
                IsActive = l.IsActive,
                Type = l.Type.ToString(),
                ParentId = l.ParentId,
                ParentName = l.Parent != null ? l.Parent.Name : null,
                PolygonCoordinates = l.PolygonCoordinates
            })
            .ToListAsync();

        return Ok(locations);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<LocationDto>> GetLocation(int id)
    {
        var l = await _context.Locations
            .Include(l => l.Parent)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (l == null)
            return NotFound();

        return Ok(new LocationDto
        {
            Id = l.Id,
            Name = l.Name,
            Description = l.Description,
            Latitude = l.Latitude,
            Longitude = l.Longitude,
            IsActive = l.IsActive,
            Type = l.Type.ToString(),
            ParentId = l.ParentId,
            ParentName = l.Parent != null ? l.Parent.Name : null,
            PolygonCoordinates = l.PolygonCoordinates
        });
    }

    [HttpPost]
    [Authorize(Roles = "Admin,SafetyOfficer,Supervisor")]
    public async Task<ActionResult<LocationDto>> CreateLocation([FromBody] LocationDto dto)
    {
        if (!Enum.TryParse<LocationType>(dto.Type, out var type))
        {
            type = LocationType.Other;
        }

        try
        {
            var location = new Location
            {
                Name = dto.Name,
                Description = dto.Description,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                IsActive = true,
                Type = type,
                ParentId = dto.ParentId,
                PolygonCoordinates = dto.PolygonCoordinates
            };

            _context.Locations.Add(location);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLocation), new { id = location.Id }, new LocationDto
            {
                Id = location.Id,
                Name = location.Name,
                Description = location.Description,
                Latitude = location.Latitude,
                Longitude = location.Longitude,
                IsActive = location.IsActive,
                Type = location.Type.ToString(),
                ParentId = location.ParentId,
                PolygonCoordinates = location.PolygonCoordinates
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Create failed", error = ex.Message, inner = ex.InnerException?.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,SafetyOfficer,Supervisor")]
    public async Task<IActionResult> UpdateLocation(int id, [FromBody] LocationDto dto)
    {
        var location = await _context.Locations.FindAsync(id);
        if (location == null)
            return NotFound();

        if (Enum.TryParse<LocationType>(dto.Type, out var type))
        {
            location.Type = type;
        }

        location.Name = dto.Name;
        location.Description = dto.Description;
        location.Latitude = dto.Latitude;
        location.Longitude = dto.Longitude;
        location.IsActive = dto.IsActive;
        location.ParentId = dto.ParentId;
        location.PolygonCoordinates = dto.PolygonCoordinates;

        await _context.SaveChangesAsync();
        return Ok(dto);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteLocation(int id)
    {
        try 
        {
            var location = await _context.Locations.FindAsync(id);
            if (location == null)
                return NotFound();

            // Check if any location is child of this one
            if (await _context.Locations.AnyAsync(l => l.ParentId == id))
            {
                return BadRequest("Cannot delete location with child locations. Reassign them first.");
            }

            _context.Locations.Remove(location);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
             return StatusCode(500, new { message = "Delete failed", error = ex.Message, inner = ex.InnerException?.Message });
        }
    }
}

public class LocationDto
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? PolygonCoordinates { get; set; }
    public string? Type { get; set; }
    public bool IsActive { get; set; }
    public int? ParentId { get; set; }
    public string? ParentName { get; set; }
}
