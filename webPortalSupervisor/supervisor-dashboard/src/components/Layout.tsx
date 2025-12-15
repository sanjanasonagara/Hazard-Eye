import { Link, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useSignalR } from '../context/SignalRContext';
// import { useEffect, useState } from 'react'; // removed unused imports

const Layout = ({ children }: { children: React.ReactNode }) => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const { connection } = useSignalR();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Shield className="h-8 w-8 text-blue-600 mr-2" />
                            <span className="text-xl font-bold text-gray-900 px-2">HazardEye</span>
                            <Link to="/dashboard" className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Dashboard</Link>
                            <Link to="/incidents" className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Incidents</Link>
                            {user?.role === 'Admin' && (
                                <Link to="/users" className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Users</Link>
                            )}
                        </div>
                        <div className="flex items-center">
                            <div className={`mr-4 h-2 w-2 rounded-full ${connection ? 'bg-green-500' : 'bg-red-500'}`} title={connection ? "Connected" : "Disconnected"} />
                            <span className="text-gray-700 mr-4">Welcome, {user?.firstName || 'User'}</span>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-red-600 hover:text-red-800 font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;
