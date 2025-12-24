import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, ClipboardList, User, ChevronDown, LogOut, FileText, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const { state, switchRole } = useApp();
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const [showNotifications, setShowNotifications] = React.useState(false);
  const navigate = useNavigate();

  // Combine alerts and emergency instructions for notifications
  const notifications = React.useMemo(() => {
    const alerts = state.alerts.map(a => ({ ...a, type: 'alert' as const }));
    const emergencies = state.emergencyInstructions.map(e => ({ ...e, type: 'emergency' as const, timestamp: new Date() })); // Mock timestamp for emergency
    return [...alerts, ...emergencies].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [state.alerts, state.emergencyInstructions]);

  const unreadCount = notifications.length; // Simply count all for now as "unread" conceptually for the prototype

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    setShowRoleMenu(false);
  };

  return (
    <header className="bg-[#030d29] border-b border-blue-800 px-6 py-3 flex items-center justify-between text-white">
      {/* Left: App name / logo */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/hazardeye-logo.png"
            alt="HazardEye logo"
            className="w-8 h-8 rounded-lg object-contain shadow-sm shadow-black/20"
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-white">HazardEye</span>
            <span className="text-xs text-blue-200">
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
            `inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
              ? 'text-white bg-blue-900/80 shadow-sm'
              : 'text-blue-100 hover:text-white hover:bg-blue-800/60'
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </NavLink>
        <NavLink
          to="/incidents"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
              ? 'text-white bg-blue-900/80 shadow-sm'
              : 'text-blue-100 hover:text-white hover:bg-blue-800/60'
            }`
          }
        >
          <AlertTriangle className="w-4 h-4" />
          Incidents
        </NavLink>
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
              ? 'text-white bg-blue-900/80 shadow-sm'
              : 'text-blue-100 hover:text-white hover:bg-blue-800/60'
            }`
          }
        >
          <ClipboardList className="w-4 h-4" />
          Tasks
        </NavLink>
        <NavLink
          to="/safety-resources"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
              ? 'text-white bg-blue-900/80 shadow-sm'
              : 'text-blue-100 hover:text-white hover:bg-blue-800/60'
            }`
          }
        >
          <FileText className="w-4 h-4" />
          Safety Resources
        </NavLink>
      </nav>

      {/* Right: Role switch + user info */}
      <div className="flex items-center gap-4">
        {/* Role Switch */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-800/60 hover:bg-blue-700/70 rounded-lg transition-colors border border-blue-700"
          >
            <span className="text-sm font-medium text-blue-100 capitalize">
              {state.currentUser.role}
            </span>
            <ChevronDown className="w-4 h-4 text-blue-200" />
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
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${state.currentUser.role === 'supervisor'
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700'
                    }`}
                >
                  Supervisor
                </button>
                <button
                  onClick={() => handleRoleSwitch('employee')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${state.currentUser.role === 'employee'
                    ? 'bg-blue-50 text-blue-700 font-medium'
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
            className="flex items-center gap-3 px-3 py-2 hover:bg-blue-800/60 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center shadow-sm shadow-black/20">
              <span className="text-xs font-semibold text-white">
                {state.currentUser.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-white">
                {state.currentUser.name}
              </p>
              <p className="text-xs text-blue-200">
                {state.currentUser.department || 'General'}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-blue-200" />
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
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/profile');
                  }}
                >
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

        <div className="h-6 w-px bg-blue-800/50 mx-1"></div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-blue-100 hover:text-white hover:bg-blue-800/60 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#030d29]"></span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20 max-h-[80vh] overflow-y-auto">
                <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <span className="text-xs text-gray-500">{unreadCount} New</span>
                </div>

                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No new notifications
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((note, idx) => (
                      <div key={idx} className={`p-4 hover:bg-gray-50 transition-colors ${(note as any).severity === 'High' ? 'bg-red-50/50' : ''
                        }`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg shrink-0 ${(note as any).severity === 'High' || (note as any).type === 'emergency'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-orange-100 text-orange-600'
                            }`}>
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-sm font-semibold text-gray-900">
                                {note.title}
                              </h4>
                              <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                {format(note.timestamp || new Date(), 'h:mm a')}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {(note as any).message || (note as any).steps?.[0]}
                            </p>
                            {(note as any).type === 'emergency' && (
                              <div className="mt-2 text-xs font-bold text-red-600 flex items-center gap-1">
                                <span>Emergency Protocol Active</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

