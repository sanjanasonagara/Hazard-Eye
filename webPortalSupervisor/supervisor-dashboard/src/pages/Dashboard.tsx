import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import api from '../services/api';
import type { DashboardStats, IncidentDto } from '../types';
import { useSignalR } from '../context/SignalRContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const { connection } = useSignalR();

    const fetchStats = async () => {
        try {
            const response = await api.get<DashboardStats>('/dashboard/summary');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();

        if (connection) {
            // Listen for events to refresh stats in real-time
            connection.on("IncidentCreated", (incident: IncidentDto) => {
                console.log("Real-time update: New Incident", incident);
                fetchStats();
            });
            connection.on("IncidentUpdated", (incident: IncidentDto) => {
                console.log("Real-time update: Incident Updated", incident);
                fetchStats();
            });
        }

        return () => {
            if (connection) {
                connection.off("IncidentCreated");
                connection.off("IncidentUpdated");
            }
        };
    }, [connection]);

    if (loading) return <div className="p-8">Loading Dashboard...</div>;
    if (!stats) return <div className="p-8 text-red-600">Failed to load dashboard data.</div>;

    interface StatCardProps {
        title: string;
        value: number | undefined;
        change?: number;
        icon: React.ReactNode;
        color: string;
    }

    const StatCard = ({ title, value, change, icon, color }: StatCardProps) => (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm font-medium">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{value ?? 0}</h3>
                </div>
                <div className={`p-2 rounded-lg ${color}`}>
                    {icon}
                </div>
            </div>
            {change !== undefined && (
                <div className="mt-4 flex items-center">
                    <TrendingUp size={16} className="text-green-500 mr-1" />
                    <span className="text-green-500 text-sm font-medium">{change > 0 ? '+' : ''}{change}%</span>
                    <span className="text-gray-400 text-sm ml-2">from last week</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Incidents"
                        value={stats.totalIncidents}
                        change={stats.totalIncidentsChange}
                        icon={<AlertCircle className="text-blue-600" />}
                        color="bg-blue-50"
                    />
                    <StatCard
                        title="Open Incidents"
                        value={stats.openIncidents}
                        icon={<Clock className="text-orange-600" />}
                        color="bg-orange-50"
                    />
                    <StatCard
                        title="Critical Issues"
                        value={stats.criticalIssues}
                        icon={<AlertCircle className="text-red-600" />}
                        color="bg-red-50"
                    />
                    <StatCard
                        title="Resolved Today"
                        value={stats.resolvedToday}
                        change={stats.resolvedTodayChange}
                        icon={<CheckCircle className="text-green-600" />}
                        color="bg-green-50"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Incident Trends (Last 7 Days)</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.incidentTrends}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Recent Incidents</h3>
                            <Link to="/incidents" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {stats.recentIncidents?.map((incident) => (
                                <div key={incident.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${incident.severity === 'Critical' ? 'bg-red-500' :
                                            incident.severity === 'High' ? 'bg-orange-500' : 'bg-green-500'
                                            }`} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">ID: {incident.serverIncidentId}</p>
                                            <p className="text-xs text-gray-500">{new Date(incident.capturedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${incident.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                        'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {incident.status}
                                    </span>
                                </div>
                            )) || <p className="text-gray-500 text-sm">No recent incidents.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
