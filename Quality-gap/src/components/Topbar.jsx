import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const Topbar = () => {
  const [currentUser, setCurrentUser] = useState(null);

  // Setup axios with credentials and token
  axios.defaults.withCredentials = true;
  axios.interceptors.request.use((config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/current_user/');
        setCurrentUser(res.data);
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="bg-blue-300 text-white p-4 shadow flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-lg font-bold">Nexius powered school management system</h1>
      {currentUser ? (
        <div className="flex items-center space-x-4">
          <span className="hidden md:block">{currentUser.username}</span>
          <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold">
            {currentUser.username?.[0]?.toUpperCase() || currentUser.first_name?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      ) : (
        <div className="text-sm italic">Loading user...</div>
      )}
    </header>
  );
};

export default Topbar;
