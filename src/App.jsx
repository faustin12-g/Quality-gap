import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Onboarding from './Pages/Onboarding';
import SchoolLayout from './Layout/SchoolLayout';
import Dashboard from './Pages/Schools/Dashboard';
import Students from './Pages/Schools/Students';
import Teachers from './Pages/Schools/Teachers';
import Classes from './Pages/Schools/Classes';
import Reports from './Pages/Schools/Reports';
import Studentinformation from './Pages/Schools/Studentinformation';
import Siginin from './Pages/Siginin';
import Register from './Pages/Register';

const App = () => {
  return (
    <div >
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/login" element={<Siginin />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/school" element={<SchoolLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="classes" element={<Classes />} />
          <Route path="reports" element={<Reports />} />
          <Route path='studentsinfo' element={<Studentinformation/>}/>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
