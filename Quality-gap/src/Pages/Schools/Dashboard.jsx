import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart3, Users, CreditCard, Clock } from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState({
    students: 0,
    transactions: 0,
    hours: 0,
  });

  const [schoolData, setSchoolData]=useState('')

  useEffect(()=>{
    const storedSchoolData = JSON.parse(localStorage.getItem('schoolData'));
    if (storedSchoolData && storedSchoolData.name) {
      setSchoolData(storedSchoolData); // Set the school data
    }
  }, [])

  useEffect(() => {
    // Replace with your actual API endpoint
    axios.get("/api/school-dashboard/")
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.error("Error fetching dashboard data:", err);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{schoolData.name} Data management Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Students */}
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-gray-500 text-sm font-medium">Students</h2>
              <p className="text-2xl font-bold text-indigo-600">{data.students}</p>
            </div>
            <Users className="h-10 w-10 text-indigo-500" />
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-gray-500 text-sm font-medium">Transactions</h2>
              <p className="text-2xl font-bold text-green-600">{data.transactions}</p>
            </div>
            <CreditCard className="h-10 w-10 text-green-500" />
          </div>
        </div>

        {/* Hours */}
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-gray-500 text-sm font-medium">Total Time</h2>
              <p className="text-2xl font-bold text-yellow-600">{data.hours} hrs</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-500" />
          </div>
        </div>

        {/* Placeholder for a future chart */}
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-gray-500 text-sm font-medium">Chart</h2>
              <p className="text-2xl font-bold text-blue-600">--</p>
            </div>
            <BarChart3 className="h-10 w-10 text-blue-500" />
          </div>
        </div>
      </div>

      {/* You can add charts, tables or graphs below */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-600">Coming soon...</p>
      </div>
    </div>
  );
};

export default Dashboard;
