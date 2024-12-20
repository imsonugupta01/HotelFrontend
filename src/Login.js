
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import { UserContext } from './Context/UserContext';
import { jwtDecode } from 'jwt-decode';  // Correct import for jwt-decode

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  // const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Check if the user is already logged in (based on the token in localStorage)
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     // If the token exists, we assume the user is logged in and redirect them to the home page
  //     const decodedToken = jwtDecode(token);  // Decode the token
  //     if (decodedToken.role === 'admin') {
  //       navigate('/admin');  // Redirect to admin page
  //     } else {
  //       navigate('/');  // Redirect to user homepage
  //     }
  //   }
  // }, [navigate]);

  const { user, setUser } = useContext(UserContext);
  useEffect(() => {
          if (user) {
            if (user.role === 'admin') {
              navigate('/admin');  // Navigate to the admin page
            } else {
              navigate('/');  // Navigate to the regular user page
            };  // Redirect to login if no user
          }
      }, [user, navigate]);  // The effect will run when 'user' or 'navigate' changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_ROOT_API_URL}/api/auth/login`, {
        email,
        password,
      });

      const token = response.data.token;
      const User = response.data.user;

      localStorage.setItem('token', token);  // Store the token

      // Set the user in context
      setUser(User);
      console.log(User)
      // Decode token to check user role
      // const decodedToken = jwtDecode(token);

    
    } catch (err) {
      setError(err.response.data.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm font-medium">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Login
          </button>
          <Link 
  to="/signUp" 
  className="text-blue-500 hover:text-blue-700  underline mt-4 block"
>
  Create an account
</Link>

        </form>
      </div>
    </div>
  );
};

export default Login;
