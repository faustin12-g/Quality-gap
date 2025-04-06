import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const formatExactTimeDifference = (dateString) => {
  const pastDate = new Date(dateString + 'Z')
  const now = new Date()

  const seconds = Math.floor((now - pastDate) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)

  if (years > 0) return `${years} year${years !== 1 ? 's' : ''} ago`
  if (months > 0) return `${months} month${months !== 1 ? 's' : ''} ago`
  if (days > 0) return `${days} day${days !== 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  return "just now"
}

const Support = () => {
  const [support, setSupport] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedItems, setSelectedItems] = useState([])
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyContent, setReplyContent] = useState('')
  const [emailSubject, setEmailSubject] = useState('Re: Your Support Request')

  // React Quill configuration
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      ['link'],
      ['clean']
    ],
  }

  useEffect(() => {
    fetchSupportRequests()
  }, [activeTab])

  const fetchSupportRequests = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://127.0.0.1:8000/api/customerhelp/", {
        headers: {
          "Content-Type": "application/json",
        }
      })
      setSupport(response.data)
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to fetch support requests')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredSupport = support.filter(item => {
    if (activeTab === 'all') return true
    if (activeTab === 'resolved') return item.status === 'Resolved'
    if (activeTab === 'pending') return item.status !== 'Resolved'
    return true
  })

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/customerhelp/${id}/`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      )
      setSupport(support.map(item => 
        item.id === id ? {...item, status: newStatus} : item
      ))
    } catch (err) {
      setError(err.message || 'Failed to update status')
    }
  }

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) {
      Swal.fire('Error', 'Please enter a reply message', 'error');
      return;
    }
  
    try {
      // Format the email content
      let formattedContent = replyContent;
      if (replyingTo.description) {
        formattedContent = `
          On ${new Date().toLocaleString()}, the customer wrote
        
            ${replyingTo.description}
          ${replyContent}
        `;
      }
  
      // Send the reply email
      await axios.post(
        `http://127.0.0.1:8000/api/customerhelp/${replyingTo.id}/reply/`,
        { 
          reply: formattedContent,
          subject: emailSubject,
          is_email: true
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
  
      // Update local state
      setSupport(support.map(item => 
        item.id === replyingTo.id ? {
          ...item, 
          status: 'Resolved',
          replies: [
            ...(item.replies || []), 
            {
              text: formattedContent,
              timestamp: new Date().toISOString(),
              is_email: true
            }
          ]
        } : item
      ));
  
      // Reset form
      setReplyContent('');
      setReplyingTo(null);
      setEmailSubject('Re: Your Support Request');
  
      Swal.fire('Success', 'Reply sent successfully!', 'success');
    } catch (err) {
      Swal.fire('Error', err.message || 'Failed to send reply', 'error');
    }
  };
  

  const handleDelete = async (ids) => {
    try {
      // If single delete
      if (typeof ids === 'number') {
        ids = [ids]
      }

      // Confirm deletion
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })

      if (!result.isConfirmed) return

      // Delete requests
      await Promise.all(ids.map(id => 
        axios.delete(
          `http://127.0.0.1:8000/api/deletehelprequest/${id}/`,
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        )
      ))

      // Update state
      setSupport(support.filter(item => !ids.includes(item.id)))
      setSelectedItems([])
      
      Swal.fire('Deleted!', 'Your request has been deleted.', 'success')
    } catch (err) {
      Swal.fire('Error', err.message || 'Failed to delete request', 'error')
    }
  }

  const toggleSelection = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    )
  }

  const selectAllItems = (e) => {
    setSelectedItems(e.target.checked ? filteredSupport.map(item => item.id) : [])
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Customer Support Requests
      </h1>
      
      {/* Filter and Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="bg-white p-3 shadow-md rounded-md flex-1">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 rounded ${activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('all')}
            >
              All Requests
            </button>
            <button
              className={`px-3 py-1 rounded ${activeTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </button>
            <button
              className={`px-3 py-1 rounded ${activeTab === 'resolved' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('resolved')}
            >
              Resolved
            </button>
          </div>
        </div>

        <div className="bg-white p-3 shadow-md rounded-md">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange(selectedItems, 'Resolved')}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
              disabled={selectedItems.length === 0}
            >
              Mark Resolved
            </button>
            <button
              onClick={() => handleDelete(selectedItems)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
              disabled={selectedItems.length === 0}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Reply to {replyingTo.name}
                </h3>
                <button 
                  onClick={() => setReplyingTo(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1 font-medium">Subject:</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div className="mb-4 p-3 bg-gray-50 rounded border">
                <p className="font-medium text-gray-700 mb-2">Original Message:</p>
                <div className="text-gray-600 whitespace-pre-line p-2 bg-white rounded border">
                  {replyingTo.description}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1 font-medium">Your Reply:</label>
                <ReactQuill
                  theme="snow"
                  value={replyContent}
                  onChange={setReplyContent}
                  modules={modules}
                  className="bg-white rounded border"
                />
              </div>
          
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setReplyingTo(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReplySubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support Requests Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {filteredSupport.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No support requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                    <input
                      type="checkbox"
                      onChange={selectAllItems}
                      checked={
                        selectedItems.length > 0 && 
                        selectedItems.length === filteredSupport.length
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSupport.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 ${
                      selectedItems.includes(item.id) ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelection(item.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={`mailto:${item.email}`} 
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {item.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-sm text-gray-900 line-clamp-2">
                        {item.description}
                      </div>
                      {item.replies?.length > 0 && (
                        <div className="mt-2 pl-3 border-l-2 border-gray-200">
                          <div className="text-xs font-medium text-gray-500 mb-1">
                            {item.replies.length} {item.replies.length === 1 ? 'reply' : 'replies'}
                          </div>
                          {item.replies.map((reply, idx) => (
                            <div 
                              key={idx} 
                              className="text-xs text-gray-600 mb-2 last:mb-0"
                            >
                              {reply.is_email ? (
                                <div className="bg-blue-50 p-2 rounded">
                                  <div className="flex items-center text-xs mb-1">
                                    <span className="font-medium">Email sent</span>
                                    <span className="ml-2 bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                      Email
                                    </span>
                                  </div>
                                  <div 
                                    className="text-sm text-gray-700 mt-1" 
                                    dangerouslySetInnerHTML={{ __html: reply.text }} 
                                  />
                                </div>
                              ) : (
                                <div className="bg-gray-50 p-2 rounded">
                                  {reply.text}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatExactTimeDifference(item.created_at || new Date().toISOString())}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'Resolved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setReplyingTo(item)
                            setEmailSubject(`Re: Support Request #${item.id}`)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Support