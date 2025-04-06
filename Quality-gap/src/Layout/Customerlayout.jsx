// components/SchoolLayout.jsx
import React from 'react';
import Supportsidebar from '../components/Supportsidebar';
import { Outlet } from 'react-router-dom';

const Customersupportsidebar = () => {
  return (
    <div className="flex h-screen">
     <Supportsidebar />
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Customersupportsidebar;
