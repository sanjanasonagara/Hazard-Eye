import { fetchApi } from './api';
import { Task, Priority, TaskStatus } from '../../supervisor/types';

export interface WorkTaskDto {
    id: number;
    title: string;
    incidentId?: number;
    departmentId: number;
    departmentName: string;
    assignedToUserId: number;
    assignedToName: string;
    description: string;
    status: string;
    priority: number;
    createdAt: string;
    dueDate?: string;
    completedAt?: string;
    area?: string;
    plant?: string;
}

export const taskService = {
    getTasks: async (): Promise<Task[]> => {
        try {
            const dtos = await fetchApi<WorkTaskDto[]>('/tasks');
            return dtos.map(mapDtoToTask);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            throw error;
        }
    },

    createTask: async (task: Partial<Task>): Promise<Task> => {
        try {
            const payload = {
                incidentId: parseInt(task.incidentId || '0'),
                assignedToUserId: parseInt(task.assignedTo || '0'),
                description: task.description,
                dueDate: task.dueDate?.toISOString(),
                area: task.area,
                plant: task.plant
            };
            const dto = await fetchApi<WorkTaskDto>('/tasks', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            return mapDtoToTask(dto);
        } catch (error) {
            console.error('Failed to create task:', error);
            throw error;
        }
    },

    addComment: async (taskId: string, text: string, author: string): Promise<void> => {
        try {
            await fetchApi(`/tasks/${taskId}/comments`, {
                method: 'POST',
                body: JSON.stringify({ text, author })
            });
        } catch (error) {
            console.error('Failed to add comment:', error);
            throw error;
        }
    }
};

const mapDtoToTask = (dto: WorkTaskDto): Task => {
    return {
        id: dto.id.toString(),
        incidentId: dto.incidentId?.toString(),
        description: dto.description || dto.title,
        area: dto.area || dto.departmentName || 'Main Site',
        plant: dto.plant || 'General',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : new Date(),
        priority: mapPriority(dto.priority),
        status: dto.status as TaskStatus,
        precautions: 'Refer to safety guidelines.',
        assignedTo: dto.assignedToUserId.toString(),
        assignedToName: dto.assignedToName,
        createdBy: '0',
        createdByName: 'System',
        createdAt: new Date(dto.createdAt),
        comments: [],
    };
};

const mapPriority = (p: number): Priority => {
    if (p >= 3) return 'High';
    if (p === 2) return 'Medium';
    return 'Low';
};
