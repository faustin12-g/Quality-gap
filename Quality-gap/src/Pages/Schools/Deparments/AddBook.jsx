import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const AddBook = () => {
  const [formData, setFormData] = useState({
    book_name: '',
    book_Quantity: '',
  });
const  [schoolName, setSchoolName]=useState('');
const navigate=useNavigate()

useEffect(() => {
    const storedSchoolData = JSON.parse(localStorage.getItem('schoolData'));
    if (storedSchoolData && storedSchoolData.name) {
      setSchoolName(storedSchoolData.name);
      // optionally, setSchoolCode(storedSchoolData.code);
    }
  }, []);
  
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token'); // Or wherever you store the auth token
      const response = await axios.post(
        `http://127.0.0.1:8000/api/schools/${encodeURIComponent(schoolName)}/library/add-book/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Book added successfully!');
      console.log(response.data);
    }catch(error){
        if (error.response) {
          console.log("Backend response data:", error.response.data);
        } else {
          console.log("Error", error.message);
        }
      };
      
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add a New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="book_name"
          value={formData.book_name}
          onChange={handleChange}
          placeholder="Book Name"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="number"
          name="book_Quantity"
          value={formData.book_Quantity}
          onChange={handleChange}
          placeholder="Quantity"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
