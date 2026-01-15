"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaMapMarkerAlt, FaSignOutAlt } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, logout } from '../../../redux/authslice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  });
  const [parrainage, setParrainage] = useState({ code_parrainage: '', lien_parrainage: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedName = localStorage.getItem('userName') || 'Unknown';
    const storedEmail = localStorage.getItem('userEmail') || '';
    // Récupérer code et lien de parrainage depuis localStorage si présents
    const code_parrainage = localStorage.getItem('code_parrainage') || '';
    const lien_parrainage = localStorage.getItem('lien_parrainage') || '';
    setUserData({
      name: storedName,
      email: storedEmail,
    });
    setParrainage({
      code_parrainage,
      lien_parrainage,
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('No authentication token found');

      const response = await fetch('http://localhost:3001/users/agentcommercial/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      // Update localStorage with new data
      localStorage.setItem('userName', updatedUser.name || userData.name);
      localStorage.setItem('userEmail', updatedUser.email || userData.email);

      // Ajout: stocker code_parrainage et lien_parrainage si présents dans la réponse
      if (updatedUser.code_parrainage) {
        localStorage.setItem('code_parrainage', updatedUser.code_parrainage);
      }
      if (updatedUser.lien_parrainage) {
        localStorage.setItem('lien_parrainage', updatedUser.lien_parrainage);
      }
      setParrainage({
        code_parrainage: updatedUser.code_parrainage || localStorage.getItem('code_parrainage') || '',
        lien_parrainage: updatedUser.lien_parrainage || localStorage.getItem('lien_parrainage') || '',
      });

      // Update Redux store
      dispatch(setUser({
        name: updatedUser.name || userData.name,
        email: updatedUser.email || userData.email,
        id: localStorage.getItem('userId'),
        role: localStorage.getItem('userRole'),
      }));

      toast.success('Profile updated successfully', {
        role: 'alert',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: 'colored',
      });
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error(`Error updating profile: ${err.message}`, {
        role: 'alert',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: 'colored',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    window.location.href = 'http://localhost:3020/';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
      {/* Header */}
      <header className="bg-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <FaUser className="h-8 w-8 mr-3" />
            <h1 className="text-2xl font-munika">Travel Agency Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-munika transition-all disabled:opacity-50"
            disabled={isLoading}
            aria-label="Se déconnecter"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Profile Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-munika text-blue-800 mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaUser className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-munika text-gray-600">Name</p>
                  <p className="text-lg font-munika text-gray-900">{userData.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <HiOutlineMail className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-munika text-gray-600">Email</p>
                  <p className="text-lg font-munika text-gray-900">{userData.email}</p>
                </div>
              </div>
              {/* Parrainage info */}
              {parrainage.code_parrainage && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="font-munika text-blue-800 mb-1">
                    Code de parrainage : <span className="font-mono">{parrainage.code_parrainage}</span>
                  </div>
                  {parrainage.lien_parrainage && (
                    <div className="font-munika text-blue-700 break-all">
                      Lien de parrainage :{' '}
                      <a
                        href={parrainage.lien_parrainage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {parrainage.lien_parrainage}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Update Profile Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-munika text-blue-800 mb-4">Update Profile</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-munika text-gray-700 mb-1">
                  Name
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="block font-munika w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                    placeholder="Your name"
                    value={userData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-munika text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="block font-munika w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                    placeholder="your@email.com"
                    value={userData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-munika text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:shadow-md active:scale-[0.98]"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default Profile;