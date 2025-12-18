import {
  Incident,
  Task,
  User,
  Severity,
  Priority,
  Department,
  IncidentStatus,
  TaskStatus,
  AIRecommendation,
} from '../types';

export const AREA_OPTIONS = ['Plant A', 'Plant B', 'Plant C', 'Warehouse', 'Office Building'];
export const PLANT_OPTIONS = ['Main Facility', 'North Wing', 'South Wing', 'Annex Building'];

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Supervisor',
    email: 'john.supervisor@hazardeeye.com',
    role: 'supervisor',
    department: 'Fire & Safety',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
  {
    id: '2',
    name: 'Sarah Employee',
    email: 'sarah.employee@hazardeeye.com',
    role: 'employee',
    department: 'Electrical',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: '3',
    name: 'Mike Technician',
    email: 'mike.tech@hazardeeye.com',
    role: 'employee',
    department: 'Mechanical',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
  },
  {
    id: '4',
    name: 'Emma Engineer',
    email: 'emma.eng@hazardeeye.com',
    role: 'employee',
    department: 'Civil',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
  },
];

// Mock AI Recommendations
const mockAIRecommendations: AIRecommendation[] = [
  {
    whatToDo: 'Immediately isolate the affected electrical panel and de-energize the circuit. Contact the electrical maintenance team for inspection and repair.',
    whyItMatters: 'Exposed wiring poses a severe electrocution risk and fire hazard. Immediate action prevents potential injuries and equipment damage.',
    preventiveSteps: [
      'Conduct monthly visual inspections of all electrical panels',
      'Install protective covers on all exposed wiring',
      'Implement lockout/tagout procedures for maintenance',
      'Schedule quarterly electrical safety audits',
    ],
    riskExplanation: 'The exposed wiring creates multiple hazards: direct contact can cause severe electrical shock or electrocution, and arcing can ignite nearby combustible materials. The risk is compounded by the industrial environment where workers may be in close proximity.',
  },
  {
    whatToDo: 'Cordon off the area immediately and assess structural integrity. Engage structural engineering team for detailed inspection and reinforcement plan.',
    whyItMatters: 'Structural damage can lead to catastrophic failure, endangering personnel and causing significant operational downtime.',
    preventiveSteps: [
      'Implement regular structural integrity assessments',
      'Monitor for signs of stress or degradation',
      'Maintain proper load distribution protocols',
      'Schedule annual structural engineering reviews',
    ],
    riskExplanation: 'Cracks in structural elements indicate potential failure points. Without intervention, this could lead to partial or complete structural collapse, resulting in serious injuries, fatalities, and extensive property damage.',
  },
  {
    whatToDo: 'Evacuate the immediate area and activate fire suppression systems. Contact fire safety team and emergency services if necessary.',
    whyItMatters: 'Fire hazards in industrial settings can escalate rapidly, causing extensive damage and posing life-threatening risks to all personnel.',
    preventiveSteps: [
      'Ensure all fire suppression equipment is regularly inspected',
      'Maintain clear evacuation routes',
      'Conduct monthly fire safety drills',
      'Implement strict no-smoking policies in designated areas',
    ],
    riskExplanation: 'Industrial fires can spread quickly due to the presence of flammable materials and complex ventilation systems. Early detection and response are critical to preventing catastrophic outcomes.',
  },
];

// Generate mock incidents
export const generateMockIncidents = (count: number = 25): Incident[] => {
  const areas = AREA_OPTIONS;
  const plants = PLANT_OPTIONS;
  const units = ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', undefined];
  const departments: Department[] = [
    'Electrical',
    'Mechanical',
    'Civil',
    'Fire & Safety',
    'Environmental',
    'General',
  ];
  const severities: Severity[] = ['High', 'Medium', 'Low'];
  const statuses: IncidentStatus[] = ['Open', 'In Progress', 'Resolved'];
  
  const descriptions = [
    'Exposed electrical wiring found near main control panel. Immediate attention required.',
    'Structural crack observed in support beam. Engineering assessment needed.',
    'Fire extinguisher missing from designated location. Safety compliance issue.',
    'Chemical spill detected in storage area. Containment and cleanup required.',
    'Damaged safety railing on second floor walkway. Fall hazard identified.',
    'Malfunctioning emergency exit lighting. Evacuation safety concern.',
    'Leaking pipe in mechanical room. Water damage and slip hazard.',
    'Overloaded electrical circuit causing intermittent power issues.',
    'Damaged floor grating creating trip hazard in production area.',
    'Inadequate ventilation in confined space. Air quality concern.',
  ];

  const incidents: Incident[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const dateTime = new Date(now);
    dateTime.setDate(dateTime.getDate() - daysAgo);
    dateTime.setHours(dateTime.getHours() - hoursAgo);

    const department = departments[Math.floor(Math.random() * departments.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    incidents.push({
      id: `incident-${i + 1}`,
      imageUrl: `https://picsum.photos/seed/incident-${i + 1}/800/600`,
      dateTime,
      area: areas[Math.floor(Math.random() * areas.length)],
      plant: plants[Math.floor(Math.random() * plants.length)],
      unit: units[Math.floor(Math.random() * units.length)],
      department,
      severity,
      status,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      aiSummary: `AI analysis indicates ${severity.toLowerCase()} severity ${department.toLowerCase()} issue requiring ${status === 'Open' ? 'immediate' : status === 'In Progress' ? 'ongoing' : 'completed'} attention.`,
      aiRecommendation: mockAIRecommendations[Math.floor(Math.random() * mockAIRecommendations.length)],
    });
  }

  return incidents.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
};

// Generate mock tasks
export const generateMockTasks = (incidents: Incident[], users: User[]): Task[] => {
  const tasks: Task[] = [];
  const employeeUsers = users.filter(u => u.role === 'employee');
  const supervisorUsers = users.filter(u => u.role === 'supervisor');

  if (employeeUsers.length === 0 || supervisorUsers.length === 0) return tasks;

  const priorities: Priority[] = ['High', 'Medium', 'Low'];
  const statuses: TaskStatus[] = ['Open', 'In Progress', 'Completed', 'Delayed'];
  const delayReasons = [
    'Waiting for parts delivery',
    'Requires additional resources',
    'Weather conditions',
    'Pending approval',
    'Equipment unavailable',
  ];

  // Create tasks from some incidents
  incidents.slice(0, 15).forEach((incident, index) => {
    const assignedEmployee = employeeUsers[Math.floor(Math.random() * employeeUsers.length)];
    const supervisor = supervisorUsers[0];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const dueDate = new Date(incident.dateTime);
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14) + 1);

    const task: Task = {
      id: `task-${index + 1}`,
      incidentId: incident.id,
      description: `Address ${incident.department} issue: ${incident.description}`,
      area: incident.area,
      plant: incident.plant,
      dueDate,
      priority,
      status,
      precautions: incident.aiRecommendation?.preventiveSteps.join('; ') || 'Follow standard safety protocols.',
      assignedTo: assignedEmployee.id,
      assignedToName: assignedEmployee.name,
      createdBy: supervisor.id,
      createdByName: supervisor.name,
      createdAt: new Date(incident.dateTime.getTime() + 3600000), // 1 hour after incident
      comments: [],
    };

    if (status === 'Delayed') {
      task.delayReason = delayReasons[Math.floor(Math.random() * delayReasons.length)];
    }

    // Add some comments
    if (Math.random() > 0.5) {
      task.comments.push({
        id: `comment-${index}-1`,
        taskId: task.id,
        userId: assignedEmployee.id,
        userName: assignedEmployee.name,
        userRole: 'employee',
        content: 'Started working on this task. Initial assessment complete.',
        timestamp: new Date(task.createdAt.getTime() + 86400000),
      });
    }

    if (status === 'Delayed' && task.delayReason) {
      task.comments.push({
        id: `comment-${index}-2`,
        taskId: task.id,
        userId: assignedEmployee.id,
        userName: assignedEmployee.name,
        userRole: 'employee',
        content: `Task delayed: ${task.delayReason}`,
        timestamp: new Date(task.dueDate.getTime() - 86400000),
      });
    }

    tasks.push(task);
  });

  return tasks;
};

