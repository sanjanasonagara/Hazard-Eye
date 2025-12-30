import { getPendingIncidents, markIncidentUploaded, getPendingTasks, markTaskUploaded, updateIncidentServerId, updateTaskServerId } from './Database';
import api from './api';
import { Alert } from 'react-native';

let isSyncing = false;

export const syncData = async (onSyncComplete?: () => void) => {
    if (isSyncing) return;
    isSyncing = true;

    try {
        const pendingIncidents = await getPendingIncidents();
        const pendingTasks = await getPendingTasks();

        if (pendingIncidents.length === 0 && pendingTasks.length === 0) {
            return;
        }

        let syncedCount = 0;

        // Sync Incidents
        for (const incident of pendingIncidents) {
            try {
                const payload = {
                    deviceId: "DEV-MOBILE-001",
                    incidentId: incident.id,
                    // If we have a server_id, we should ideally send it, but existing API uses 'incidentId' as string.
                    // The backend handles matching by this string ID.
                    capturedAt: incident.created_at,
                    mediaUris: JSON.parse(incident.media_uris || '[]'),
                    mlMetadata: JSON.parse(incident.ml_metadata || '{}'),
                    severity: incident.severity >= 3 ? "High" : incident.severity >= 2 ? "Medium" : "Low",
                    category: incident.department || "Other",
                    advisory: incident.advisory,
                    note: incident.note,
                    status: incident.status,
                    area: incident.area,
                    plant: incident.plant
                };

                const response = await api.post('/incidents', payload);
                // Assume response returns { id: number }
                if (response.data && response.data.id) {
                    await updateIncidentServerId(incident.id, response.data.id);
                } else {
                     await markIncidentUploaded(incident.id);
                }
                syncedCount++;
            } catch (error) {
                console.error(`Failed to sync incident ${incident.id}`, error);
            }
        }

        // Sync Tasks
        for (const task of pendingTasks) {
            try {
                // If we have a server ID, we use it for checking, but for now we follow the string ID pattern.
                const payload = {
                    id: task.id,
                    title: task.title,
                    assignee: task.assignee,
                    description: task.description,
                    priority: task.priority,
                    status: task.status,
                    dueDate: task.due_date ? task.due_date : null,
                    comments: JSON.parse(task.comments || '[]'),
                    area: task.area,
                    plant: task.plant,
                    precautions: task.precautions,
                    incidentId: task.incident_id,
                    delayReason: task.delay_reason,
                    // Send server_id if we have it, though backend currently ignores it in favor of 'id' string matching
                    serverId: task.server_id 
                };

                const response = await api.post('/tasks/sync', payload);
                if (response.data && response.data.id) {
                     await updateTaskServerId(task.id, response.data.id);
                } else {
                     await markTaskUploaded(task.id);
                }
                syncedCount++;
            } catch (error) {
                console.error(`Failed to sync task ${task.id}`, error);
            }
        }

        if (syncedCount > 0) {
            // Fallback to Alert since expo-notifications is restricted in Expo Go on Android
            Alert.alert("Sync Complete", `All pending data (${syncedCount} items) has been uploaded.`);
            
            // Allow calling component to refresh its state
            if (onSyncComplete) {
                onSyncComplete();
            }
        }
    } catch (error) {
        console.error('Error in syncData:', error);
    } finally {
        isSyncing = false;
    }
};
