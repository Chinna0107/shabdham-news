import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import Modal from '../../components/Admin/Modal';
import { 
  adminFetchEmployees, 
  adminCreateEmployee, 
  adminUpdateEmployee, 
  adminDeleteEmployee,
  fetchCategories
} from '../../services/api';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'employee', 
    allowed_categories: [] 
  });

  const loadData = async () => {
    try {
      const [empsData, catsData] = await Promise.all([
        adminFetchEmployees(),
        fetchCategories()
      ]);
      setEmployees(empsData);
      setCategories(catsData);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await adminDeleteEmployee(id);
        setEmployees(employees.filter(emp => emp.id !== id));
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete');
      }
    }
  };

  const openModal = (emp = null) => {
    if (emp) {
      setEditingEmp(emp);
      setFormData({ 
        name: emp.name, 
        email: emp.email, 
        password: '', 
        role: emp.role, 
        allowed_categories: emp.allowed_categories || [] 
      });
    } else {
      setEditingEmp(null);
      setFormData({ 
        name: '', 
        email: '', 
        password: '', 
        role: 'employee', 
        allowed_categories: [] 
      });
    }
    setIsModalOpen(true);
  };

  const handleCategoryToggle = (catId) => {
    setFormData(prev => {
      const current = prev.allowed_categories || [];
      if (current.includes(catId)) {
        return { ...prev, allowed_categories: current.filter(id => id !== catId) };
      } else {
        return { ...prev, allowed_categories: [...current, catId] };
      }
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingEmp) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password; // only send if changing
        const updated = await adminUpdateEmployee(editingEmp.id, payload);
        setEmployees(employees.map(emp => emp.id === updated.id ? updated : emp));
      } else {
        const created = await adminCreateEmployee(formData);
        setEmployees([...employees, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save');
    }
  };

  const getCategoryNames = (catIds) => {
    if (!catIds || !catIds.length) return [];
    return catIds.map(id => {
      const cat = categories.find(c => c.id === id);
      return cat ? cat.name : `ID:${id}`;
    });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b] mb-1">Employee Management</h1>
          <p className="text-gray-500">Manage permissions and view contributors.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-[#c8102e] text-white px-5 py-2 rounded-lg shadow-lg shadow-red-900/20 font-bold hover:bg-[#a00d25] transition-colors flex items-center whitespace-nowrap self-start md:self-auto"
        >
          <FaPlus className="mr-2" /> New Employee
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="py-4 px-8 font-bold text-sm text-[#1e293b]">User</th>
              <th className="py-4 px-6 font-bold text-sm text-[#1e293b] w-32">Role</th>
              <th className="py-4 px-6 font-bold text-sm text-[#1e293b] w-[50%]">Assigned Categories</th>
              <th className="py-4 px-8 font-bold text-sm text-[#1e293b] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-8 text-gray-500">Loading or no users found.</td></tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="border-b border-gray-50 hover:bg-slate-50 transition-colors align-top">
                  <td className="py-6 px-8">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm mr-4 shrink-0 shadow-sm">
                        {emp.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1e293b]">{emp.name}</span>
                        <span className="text-xs text-gray-400 font-medium mt-0.5">{emp.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${emp.role === 'superadmin' || emp.role === 'admin' ? 'text-blue-500' : 'text-green-500'}`}>
                      {emp.role}
                    </span>
                  </td>
                  <td className="py-6 px-6">
                    {emp.role === 'admin' || emp.role === 'superadmin' ? (
                      <span className="text-blue-400 italic text-sm">All Categories (Admin)</span>
                    ) : (
                      <>
                        {(!emp.allowed_categories || emp.allowed_categories.length === 0) ? (
                          <span className="text-gray-300 italic text-sm">No categories assigned</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {getCategoryNames(emp.allowed_categories).map((catName, i) => (
                              <span key={i} className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] border border-gray-200">
                                {catName}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <button onClick={() => openModal(emp)} className="text-gray-400 hover:text-blue-500 transition-colors p-2">
                        <FaEdit size={16} />
                      </button>
                      <button onClick={() => handleDelete(emp.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                        <FaTrashAlt size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingEmp ? 'Edit Employee' : 'New Employee'}
      >
        <form onSubmit={handleSave} className="flex flex-col space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 font-bold"
              required 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Email</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 font-bold"
              required 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
              {editingEmp ? "Password (leave blank to keep current)" : "Password"}
            </label>
            <input 
              type="password" 
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 font-bold"
              required={!editingEmp}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Role</label>
            <select 
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 font-bold"
            >
              <option value="employee">EMPLOYEE</option>
              <option value="admin">ADMIN</option>
            </select>
          </div>
          
          {formData.role === 'employee' && (
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                Allowed Categories (Tick all that apply)
              </label>
              <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 max-h-48 overflow-y-auto space-y-2">
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center space-x-3 cursor-pointer p-1 hover:bg-gray-100 rounded">
                    <input 
                      type="checkbox"
                      checked={(formData.allowed_categories || []).includes(cat.id)}
                      onChange={() => handleCategoryToggle(cat.id)}
                      className="w-4 h-4 text-[#c8102e] rounded border-gray-300 focus:ring-[#c8102e]"
                    />
                    <span className="text-sm font-bold text-gray-700">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          <button type="submit" className="w-full bg-[#c8102e] text-white py-3 rounded-xl font-bold mt-4 hover:bg-[#a00d25] transition-colors">
            {editingEmp ? 'Save Changes' : 'Add Employee'}
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default Employees;
