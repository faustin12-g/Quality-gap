import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Pages
import Onboarding from './Pages/Onboarding';
import Siginin from './Pages/Siginin';
import Register from './Pages/Register';
import RequestMembership from './Pages/RequestMembership';

// School Dashboard Pages & Layout
import SchoolLayout from './Layout/SchoolLayout';
import Dashboard from './Pages/Schools/Dashboard';
import Students from './Pages/Schools/Students';
import Teachers from './Pages/Schools/Teachers';
import Classes from './Pages/Schools/Classes';
import Reports from './Pages/Schools/Reports';
import Studentinformation from './Pages/Schools/Studentinformation';

// Customer Support / Admin Pages & Layout
import Customersupportsidebar from './Layout/Customerlayout';
import Customersupport from './Pages/Admin/Customersupport';
import Admindashboard from './Pages/Admin/Admindashboard';
import Support from './Pages/Admin/Support';
import Help from './Pages/Help';
import Pricing from './Pages/Pricing';
import About from './Pages/About';

const App = () => {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Onboarding />} />
        <Route path="/login" element={<Siginin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/request" element={<RequestMembership />} />
        <Route path='/helpcenter' element={<Help/>}/>
        <Route path="/pricing" element={<Pricing/>}/>
        <Route path='/main' element={<About/>}/>

        {/* Customer Support / Admin Dashboard Routes */}
        <Route path="/customer" element={<Customersupportsidebar />}>
          <Route index element={<Admindashboard />} />
          <Route path="support" element={<Customersupport />} />
          <Route path="info" element={<Support />} />
        </Route>

        {/* School Dashboard Routes */}
        <Route path="/school" element={<SchoolLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="classes" element={<Classes />} />
          <Route path="reports" element={<Reports />} />
          <Route path="studentsinfo" element={<Studentinformation />} />
          {/* If needed, you can add more nested routes here */}
        </Route>
      </Routes>
    </div>
  );
};

export default App;
