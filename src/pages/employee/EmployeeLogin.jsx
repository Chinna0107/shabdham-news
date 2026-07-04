import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { adminLogin } from '../../services/api';
import logo from '../../assets/logo.jpeg';

const EmployeeLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await adminLogin(email, password);
      localStorage.setItem('adminToken', data.token); // using same token key for api interceptor
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      
      if (data.user.role === 'employee') {
        navigate('/employee/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Main Container */}
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

        {/* Right Side: Login Form */}
        <div className="w-full md:w-[55%] p-10 md:p-14 flex flex-col justify-center bg-gray-50/50">
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
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold rounded-xl py-3.5 hover:bg-blue-700 transition-colors mt-2 shadow-lg shadow-blue-900/20 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In to Portal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
