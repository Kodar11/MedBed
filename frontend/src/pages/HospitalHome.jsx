import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const HospitalHome = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);

        // Fetch reservations without authentication
        const { data } = await axios.get(`http://localhost:3000/api/v1/users/send-payment-info`);

        // Handle the received data
        if (data && data.data) {
          setReservations([data.data]); // Wrap the object in an array
        } else {
          setReservations([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching reservation data:", error?.response?.data?.message || error);
        setLoading(false);
      }
    };

    fetchReservations();
  }, []); // Empty dependency array to run this only on component mount

  if (loading) return <p>Loading...</p>;


  const handleClick = () => {
    navigate('/hospital-form');
  };

  return (
    <div className="flex flex-col justify-center min-h-[50vh]">
  <div className="p-4 flex justify-center bg-gray-100 w-full">
    <div className="md:w-3/5 w-full bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-sm:p-2">
      <h3 className="text-xl font-semibold bg-indigo-100 text-indigo-700 py-2 px-4 rounded-t-lg max-sm:text-lg max-sm:px-2">
        Bed Reservations
      </h3>
      <div className="max-h-[20rem] overflow-y-auto p-4 max-sm:p-2">
        {reservations.length > 0 ? (
          <ul className="space-y-4 max-sm:space-y-2">
            {reservations.map((reservation, index) => {
              if (!reservation) return null;

              return (
                <li
                  key={reservation.payment_id || index}
                  className="bg-gray-100 p-4 rounded-lg shadow max-sm:p-2"
                >
                  <div className="flex justify-between items-center max-sm:flex-col">
                    <div className="max-sm:mb-2">
                      <h4 className="font-semibold text-lg max-sm:text-base">
                        Payment ID: {reservation.paymentId || "Not available"}
                      </h4>
                      <p className="text-gray-600 max-sm:text-sm">
                        Bed Reservation Time: {reservation.reservationTime
                          ? new Date(reservation.reservationTime).toLocaleString()
                          : "Not available"}
                      </p>
                      <p className="text-gray-600 max-sm:text-sm">
                        Check-In Time: {reservation.checkInTime
                          ? new Date(reservation.checkInTime).toLocaleString()
                          : "Not yet checked in"}
                      </p>
                      <p className="text-gray-600 max-sm:text-sm">
                        Late Patient: {reservation.late_patient ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-500 max-sm:text-sm">
                    <p>Username: {reservation.user?.username || "N/A"}</p>
                    <p>Email: {reservation.user?.email || "N/A"}</p>
                    <p>Phone Number: {reservation.user?.phone_number || "N/A"}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-600 max-sm:text-sm">No reservations</p>
        )}
      </div>
    </div>
  </div>

  {/* Centered Button */}
  <div className="w-full flex justify-center mt-4">
    <button
      onClick={handleClick}
      className="max-w-xs w-full md:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
    >
      Edit Information
    </button>
  </div>
</div>

  );
};

export default HospitalHome;
