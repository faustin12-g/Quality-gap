import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Customersupport = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return <div className="p-6 text-gray-700 text-lg">Loading membership requests...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600 text-lg">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-800">Membership Requests</h1>
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
              {requests.map((req, idx) => (
                <tr key={idx} className="text-gray-700">
                  <td className="py-2 px-4 border">{req.name}</td>
                  <td className="py-2 px-4 border">{req.email}</td>
                  <td className="py-2 px-4 border">{req.phone_number}</td>
                 <td className="py-2 px-4 border">{req.district_name || req.district}</td>
<td className="py-2 px-4 border">{req.school_name || req.school}</td>
                  <td className="py-2 px-4 border">{req.description}</td>
                  <td className="py-2 px-4 border flex justify-center items-center gap-2">
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Confirm</button>
                    <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>Reject</button>
                    <button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>Reply</button>

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
