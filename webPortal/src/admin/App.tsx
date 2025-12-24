import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';

// Page Imports
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import CMS from './pages/CMS';
import Reports from './pages/Reports';
import SafetyGuidelines from './pages/SafetyGuidelines';
import ProfileSettings from './pages/ProfileSettings';

import UserManagement from './pages/UserManagement';

function App() {
  return (
    <div className="admin-portal">
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="cms" element={<CMS />} />
          <Route path="reports" element={<Reports />} />


          <Route path="users" element={<UserManagement />} />
          <Route path="safety" element={<SafetyGuidelines />} />

          <Route path="safety-guidelines" element={<SafetyGuidelines />} />

          <Route path="profile" element={<ProfileSettings />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
