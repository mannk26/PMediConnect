import React, { useState, useEffect } from 'react';
import { patientService } from '../services/api';
import { Plus, Edit2, Trash2, Search, User } from 'lucide-react';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    gender: 'Other'
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await patientService.getAll();
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await patientService.update(editingId, formData);
      } else {
        await patientService.create(formData);
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({
        firstName: '', lastName: '', email: '', phoneNumber: '',
        address: '', dateOfBirth: '', gender: 'Other'
      });
      fetchPatients();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving patient');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientService.delete(id);
        fetchPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  const openEditModal = (patient) => {
    setEditingId(patient.id);
    setFormData(patient);
    setShowModal(true);
  };

  const filteredPatients = patients.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              firstName: '', lastName: '', email: '', phoneNumber: '',
              address: '', dateOfBirth: '', gender: 'Other'
            });
            setShowModal(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Add Patient
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Patient</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Contact</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Details</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">Loading patients...</td></tr>
            ) : filteredPatients.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">No patients found</td></tr>
            ) : filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</div>
                      <div className="text-sm text-gray-500">{patient.gender}, {patient.dateOfBirth}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="text-gray-900">{patient.email}</div>
                  <div className="text-gray-500">{patient.phoneNumber}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {patient.address}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openEditModal(patient)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(patient.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">{editingId ? 'Edit Patient' : 'Add New Patient'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <input required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <input className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                <input type="date" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <textarea className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows="2" />
              </div>
              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm">Save Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
