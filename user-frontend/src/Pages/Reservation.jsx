import React, { useState, useEffect } from "react";
import axios from "axios";

// Function to get a cookie by name
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
const decodeToken = (token) => {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload));
};

const BedReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);

        // Get the access token from the cookie
        const accessToken = getCookie("accessToken");

        if (!accessToken) {
          console.error("Access token not found");
          setLoading(false);
          return;
        }

        // Decode the access token to get userId
        const decodedToken = decodeToken(accessToken);
        const userId = decodedToken?.id;

        if (!userId) {
          console.error("User ID not found in token");
          setLoading(false);
          return;
        }

        // Fetch reservations based on the userId
        const { data } = await axios.get(`http://localhost:3000/api/v1/users/get-payment-info-user/${userId}`,);
        
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

  return (
    <div className="p-4 flex justify-center min-h-screen bg-gray-100">
      <div className="lg:w-1/2 w-full bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-sm:p-2">
        <h3 className="text-xl font-semibold bg-indigo-100 text-indigo-700 py-2 px-4 rounded-t-lg max-sm:text-lg max-sm:px-2">
          Bed Reservations
        </h3>
        <div className="max-h-[28rem] overflow-y-auto p-4 max-sm:p-2">
          {reservations.length > 0 ? (
            <ul className="space-y-4 max-sm:space-y-2">
              {reservations.map((reservation, index) => {
                // Ensure reservation exists before rendering
                if (!reservation) return null;

                return (
                  <li key={reservation.payment_id || index} className="bg-gray-100 p-4 rounded-lg shadow max-sm:p-2">
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
  );
};

export default BedReservations;
