import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { SignalRProvider } from './context/SignalRContext';

import Dashboard from './pages/Dashboard';

// Protected Route Guard
const ProtectedRoute = ({ children, requireAdmin }: { children: JSX.Element, requireAdmin?: boolean }) => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user?.role !== 'Admin') {
        return <div className="p-8 text-center text-red-600">Access Denied: Admins Only</div>;
    }

    return children;
};

import Users from './pages/Users';
import Incidents from './pages/Incidents';
import Layout from './components/Layout';

function App() {
    return (
        <SignalRProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Dashboard />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute requireAdmin>
                                <Layout>
                                    <Users />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/incidents"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Incidents />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </SignalRProvider>
    );
}

export default App;
