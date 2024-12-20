import React, { useContext, useState } from "react";
import { UserContext } from "../Context/UserContext";

const AddTour = () => {
  //  const { user, setUser } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [availableDates, setAvailableDates] = useState("");
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setErrorMessage("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("availableDates", availableDates); // Comma-separated string
    formData.append("image", image);

    try {
      const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/api/tour-packages/add`, {
        method: "POST",
        body: formData,
         headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      });

      if (response.ok) {
        setSuccessMessage("Tour package added successfully!");
        setErrorMessage("");
        setTitle("");
        setDescription("");
        setPrice("");
        setAvailableDates("");
        setImage(null);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to add tour package");
      }
    } catch (error) {
      setErrorMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Add Tour Package
      </h2>
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Title</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Price</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">
            Available Dates (comma-separated)
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 2024-01-10, 2024-01-20"
            value={availableDates}
            onChange={(e) => setAvailableDates(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Tour Package
        </button>
      </form>
    </div>
  );
};

export default AddTour;
