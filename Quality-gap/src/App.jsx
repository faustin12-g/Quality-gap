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
import Timetable from './Pages/Schools/Timetable';
import Departments from './Pages/Schools/Departments';
import Ordinarylevel from './Pages/Schools/Class/Ordinarylevel';
import AdvancedLeve from './Pages/Schools/Class/AdvancedLeve';
import Studentsperformance from './Pages/Schools/Students/Studentsperformance';
import Headtecher from './Pages/Schools/Deparments/Headtecher';
import DirectorOfstudie from './Pages/Schools/Deparments/DirectorOfstudie';
import DirectOfDescripline from './Pages/Schools/Deparments/DirectOfDescripline';
import Library from './Pages/Schools/Deparments/Library';
import Finance from './Pages/Schools/Deparments/Finance';
import SchoolLogin from './components/SchoolLogin ';
import SetSchoolPassword from './components/Setschoolpassword';


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
        <Route path='/school-login' element={<SchoolLogin/>}/>
        <Route path='/school-passwrd' element={<SetSchoolPassword/>}/>

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
          <Route path="classes/ordinary" element={<Ordinarylevel />} />
          <Route path='classes/advanced' element={<AdvancedLeve/>}/>
          <Route path="reports" element={<Reports />} />
          <Route path="studentsinfo" element={<Studentinformation />} />
          <Route path='students/performance' element={<Studentsperformance/>}/>
          <Route path='timetable' element={<Timetable/>}/>

          <Route path='department' element={<Departments/>}/>
          <Route path='department/headtecher' element={<Headtecher/>}/>
          <Route path='department/dos' element={<DirectorOfstudie/>}/>
          <Route path='department/dod' element={<DirectOfDescripline/>}/>
          <Route path='department/library' element={<Library/>}/>
          <Route path='department/finance' element={<Finance/>}/>
          {/* If needed, you can add more nested routes here */}
        </Route>
      </Routes>
    </div>
  );
};

export default App;
