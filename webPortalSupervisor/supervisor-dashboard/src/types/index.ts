export interface UserDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface LoginResponse {
    token: string;
    user: UserDto;
}

export interface IncidentDto {
    id: number;
    serverIncidentId: string;
    deviceId: string;
    description?: string;
    note?: string;
    capturedAt: string;
    severity: string;
    type?: string;
    mediaUris: string[];
    status: string;
    priority?: string;
    location?: string;
    category?: string;
    advisory?: string;
    assignedTo?: number;
    assignedToName?: string;
    createdBy: number;
    createdByName: string;
    createdAt: string;
    resolvedAt?: string;
    closedAt?: string;
    comments?: CommentDto[];
    correctiveActions?: CorrectiveActionDto[];
}

export interface DailyTrend {
    date: string;
    count: number;
}

export interface DashboardStats {
    totalIncidents: number;
    totalIncidentsChange: number;
    openIncidents: number;
    criticalIssues: number;
    resolvedToday: number;
    resolvedTodayChange: number;
    incidentTrends: DailyTrend[];
    recentIncidents: IncidentDto[];
}

export interface CommentDto {
    id: number;
    userId: number;
    userName: string;
    comment: string;
    createdAt: string;
}

export interface CorrectiveActionDto {
    id: number;
    action: string;
    dueDate: string;
    completed: boolean;
    completedAt?: string;
}
