import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';;
import axios from 'axios';
import Swal from 'sweetalert2';

const StudentInformation = () => {
  const { schoolName } = useParams();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingStudent, setEditingStudent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [levelFilter, setLevelFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    level: '',       // This should be the level ID or name
    className: '',   // This should be the class name
    parentName: ''   // This should be the full name (will be split)
});

  useEffect(() => {
    if (schoolName) {
      axios.get(`http://127.0.0.1:8000/api/schools/${schoolName}/students/`)
        .then(response => {
          console.log('Students fetched:', response.data);
          setStudents(response.data);
          setFilteredStudents(response.data);
        })
        .catch(error => {
          console.error('Error fetching students:', error);
          setError('Failed to fetch students. Please try again later.');
        })
        .finally(() => setLoading(false));
    }
  }, [schoolName]);

  useEffect(() => {
    let filtered = students;
    if (levelFilter) {
      filtered = filtered.filter(student => student.level?.name.toLowerCase() === levelFilter.toLowerCase());
    }
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredStudents(filtered);
  }, [levelFilter, searchTerm, students]);

  const handleChange = (e) => {
    setNewStudent({
      ...newStudent,
      [e.target.name]: e.target.value,
    });
  };




  const fetchStudentForEdit = async (studentId) => {
    try {
      const token = Cookies.get('access_token');
      const response = await axios.get(
        `http://127.0.0.1:8000/api/schools/${encodeURIComponent(schoolName)}/students/${studentId}/edit/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setEditingStudent(response.data);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching student:', error);
      setError(error.response?.data?.error || 'Failed to fetch student data');
    }
  };
  

const handleDelete = async (studentId) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteStudent(studentId);
    }
  });
};

const deleteStudent = async (studentId) => {


    try {
      const token = Cookies.get('access_token');
      await axios.delete(
        `http://127.0.0.1:8000/api/schools/${encodeURIComponent(schoolName)}/students/${studentId}/delete/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      Swal.fire({
        title: 'Success!',
        text: 'Student has been deleted successfully.',
        icon:'success',
        confirmButtonText: 'OK'
      });
      setStudents(prev => prev.filter(student => student.id !== studentId));
      setFilteredStudents(prev => prev.filter(student => student.id !== studentId));
    } catch (error) {
      console.error('Error deleting student:', error);
      setError(error.response?.data?.error || 'Failed to delete student');
    }
  };


  // Add this function to handle the edit submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const token = Cookies.get('access_token');
      const formattedData = {
        firstName: editingStudent.firstName.trim(),
        lastName: editingStudent.lastName.trim(),
        gender: editingStudent.gender,
        dateOfBirth: editingStudent.dateOfBirth,
        level: editingStudent.level?.name || editingStudent.level,
        className: editingStudent.class_name?.name || editingStudent.className,
        parentName: editingStudent.parent 
          ? `${editingStudent.parent.firstName} ${editingStudent.parent.lastName}`
          : editingStudent.parentName
      };
  
      // Remove undefined/null values
      Object.keys(formattedData).forEach(key => {
        if (formattedData[key] === undefined || formattedData[key] === null) {
          delete formattedData[key];
        }
      });
  
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/schools/${encodeURIComponent(schoolName)}/students/${editingStudent.id}/edit/`,
        formattedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      // Update the students list with the edited student
      setStudents(prev => prev.map(student => 
        student.id === editingStudent.id ? response.data : student
      ));
      setFilteredStudents(prev => prev.map(student => 
        student.id === editingStudent.id ? response.data : student
      ));
      
      setIsEditModalOpen(false);
      setEditingStudent(null);
      
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        setError(error.response.data?.error || 'Failed to update student');
      } else {
        setError(error.message || 'Failed to update student');
      }
    }
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const token = Cookies.get('access_token');
      const formattedData = {
        firstName: newStudent.firstName.trim(),
        lastName: newStudent.lastName.trim(),
        gender: newStudent.gender,
        dateOfBirth: newStudent.dateOfBirth,
        level: newStudent.level.trim(), // Will create if doesn't exist
        className: newStudent.className.trim(), // Will create if doesn't exist
        parentName: newStudent.parentName.trim()
      };

      const response = await axios.post(
        `http://127.0.0.1:8000/api/schools/${encodeURIComponent(schoolName)}/students/add/`,
        formattedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Handle success
      setStudents(prev => [...prev, response.data]);
      setFilteredStudents(prev => [...prev, response.data]);
      setIsModalOpen(false);
      setNewStudent({
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        level: '',
        className: '',
        parentName: ''
      });
      
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        setError(error.response.data?.error || 'Failed to add student');
      } else {
        setError(error.message || 'Failed to add student');
      }
    }
  };
  

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Loading Students...</h2>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-11">
        <h2 className="text-xl font-bold mb-2">Students List</h2>
        <button
          onClick={openModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Student
        </button>
      </div>

      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}

      {/* Level Filter */}
      <div className="flex space-x-4 mb-4">
        <select
          className="border px-4 py-2 rounded"
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
        >
          <option value="">Select Level</option>
          <option value="Advanced">Advanced Level</option>
          <option value="Ordinary">Ordinary Level</option>
        </select>

        {/* Search Bar */}
        <input
          type="text"
          className="border px-4 py-2 rounded"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredStudents.length === 0 ? (
        <p>No students found matching the filter criteria.</p>
      ) : (
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
            <th className="border px-4 py-2">Student Number</th>
              <th className="border px-4 py-2">First Name</th>
              <th className="border px-4 py-2">Last Name</th>
              <th className="border px-4 py-2">Gender</th>
              <th className="border px-4 py-2">Date of Birth</th>
              <th className="border px-4 py-2">Class</th>
              <th className="border px-4 py-2">Level</th>
              <th className="border px-4 py-2">Parent Name</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id} className="hover:bg-gray-100">

                <td className="border px-4 py-2">{student.studentNumber}</td>
                <td className="border px-4 py-2">{student.firstName}</td>
                <td className="border px-4 py-2">{student.lastName}</td>
                <td className="border px-4 py-2">{student.gender}</td>
                <td className="border px-4 py-2">{student.dateOfBirth}</td>
                <td className="border px-4 py-2">{student.class_name ? student.class_name.name : 'N/A'}</td>
                <td className="border px-4 py-2">{student.level ? student.level.name : 'N/A'}</td>
                <td className="border px-4 py-2">{student.parent ? `${student.parent.firstName} ${student.parent.lastName}` : 'N/A'}</td>
                <td className="border px-4 py-2">
                <button 
  onClick={() => fetchStudentForEdit(student.id)}
  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
>
  Edit
</button>
                </td>
                <td className="border px-4 py-2">
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleDelete(student.id)}
                  
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}



{isEditModalOpen && editingStudent && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-1/3">
      <h3 className="text-xl font-bold mb-4">Edit Student</h3>
      <form onSubmit={handleEditSubmit}>
        <div className="grid grid-cols-2 gap-4">
          {/* Copy the same form fields as your add modal, but with editingStudent as values */}
          <div className="mb-4">
            <label htmlFor="editFirstName" className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              id="editFirstName"
              name="firstName"
              value={editingStudent.firstName || ''}
              onChange={(e) => setEditingStudent({...editingStudent, firstName: e.target.value})}
              className="border px-4 py-2 rounded w-full"
              required
            />
          </div>
          
            <div className="mb-4">
              <label htmlFor="editLastName" className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                id="editLastName"
                name="lastName"
                value={editingStudent.lastName || ''}
                onChange={(e) => setEditingStudent({...editingStudent, lastName: e.target.value})}
                className="border px-4 py-2 rounded w-full"
                required
              />
            </div>
          
            <div className="mb-4">
              <label htmlFor="editGender" className="block text-sm font-medium">Gender</label>
              <select
                id="editGender"
                name="gender"
                value={editingStudent.gender}
                onChange={(e) => setEditingStudent({...editingStudent, gender: e.target.value})}
                className="border px-4 py-2 rounded w-full"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          
            <div className="mb-4">
              <label htmlFor="editDateOfBirth" className="block text-sm font-medium">Date of Birth</label>
              <input
                type="date"
                id="editDateOfBirth"
                name="dateOfBirth"
                value={editingStudent.dateOfBirth}
                onChange={(e) => setEditingStudent({...editingStudent, dateOfBirth: e.target.value})}
                className="border px-4 py-2 rounded w-full"
                required
              />
            </div>
          
            <div className="mb-4">
              <label htmlFor="editLevel" className="block text-sm font-medium">Level</label>
              <select
                id="editLevel"
                name="level"
                value={editingStudent.level?.name || editingStudent.level}
                onChange={(e) => setEditingStudent({...editingStudent, level: e.target.value})}
                className="border px-4 py-2 rounded w-full"
                required
              >
                <option value="">Select Level</option>
                <option value="Advanced level">Advanced level</option>
                <option value="Ordinary level">Ordinary level</option>
              </select>
            </div>
          
            <div className="mb-4">
              <label htmlFor="editClassName" className="block text-sm font-medium">Class</label>
              <input
                type="text"
                id="editClassName"
                name="className"
                value={editingStudent.class_name?.name || editingStudent.className}   
                onChange={(e) => setEditingStudent({...editingStudent, className: e.target.value})}
                className="border px-4 py-2 rounded w-full"
                required
              />
            </div>
          
            <div className="mb-4">
              <label htmlFor="editParentName" className="block text-sm font-medium">Parent Name</label>
              <input
                type="text"
                id="editParentName"
                name="parentName"
                value={editingStudent.parent ? `${editingStudent.parent.firstName} ${editingStudent.parent.lastName}` : editingStudent.parentName}
                onChange={(e) => setEditingStudent({...editingStudent, parentName: e.target.value})}
                className="border px-4 py-2 rounded w-full"
                required
              />
            </div>
          
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(false)}
            className="bg-gray-300 hover:bg-gray-500 text-black font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)}



      {/* Modal for Add New Student */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-xl font-bold mb-4">Add New Student</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="firstName" className="block text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={newStudent.firstName}
                    onChange={handleChange}
                    className="border px-4 py-2 rounded w-full"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="lastName" className="block text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={newStudent.lastName}
                    onChange={handleChange}
                    className="border px-4 py-2 rounded w-full"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="gender" className="block text-sm font-medium">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={newStudent.gender}
                    onChange={handleChange}
                    className="border px-4 py-2 rounded w-full"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium">Date of Birth</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={newStudent.dateOfBirth}
                    onChange={handleChange}
                    className="border px-4 py-2 rounded w-full"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="level" className="block text-sm font-medium">Level</label>
                  <select
                    id="level"
                    name="level"
                    value={newStudent.level}
                    onChange={handleChange}
                    className="border px-4 py-2 rounded w-full"
                    required
                  >
                    <option value="">Select Level</option>
                    <option value="Advanced">Advanced level</option>
                    <option value="Ordinary">Ordinary level</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="className" className="block text-sm font-medium">Class</label>
                  <input
                    type="text"
                    id="className"
                    name="className"
                    value={newStudent.className}
                    onChange={handleChange}
                    className="border px-4 py-2 rounded w-full"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="parentName" className="block text-sm font-medium">Parent Name</label>
                  <input
                    type="text"
                    id="parentName"
                    name="parentName"
                    value={newStudent.parentName}
                    onChange={handleChange}
                    className="border px-4 py-2 rounded w-full"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-500 text-black font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentInformation;
