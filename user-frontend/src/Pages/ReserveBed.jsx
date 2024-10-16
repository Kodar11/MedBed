import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate from react-router-dom

const getCookie = (cookieName) => {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
};

const RazorpayPayment = () => { // Accept hospitalId as a prop
  const navigate = useNavigate(); // Initialize the navigate function
  const {hospitalId} = useParams()

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Clean up
    };
  }, []);

  const decodeToken = (token) => {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  };

  const handlePayment = (e) => {
    e.preventDefault();

    if (!window.Razorpay) {
      alert("Razorpay is not loaded. Please refresh the page.");
      return;
    }

    const accessToken = getCookie("accessToken");
    if (!accessToken) {
      alert("User not logged in.");
      return;
    }

    // Decode the token to get userId, assuming JWT
    const decodedToken = decodeToken(accessToken);
    const userId = decodedToken?.id; // Extract userId from the token
    if (!userId) {
      alert("User ID is missing from the token.");
      return;
    }

    const options = {
      key: "rzp_test_xv68vPTt2yrHXB", // Replace with your Razorpay key
      amount: "50000", // ₹500 in paise
      currency: "INR",
      name: "MedBed",
      description: "Bed Reservation Deposit",
      image: "https://example.com/your_logo", // Replace with actual logo URL
      handler: function (response) {
        // Payment was successful, now make the Axios request to create a reservation
        axios.post("http://localhost:3000/api/v1/users/create-bed-reservation", {
          paymentId: response.razorpay_payment_id, // Payment ID from Razorpay
          userId: userId, // Extracted userId from the token
          hospitalId: hospitalId, // Pass the hospitalId
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Bearer token from cookies
          },
        })
          .then(res => {
            console.log("Reservation created:", res.data);
            alert("Reservation successful!");
            navigate('/reservations'); // Navigate to the /reservations page after successful payment
          })
          .catch(err => {
            console.error("Error creating reservation:", err);
            alert("Failed to create reservation. Please try again.");
          });
      },
      prefill: {
        name: decodedToken.name, // Prefill user details
        email: decodedToken.email,
        contact: decodedToken.phone_number,
      },
      theme: {
        color: "#5A67D8", // Custom theme color
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-purple-200 p-6">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-2">Secure Your Bed Reservation</h1>
        <p className="text-gray-500 mb-6">
          A refundable deposit is required to reserve your bed. Complete the payment below to confirm your booking.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Deposit Amount</h2>
          <p className="text-4xl font-bold text-blue-500">₹500</p>
          <p className="text-sm text-gray-500 mt-2">(Refundable upon check-in)</p>
        </div>

        <button
          onClick={handlePayment}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg shadow-md text-lg font-medium hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Pay ₹500 Now
        </button>

        <p className="text-xs text-gray-400 mt-4">
          *You will receive a full refund upon successful check-in.
        </p>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')} // Navigate to home page on click
          className="mt-6 bg-gray-600 text-white py-2 px-6 rounded-lg text-lg font-medium hover:bg-gray-700 transition duration-300 ease-in-out"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default RazorpayPayment;
