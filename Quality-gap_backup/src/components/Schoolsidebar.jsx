import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaChalkboardTeacher, 
  FaUsers, 
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

  const handleStudentinfo = () => {
    setShowStudentinfo(!showStudentinfo);
  };

  // Helper function to check if the current path starts with '/school/students'
  const isActiveStudents = (pathname) => location.pathname.startsWith(pathname);

  return (
    <aside className="w-64 h-screen bg-white shadow-lg p-5 flex flex-col">
      {/* Logo & School Image */}
      <div className="flex items-center space-x-3 mb-8">
        <span className="text-2xl font-bold text-blue-600">School name</span>
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
                  <Link 
                    to="/school/studentsinfo" 
                    className={`text-gray-700 hover:text-blue-600 ${location.pathname === "/school/students/add" ? "bg-blue-600 text-white space-x-3 p-3" : ""}`}
                  >
                Student information
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/school/students/delete" 
                    className={`text-gray-700 hover:bg-blue-600 ${location.pathname === "/school/students/delete" ? "bg-blue-600 text-white" : ""}`}
                  >
                    Delete student
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/school/students/edit" 
                    className={`text-gray-700 hover:bg-blue-600 ${location.pathname === "/school/students/edit" ? "bg-blue-600 text-white" : ""}`}
                  >
                    Edit student
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
            <Link
              to="/school/department"
              className={`flex items-center space-x-3 p-3 rounded-md transition-all duration-300 
                ${location.pathname === "/school/department" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <FaBook className="text-lg" />
              <span>Department</span>
            </Link>
          </li>

          {/* Classes */}
          <li>
            <Link
              to="/school/classes"
              className={`flex items-center space-x-3 p-3 rounded-md transition-all duration-300 
                ${location.pathname === "/school/classes" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <FaClipboardList className="text-lg" />
              <span>Classes</span>
            </Link>
          </li>

          {/* Routine */}
          <li>
            <Link
              to="/school/routine"
              className={`flex items-center space-x-3 p-3 rounded-md transition-all duration-300 
                ${location.pathname === "/school/routine" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <FaCalendarAlt className="text-lg" />
              <span>Routine</span>
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
