// components/SchoolLayout.jsx
import React from 'react';
import SchoolSidebar from  '../components/Schoolsidebar';
import { Outlet } from 'react-router-dom';

const SchoolLayout = () => {
  return (
    <div className="flex h-screen">
      <SchoolSidebar />
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default SchoolLayout;
