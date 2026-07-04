import React, { useState, useEffect } from 'react';
import { resetPassword, verifyPassword } from '../../services/api';
import { FaUserCircle, FaEnvelope, FaLock, FaKey, FaCheckCircle, FaSpinner, FaArrowRight } from 'react-icons/fa';

const AdminProfile = () => {
  const [user, setUser] = useState({ name: 'Admin', email: '' });
  
  // Step 0: Button only
  // Step 1: Verify Old Password
  // Step 2: Set New Password
  const [step, setStep] = useState(0);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!oldPassword) {
      setError('Please enter your present password.');
      return;
    }

    setLoading(true);
    try {
      await verifyPassword(oldPassword);
      setStep(2);
      setMessage('Password verified. Now enter your new password.');
    } catch (err) {
      setError(err.response?.data?.error || 'Incorrect password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(oldPassword, newPassword);
      setMessage(response.message || 'Password successfully updated!');
      setStep(0);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelReset = () => {
    setStep(0);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-[#1e293b] px-8 py-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c8102e] rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -ml-20 -mb-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-[#f15a24] text-white flex items-center justify-center text-4xl font-bold shadow-xl border-4 border-slate-800">
              {user.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-center md:text-left text-white">
              <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
              <span className="inline-flex items-center text-sm font-medium bg-[#c8102e]/30 text-red-200 px-3 py-1 rounded-full border border-red-500/30">
                Shabdham Admin
              </span>
              <div className="mt-3 flex items-center justify-center md:justify-start text-slate-300">
                <FaEnvelope className="mr-2" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reset Password Section */}
        <div className="p-8 md:p-12 bg-slate-50">
          <div className="max-w-md mx-auto md:mx-0">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center">
                <FaLock className="mr-2 text-[#c8102e]" /> Security Settings
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Manage your account security and password.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-start mb-5">
                <span className="block mt-0.5 mr-2">⚠️</span> {error}
              </div>
            )}
            
            {message && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-100 flex items-center mb-5">
                <FaCheckCircle className="mr-2" size={16} /> {message}
              </div>
            )}

            {step === 0 && (
              <div>
                <button
                  onClick={() => setStep(1)}
                  className="bg-white border border-slate-200 hover:border-[#c8102e] hover:bg-red-50 text-slate-700 font-bold py-3 px-6 rounded-xl shadow-sm transition-all active:scale-[0.98] flex items-center"
                >
                  <FaKey className="mr-2 text-[#c8102e]" /> Reset Password
                </button>
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleVerifyPassword} className="space-y-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Step 1: Verify Present Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaKey className="text-slate-400" />
                    </div>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      placeholder="Enter current password"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]/20 focus:border-[#c8102e] transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={cancelReset}
                    className="flex-1 bg-white hover:bg-slate-50 text-slate-600 font-bold py-3 px-4 rounded-xl border border-slate-200 transition-all active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#c8102e] hover:bg-[#a00d25] text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-900/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <>Verify <FaArrowRight className="ml-2" /></>
                    )}
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleResetPassword} className="space-y-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Step 2: Create New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-slate-400" />
                      </div>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder="Enter new password"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]/20 focus:border-[#c8102e] transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-slate-400" />
                      </div>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm new password"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]/20 focus:border-[#c8102e] transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={cancelReset}
                    className="flex-1 bg-white hover:bg-slate-50 text-slate-600 font-bold py-3 px-4 rounded-xl border border-slate-200 transition-all active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-green-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" /> Saving...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
