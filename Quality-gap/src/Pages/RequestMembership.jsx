import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LOGO from '../assets/QG_logo.png';
import Cookies from 'js-cookie';

const RequestMembership = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    district: '',
    school: '',
    description: '',
  });
  const [profile, setProfile] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState({
    districts: true,
    schools: false,
    profile: true,
    submitting: false
  });
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    error: false,
    message: ''
  });

  const API_URL = 'http://localhost:8000/api';

  // Configure axios to send cookies with every request
  axios.defaults.withCredentials = true;

  // Add request interceptor to include token if available
  axios.interceptors.request.use((config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Add response interceptor to handle 401 errors
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        // Attempt token refresh
        const refreshToken = Cookies.get('refresh_token');
        if (refreshToken) {
          return axios.post(`${API_URL}/token/refresh/`, { refresh: refreshToken })
            .then(response => {
              Cookies.set('access_token', response.data.access);
              error.config.headers.Authorization = `Bearer ${response.data.access}`;
              return axios(error.config);
            })
            .catch(() => {
              window.location.href = '/login';
              return Promise.reject(error);
            });
        } else {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  // Fetch current user profile
  const getCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/current_user/`);
      setProfile(response.data);
      setFormData(prev => ({
        ...prev,
        name: `${response.data.first_name} ${response.data.last_name}`,
        email: response.data.email,
      }));
    } catch (error) {
      console.error('Error fetching current user:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  // Fetch districts
  const fetchDistricts = async () => {
    try {
      const response = await axios.get(`${API_URL}/districts/`);
      setDistricts(response.data);
    } catch (error) {
      console.error('Error fetching districts:', error);
    } finally {
      setLoading(prev => ({ ...prev, districts: false }));
    }
  };

  // Fetch schools when district changes
  const fetchSchools = async () => {
    if (formData.district) {
      setLoading(prev => ({ ...prev, schools: true }));
      setFormData(prev => ({ ...prev, school: '' }));

      try {
        const response = await axios.get(`${API_URL}/schools/?district_id=${formData.district}`);
        setSchools(response.data);
      } catch (error) {
        console.error('Error fetching schools:', error);
        setSchools([]);
      } finally {
        setLoading(prev => ({ ...prev, schools: false }));
      }
    } else {
      setSchools([]);
    }
  };

  useEffect(() => {
    getCurrentUser();
    fetchDistricts();
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [formData.district]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, submitting: true }));
    setSubmitStatus({ success: false, error: false, message: '' });

    try {
      await axios.post(`${API_URL}/requested_memberships/`, formData);
      setSubmitStatus({
        success: true,
        message: 'Membership request submitted successfully!'
      });
      setFormData({
        name: profile ? `${profile.first_name} ${profile.last_name}` : '',
        email: profile?.email || '',
        district: '',
        school: '',
        phone_number: '',
        description: '',
      });
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({
        error: true,
        message: error.response?.data?.message || 'Error submitting request. Please try again.'
      });
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  if (loading.profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center p-4 md:p-8">
      <Link to="/" className="mb-8 hover:opacity-90 transition-opacity">
        <img src={LOGO} width={200} alt="Company Logo" className="object-contain" />
      </Link>

      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Join Our Community</h1>
          <p className="text-gray-600">Fill out the form below to request membership</p>
        </div>

        {submitStatus.message && (
          <div className={`mb-6 p-4 rounded-lg ${
            submitStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
                disabled={loading.profile}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
                disabled={loading.profile}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
              <input
                type="tel"
                name="phone_number"  // Updated name to match state
                value={formData.phone_number}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+250 78 123 4567"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">District *</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                disabled={loading.districts}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">{loading.districts ? 'Loading districts...' : 'Select your district'}</option>
                {districts.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">School *</label>
              <select
                name="school"
                value={formData.school}
                onChange={handleChange}
                required
                disabled={!formData.district || loading.schools}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">
                  {!formData.district
                    ? 'Select district first'
                    : loading.schools
                    ? 'Loading schools...'
                    : schools.length === 0
                    ? 'No schools available'
                    : 'Select your school'}
                </option>
                {schools.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Why do you want to join? *</label>
            <textarea
              name="description"  // Updated name to match state
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about your motivation to join our community..."
            />
          </div>

          <button
            type="submit"
            disabled={loading.submitting}
            className={`w-full py-3 text-white font-medium rounded-lg transition ${
              loading.submitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading.submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestMembership;
