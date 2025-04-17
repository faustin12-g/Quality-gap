// components/SchoolLayout.jsx
import React from 'react';
import SchoolSidebar from '../components/Schoolsidebar';
import Topbar from '../components/Topbar'; // Make sure this path is correct
import { Outlet } from 'react-router-dom';

const SchoolLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SchoolSidebar />

      {/* Main content with Topbar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        {/* Main content area */}
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SchoolLayout;
