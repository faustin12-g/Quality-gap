import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, message, Modal, Input, Checkbox, Table } from 'antd';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [schoolName, setSchoolName] = useState('');
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState('rent');
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [rentalHistory, setRentalHistory] = useState([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [studentsWhoRented, setStudentsWhoRented] = useState([]);
  const [bookSearchText, setBookSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const token = Cookies.get('access_token');

  // Fetch the school data and set the school name
  useEffect(() => {
    const storedSchoolData = JSON.parse(localStorage.getItem('schoolData'));
    if (storedSchoolData?.name) setSchoolName(storedSchoolData.name);
  }, []);

  useEffect(() => {
    if (schoolName) {
      fetchBooks();
      fetchStudents();
    }
  }, [schoolName]);

  // Fetch books for the current school
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/schools/${encodeURIComponent(schoolName)}/library/`);
      setBooks(res.data);
    } catch {
      message.error("Failed to fetch books.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch students for the current school
  const fetchStudents = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/schools/${encodeURIComponent(schoolName)}/students/`);
      setStudents(res.data);
      setFilteredStudents(res.data);
    } catch {
      message.error("Failed to fetch students.");
    }
  };

  // Handle search for students in modal
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = students.filter(student =>
      student.firstName.toLowerCase().includes(value.toLowerCase()) ||
      student.lastName.toLowerCase().includes(value.toLowerCase()) ||
      student.class_name?.name?.toLowerCase().includes(value.toLowerCase()) ||
      student.level?.name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  // Debounced search for books
  const debouncedBookSearch = debounce((value) => {
    setBookSearchText(value);
  }, 300);

  // Filter books based on search text
  const filteredBooks = books.filter(book =>
    book.book_name?.toLowerCase().includes(bookSearchText.toLowerCase())
  );

  // Handle rent or return actions
  const handleAction = (bookId, action) => {
    setSelectedBookId(bookId);
    setActionType(action);
    setModalVisible(true);

    if (action === 'return') {
      fetchStudentsWhoRented(bookId);
    }
  };

  // Fetch students who rented the selected book
  const fetchStudentsWhoRented = async (bookId) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/schools/${encodeURIComponent(schoolName)}/library/${bookId}/renters/`);
      setStudentsWhoRented(res.data);
      setFilteredStudents(res.data);
    } catch {
      message.error("Failed to fetch students who rented the book.");
    }
  };

  // Handle the book action (rent/return)
  const handleBookAction = async () => {
    if (selectedStudentIds.length === 0) return message.warning("Please select at least one student.");

    const endpoint = actionType === 'rent' ? 'rent' : 'return';

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/schools/${encodeURIComponent(schoolName)}/library/${selectedBookId}/${endpoint}/`,
        { student_id: selectedStudentIds[0] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(`Book ${actionType === 'rent' ? 'rented' : 'returned'} successfully.`);
      resetModalState();
      fetchBooks();
    } catch (err) {
      message.error(err.response?.data?.error || `Failed to ${actionType} book.`);
    }
  };

  // Reset the modal state
  const resetModalState = () => {
    setModalVisible(false);
    setSelectedBookId(null);
    setSelectedStudentIds([]);
    setSearchText('');
    setFilteredStudents(students);
    setStudentsWhoRented([]);
  };

  // Handle book deletion
  const handleDeleteBook = async (bookId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/schools/${encodeURIComponent(schoolName)}/library/${bookId}/delete/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Book deleted successfully.");
      fetchBooks();
    } catch (error) {
      message.error("Failed to delete book.");
      console.error(error.response?.data || error.message);
    }
  };
  
  // Fetch rental history
  const fetchRentalHistory = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/schools/${schoolName}/library/rental-history/`);
      setRentalHistory(res.data);
      setHistoryVisible(true);
    } catch {
      message.error("Failed to fetch rental history.");
    }
  };

  // Table columns
  const historyColumns = [
    { title: 'Book Name', dataIndex: ['book', 'book_name'] },
    { title: 'Student', render: (_, r) => `${r.student.firstName} ${r.student.lastName}` },
    { title: 'Rented On', dataIndex: 'rented_on' },
    { title: 'Returned', dataIndex: 'returned', render: returned => returned ? 'Yes' : 'No' },
    { title: 'Returned On', dataIndex: 'returned_on', render: text => text || '---' }
  ];

  const bookColumns = [
    { title: 'Book Name', dataIndex: 'book_name', key: 'book_name' },
    { title: 'Quantity', dataIndex: 'book_Quantity', key: 'book_Quantity' },
    { title: 'Rented', dataIndex: 'book_rented', key: 'book_rented' },
    { 
      title: 'Availability', 
      key: 'availability',
      render: (_, record) => record.book_Quantity - record.book_rented 
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div>
          <Button type="primary" onClick={() => handleAction(record.id, 'rent')} style={{ marginRight: 8 }}>
            Rent
          </Button>
          <Button type="default" onClick={() => handleAction(record.id, 'return')} style={{ marginRight: 8 }}>
            Return
          </Button>
          <Button danger onClick={() => handleDeleteBook(record.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];
  
  return (
    <div className="p-6">
      <div className='flex justify-between items-center mb-4'>
        <div>
          <h2 className="text-xl font-bold">Library - {schoolName}</h2>
          <Button onClick={fetchRentalHistory} style={{ marginTop: 8 }}>
            View Rental History
          </Button>
        </div>
        <Link to="/school/department/library/add-book">
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>
            Add Book
          </button>
        </Link>
      </div>

      {/* Book Search Bar */}
      <div className="mb-6">
        <Input.Search
          placeholder="Search books by name"
          allowClear
          enterButton="Search"
          size="large"
          onChange={(e) => debouncedBookSearch(e.target.value)}
          style={{ width: '100%', maxWidth: '500px' }}
        />
      </div>

      {/* Rent/Return Modal */}
      <Modal
        title={`Select Students to ${actionType === 'rent' ? 'Rent' : 'Return'} Book`}
        open={modalVisible}
        onOk={handleBookAction}
        onCancel={resetModalState}
        okText={`Confirm ${actionType === 'rent' ? 'Rent' : 'Return'}`}
      >
        <Input.Search
          placeholder="Search students"
          onSearch={handleSearch}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <div className="grid grid-cols-4 gap-4">
          <div><strong>Checkbox</strong></div>
          <div><strong>Student Name</strong></div>
          <div><strong>Class</strong></div>
          <div><strong>Level</strong></div>

          {filteredStudents.map(student => {
            const actualStudent = student.student || student;
            return (
              <React.Fragment key={`${actualStudent.id}-${actualStudent.firstName}`}>
                <div>
                  <Checkbox
                    value={actualStudent.id}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSelectedStudentIds(prev =>
                        checked
                          ? [...prev, actualStudent.id]
                          : prev.filter(id => id !== actualStudent.id)
                      );
                    }}
                    checked={selectedStudentIds.includes(actualStudent.id)}
                  />
                </div>
                <div>{`${actualStudent.firstName} ${actualStudent.lastName}`}</div>
                <div>{actualStudent.class_name?.name || 'N/A'}</div>
                <div>{actualStudent.level?.name || 'N/A'}</div>
              </React.Fragment>
            );
          })}
        </div>
      </Modal>

      {/* Rental History Modal */}
      <Modal
        title="Rental History"
        open={historyVisible}
        onCancel={() => setHistoryVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          dataSource={rentalHistory}
          columns={historyColumns}
          rowKey="id"
          pagination={false}
        />
      </Modal>

      {/* Books Table */}
      <Table
        dataSource={filteredBooks}
        columns={bookColumns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Library;