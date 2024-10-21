import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  // State for form data (no insurance fields)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone: '',
    email: '',
    password: ''
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const navigate = useNavigate();

  // Function to navigate to the login page after successful registration
  const navigateToLoginPage = () => {
    navigate('/login');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send form data to backend
      const res = await axios.post('http://localhost:8000/api/v1/users/register', {
        fullName: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        phone_number: formData.phone
      }, { withCredentials: true });

      if (res.data.statusCode === 200) {
        navigateToLoginPage();
      } else {
        console.log("Error on registration");
      }
    } catch (e) {
      console.error(e);
      alert(e);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">MedBed</h1>
        <h2 className="text-xl font-semibold text-center text-blue-600">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone No."
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
          />
          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors duration-300 ease-in-out"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
