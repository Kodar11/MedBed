import React, { useEffect } from 'react';
import axios from 'axios';

const RazorpayPayment = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Clean up
    };
  }, []);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handlePayment = (e) => {
    e.preventDefault();

    if (!window.Razorpay) {
        alert("Razorpay is not loaded. Please refresh the page.");
        return;
    }

    // Get the access token directly from local storage
    const accessToken = localStorage.getItem("accessToken") ? JSON.parse(localStorage.getItem("accessToken")) : null;
    console.log("1",accessToken);

    if (!accessToken) {
        alert("User not logged in.");
        return;
    }

    // const user = JSON.parse(localStorage.getItem("user")); // Retrieve the full user object

    // console.log("Raw user from localStorage:", user); // Log raw string
    // console.log("Access Token:", accessToken); // Log the access token

    if (!user || !user.id) {
        alert("User not logged in.");
        return;
    }

    const options = {
        key: "rzp_test_xv68vPTt2yrHXB",
        amount: "50000",  // ₹500 in paise
        currency: "INR",
        name: "MedBed",
        description: "Bed Reservation Deposit",
        image: "https://example.com/your_logo",  // Placeholder for a logo, replace with actual logo URL
        handler: function (response) {
            // After successful payment, make the Axios request to create a reservation
            axios.post("/api/bed-reservation", {
                paymentId: response.razorpay_payment_id,
                userId: user.id,  // Send userId from localStorage
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Send the token as Bearer token
                },
            })
            .then(res => {
                console.log("Reservation created:", res.data);
                alert("Reservation successful!");
            })
            .catch(err => {
                console.error("Error creating reservation:", err);
                alert("Failed to create reservation. Please try again.");
            });
        },
        prefill: {
            name: user.username,  // Use logged-in user details
            email: user.email,
            contact: user.phone_number,
        },
        notes: {
            address: "Razorpay Corporate Office"
        },
        theme: {
            color: "#5A67D8"  // Subtle purple color
        }
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

        <div className="mt-8">
          <p className="text-gray-500 text-sm">
            By making this payment, you agree to our
            <a href="#" className="text-blue-500 hover:underline ml-1">Terms & Conditions</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPayment;
