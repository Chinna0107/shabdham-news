import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaEyeSlash, FaKey, FaEnvelope, FaLock, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { adminLogin, forgotPassword, resetPasswordWithCode } from '../../services/api';
import logo from '../../assets/logo.jpeg';

const EmployeeLogin = () => {
  const navigate = useNavigate();
  
  // Login State
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password State
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await adminLogin(email, password);
      
      if (data.user.role !== 'employee') {
        setError('Access denied. Please use the admin login page.');
        return;
      }

      localStorage.setItem('employee_token', data.token);
      localStorage.setItem('employee_user', JSON.stringify(data.user));
      
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      
      navigate('/employee/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotMessage('');
    setForgotLoading(true);

    try {
      if (forgotStep === 1) {
        if (!forgotEmail) {
          setForgotError('Please enter your email.');
          setForgotLoading(false);
          return;
        }
        const res = await forgotPassword(forgotEmail);
        setForgotMessage(res.message);
        setForgotStep(2);
      } else if (forgotStep === 2) {
        if (!resetCode) {
          setForgotError('Please enter the reset code.');
          setForgotLoading(false);
          return;
        }
        setForgotStep(3);
        setForgotMessage('Code accepted. Please enter your new password.');
      } else if (forgotStep === 3) {
        if (newPassword !== confirmNewPassword) {
          setForgotError('Passwords do not match.');
          setForgotLoading(false);
          return;
        }
        if (newPassword.length < 6) {
          setForgotError('Password must be at least 6 characters.');
          setForgotLoading(false);
          return;
        }
        const res = await resetPasswordWithCode(forgotEmail, resetCode, newPassword);
        setForgotMessage(res.message || 'Password successfully reset!');
        setTimeout(() => {
          setIsForgotPassword(false);
          setForgotStep(1);
          setForgotEmail('');
          setResetCode('');
          setNewPassword('');
          setConfirmNewPassword('');
          setForgotMessage('');
        }, 3000);
      }
    } catch (err) {
      setForgotError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const cancelForgot = () => {
    setIsForgotPassword(false);
    setForgotStep(1);
    setForgotError('');
    setForgotMessage('');
    setResetCode('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] shadow-2xl flex flex-col md:flex-row w-full max-w-[1000px] min-h-[500px] overflow-hidden">
        
        {/* Left Side: Dark Info Panel */}
        <div className="bg-blue-900 text-white w-full md:w-[45%] p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -ml-20 -mb-20"></div>
          
          <div className="relative z-10">
            <div className="mb-12">
              <img 
                src={logo}
                alt="Logo" 
                className="h-16 bg-white p-2 rounded-lg object-contain"
              />
            </div>
            
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Employee<br />Portal
            </h1>
            <p className="text-blue-200 text-sm font-medium">
              Manage your assigned news categories and track publication status.
            </p>
          </div>

          <div className="relative z-10 mt-12 md:mt-0">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-blue-300 hover:text-white transition-colors"
            >
              <FaArrowLeft className="mr-2" size={12} /> Back to Site
            </Link>
          </div>
        </div>

        {/* Right Side: Forms */}
        <div className="w-full md:w-[55%] p-10 md:p-14 flex flex-col justify-center bg-gray-50/50">
          {!isForgotPassword ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Contributor</h2>
                <p className="text-gray-500 text-sm font-medium">
                  Sign in to submit and manage your news articles.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold border border-red-100">
                    {error}
                  </div>
                )}
                
                <div className="flex flex-col">
                  <label className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    placeholder="Enter your employee email"
                    className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col relative">
                  <label className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-2">
                    Password
                  </label>
                  <div className="relative w-full">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="********"
                      className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 pr-12 text-sm text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                  <div className="text-right mt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsForgotPassword(true)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-bold rounded-xl py-3.5 hover:bg-blue-700 transition-colors mt-2 shadow-lg shadow-blue-900/20 disabled:opacity-60"
                >
                  {loading ? 'Signing in...' : 'Sign In to Portal'}
                </button>
              </form>
            </>
          ) : (
            // Forgot Password Flow
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center">
                  <FaKey className="mr-2 text-blue-500" /> Reset Password
                </h2>
                <p className="text-gray-500 text-sm font-medium">
                  {forgotStep === 1 && "Enter your email to receive a reset code."}
                  {forgotStep === 2 && "Enter the 6-digit code sent to your email."}
                  {forgotStep === 3 && "Create a new, secure password."}
                </p>
              </div>

              <form onSubmit={handleForgotSubmit} className="flex flex-col space-y-5">
                {forgotError && (
                  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold border border-red-100 flex items-start">
                    <span className="block mt-0.5 mr-2">⚠️</span> {forgotError}
                  </div>
                )}
                {forgotMessage && (
                  <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-bold border border-green-100 flex items-center">
                    <FaCheckCircle className="mr-2" /> {forgotMessage}
                  </div>
                )}

                {forgotStep === 1 && (
                  <div className="flex flex-col">
                    <label className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input 
                        type="email" 
                        placeholder="employee@shabdham.com"
                        className="w-full pl-10 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                {forgotStep === 2 && (
                  <div className="flex flex-col">
                    <label className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-2">
                      6-Digit Code
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. 123456"
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-center text-xl tracking-widest font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      maxLength={6}
                      required
                    />
                  </div>
                )}

                {forgotStep === 3 && (
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="text-gray-400" />
                        </div>
                        <input 
                          type="password" 
                          placeholder="Enter new password"
                          className="w-full pl-10 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="text-gray-400" />
                        </div>
                        <input 
                          type="password" 
                          placeholder="Confirm new password"
                          className="w-full pl-10 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 mt-4">
                  <button 
                    type="button"
                    onClick={cancelForgot}
                    className="flex-1 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl py-3.5 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 bg-blue-600 text-white font-bold rounded-xl py-3.5 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-60 flex items-center justify-center"
                  >
                    {forgotLoading ? <FaSpinner className="animate-spin" /> : 'Continue'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
