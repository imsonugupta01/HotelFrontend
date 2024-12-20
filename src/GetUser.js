// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Updated import
// import axios from 'axios';

// const GetUser = () => {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate(); // Updated to useNavigate

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/getUser', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         setUser(response.data.user);
//       } catch (err) {
//         setError('Failed to fetch user');
//         navigate('/login'); // Navigate to login page if fetching fails
//       }
//     };

//     fetchUser();
//   }, [navigate]); // Dependency updated to navigate

//   // Logout function
//   const handleLogout = () => {
//     localStorage.removeItem('token'); // Remove token from localStorage
//     navigate('/login'); // Redirect to login page after logout
//   };

//   if (error) return <div>{error}</div>;
//   if (!user) return <div>Loading...</div>;

//   return (
//     <div>
//       <h1>Welcome, {user.name}</h1>
//       <p>Email: {user.email}</p>
      
//       {/* Logout Button */}
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// };

// export default GetUser;


import React, { useContext, useEffect } from 'react';
import { UserContext } from './Context/UserContext';
import { useNavigate } from 'react-router-dom';

const GetUser = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // If user is not found in context, navigate to login
  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login if user is not logged in
    }
  }, [user, navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null); // Remove user from context
    navigate('/login'); // Redirect to login page
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default GetUser;
