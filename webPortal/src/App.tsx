import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import AdminApp from './admin/App';
import SupervisorApp from './supervisor/App';

const LandingPage = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: '2rem',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: 'white',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>HazardEye Portal</h1>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <Link to="/admin" style={{
                    padding: '2rem 3rem',
                    borderRadius: '1rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    textDecoration: 'none',
                    textAlign: 'center',
                    transition: 'all 0.3s'
                }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Admin Portal</h2>
                    <p style={{ opacity: 0.7 }}>System configuration & metrics</p>
                </Link>
                <Link to="/supervisor" style={{
                    padding: '2rem 3rem',
                    borderRadius: '1rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    textDecoration: 'none',
                    textAlign: 'center',
                    transition: 'all 0.3s'
                }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Supervisor Portal</h2>
                    <p style={{ opacity: 0.7 }}>Incident management & tasks</p>
                </Link>
            </div>
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                {/* We use * to allow internal routing within the sub-apps */}
                <Route path="/admin/*" element={<AdminApp />} />
                <Route path="/supervisor/*" element={<SupervisorApp />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
