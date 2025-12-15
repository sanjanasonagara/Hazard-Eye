import React, { createContext, useContext, useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

interface SignalRContextType {
    connection: signalR.HubConnection | null;
}

const SignalRContext = createContext<SignalRContextType>({ connection: null });

// eslint-disable-next-line react-refresh/only-export-components
export const useSignalR = () => useContext(SignalRContext);

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5200/hubs/dashboard", {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();

        newConnection.start()
            .then(() => {
                console.log('SignalR Connected!');
                setConnection(newConnection);
            })
            .catch(err => console.error('SignalR Connection Error: ', err));

        return () => {
            newConnection.stop();
        };
    }, []);

    return (
        <SignalRContext.Provider value={{ connection }}>
            {children}
        </SignalRContext.Provider>
    );
};
