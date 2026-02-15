import React, { useState, useEffect } from 'react';
import { patientService, appointmentService } from '../services/api';
import { Users, Calendar, Activity, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    upcomingAppointments: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [pRes, aRes] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll()
      ]);
      setStats({
        totalPatients: pRes.data.length,
        totalAppointments: aRes.data.length,
        upcomingAppointments: aRes.data.filter(a => a.status === 'SCHEDULED').length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const cards = [
    { name: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Total Appointments', value: stats.totalAppointments, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'Upcoming Visits', value: stats.upcomingAppointments, icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Patient Growth', value: '+12%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${card.bg} ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{card.name}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-medium">Patient Service</span>
              </div>
              <span className="text-sm text-green-600 font-bold">ONLINE</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-medium">Appointment Service</span>
              </div>
              <span className="text-sm text-green-600 font-bold">ONLINE</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-medium">API Gateway</span>
              </div>
              <span className="text-sm text-green-600 font-bold">ONLINE</span>
            </div>
          </div>
        </div>

        <div className="bg-indigo-700 p-8 rounded-xl shadow-lg text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">Welcome to PMediConnect</h3>
            <p className="text-indigo-100 mb-6">Your centralized healthcare management system. Monitor patients, schedule appointments, and manage medical records with ease.</p>
            <button className="bg-white text-indigo-700 px-6 py-2 rounded-lg font-bold hover:bg-indigo-50 transition-colors">
              View Quick Start Guide
            </button>
          </div>
          <Activity className="absolute -right-8 -bottom-8 h-48 w-48 text-indigo-600/30" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
