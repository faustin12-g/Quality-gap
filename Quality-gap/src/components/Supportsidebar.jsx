import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaChalkboardTeacher, 
  FaSignOutAlt 
} from 'react-icons/fa';

const CustomerSupportSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-blue-400 shadow-lg p-5 flex flex-col">
      {/* Logo & Title */}
      <div className="flex items-center mb-8">
        <span className="text-2xl font-bold text-blue-600">Customer Support</span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow">
        <ul className="space-y-3">
          <li>
            <Link
              to="/customer"
              className={`flex items-center space-x-3 p-3 rounded-md transition-all duration-300 
                ${location.pathname === "/customer" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <FaChalkboardTeacher className="text-lg" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/customer/support"
              className={`flex items-center space-x-3 p-3 rounded-md transition-all duration-300 
                ${location.pathname === "/customer/support" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <FaChalkboardTeacher className="text-lg" />
              <span>Membership Enquiry</span>
            </Link>
          </li>
          <li>
            <Link
              to="/customer/info"
              className={`flex items-center space-x-3 p-3 rounded-md transition-all duration-300 
                ${location.pathname === "/customer/info" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <FaChalkboardTeacher className="text-lg" />
              <span>System issue request</span>
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

export default CustomerSupportSidebar;
