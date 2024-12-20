import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../Context/UserContext";
import { useParams, useNavigate } from "react-router-dom";

const BookTour = () => {
  const { title } = useParams();
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const [tourDetails, setTourDetails] = useState({});
  const [formData, setFormData] = useState({
    userId: user.id,
    bookedDate: "",
    tourId: title,
    rate: "",
    image: "", // Ensure this is initialized
    person: [{ name: "", gender: "", age: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePersonChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPerson = [...formData.person];
    updatedPerson[index][name] = value;
    setFormData((prev) => ({
      ...prev,
      person: updatedPerson,
    }));
  };

  const addPerson = () => {
    setFormData((prev) => ({
      ...prev,
      person: [...prev.person, { name: "", gender: "", age: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.image) {
      setErrorMessage("Tour image is not available.");
      setLoading(false);
      return;
    }

    try {
      console.log(formData); // Check if image is being passed in formData
      await axios.post(`${process.env.REACT_APP_ROOT_API_URL}/api/bookTour/book`, formData);
      setSuccessMessage("Tour booked successfully!");
      setFormData({
        userId: user.id,
        bookedDate: "",
        tourId: "",
        image: "",
        rate: "",
        person: [{ name: "", gender: "", age: "" }],
      });
    } catch (error) {
      setErrorMessage("An error occurred while booking the tour. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000${process.env.REACT_APP_ROOT_API_URL}/api/tour-packages/getDetails/${title}`);
        setTourDetails(response.data);
        console.log(response.data); // Check if imageUrl is present
        setFormData((prev) => ({
          ...prev,
          image: response.data.imageUrl, // Ensure this is set properly
        }));
      } catch (error) {
        setErrorMessage("An error occurred while fetching tour details.");
      }
    };

    fetchTourDetails();
  }, [title]);

  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: `url(${tourDetails.imageUrl})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Dark overlay for better text contrast */}
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-lg z-10">
        <h1 className="text-3xl font-bold">Book Your Dream Tour</h1>
        <div className="relative group">
          <button className="flex items-center space-x-2">
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="rounded-full h-10 w-10 border-2 border-white"
            />
             <span className="hidden sm:block">{user ? user.name : 'Guest'}</span>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {user && (
              <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                View Profile
              </a>
            )}
            {user && (
              <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </a>
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

      {/* Booking Form */}
      <div className="flex items-center justify-center py-6 sm:py-16">
        <div className="shadow-xl rounded-lg my-0 p-8 sm:p-10 w-full max-w-4xl z-10">
          <h2 className="text-white text-3xl font-semibold text-center text-gray-800 mb-2">
            {tourDetails.title}
          </h2>

          {errorMessage && (
            <div className="text-red-500 text-center mb-4">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-500 text-center mb-4">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Booked Date */}
            <div>
              <label htmlFor="bookedDate" className="block text-white font-medium">
                Select Booking Date
              </label>
              <input
                type="date"
                id="bookedDate"
                name="bookedDate"
                value={formData.bookedDate}
                onChange={handleInputChange}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Rate */}
            <div>
              <label htmlFor="rate" className="block text-white font-medium">
                Rate (₹)
              </label>
              <input
                type="number"
                id="rate"
                name="rate"
                value={formData.rate}
                onChange={handleInputChange}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Person Details */}
            <div>
              <h3 className="text-xl font-semibold text-white">Person Details</h3>
              {formData.person.map((p, index) => (
                <div key={index} className="space-y-4 mt-4">
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label htmlFor={`name-${index}`} className="block text-white">
                        Name
                      </label>
                      <input
                        type="text"
                        id={`name-${index}`}
                        name="name"
                        value={p.name}
                        onChange={(e) => handlePersonChange(index, e)}
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor={`gender-${index}`} className="block text-white">
                        Gender
                      </label>
                      <select
                        id={`gender-${index}`}
                        name="gender"
                        value={p.gender}
                        onChange={(e) => handlePersonChange(index, e)}
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`age-${index}`} className="block text-white">
                      Age
                    </label>
                    <input
                      type="number"
                      id={`age-${index}`}
                      name="age"
                      value={p.age}
                      onChange={(e) => handlePersonChange(index, e)}
                      className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addPerson}
                className="mt-4 text-white"
              >
                Add Another Person
              </button>
            </div>

            {/* Submit */}
            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {loading ? "Booking..." : "Book Now"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookTour;
