import { getPendingIncidents, markIncidentUploaded } from './Database';
import * as FileSystem from 'expo-file-system';

// Mock Backend URL - replace with real one
const BACKEND_URL = 'http://192.168.1.100:5000/api';

export const syncIncidents = async () => {
    const pending = getPendingIncidents();

    if (pending.length === 0) {
        console.log("No pending incidents to sync.");
        return;
    }

    console.log(`Syncing ${pending.length} incidents...`);

    for (const incident of pending) {
        try {
            // 1. Upload Media
            // In a real app, parse media_uris and upload each file
            // For now, we simulate success

            // 2. Upload Metadata
            const payload = {
                ...incident,
                media_uris: JSON.parse(incident.media_uris),
                ml_metadata: JSON.parse(incident.ml_metadata)
            };

            // Simulated Network Call
            // await fetch(`${BACKEND_URL}/incidents`, { ... });

            console.log(`Uploaded incident ${incident.id}`);

            // 3. Mark as Uploaded
            markIncidentUploaded(incident.id);

        } catch (error) {
            console.error(`Failed to sync incident ${incident.id}`, error);
        }
    }
};
