export interface Incident {
    id: string;
    created_at: string;
    media_uris: string; // JSON string of string[]
    ml_metadata: string; // JSON string
    advisory: string;
    severity: number;
    sync_status: 'pending' | 'synced';
    status: string;
    note: string;
    department?: string;
    area?: string;
    plant?: string;
}

export interface IncidentDto {
    id: number;
    serverIncidentId: string;
    deviceId: string;
    incidentId?: string;
    capturedAt: string;
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
    createdAt: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: string;
}
