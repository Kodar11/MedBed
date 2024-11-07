import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faClock, faUser, faEnvelope, faPhone, faExclamationTriangle, faCopy, faShare, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
        const response = await axios.get(`http://localhost:3000/api/v1/users/get-payment-info-user/${userId}`);
        
        // Handle the received data
        if (response.data && response.data.data) {
          let reservationsData = response.data.data;
          
          // Ensure reservationsData is always an array
          if (!Array.isArray(reservationsData)) {
            console.warn("API returned a single object instead of an array. Converting to array.");
            reservationsData = [reservationsData];
          }

          setReservations(reservationsData);
        } else {
          console.warn("No reservation data found in the API response");
          setReservations([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching reservation data:", error?.response?.data?.message || error);
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleBackClick = () => {
    navigate('/');
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-white">
            <FontAwesomeIcon icon={faBed} className="mr-3" />
            Bed Reservations
          </h3>
          <button
            onClick={handleBackClick}
            className="text-white hover:text-gray-200 transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Home
          </button>
        </div>
        <div className="max-h-[600px] overflow-y-auto p-6">
          {reservations.length > 0 ? (
            <ul className="space-y-6">
              {reservations.map((reservation, index) => {
                if (!reservation) return null;

                return (
                  <li
                    key={reservation.payment_id || index}
                    className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <div>
                        <h4 className="font-semibold text-lg text-blue-700 mb-2">
                          Payment ID: {reservation.payment_id || "Not available"}
                        </h4>
                        <p className="text-gray-600 flex items-center">
                          <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-500" />
                          Reserved: {reservation.bed_reservation_time
                            ? new Date(reservation.bed_reservation_time).toLocaleString()
                            : "Not available"}
                        </p>
                        <p className="text-gray-600 flex items-center mt-1">
                          <FontAwesomeIcon icon={faClock} className="mr-2 text-green-500" />
                          Check-In: {reservation.check_in_time
                            ? new Date(reservation.check_in_time).toLocaleString()
                            : "Not yet checked in"}
                        </p>
                      </div>
                      <div className="flex space-x-2 mt-2 md:mt-0">
                        <button className="text-blue-500 hover:text-blue-600 transition-colors duration-300">
                          <FontAwesomeIcon icon={faCopy} className="mr-2" />
                        </button>
                        <button className="text-green-500 hover:text-green-600 transition-colors duration-300">
                          <FontAwesomeIcon icon={faShare} className="mr-2" />
                        </button>
                      </div>
                    </div>
                    {reservation.late_patient && (
                      <div className="mt-2 md:mt-0 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                        Late Patient
                      </div>
                    )}
                    <div className="bg-white p-4 rounded-lg shadow-inner">
                      <h5 className="font-semibold text-gray-700 mb-2">Patient Information</h5>
                      <p className="text-gray-600 flex items-center">
                        <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-400" />
                        {reservation.user_info?.username || "N/A"}
                      </p>
                      <p className="text-gray-600 flex items-center mt-1">
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-blue-400" />
                        {reservation.user_info?.email || "N/A"}
                      </p>
                      <p className="text-gray-600 flex items-center mt-1">
                        <FontAwesomeIcon icon={faPhone} className="mr-2 text-blue-400" />
                        {reservation.user_info?.phone_number || "N/A"}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-600 text-center py-8">
              No reservations found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BedReservations;
