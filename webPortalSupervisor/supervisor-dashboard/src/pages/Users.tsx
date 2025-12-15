import { useEffect, useState } from 'react';
import { DataTable } from '../components/DataTable';
import api from '../services/api';
import type { UserDto } from '../types';
import { Trash2, AlertCircle, Plus, X } from 'lucide-react';

export default function Users() {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'Viewer'
    });

    const fetchUsers = async () => {
        try {
            const response = await api.get<UserDto[]>('/auth/users');
            setUsers(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/auth/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
            setUsers(users.filter(u => u.id !== id));
        } catch {
            alert('Failed to delete user');
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post<UserDto>('/auth/users', newUser);
            setUsers([...users, res.data]);
            setShowModal(false);
            setNewUser({ email: '', password: '', firstName: '', lastName: '', role: 'Viewer' });
        } catch (err: unknown) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const message = (err as any).response?.data?.message || 'Failed to create user';
            alert(message);
        }
    };

    const columns = [
        { header: 'ID', accessorKey: 'id' as keyof UserDto },
        { header: 'Name', accessorKey: (u: UserDto) => `${u.firstName} ${u.lastName}` },
        { header: 'Email', accessorKey: 'email' as keyof UserDto },
        {
            header: 'Role',
            accessorKey: 'role' as keyof UserDto,
            cell: (u: UserDto) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${u.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'SafetyOfficer' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {u.role}
                </span>
            )
        }
    ];

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600 flex gap-2"><AlertCircle /> {error}</div>;

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                    >
                        <Plus size={18} /> Add User
                    </button>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <DataTable
                        title=""
                        data={users}
                        columns={columns}
                        actions={(user) => (
                            <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">
                                <Trash2 size={18} />
                            </button>
                        )}
                    />
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full m-auto">
                        <div className="flex justify-between items-center p-5 border-b">
                            <h3 className="text-xl font-bold text-gray-900">Add New User</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border rounded-lg px-3 py-2"
                                        value={newUser.firstName}
                                        onChange={e => setNewUser({ ...newUser, firstName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border rounded-lg px-3 py-2"
                                        value={newUser.lastName}
                                        onChange={e => setNewUser({ ...newUser, lastName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={newUser.role}
                                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="Viewer">Viewer</option>
                                    <option value="SafetyOfficer">Safety Officer (Supervisor)</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Auditor">Auditor</option>
                                </select>
                            </div>
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
