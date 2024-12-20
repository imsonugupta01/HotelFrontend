import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

const UserProfile = () => {
  const [tours, setTours] = useState([]);
  const [history, setHistory] = useState([]);
  const [reviews, setReviews] = useState([]); // State for reviews
  const [searchTerm, setSearchTerm] = useState("");
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setHistory([]);
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const fetchHistory = async () => {
    try {
      if (user) {
        const response = await axios.get(
          `${process.env.REACT_APP_ROOT_API_URL}/api/bookTour/UserBooking/${user.id}`
        );
        setHistory(response.data);
      }
    } catch (err) {
      console.error("Error in fetching history", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const reviewResponse = await axios.get(`${process.env.REACT_APP_ROOT_API_URL}/api/review/get`);
      const reviews = reviewResponse.data;
      // console.log(reviews)
      // Fetch user details for each review
      const reviewsWithUserDetails = await Promise.all(
        reviews.map(async (review) => {
          try {
            console.log("userId:", review.userId); // Log the userId to make sure it's correct
          
            const userResponse = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/api/users/getById?userId=${review.userId}`, {
              method: 'GET',  // GET method without body
              headers: {
                "Content-Type": "application/json", // Ensure correct content type
              }
            });
          
            // Check if the response is successful
            if (!userResponse.ok) {
              throw new Error('User not found or error fetching data');
            }
          
            // Parse the response data
            const data = await userResponse.json();
            console.log("API Response Data:", data); // Log the response data
          
            return { ...review, userName: data.user.name };
          } catch (error) {
            console.error("Error fetching user by ID:", error.message); // Log error details
            return { ...review, userName: "Unknown User" };
          }
          
          
        
        
          
        })
      );
  
      setReviews(reviewsWithUserDetails);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };
  

  useEffect(() => {
    
    fetchReviews();
    if (!user) {
      setTimeout(()=>{
        fetchHistory()
      },2000)
    }
  }, [user,navigate]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_ROOT_API_URL}/api/tour-packages/get`);
        setTours(response.data);
      } catch (err) {
        console.error("Error in fetching tours", err);
      }
    };

    fetchTours();
  }, []);

  const handleNavigate = (title) => {
    navigate(`/Tour-Detail/${title}`);
  };

  const handlePageChnge = (tourId) => {
    navigate(`/History-Detail/${tourId}`);
  };

  const filteredTours = tours.filter(
    (tour) =>
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tour.country && tour.country.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-md relative z-20">
  <h1 className="text-2xl font-bold">User Dashboard</h1>
  <div className="relative group">
    <button className="flex items-center space-x-2">
      <img
        src="https://via.placeholder.com/40"
        alt="Profile"
        className="rounded-full h-10 w-10 border-2 border-white"
      />
      <span className="hidden sm:block">{user ? user.name : "Guest"}</span>
    </button>
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
      {user && (
        <>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
            View Profile
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={handleLogout}
          >
            Logout
          </a>
        </>
      )}
      {!user && (
        <a
          href="#"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          onClick={handleLogin}
        >
          Login
        </a>
      )}
    </div>
  </div>
</header>

<section className="relative h-[65vh] w-full overflow-hidden">
  {/* Video Background */}
  <video
  className="absolute top-0 left-0 w-full h-[65vh] object-cover"
  src="https://firebasestorage.googleapis.com/v0/b/mystore-eca03.appspot.com/o/223461_smalll.mp4?alt=media&token=325c69fa-e6e1-4947-8f4d-bd4081ee6af6"
  autoPlay
  loop
  muted
/>


  {/* Overlay Content */}
  <div className="relative z-10 flex justify-center items-center h-full">
    <div className="text-center rounded-lg bg-opacity-30 transform -translate-y-5 md:-translate-y-20">
      <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
        Ready to Travel Island
      </h1>
      <h1 class="min-h-[50px]"> </h1>
{/* <h1 class="min-h-[50px]"></h1> */}

      <button className="px-6 py-3 bg-yellow-500 text-white font-medium text-lg md:text-xl rounded-lg shadow-lg hover:bg-yellow-600 transition">
        Explore
      </button>
    </div>
  </div>

  {/* Optional Gradient Overlay */}
  {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-0"></div> */}
</section>


      

      <main className="container mx-auto px-4 py-2">
        <section className="bg-white shadow rounded-lg p-6 mb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Available Tours</h2>
            <input
              type="text"
              placeholder="Search by place or country..."
              className=" mx-2 px-6 py-2 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredTours.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <div
                  key={tour._id}
                  className="bg-gray-50 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2"
                >
                  <img
                    src={tour.imageUrl}
                    alt={tour.title}
                    className="h-[60vh] object-cover"
                    onClick={() => handleNavigate(tour.title)}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-center text-gray-800 mb-5">{tour.title}</h3>
                    <p className="text-lg text-blue-600 font-bold text-center mb-2">${tour.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No tours match your search criteria.</p>
          )}
        </section>

         
        <section className="bg-white shadow-lg rounded-lg p-6 mb-4">
  <h2 className="text-xl font-bold mb-4 text-gray-800">Customer's Reviews</h2>
  {reviews.length > 0 ? (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review) => {
        const rating = review.rating; // Assuming the rating is a number between 1 and 5
        return (
          <li
            key={review._id}
            className="bg-gradient-to-r from-blue-100 to-green-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{review.tourId}</h3>
            

            {/* Star rating */}
            <div className="flex mb-4">
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  key={index}
                  className={`text-3xl ${index < rating ? "text-yellow-500" : "text-gray-300"}`}
                >
                  ★
                </span>
              ))}
            </div>

            <p className="text-gray-700 mb-4">{review.reviewText}</p>

            <p className="text-sm text-gray-500">
              Reviewed on: {new Date(review.reviewDate).toLocaleDateString()}
            </p>
            <p className="text-l text-black-500 mb-4">By: {review.userName}</p>
          </li>
        );
      })}
    </ul>
  ) : (
    <p className="text-gray-500">No reviews available.</p>
  )}
</section>



        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Your Travel Dairy</h2>
          {history.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((tour) => (
                <li
                  key={tour._id}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col items-center"
                  onClick={() => handlePageChnge(tour._id)}
                >
                  <div className="w-full h-[40vh] mb-4">
                    <img
                      src={tour.image}
                      alt={tour.TourId}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 text-center">{tour.TourId}</h3>
                  <p className="text-sm text-gray-600 text-center">
                    {new Date(tour.BookedData).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No tour history available.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default UserProfile;
