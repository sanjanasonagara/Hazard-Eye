import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, ClipboardList, User, ChevronDown, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const { state, switchRole } = useApp();
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    setShowRoleMenu(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* Left: App name / logo */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-semibold text-sm">
            HE
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-gray-900">HazardEye</span>
            <span className="text-xs text-gray-500">
              {state.currentUser.role === 'supervisor' ? 'Supervisor Portal' : 'Employee Portal'}
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Navigation links */}
      <nav className="hidden md:flex items-center gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive ? 'text-primary-700 bg-primary-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </NavLink>
        <NavLink
          to="/incidents"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive ? 'text-primary-700 bg-primary-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`
          }
        >
          <AlertTriangle className="w-4 h-4" />
          Incidents
        </NavLink>
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive ? 'text-primary-700 bg-primary-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`
          }
        >
          <ClipboardList className="w-4 h-4" />
          Tasks
        </NavLink>
      </nav>

      {/* Right: Role switch + user info */}
      <div className="flex items-center gap-4">
        {/* Role Switch */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <span className="text-sm font-medium text-gray-700 capitalize">
              {state.currentUser.role}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>

          {showRoleMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowRoleMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <button
                  onClick={() => handleRoleSwitch('supervisor')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    state.currentUser.role === 'supervisor' 
                      ? 'bg-primary-50 text-primary-700 font-medium' 
                      : 'text-gray-700'
                  }`}
                >
                  Supervisor
                </button>
                <button
                  onClick={() => handleRoleSwitch('employee')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    state.currentUser.role === 'employee' 
                      ? 'bg-primary-50 text-primary-700 font-medium' 
                      : 'text-gray-700'
                  }`}
                >
                  Employee
                </button>
              </div>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-xs font-semibold text-white">
                {state.currentUser.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-gray-900">
                {state.currentUser.name}
              </p>
              <p className="text-xs text-gray-500">
                {state.currentUser.department || 'General'}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {state.currentUser.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {state.currentUser.email}
                  </p>
                </div>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User className="w-4 h-4" />
                  Profile Settings
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

