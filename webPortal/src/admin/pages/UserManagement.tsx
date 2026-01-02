
import { useState, useMemo, useEffect } from 'react';
import {
    Search,
    CheckCircle2,
    XCircle,
    History,
    Shield,
    Briefcase,
    X,
    UserPlus,
    Trash2
} from 'lucide-react';
import './UserManagement.css';

// --- Interfaces ---

interface User {
    id: number;
    name: string;
    email: string;
    employeeId: string;
    isActive: boolean;
    lastLoginAt: string;
    createdAt: string;
    isAdmin: boolean;
    isSupervisor: boolean;
    isEmployee: boolean;
    role: string;
    supervisorDepartments: string[];
    supervisorDepartmentIds: number[];
    phone?: string;
    company?: string;
}

interface Department {
    id: number;
    name: string;
}

interface AuditEntry {
    id: number;
    action: string;
    entityType: string;
    entityId: number;
    details: any;
    timestamp: string;
    user: { name: string } | null;
}

// --- API Helpers ---

const API_BASE = 'http://localhost:5200/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

const UserManagement = () => {
    // State
    const [users, setUsers] = useState<User[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    // Permissions Modal State
    const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [permissionsForm, setPermissionsForm] = useState({
        isAdmin: false,
        isSupervisor: false,
        selectedDeptIds: [] as number[]
    });

    // Create User Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createForm, setCreateForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'Worker',
        isActive: true,
        employeeId: '',
        phone: '',
        company: '',
        supervisorDepartmentIds: [] as number[]
    });

    // --- Data Fetching ---

    const loadUserData = async () => {
        setLoading(true);
        try {
            const [usersRes, deptsRes, auditRes] = await Promise.all([
                fetch(`${API_BASE}/users`, { headers: getAuthHeaders() }),
                fetch(`${API_BASE}/departments`, { headers: getAuthHeaders() }),
                fetch(`${API_BASE}/audit`, { headers: getAuthHeaders() })
            ]);

            let deptsData: Department[] = [];
            if (deptsRes.ok) {
                deptsData = await deptsRes.json();
                setDepartments(deptsData);
            }

            if (usersRes.ok) {
                const usersData = await usersRes.json();
                const mappedUsers = usersData.map((u: any) => {
                    const deptIds = u.supervisorDepartmentIds || [];
                    const deptNames = deptIds.map((id: number) => 
                        deptsData.find(d => d.id === id)?.name || `ID:${id}`
                    );
                    
                    return {
                        id: u.id,
                        name: `${u.firstName} ${u.lastName}`,
                        email: u.email,
                        employeeId: u.employeeId || '',
                        isActive: u.isActive !== undefined ? u.isActive : true,
                        lastLoginAt: u.lastLoginAt,
                        createdAt: u.createdAt || new Date().toISOString(),
                        isAdmin: u.role === 'Admin',
                        isSupervisor: u.role === 'Supervisor' || u.role === 'SafetyOfficer',
                        isEmployee: u.role === 'Worker' || u.role === 'Viewer',
                        role: u.role,
                        supervisorDepartments: deptNames, 
                        supervisorDepartmentIds: deptIds,
                        phone: u.phone,
                        company: u.company
                    };
                });
                setUsers(mappedUsers);
            } else {
                setError(`Failed to load users (Status: ${usersRes.status})`);
            }

            if (auditRes.ok) setAuditLog(await auditRes.json());

        } catch (err) {
            console.error(err);
            setError("Failed to load data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUserData();
    }, []);

    // --- Actions ---

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/users`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(createForm)
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to create user');
            }

            alert('User created successfully');
            setIsCreateModalOpen(false);
            setCreateForm({ 
                firstName: '', 
                lastName: '', 
                email: '', 
                password: '', 
                role: 'Worker', 
                isActive: true, 
                employeeId: '',
                phone: '',
                company: '',
                supervisorDepartmentIds: [] 
            });
            loadUserData();
        } catch (err: any) {
            alert('Error creating user: ' + err.message);
        }
    };

    const handleDeleteUser = async (user: User) => {
        if (!confirm(`Are you sure you want to PERMANENTLY delete ${user.name}? This may fail if they have history.`)) return;
        try {
            const res = await fetch(`${API_BASE}/users/${user.id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (!res.ok) throw new Error('Failed to delete user');
            alert('User deleted successfully');
            loadUserData();
        } catch (err) {
            alert('Error deleting user: It is likely this user has historical data and cannot be deleted. Consider disabling them instead.');
        }
    };

    const handleOpenPermissions = (user: User) => {
        setSelectedUser(user);
        setPermissionsForm({
            isAdmin: user.isAdmin,
            isSupervisor: user.isSupervisor,
            selectedDeptIds: user.supervisorDepartmentIds || []
        });
        setIsPermissionsModalOpen(true);
    };

    const handleSavePermissions = async () => {
        if (!selectedUser) return;
        try {
            // Determine the role string based on checkboxes
            let newRole = 'Worker';
            if (permissionsForm.isAdmin) {
                newRole = 'Admin';
            } else if (permissionsForm.isSupervisor) {
                // If they were already a Safety Officer, keep it, otherwise use Supervisor
                newRole = selectedUser.role === 'SafetyOfficer' ? 'SafetyOfficer' : 'Supervisor';
            }

            const res = await fetch(`${API_BASE}/users/${selectedUser.id}/permissions`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    role: newRole,
                    supervisorDepartmentIds: permissionsForm.selectedDeptIds
                })
            });
            if (!res.ok) throw new Error('Failed to update permissions');
            setIsPermissionsModalOpen(false);
            loadUserData();
            alert('Permissions updated successfully.');
        } catch (err) {
            alert('Error updating permissions');
        }
    };

    const handleToggleStatus = async (user: User) => {
        if (!confirm(`Are you sure you want to ${user.isActive ? 'disable' : 'enable'} ${user.name}?`)) return;
        try {
            const res = await fetch(`${API_BASE}/users/${user.id}/status`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ isActive: !user.isActive })
            });
            if (!res.ok) throw new Error('Failed to update status');
            loadUserData();
        } catch (err) {
            alert('Error updating status');
        }
    };

    // --- Filtering ---

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());
            if (!matchesSearch) return false;

            if (roleFilter === 'ADMIN' && !user.isAdmin) return false;
            if (roleFilter === 'SUPERVISOR' && !user.isSupervisor) return false;
            if (roleFilter === 'EMPLOYEE_ONLY' && (user.isAdmin || user.isSupervisor)) return false;

            return true;
        });
    }, [users, searchQuery, roleFilter]);

    return (
        <div className="user-management-container">
            <div className="page-header">
                <div className="page-title">
                    <h1>User Management & Governance</h1>
                    <p>Manage system authority, responsibilities, and access controls</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserPlus size={16} />
                        Create New User
                    </button>
                    <button className="btn-secondary" onClick={loadUserData} style={{ padding: '8px 16px', background: 'white', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}>
                        Refresh List
                    </button>
                </div>
            </div>

            <div className="filters-card">
                <div className="filters-layout">
                    <div className="search-container">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="search-input"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="filters-group">
                        <select
                            className="filter-select"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="All">All Users</option>
                            <option value="ADMIN">Admins</option>
                            <option value="SUPERVISOR">Supervisors</option>
                            <option value="EMPLOYEE_ONLY">Employees Only</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading && <div style={{ textAlign: 'center', padding: '1rem', color: '#64748b' }}>Loading security data...</div>}

            {error && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    {error}
                </div>
            )}

            <div className="table-card">
                <div className="table-responsive">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Identity</th>
                                <th>Contact & Dept</th>
                                <th>Role & Responsibilities</th>
                                <th>Assigned Scope (Sup.)</th>
    
                                <th align="right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-info">
                                                <div className="avatar-initials">{user.name.charAt(0)}</div>
                                                <div className="user-text">
                                                    <h4>{user.name}</h4>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.875rem' }}>
                                                <div style={{ fontWeight: 500, color: '#334155' }}>
                                                    {user.company || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No Dept</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                             <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                  <span className="status-badge" style={{ backgroundColor: '#e2e8f0', color: '#475569' }}>{user.role}</span>
                                                  {user.isSupervisor && (
                                                      <span className="status-badge" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>
                                                          <Briefcase size={10} style={{ marginRight: 4 }} /> Authority
                                                      </span>
                                                  )}
                                                  {user.isAdmin && (
                                                      <span className="status-badge" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                                                          <Shield size={10} style={{ marginRight: 4 }} /> Root
                                                      </span>
                                                  )}
                                             </div>
                                        </td>
                                        <td>
                                            {user.isSupervisor ? (
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                    {user.supervisorDepartments.length > 0 ? user.supervisorDepartments.join(', ') : 'No Scope'}
                                                </div>
                                            ) : '—'}
                                        </td>
                                        
                                        <td>
                                            <div className="actions-cell">
                                                <button onClick={() => handleOpenPermissions(user)} title="Manage Permissions" style={{ padding: '6px', marginRight: '8px', cursor: 'pointer', border: '1px solid #cbd5e1', borderRadius: '4px', background: 'white' }}>
                                                    <Shield size={16} color="#475569" />
                                                </button>
                                                <button onClick={() => handleToggleStatus(user)} title={user.isActive ? "Disable" : "Enable"} style={{ padding: '6px', marginRight: '8px', cursor: 'pointer', border: '1px solid #cbd5e1', borderRadius: '4px', background: 'white' }}>
                                                    {user.isActive ? <XCircle size={16} color="#ef4444" /> : <CheckCircle2 size={16} color="#22c55e" />}
                                                </button>
                                                <button onClick={() => handleDeleteUser(user)} title="Delete User" style={{ padding: '6px', cursor: 'pointer', border: '1px solid #cbd5e1', borderRadius: '4px', background: 'white' }}>
                                                    <Trash2 size={16} color="#ef4444" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No users found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isCreateModalOpen && (
                 <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Create New User</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreateUser}>
                            <div style={{ display: 'grid', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input required type="text" placeholder="John" value={createForm.firstName} onChange={e => setCreateForm({...createForm, firstName: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input required type="text" placeholder="Doe" value={createForm.lastName} onChange={e => setCreateForm({...createForm, lastName: e.target.value})} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input required type="email" placeholder="john.doe@company.com" value={createForm.email} onChange={e => setCreateForm({...createForm, email: e.target.value})} />
                                </div>

                                <div className="form-group">
                                    <label>Password</label>
                                    <input required type="password" placeholder="••••••••" value={createForm.password} onChange={e => setCreateForm({...createForm, password: e.target.value})} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className="form-group">
                                        <label>Employee ID</label>
                                        <input type="text" placeholder="EMP-001" value={createForm.employeeId} onChange={e => setCreateForm({...createForm, employeeId: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input type="text" placeholder="+1 (555) 000-0000" value={createForm.phone} onChange={e => setCreateForm({...createForm, phone: e.target.value})} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Primary Department</label>
                                    <select 
                                        required
                                        value={createForm.company} 
                                        onChange={e => setCreateForm({...createForm, company: e.target.value})}
                                    >
                                        <option value="">Select a department...</option>
                                        {departments.map(dept => (
                                            <option key={dept.id} value={dept.name}>{dept.name}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label>System Role</label>
                                    <select value={createForm.role} onChange={e => setCreateForm({...createForm, role: e.target.value})}>
                                        <option value="Worker">Worker / Operator</option>
                                        <option value="Supervisor">Supervisor</option>
                                        <option value="SafetyOfficer">Safety Officer</option>
                                        <option value="Admin">Administrator</option>
                                        <option value="Viewer">Viewer (Read-only)</option>
                                    </select>
                                </div>
                                
                                {(createForm.role === 'Supervisor' || createForm.role === 'SafetyOfficer') && (
                                    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '12px', letterSpacing: '0.05em' }}>AUTHORITY RADIUS (ASSIGN DEPARTMENTS)</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            {departments.map(dept => (
                                                <label key={dept.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', cursor: 'pointer', padding: '4px' }}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={createForm.supervisorDepartmentIds.includes(dept.id)} 
                                                        onChange={e => {
                                                            const isChecked = e.target.checked;
                                                            setCreateForm(prev => ({
                                                                ...prev,
                                                                supervisorDepartmentIds: isChecked 
                                                                    ? [...prev.supervisorDepartmentIds, dept.id] 
                                                                    : prev.supervisorDepartmentIds.filter(id => id !== dept.id)
                                                            }));
                                                        }} 
                                                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                                    />
                                                    {dept.name}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ paddingLeft: '24px', paddingRight: '24px' }}>Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isPermissionsModalOpen && selectedUser && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Manage Access</h2>
                            <button onClick={() => setIsPermissionsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '24px' }}>Configure responsibilities for <strong>{selectedUser.name}</strong></p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>System Administrator</h4>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Full access to all settings</p>
                                </div>
                                <input type="checkbox" checked={permissionsForm.isAdmin} onChange={e => setPermissionsForm({ ...permissionsForm, isAdmin: e.target.checked })} style={{ width: '20px', height: '20px' }} />
                            </div>
                            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Safety Supervisor</h4>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Department-specific oversight</p>
                                    </div>
                                    <input type="checkbox" checked={permissionsForm.isSupervisor} onChange={e => setPermissionsForm({ ...permissionsForm, isSupervisor: e.target.checked })} style={{ width: '20px', height: '20px' }} />
                                </div>
                                {permissionsForm.isSupervisor && (
                                    <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>ASSIGNED DEPARTMENTS</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                            {departments.map(dept => (
                                                <label key={dept.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                                                    <input type="checkbox" checked={permissionsForm.selectedDeptIds.includes(dept.id)} onChange={e => {
                                                        const isChecked = e.target.checked;
                                                        setPermissionsForm(prev => ({
                                                            ...prev,
                                                            selectedDeptIds: isChecked ? [...prev.selectedDeptIds, dept.id] : prev.selectedDeptIds.filter(id => id !== dept.id)
                                                        }));
                                                    }} />
                                                    {dept.name}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button onClick={() => setIsPermissionsModalOpen(false)} style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white' }}>Cancel</button>
                            <button onClick={handleSavePermissions} style={{ padding: '10px 24px', borderRadius: '6px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 600 }}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="audit-log-section">
                <h2 className="audit-title"><History size={20} /> Governance Audit Log</h2>
                <div className="audit-list">
                    {auditLog.length > 0 ? auditLog.slice(0, 10).map(entry => (
                        <div key={entry.id} className="audit-item">
                            <div className="audit-text">
                                <p><strong>{entry.action}</strong></p>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{JSON.stringify(entry.details)}</div>
                                <div className="audit-meta">{new Date(entry.timestamp).toLocaleString()}</div>
                            </div>
                        </div>
                    )) : <div className="empty-state">No recent activity.</div>}
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
