using HazardEye.API.Data;
using HazardEye.API.DTOs;
using HazardEye.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR; // Required for SendAsync extension
using TaskStatus = HazardEye.API.Models.TaskStatus;

namespace HazardEye.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly HazardEyeDbContext _context;
    private readonly ILogger<TasksController> _logger;
    private readonly Microsoft.AspNetCore.SignalR.IHubContext<Hubs.DashboardHub> _hubContext;

    public TasksController(
        HazardEyeDbContext context, 
        ILogger<TasksController> logger,
        Microsoft.AspNetCore.SignalR.IHubContext<Hubs.DashboardHub> hubContext)
    {
        _context = context;
        _logger = logger;
        _hubContext = hubContext;
    }

    [HttpGet]
    [Authorize(Roles = "SafetyOfficer,Admin,Supervisor,Worker")]
    public async Task<ActionResult<IEnumerable<WorkTaskDto>>> GetTasks()
    {
        _logger.LogInformation("GetTasks: Fetching all tasks from database.");
        var tasks = await _context.Tasks
            .Include(t => t.AssignedToUser)
            .Include(t => t.PlantLocation)
            .Include(t => t.AreaLocation)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new WorkTaskDto
            {
                Id = t.Id,
                IncidentId = t.IncidentId,
                AssignedToUserId = t.AssignedToUserId,
                AssignedToName = t.AssignedToUser != null ? $"{t.AssignedToUser.FirstName} {t.AssignedToUser.LastName}" : "Unknown",
                Description = t.Description,
                Status = t.Status.ToString(),
                CreatedAt = t.CreatedAt,
                DueDate = t.DueDate,
                CompletedAt = t.CompletedAt,
                Comments = t.Comments,
                PlantLocationId = t.PlantLocationId,
                PlantLocationName = t.PlantLocation != null ? t.PlantLocation.Name : null,
                AreaLocationId = t.AreaLocationId,
                AreaLocationName = t.AreaLocation != null ? t.AreaLocation.Name : null
            })
            .ToListAsync();

        _logger.LogInformation("GetTasks: Returning {Count} tasks.", tasks.Count);
        return Ok(tasks);
    }

    [HttpPost]
    [Authorize(Roles = "SafetyOfficer,Admin,Supervisor")]
    public async Task<ActionResult<WorkTaskDto>> CreateTask(CreateWorkTaskDto createTaskDto)
    {
        _logger.LogInformation("CreateTask: Creating task for User {UserId}, Incident {IncidentId}.", createTaskDto.AssignedToUserId, createTaskDto.IncidentId);
        var assignedUser = await _context.Users.FindAsync(createTaskDto.AssignedToUserId);
        if (assignedUser == null)
        {
            _logger.LogWarning("CreateTask: Assigned user {UserId} not found.", createTaskDto.AssignedToUserId);
            return BadRequest("Assigned user not found.");
        }

        Incident? incident = null;
        if (createTaskDto.IncidentId.HasValue)
        {
            incident = await _context.Incidents.FindAsync(createTaskDto.IncidentId.Value);
            if (incident == null)
            {
                _logger.LogWarning("CreateTask: Incident {IncidentId} not found.", createTaskDto.IncidentId);
                return BadRequest("Incident not found.");
            }
        }

        var task = new WorkTask
        {
            IncidentId = createTaskDto.IncidentId,
            AssignedToUserId = createTaskDto.AssignedToUserId,
            Description = createTaskDto.Description,
            DueDate = createTaskDto.DueDate,
            Status = HazardEye.API.Models.TaskStatus.Assigned,
            PlantLocationId = createTaskDto.PlantLocationId,
            AreaLocationId = createTaskDto.AreaLocationId
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        var taskDto = new WorkTaskDto
        {
            Id = task.Id,
            IncidentId = task.IncidentId,
            AssignedToUserId = task.AssignedToUserId,
            AssignedToName = $"{assignedUser.FirstName} {assignedUser.LastName}",
            Description = task.Description,
            Status = task.Status.ToString(),
            CreatedAt = task.CreatedAt,
            DueDate = task.DueDate,
            CompletedAt = task.CompletedAt,
            Comments = task.Comments,
            PlantLocationId = task.PlantLocationId,
            AreaLocationId = task.AreaLocationId
        };

        await _hubContext.Clients.All.SendAsync("TaskCreated", taskDto);

        return CreatedAtAction(nameof(GetTasks), new { id = task.Id }, taskDto);
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "SafetyOfficer,Admin,Supervisor,Worker")]
    public async Task<IActionResult> UpdateTaskStatus(int id, [FromBody] string status)
    {
         if (!Enum.TryParse<HazardEye.API.Models.TaskStatus>(status, true, out var newStatus))
        {
            return BadRequest("Invalid status.");
        }

        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
        {
            return NotFound();
        }

        task.Status = newStatus;
        if (newStatus == HazardEye.API.Models.TaskStatus.Completed)
        {
            task.CompletedAt = DateTime.UtcNow;
        }
        else
        {
            task.CompletedAt = null;
        }

        await _context.SaveChangesAsync();

        // Broadcast Update
        var updatedTask = await _context.Tasks
            .Include(t => t.AssignedToUser)
            .Include(t => t.PlantLocation)
            .Include(t => t.AreaLocation)
            .FirstOrDefaultAsync(t => t.Id == id);
        if (updatedTask != null)
        {
            var taskDto = new WorkTaskDto
            {
                Id = updatedTask.Id,
                IncidentId = updatedTask.IncidentId,
                AssignedToUserId = updatedTask.AssignedToUserId,
                AssignedToName = updatedTask.AssignedToUser != null ? $"{updatedTask.AssignedToUser.FirstName} {updatedTask.AssignedToUser.LastName}" : "Unknown",
                Description = updatedTask.Description,
                Status = updatedTask.Status.ToString(),
                CreatedAt = updatedTask.CreatedAt,
                DueDate = updatedTask.DueDate,
                CompletedAt = updatedTask.CompletedAt,
                Comments = updatedTask.Comments,
                PlantLocationId = updatedTask.PlantLocationId,
                PlantLocationName = updatedTask.PlantLocation != null ? updatedTask.PlantLocation.Name : null,
                AreaLocationId = updatedTask.AreaLocationId,
                AreaLocationName = updatedTask.AreaLocation != null ? updatedTask.AreaLocation.Name : null
            };
             await _hubContext.Clients.All.SendAsync("TaskUpdated", taskDto);
        }

        return NoContent();
    }

    [HttpPost("sync")]
    [Authorize(Roles = "SafetyOfficer,Admin,Worker,Supervisor")]
    public async Task<IActionResult> SyncTask([FromBody] SyncTaskRequest request)
    {
        // Try to match task or create it.
        WorkTask? task = null;
        
        // Priority 1: Match by ID (if numeric and valid)
        if (int.TryParse(request.Id, out var existingTaskId))
        {
             task = await _context.Tasks.FindAsync(existingTaskId);
             if (task != null) _logger.LogInformation("[SyncTask] Matched Task by ID: {Id}", existingTaskId);
        }

        // Priority 2: Match by Description (Fallback)
        if (task == null)
        {
             task = await _context.Tasks.FirstOrDefaultAsync(t => t.Description == request.Description);
             if (task != null) _logger.LogInformation("[SyncTask] Matched Task by Description: {Desc}", request.Description);
        }
        
        if (task == null)
        {
            // Resolve Incident Entity
            // Resolve Incident Entity
            Incident? incidentEntity = null;
            _logger.LogInformation("[SyncTask] Processing Task: {Description}, ExtID: {Id}, IncID Req: {IncidentId}", request.Description, request.Id, request.IncidentId);

            if (!string.IsNullOrEmpty(request.IncidentId) && int.TryParse(request.IncidentId, out var id)) 
            {
                // Verify it actually exists in DB to avoid FK error
                incidentEntity = await _context.Incidents.FindAsync(id);
                if (incidentEntity == null) _logger.LogWarning("[SyncTask] Incident ID {Id} not found in DB.", id);
            }

            // If invalid or lookup failed, use fallback
            if (incidentEntity == null)
            {
                _logger.LogInformation("[SyncTask] Using 'General Tasks' fallback.");
                incidentEntity = await _context.Incidents.FirstOrDefaultAsync(i => i.Advisory == "General Tasks");
                if (incidentEntity == null)
                {
                    _logger.LogInformation("[SyncTask] Creating 'General Tasks' incident.");
                    incidentEntity = new Incident
                    {
                        Advisory = "General Tasks",
                        Severity = HazardEye.API.Models.IncidentSeverity.Low,
                        Status = HazardEye.API.Models.IncidentStatus.Pending,
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = 1 // Assume Admin exists
                    };
                    _context.Incidents.Add(incidentEntity);
                    await _context.SaveChangesAsync();
                }
            }

            if (incidentEntity.Id == 0)
            {
                 _logger.LogError("[SyncTask] Resolved Incident Entity has ID 0 even after save/fetch.");
                 throw new Exception("Resolved Incident Entity has ID 0.");
            }
            _logger.LogInformation("[SyncTask] Resolved Incident ID: {Id}", incidentEntity.Id);

            // Resolve Assigned User
            int assignedUserId = 0;
            if (!string.IsNullOrEmpty(request.Assignee))
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => (u.FirstName + " " + u.LastName) == request.Assignee);
                if (user != null) assignedUserId = user.Id;
            }
            
            // Fallback to current authenticated user or first user
            if (assignedUserId == 0)
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out var uid))
                {
                    assignedUserId = uid;
                }
                else
                {
                    assignedUserId = await _context.Users.Select(u => u.Id).FirstOrDefaultAsync();
                }
            }

            task = new WorkTask
            {
                IncidentId = incidentEntity.Id,
                AssignedToUserId = assignedUserId, 
                Description = request.Description,
                DueDate = request.DueDate?.ToUniversalTime(),
                Status = Enum.TryParse<TaskStatus>(request.Status, true, out var s) ? s : TaskStatus.Assigned,
                CreatedAt = request.CreatedAt ?? DateTime.UtcNow,
                Comments = request.Comments ?? "[]"
            };
            _context.Tasks.Add(task);
        }
        else
        {
            task.Status = Enum.TryParse<TaskStatus>(request.Status, true, out var s) ? s : task.Status;
            task.Description = request.Description;
            task.DueDate = request.DueDate?.ToUniversalTime();
            if (!string.IsNullOrEmpty(request.Comments))
            {
                task.Comments = request.Comments;
            }
        }

        await _context.SaveChangesAsync();

        // Broadcast Sync Event (approximate DTO)
        var syncTaskDto = new WorkTaskDto
        {
            Id = task.Id,
            IncidentId = task.IncidentId,
            AssignedToUserId = task.AssignedToUserId,
            // Assignee name might not be loaded, skipping or doing quick load
            AssignedToName = request.Assignee ?? "Unknown", 
            Description = task.Description,
            Status = task.Status.ToString(),
            CreatedAt = task.CreatedAt,
            DueDate = task.DueDate,
            CompletedAt = task.CompletedAt,
            Comments = task.Comments
        };

        // Determine if created or updated based on if IDs match (heuristic)
        // Actually simpler: just send TaskUpdated. Clients should handle upsert.
        await _hubContext.Clients.All.SendAsync("TaskUpdated", syncTaskDto);

        return Ok(new { id = task.Id, externalId = request.Id });
    }
}

public class SyncTaskRequest
{
    public string Id { get; set; } = string.Empty;
    public string? IncidentId { get; set; }
    public string? Assignee { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public DateTime? CreatedAt { get; set; }
    public string? Comments { get; set; }
}
