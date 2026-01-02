using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HazardEye.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MediaController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<MediaController> _logger;

    public MediaController(IWebHostEnvironment environment, ILogger<MediaController> logger)
    {
        _environment = environment;
        _logger = logger;
    }

    [HttpPost("upload")]
    public async Task<ActionResult<string>> UploadMedia(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        try
        {
            // Ensure uploads directory exists
            var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            // Generate unique filename
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsPath, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return URL (Assuming standard static file serving)
            var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
            var fileUrl = $"{baseUrl}/uploads/{fileName}";

            _logger.LogInformation("File uploaded successfully: {FileName} -> {Url}", file.FileName, fileUrl);

            return Ok(new { url = fileUrl });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file.");
            return StatusCode(500, "Internal server error uploading file.");
        }
    }
}
