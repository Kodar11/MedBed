import React, { useState, useEffect } from "react";
import axios from "axios";

const BedReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint and reservation ID
        const { data } = await axios.post("https://localhost:3000/api/v1/users/send-payment-info", {
          reservationId: "be2da687-90c3-49ad-9f86-1247eb82b8e0", // Dynamically set the reservation ID
        });

        // Assuming the response structure has `data` containing the reservation details
        setReservations([data.payload]); // Set the reservation data from API response
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reservation data:", error?.response?.data?.message || error);
        setLoading(false); // Proceed to load UI even on error
      }
    };

    fetchReservations();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 flex justify-center min-h-screen bg-gray-100">
      <div className="lg:w-1/2 w-full bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-sm:p-2">
        <h3 className="text-xl font-semibold bg-indigo-100 text-indigo-700 py-2 px-4 rounded-t-lg max-sm:text-lg max-sm:px-2">
          Bed Reservations
        </h3>
        <div className="max-h-[28rem] overflow-y-auto p-4 max-sm:p-2">
          {reservations.length > 0 ? (
            <ul className="space-y-4 max-sm:space-y-2">
              {reservations.map((reservation) => (
                <li key={reservation.payment_id} className="bg-gray-100 p-4 rounded-lg shadow max-sm:p-2">
                  <div className="flex justify-between items-center max-sm:flex-col">
                    <div className="max-sm:mb-2">
                      <h4 className="font-semibold text-lg max-sm:text-base">
                        Payment ID: {reservation.payment_id}
                      </h4>
                      <p className="text-gray-600 max-sm:text-sm">
                        Bed Reservation Time: {reservation.bed_reservation_time
                          ? new Date(reservation.bed_reservation_time).toLocaleString()
                          : "Not available"}
                      </p>
                      <p className="text-gray-600 max-sm:text-sm">
                        Check-In Time: {reservation.check_in_time
                          ? new Date(reservation.check_in_time).toLocaleString()
                          : "Not yet checked in"}
                      </p>
                      <p className="text-gray-600 max-sm:text-sm">
                        Late Patient: {reservation.late_patient ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-500 max-sm:text-sm">
                    <p>Username: {reservation.user_info.username}</p>
                    <p>Email: {reservation.user_info.email}</p>
                    <p>Phone Number: {reservation.user_info.phone_number}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 max-sm:text-sm">No reservations</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BedReservations;
