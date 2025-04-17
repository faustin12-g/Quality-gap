import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const SetSchoolPassword = () => {
  const [schoolCode, setSchoolCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if (code) {
      setSchoolCode(code);
    }
  }, [location]);

  const isPasswordStrong = (password) => {
    return password.length >= 6 && /[A-Za-z]/.test(password) && /\d/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (newPassword !== confirmPassword) {
      Swal.fire('Error', 'Passwords do not match', 'error');
      return;
    }
  
    if (!isPasswordStrong(newPassword)) {
      Swal.fire(
        'Weak Password',
        'Password should be at least 6 characters and include a number and a letter.',
        'warning'
      );
      return;
    }
  
    setLoading(true);
    try {
      const token = Cookies.get('access_token');
  
      // Log the data for debugging
      console.log({
        school_code: schoolCode,
        password: newPassword
      });
  
      const res = await fetch('http://127.0.0.1:8000/api/set-school-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          school_code: schoolCode,
          password: newPassword,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        Swal.fire('Success', 'School password set successfully!', 'success');
        navigate('/school-login');
      } else {
        Swal.fire('Error', data.error || 'Something went wrong', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to connect to the server', 'error');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Set School Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School Code
            </label>
            <input
              type="text"
              value={schoolCode}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {newPassword && !isPasswordStrong(newPassword) && (
              <p className="text-xs text-red-500 mt-1">
                Must be at least 6 characters, contain letters and numbers.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-xl transition duration-300 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Setting Password...' : 'Set Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetSchoolPassword;
