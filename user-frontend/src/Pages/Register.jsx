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
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md p-3 sm:p-4 md:p-6 bg-white rounded-lg shadow-2xl border border-blue-700">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center font-serif text-gray-800 mb-2 md:mb-4">MedBed</h1>
        {/* <h2 className="text-base sm:text-lg md:text-xl font-bold text-center font-serif text-blue-600 mb-3 md:mb-5">REGISTER</h2> */}
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-2">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 my-1"
          />
          <input
            type="text"
            name="username"
            placeholder="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone No."
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 sm:py-3 md:py-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-3 sm:mt-4 md:mt-5 text-xs sm:text-sm md:text-base">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}

export default Register;