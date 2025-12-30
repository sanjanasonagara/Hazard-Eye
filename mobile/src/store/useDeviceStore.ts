import { useState, useEffect } from 'react';
import { getDeviceData, Device } from '../services/Database';

/**
 * A simple hook-based store for device data.
 * This can be expanded to use Context or a state management library if needed.
 */
export const useDeviceStore = () => {
    const [device, setDevice] = useState<Device | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshDeviceData = async () => {
        setLoading(true);
        const data = await getDeviceData();
        setDevice(data);
        setLoading(false);
    };

    useEffect(() => {
        refreshDeviceData();
    }, []);

    return {
        device,
        loading,
        refreshDeviceData
    };
};
