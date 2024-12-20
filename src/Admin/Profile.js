import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../Context/UserContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Profile() {
    const { user, setUser } = useContext(UserContext);
    let[tours,setTours]=useState();
    const navigate=useNavigate();
    useEffect(() => {
        if (!user) {
            navigate("/login");  // Redirect to login if no user
        }
    }, [ navigate]);  // The effect will run when 'user' or 'navigate' changes
    
     useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_ROOT_API_URL}/api/tour-packages/get`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        // setUser(response.data.user);
        setTours(response.data)
        console.log(response.data)
      } catch (err) {
        console.log("Error in finding tours")
      }
    };

    fetchUser();
  }, []); 
   

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null); // Remove user from context
        navigate('/'); // Redirect to login page
      };
    
  const AddPackage=()=>{
alert("added")
  }
  return (
    <div className="min-h-screen flex">
    {/* Sidebar */}
    <aside className="w-64 bg-[rgb(21,33,67)] text-white flex flex-col">
      <div className="p-4 text-center font-bold text-xl border-b border-blue-600">
        Admin Panel
      </div>
      <nav className="flex-1">
        <ul className="space-y-2 mt-4">
          <li>
            <a href="#packages" className="block px-4 py-2 hover:bg-blue-600">Manage Packages</a>
          </li>
          <li>
            <a href="#bookings" className="block px-4 py-2 hover:bg-blue-600">View Bookings</a>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-blue-600">
        <button className="w-full bg-red-500 py-2 rounded-lg hover:bg-red-600" onClick={handleLogout}>Logout</button>
      </div>
    </aside>

    {/* Main Content */}
    <main className="flex-1 bg-gray-100 p-8">
      {/* Manage Packages Section */}
      <section id="packages" className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Tour Packages</h2>
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"><Link to="/addTour"> Add Package</Link>
           
          </button>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Package Name</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Golden Triangle Tour</td>
                <td className="border border-gray-300 px-4 py-2">$1500</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button className="text-blue-500 hover:underline">Edit</button> |{' '}
                  <button className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
              {/* Add more rows dynamically */}
            </tbody>
          </table>
        </div>
      </section>

      {/* View Bookings Section */}
      <section id="bookings">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">View Submitted Bookings</h2>
        <div className="bg-white shadow rounded-lg p-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Customer Name</th>
                <th className="border border-gray-300 px-4 py-2">Package</th>
                <th className="border border-gray-300 px-4 py-2">Booking Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">John Doe</td>
                <td className="border border-gray-300 px-4 py-2">Golden Triangle Tour</td>
                <td className="border border-gray-300 px-4 py-2">2024-12-15</td>
              </tr>
              {/* Add more rows dynamically */}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
    
  )
}

export default Profile