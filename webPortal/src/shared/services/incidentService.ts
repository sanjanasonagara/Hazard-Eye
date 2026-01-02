import { fetchApi } from './api';
import { Incident } from '../../supervisor/types';

// Matching backend DTO
export interface IncidentDto {
    id: number;
    serverIncidentId: string;
    deviceId: string;
    incidentId?: string; // Client provided ID
    capturedAt: string; // ISO Date
    severity: string;
    category: string;
    status: string;
    assignedTo?: number;
    assignedToName?: string;
    createdBy: number;
    createdByName: string;
    mediaUris: string[];
    mlMetadata: Record<string, any>;
    advisory?: string;
    note?: string;
    area?: string;
    plant?: string;
    createdAt: string;
    resolvedAt?: string;
    closedAt?: string;
    comments: any[];
    correctiveActions: any[];
}

export interface IncidentListResponse {
    items: IncidentDto[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export const incidentService = {
    getIncidents: async (): Promise<Incident[]> => {
        try {
            const response = await fetchApi<IncidentListResponse>('/incidents?PageSize=100'); // Fetch enough for now
            return response.items.map(mapDtoToIncident);
        } catch (error) {
            console.error('Failed to fetch incidents:', error);
            throw error;
        }
    },

    getIncident: async (id: number): Promise<Incident | null> => {
        try {
            const response = await fetchApi<IncidentDto>(`/incidents/${id}`);
            return mapDtoToIncident(response);
        } catch (error) {
            console.error(`Failed to fetch incident ${id}:`, error);
            return null;
        }
    },

    updateIncidentStatus: async (id: string, status: string): Promise<void> => {
        try {
            await fetchApi(`/incidents/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status })
            });
        } catch (error) {
            console.error(`Failed to update incident ${id} status:`, error);
            throw error;
        }
    }
};

// Helper: Map DTO to Frontend Model
const mapDtoToIncident = (dto: IncidentDto): Incident => {
    return {
        id: dto.id.toString(),
        imageUrl: dto.mediaUris && dto.mediaUris.length > 0 ? dto.mediaUris[0] : 'https://via.placeholder.com/150?text=No+Image',
        dateTime: new Date(dto.capturedAt || dto.createdAt),
        area: dto.area || 'Field Area',
        plant: dto.plant || 'Main Plant',
        department: (dto.category as any) || 'General',
        severity: (dto.severity as any) || 'Low',
        status: (dto.status as any) || 'Open',
        description: dto.note || dto.advisory || 'No description provided',
    };
};
