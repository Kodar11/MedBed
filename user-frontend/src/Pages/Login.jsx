import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginForm() {
  const [formData, setFormData] = useState({
    username: '', 
    password: ''
  });

  const navigate = useNavigate();

  // Function to navigate to the home page after successful login
  const navigateToHomePage = () => {
    navigate('/');
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Post request to login endpoint
      const res = await axios.post('http://localhost:8000/api/v1/users/login', {
        username: formData.username,
        password: formData.password
      }, { withCredentials: true });

      if (res.data.statusCode === 200) {
        console.log("Successfully");
        
        navigateToHomePage();
      } else {
        console.log("Error during login");
      }

    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="w-full max-w-xs max-sm:max-w-[18rem] sm:max-w-[18rem] md:max-w-[20rem] lg:max-w-xs p-5 md:p-6 bg-white border-1 rounded-lg shadow-2xl border border-blue-800 mx-auto my-10 md:my-16 lg:my-24 ">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-800 mb-2 md:mb-3 font-serif">MedBed</h1>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-center text-blue-500 mb-3 md:mb-4 font-serif">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
          <input
            type="text"
            name="username" // Updated to match schema
            placeholder="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 sm:py-3 md:py-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
          >
            Login
          </button>
        </form>
        <br />
        <a href="/" className="block text-center text-blue-500 hover:underline">Register</a>
      </div>
    </>
  );
}

export default LoginForm;
