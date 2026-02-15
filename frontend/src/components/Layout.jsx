import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, Home, Activity } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-700 text-white flex-shrink-0">
        <div className="p-6 flex items-center gap-3">
          <Activity className="h-8 w-8 text-indigo-200" />
          <span className="text-xl font-bold tracking-tight">MediConnect</span>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-indigo-800 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            {navigation.find(n => n.href === location.pathname)?.name || 'Patient Details'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-200">
              AD
            </div>
            <span className="text-gray-600 font-medium">Admin User</span>
          </div>
        </header>
        <main className="p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
