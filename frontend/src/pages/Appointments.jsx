import React, { useState, useEffect } from 'react';
import { appointmentService, patientService } from '../services/api';
import { Calendar as CalendarIcon, Clock, User, Plus, XCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorName: '',
    appointmentDateTime: '',
    reason: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appRes, patRes] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll()
      ]);
      setAppointments(appRes.data);
      setPatients(patRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await appointmentService.create({
        ...formData,
        appointmentDateTime: new Date(formData.appointmentDateTime).toISOString()
      });
      setShowModal(false);
      setFormData({ patientId: '', doctorName: '', appointmentDateTime: '', reason: '' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error scheduling appointment');
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Cancel this appointment?')) {
      try {
        await appointmentService.cancel(id);
        fetchData();
      } catch (error) {
        console.error('Error cancelling appointment:', error);
      }
    }
  };

  const getPatientName = (id) => {
    const patient = patients.find(p => p.id === id);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Schedule Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-10 text-gray-500">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">No appointments scheduled</div>
        ) : appointments.map((appointment) => (
          <div key={appointment.id} className="bg-white rounded-xl shadow-sm border p-6 space-y-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                appointment.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {appointment.status}
              </span>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{getPatientName(appointment.patientId)}</h3>
              <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                <User className="h-3 w-3" /> Dr. {appointment.doctorName}
              </p>
            </div>

            <div className="flex flex-col gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                {format(new Date(appointment.appointmentDateTime), 'PPP p')}
              </div>
              {appointment.reason && (
                <div className="italic border-t pt-2 mt-1">"{appointment.reason}"</div>
              )}
            </div>

            {appointment.status === 'SCHEDULED' && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleCancel(appointment.id)}
                  className="flex-1 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <XCircle className="h-4 w-4" /> Cancel
                </button>
                <button
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" /> Complete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Schedule New Appointment</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Patient</label>
                <select 
                  required 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" 
                  value={formData.patientId} 
                  onChange={e => setFormData({...formData, patientId: e.target.value})}
                >
                  <option value="">Select Patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Doctor Name</label>
                <input 
                  required 
                  placeholder="e.g. Smith"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" 
                  value={formData.doctorName} 
                  onChange={e => setFormData({...formData, doctorName: e.target.value})} 
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Date & Time</label>
                <input 
                  type="datetime-local" 
                  required 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" 
                  value={formData.appointmentDateTime} 
                  onChange={e => setFormData({...formData, appointmentDateTime: e.target.value})} 
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Reason</label>
                <textarea 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" 
                  value={formData.reason} 
                  onChange={e => setFormData({...formData, reason: e.target.value})} 
                  rows="2" 
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
