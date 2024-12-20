import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';

const TourDetail = () => {
  const { name } = useParams(); // Get the tour name from the route parameter
  const [tourDetail, setTourDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null); // Remove user from context
    navigate('/'); // Redirect to login page
  };

  const handleLogin = () => {
    navigate('/login'); // Redirect to login page
  };

  const handleBookTourButton=(title)=>{
    if(!user){
        alert("You need to login first !!")
    }
    else{
        navigate(`/Book-Tour/${title}`)

    }
  }


  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/api/tour-packages/getDetails/${name}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tour details');
        }
        const data = await response.json();
        setTourDetail(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTourDetails();
  }, [name]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide">Tour Explorer</h1>
          <div className="relative group">
            <button className="flex items-center space-x-3 focus:outline-none">
              <img
                src={user?.avatar || 'https://via.placeholder.com/40'}
                alt="Profile"
                className="rounded-full h-10 w-10 border-2 border-white"
              />
              <span className="hidden sm:block">{user ? user.name : 'Guest'}</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              {user && (
                <>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    View Profile
                  </a>
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}
              {!user && (
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={handleLogin}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tour Image */}
          <img
            src={tourDetail.imageUrl}
            alt={tourDetail.title}
            className="w-full h-[70vh] object-cover"
          />
          {/* Tour Details */}
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800">{tourDetail.title}</h1>
            <p className="mt-4 text-gray-600 text-lg">{tourDetail.description}</p>
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-700">Price:</h2>
              <p className="text-gray-800 text-xl font-bold">${tourDetail.price}</p>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-700">Available Dates:</h2>
              <ul className="list-disc pl-5 text-gray-600">
                {tourDetail.availableDates.map((date, index) => (
                  <li key={index}>{new Date(date).toLocaleDateString()}</li>
                ))}
              </ul>
            </div>
            <button
            //   onClick={() => alert('Booking functionality coming soon!')}
              className="mt-8 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300" 
             onClick={()=>handleBookTourButton(tourDetail.title)}>
              Book Now
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TourDetail;
