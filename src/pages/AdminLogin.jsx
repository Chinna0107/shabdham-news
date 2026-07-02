import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { adminLogin } from '../services/api';
import logo from '../assets/logo.jpeg'

const AdminLogin = () => {
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
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="bg-white rounded-[24px] shadow-2xl flex flex-col md:flex-row w-full max-w-[1000px] min-h-[500px] overflow-hidden">
        
        {/* Left Side: Dark Info Panel */}
        <div className="bg-[#1e293b] text-white w-full md:w-[45%] p-10 flex flex-col justify-between relative">
          <div>
            <div className="mb-12">
              <img 
                src={logo}
                alt="Balagam TV" 
                className="h-16 bg-white p-2 rounded-lg object-contain"
              />
            </div>
            
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Portal<br />Access
            </h1>
            <p className="text-gray-400 text-sm font-medium">
              Admin & Employee Authentication
            </p>
          </div>

          <div className="mt-12 md:mt-0">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
            >
              <FaArrowLeft className="mr-2" size={12} /> Back to Site
            </Link>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-[55%] p-10 md:p-14 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1e293b] mb-2">Welcome Back</h2>
            <p className="text-gray-500 text-sm font-medium">
              Please enter your credentials to manage the portal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            {error && (
              <div className="bg-red-50 text-brand-red px-4 py-3 rounded-xl text-sm font-bold border border-red-100">
                {error}
              </div>
            )}
            
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-2">
                Email Address
              </label>
              <input 
                type="email" 
                placeholder="Enter your email"
                className="bg-[#f8fafc] border-none rounded-xl px-4 py-3.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1e293b]/20"
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
                  className="bg-[#f8fafc] border-none rounded-xl px-4 py-3.5 pr-12 text-sm text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-[#1e293b]/20"
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
              className="w-full bg-[#c8102e] text-white font-bold rounded-xl py-3.5 hover:bg-[#a00d25] transition-colors mt-2 shadow-lg shadow-red-900/20 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Optional bottom link for right side, hidden on mobile for cleaner look */}
          <div className="mt-8 hidden md:block">
            <Link 
              to="/" 
              className="inline-flex items-center text-xs text-gray-400 font-semibold hover:text-[#1e293b] transition-colors"
            >
              <FaArrowLeft className="mr-2" size={10} /> Back to Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
