import { useEffect, useState } from 'react';
import { DataTable } from '../components/DataTable';
import api from '../services/api';
import type { IncidentDto } from '../types';
import { Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface IncidentListResponse {
    items: IncidentDto[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export default function Incidents() {
    const [incidents, setIncidents] = useState<IncidentDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchIncidents = async () => {
        try {
            const response = await api.get<IncidentListResponse>('/incidents');
            // Assuming the API returns the list directly or wrapped. 
            // Based on service it returns IncidentListResponse.
            setIncidents(response.data.items);
        } catch (err) {
            console.error(err);
            setError('Failed to load incidents');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncidents();
    }, []);

    const columns = [
        { header: 'ID', accessorKey: 'serverIncidentId' as keyof IncidentDto },
        {
            header: 'Severity',
            accessorKey: 'severity' as keyof IncidentDto,
            cell: (i: IncidentDto) => {
                const colors = {
                    'Critical': 'bg-red-100 text-red-800',
                    'High': 'bg-orange-100 text-orange-800',
                    'Medium': 'bg-yellow-100 text-yellow-800',
                    'Low': 'bg-green-100 text-green-800'
                };
                return (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[i.severity as keyof typeof colors] || 'bg-gray-100'}`}>
                        {i.severity}
                    </span>
                );
            }
        },
        { header: 'Type', accessorKey: 'category' as keyof IncidentDto },
        {
            header: 'Status',
            accessorKey: 'status' as keyof IncidentDto,
            cell: (i: IncidentDto) => {
                const icons = {
                    'Pending': <Clock size={16} className="text-yellow-500" />,
                    'Resolved': <CheckCircle size={16} className="text-green-500" />,
                    'Closed': <CheckCircle size={16} className="text-gray-500" />
                };
                return (
                    <div className="flex items-center gap-2">
                        {icons[i.status as keyof typeof icons] || <AlertTriangle size={16} />}
                        <span>{i.status}</span>
                    </div>
                );
            }
        },
        {
            header: 'Time',
            accessorKey: 'capturedAt' as keyof IncidentDto,
            cell: (i: IncidentDto) => new Date(i.capturedAt).toLocaleString()
        }
    ];

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600 flex gap-2"><AlertTriangle /> {error}</div>;

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <DataTable
                    title="Incident Management"
                    data={incidents}
                    columns={columns}
                    actions={() => (
                        <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                            <Eye size={18} /> Details
                        </button>
                    )}
                />
            </div>
        </div>
    );
}
