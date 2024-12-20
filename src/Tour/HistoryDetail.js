import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Context/UserContext";
import { Form, useNavigate, useParams } from "react-router-dom";
import { formToJSON } from "axios";

function HistoryDetail() {
  const { tourId } = useParams();
  const { user } = useContext(UserContext);
  const [history, setHistory] = useState(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [tn,setTn]=useState()

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to home if user is not logged in
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_ROOT_API_URL}/api/bookTour/getById/${tourId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tour details");
        }
        const data = await response.json();
        setHistory(data);
        // console.log(data.TourId)
        setTn(data.TourId)
      } catch (err) {
        alert(err.message);
      }
    };

    fetchTourDetails();
  }, [tourId]);


  const SubmitReview = async (e) => {
    e.preventDefault();
    console.log("tn = "+ tn)
    const payload = {
      userId: user.id,
      tourId: tn,
      rating: rating,
      reviewText: review,
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/api/review/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        alert("Tour review added successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to add review");
      }
    } catch (error) {
      alert("Server error. Please try again later.");
    }
  };
  
  
  
  

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Tour History Details</h1>
        <div className="relative group">
          <button className="flex items-center space-x-2">
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="rounded-full h-10 w-10 border-2 border-white"
            />
            <span className="hidden sm:block">{user?.name || "Guest"}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {history ? (
          <div className="bg-white shadow-lg rounded-lg p-6">
            {/* Tour Image */}
            <img
              src={history.image}
              alt={history.TourId}
              className="w-full h-[60vh] object-cover rounded-lg mb-4"
            />

            {/* Tour Details */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
  <h2 className="text-2xl font-bold text-gray-800">
    {history.TourId}
  </h2>
  <p className="text-lg text-gray-700 sm:text-right">
    <strong>Booking Date:</strong>{" "}
    {new Date(history.BookedData).toLocaleDateString()}
  </p>
</div>

            <p className="text-lg text-gray-700 mb-2">
              <strong>Rate:</strong> ${history.rate}
            </p>

            {/* Travelers Section */}
            <div className="mt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Travelers</h3>
              <ul className="space-y-3">
                {history.Person.map((person) => (
                  <li
                    key={person._id}
                    className="bg-gray-50 p-4 rounded-lg shadow-md flex items-center"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 text-blue-800 font-bold text-lg h-12 w-12 rounded-full flex items-center justify-center">
                        {person.name[0]} {/* First letter of the name */}
                      </div>
                      <div>
                        <p className="text-lg text-gray-800 font-bold">
                          {person.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {person.gender}, {person.age} years
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Add Review Section */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Add Review & Rate Trip
              </h3>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review here..."
                className="w-full h-24 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              ></textarea>
              <div className="mt-4 flex items-center space-x-4">
                <label htmlFor="rating" className="text-lg font-bold">
                  Rate:
                </label>
                <select
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="0">Select Rating</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              <button
                onClick={SubmitReview}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
              >
                Submit Review
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading tour details...</p>
        )}
      </main>
    </div>
  );
}

export default HistoryDetail;
