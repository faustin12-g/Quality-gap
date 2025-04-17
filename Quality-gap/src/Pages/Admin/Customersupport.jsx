import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Customersupport = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const API_URL = 'http://localhost:8000/api/requested_memberships/all/';

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(API_URL, { withCredentials: true });
        setRequests(res.data);
      } catch (err) {
        setError('Failed to load membership requests');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleConfirm = async (requestId) => {
    try {
      setLoading(true);
      setError('');
      setSuccess(null);
      
      // Find the request to show details in success message
      const request = requests.find(req => req.id === requestId);
      setSelectedRequest(request);

      const response = await axios.post(
        'http://localhost:8000/api/approve-membership/',
        { request_id: requestId },
        { withCredentials: true }
      );
      
      setSuccess({
        message: 'School account created successfully!',
        details: `Login details have been sent to ${request.email}`,
        schoolCode: response.data.school_code
      });
      
      // Refresh the requests list
      const res = await axios.get(API_URL, { withCredentials: true });
      setRequests(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve membership');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (loading) {
    return <div className="p-6 text-gray-700 text-lg">Loading membership requests...</div>;
  }



  const handleReject = async (requestId) => {
    try {
      setLoading(true);
      setError('');
      setSuccess(null);
  
      const request = requests.find(req => req.id === requestId);
      setSelectedRequest(request);
  
      const response = await axios.post(
        'http://localhost:8000/api/reject-membership/',
        { request_id: requestId },
        { withCredentials: true }
      );
  
      setSuccess({
        message: 'Membership request rejected successfully.',
        details: `${request.email} has been notified.`
      });
  
      // Refresh the list
      const res = await axios.get(API_URL, { withCredentials: true });
      setRequests(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject membership');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  







  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-800">Membership Requests</h1>
      
      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg">
          {error}
          <button 
            onClick={() => setError('')}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}
      
      {success && (
        <div className="p-4 mb-4 bg-green-100 text-green-700 rounded-lg">
          <div className="font-bold">{success.message}</div>
          <div>{success.details}</div>
          {success.schoolCode && (
            <div className="mt-2">
              <span className="font-semibold">School Code: </span>
              <span className="bg-gray-200 px-2 py-1 rounded font-mono">
                {success.schoolCode}
              </span>
              <button 
                onClick={() => copyToClipboard(success.schoolCode)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                Copy
              </button>
            </div>
          )}
          <button 
            onClick={() => setSuccess(null)}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}
      
      {requests.length === 0 ? (
        <p className="text-gray-600">No membership requests found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-blue-100 text-gray-800 font-semibold">
              <tr>
                <th className="py-3 px-4 border">Name</th>
                <th className="py-3 px-4 border">Email</th>
                <th className="py-3 px-4 border">Phone</th>
                <th className="py-3 px-4 border">District</th>
                <th className="py-3 px-4 border">School</th>
                <th className="py-3 px-4 border">Description</th>
                <th className="py-3 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="text-gray-700 hover:bg-gray-50">
                  <td className="py-2 px-4 border">{req.name}</td>
                  <td className="py-2 px-4 border">{req.email}</td>
                  <td className="py-2 px-4 border">{req.phone_number}</td>
                  <td className="py-2 px-4 border">{req.district_name || req.district}</td>
                  <td className="py-2 px-4 border">{req.school_name || req.school}</td>
                  <td className="py-2 px-4 border">{req.description}</td>
                  <td className="py-2 px-4 border flex justify-center items-center gap-2">
                    <button 
                      onClick={() => handleConfirm(req.id)}
                      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${
                        loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                      }`}
                      disabled={loading}
                    >
                      {loading && selectedRequest?.id === req.id ? (
                        'Processing...'
                      ) : (
                        'Confirm'
                      )}
                    </button>
                    <button 
  onClick={() => handleReject(req.id)}
  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
  disabled={loading}
>
  {loading && selectedRequest?.id === req.id ? 'Rejecting...' : 'Reject'}
</button>

                    <button 
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      disabled={loading}
                    >
                      Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Customersupport;