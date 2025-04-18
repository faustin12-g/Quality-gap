import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaChalkboardTeacher, 
  FaUsers, 
  FaTable,
  FaBook, 
  FaSignOutAlt, 
  FaUserGraduate, 
  FaCalendarAlt, 
  FaClipboardList, 
  FaChevronDown, 
  FaChevronUp 
} from 'react-icons/fa';

const SchoolSidebar = () => {
  const location = useLocation();
  const [showStudentinfo, setShowStudentinfo] = useState(false);
  const [showClassinfo, setClassInfo] = useState(false);
  const [deparmentinfo, setDepartmentinfo] = useState(false);

  // const [schoolId, setSchoolId] = useState(null);  
  const [schoolName, setSchoolName] = useState('');

  useEffect(() => {
    const storedSchoolData = JSON.parse(localStorage.getItem('schoolData'));
    if (storedSchoolData && storedSchoolData.name) {
      setSchoolName(storedSchoolData.name);
      // optionally, setSchoolCode(storedSchoolData.code);
    }
  }, []);
  

  const handleStudentinfo = () => {
    setShowStudentinfo(!showStudentinfo);
  };

  const HandleDepartment = () => {
    setDepartmentinfo(!deparmentinfo);
  };

  const handleClassInfo = () => {
    setClassInfo(!showClassinfo);
  };

  // Helper function to check if the current path starts with '/school/students'
  const isActiveStudents = (pathname) => location.pathname.startsWith(pathname);
  const isActiveClass = (pathname) => location.pathname.startsWith(pathname);
  const isActiveDepartment = (pathname) => location.pathname.startsWith(pathname);

  return (
    <aside className="w-64 h-screen bg-white shadow-lg p-5 flex flex-col">
      {/* Logo & School Image */}
      <div className="flex items-center space-x-3 mb-8">
        <span className="text-2xl font-bold text-blue-600">{schoolName || 'School name'}</span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow">
        <ul className="space-y-3">
          {/* Dashboard */}
          <li>
            <Link
              to="/school"
              className={`flex items-center space-x-3 p-3 rounded-md transition-all duration-300 
                ${location.pathname === "/school" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <FaChalkboardTeacher className="text-lg" />
              <span>Dashboard</span>
            </Link>
          </li>

          {/* Students */}
          <li>
            <div
              className={`flex items-center justify-between space-x-3 p-3 rounded-md transition-all duration-300 cursor-pointer 
                ${isActiveStudents("/school/students") ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
              onClick={handleStudentinfo}
            >
              <div className="flex items-center space-x-3">
                <FaUserGraduate className="text-lg" />
                <span>Students</span>
              </div>
              {showStudentinfo ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {showStudentinfo && (
              <ul className="pl-8 space-y-2 mt-2">
                <li>
    <Link to={`/school/studentsinfo/${schoolName}`}>Student information</Link>
    </li>

                <li>
                  <Link 
                    to="/school/students/performance" 
                    className={`text-gray-700 p-2 hover:text-blue-600 ${location.pathname === "/school/students/delete" ? "bg-blue-600 text-white" : ""}`}
                  >
                    Student performance
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/school/student/card" 
                    className={`text-gray-700 p-2 hover:text-blue-600 ${location.pathname === "/school/students/edit" ? "bg-blue-600 text-white" : ""}`}
                  >
                    Students Cards
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Teachers */}
          <li>
            <Link
              to="/school/teachers"
              className={`flex items-center space-x-3 p-3 rounded-md transition-all duration-300 
                ${location.pathname === "/school/teachers" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <FaUsers className="text-lg" />
              <span>Teachers</span>
            </Link>
          </li>

          {/* Department */}
          <li>
            <div
              className={`flex items-center justify-between space-x-3 p-3 rounded-md transition-all duration-300 cursor-pointer 
                ${isActiveDepartment("/school/department") ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
              onClick={HandleDepartment}
            >
              <div className="flex items-center space-x-3">
                <FaUserGraduate className="text-lg" />
                <span>Departments</span>
              </div>
              {deparmentinfo ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {deparmentinfo && (
              <ul className="pl-8 space-y-2">
                <Link to="department/headtecher">
                  <li className="text-gray-700 p-2 cursor-pointer hover:text-blue-400">HeadTeacher</li>
                </Link>
                <Link to="department/dos">
                  <li className="text-gray-700 p-2 cursor-pointer hover:text-blue-400">Director of study</li>
                </Link>
                <Link to="department/dod">
                  <li className="text-gray-700 p-2 cursor-pointer hover:text-blue-400">Director of Displine</li>
                </Link>
                <Link to="department/finance">
                  <li className="text-gray-700 p-2 cursor-pointer hover:text-blue-400">Finance</li>
                </Link>
                <Link to="department/library">
                  <li className="text-gray-700 p-2 cursor-pointer hover:text-blue-400">Library</li>
                </Link>
              </ul>
            )}
          </li>

          {/* Classes */}
          <li>
            <div
              className={`flex items-center justify-between space-x-3 p-3 rounded-md transition-all duration-300 cursor-pointer 
                ${isActiveClass("/school/classes") ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
              onClick={handleClassInfo}
            >
              <div className="flex items-center space-x-3">
                <FaClipboardList className="text-lg" />
                <span>Classes</span>
              </div>
              {showClassinfo ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {showClassinfo && (
              <ul className="pl-8 space-y-2 mt-2">
                <Link to="/school/classes/ordinary">
                  <li className="text-gray-700 hover:text-blue-600">Ordinary level</li>
                </Link>
                <Link to="/school/classes/advanced">
                  <li className="text-gray-700 hover:text-blue-600">Advanced level</li>
                </Link>
              </ul>
            )}
          </li>

          {/* Routine */}
          <li>
            <Link
              to="/school/routine"
              className={`flex items-center space-x-3 p-3 rounded-md transition-all duration-300 
                ${location.pathname === "/school/routine" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <FaCalendarAlt className="text-lg" />
              <span>Reports</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <Link
          to="/logout"
          className="flex items-center space-x-3 p-3 rounded-md text-red-600 hover:bg-gray-100 transition-all duration-300"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default SchoolSidebar;
