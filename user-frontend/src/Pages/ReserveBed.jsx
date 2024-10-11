import React, { useEffect } from 'react';

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

  const handlePayment = (e) => {
    e.preventDefault();

    if (!window.Razorpay) {
      alert("Razorpay is not loaded. Please refresh the page.");
      return;
    }

    const options = {
      key: "rzp_test_xv68vPTt2yrHXB",
      amount: "50000",
      currency: "INR",
      name: "MedBed",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      handler: function (response) {
        alert("Payment ID: " + response.razorpay_payment_id);
        alert("Order ID: " + response.razorpay_order_id);
        alert("Signature: " + response.razorpay_signature);
      },
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "7045757623"
      },
      notes: {
        address: "Razorpay Corporate Office"
      },
      theme: {
        color: "#3399cc"
      }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Deposit Amount</h1>
        <p className="text-xl mb-6">₹500</p>
        <button
          onClick={handlePayment}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default RazorpayPayment;
