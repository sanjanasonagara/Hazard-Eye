import { fetchApi } from './api';

export interface UserDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    employeeId?: string;
    phone?: string;
    company?: string;
    isActive: boolean;
    supervisorDepartmentIds: number[];
}

export const userService = {
    getAllUsers: async (role?: string): Promise<UserDto[]> => {
        const query = role ? `?role=${role}` : '';
        return fetchApi<UserDto[]>(`/users${query}`);
    },

    getMe: async (): Promise<UserDto> => {
        return fetchApi<UserDto>('/users/me');
    }
};
