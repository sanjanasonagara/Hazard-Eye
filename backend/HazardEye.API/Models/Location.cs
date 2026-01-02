using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HazardEye.API.Models;

public enum LocationType
{
    Plant,
    Unit,
    Area,
    Other
}

public class Location
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public LocationType Type { get; set; }

    public double Latitude { get; set; }

    public double Longitude { get; set; }

    public string? PolygonCoordinates { get; set; }

    public bool IsActive { get; set; } = true;

    public int? ParentId { get; set; }

    [ForeignKey("ParentId")]
    public Location? Parent { get; set; }

    public ICollection<Location> Children { get; set; } = new List<Location>();
}
