import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import HospitalFormNavbar from "../components/HositalFormNavbar";

const HospitalHome = () => {
  const [reservations, setReservations] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  // const hospitalId = 'your-hospital-id'; // Replace this with actual hospital ID

  // useEffect(() => {
  //   const fetchHospitalReservationInfo = async () => {
  //     try {
  //       setLoading(true);

  //       // Make request to the new endpoint with hospitalId
  //       const { data } = await axios.get(`http://localhost:3000/api/v1/users/get-payment-info-hospital/${hospitalId}`);

  //       // Handle the response and set the state with reservation data
  //       if (data && data.data) {
  //         setReservations(data.data); // data.data contains the reservation information
  //       } else {
  //         setReservations([]);
  //       }

  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching reservation data:", error?.response?.data?.message || error);
  //       setError("Error fetching reservation data");
  //       setLoading(false);
  //     }
  //   };

  //   fetchHospitalReservationInfo();
  // }, [hospitalId]); // Fetch whenever hospitalId changes (optional)

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>{error}</p>;

  const handleClick = () => {
    navigate('/hospital-form');
  };

  return (
    
    <div>
      <button onClick={handleClick}
          className="max-w-xs w-full md:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Edit Information
        </button>
    </div>
    
    // <HospitalFormNavbar/>
  );
};

export default HospitalHome;




// <div className="flex flex-col justify-center min-h-[50vh]">
    //   <div className="p-4 flex justify-center bg-gray-100 w-full">
    //     <div className="md:w-3/5 w-full bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-sm:p-2">
    //       <h3 className="text-xl font-semibold bg-indigo-100 text-indigo-700 py-2 px-4 rounded-t-lg max-sm:text-lg max-sm:px-2">
    //         Bed Reservations
    //       </h3>
    //       <div className="max-h-[20rem] overflow-y-auto p-4 max-sm:p-2">
    //         {reservations.length > 0 ? (
    //           <ul className="space-y-4 max-sm:space-y-2">
    //             {reservations.map((reservation, index) => {
    //               if (!reservation) return null;

    //               return (
    //                 <li
    //                   key={reservation.reservation_id || index}
    //                   className="bg-gray-100 p-4 rounded-lg shadow max-sm:p-2"
    //                 >
    //                   <div className="flex justify-between items-center max-sm:flex-col">
    //                     <div className="max-sm:mb-2">
    //                       <h4 className="font-semibold text-lg max-sm:text-base">
    //                         Payment ID: {reservation.payment_id || "Not available"}
    //                       </h4>
    //                       <p className="text-gray-600 max-sm:text-sm">
    //                         Bed Reservation Time: {reservation.bed_reservation_time
    //                           ? new Date(reservation.bed_reservation_time).toLocaleString()
    //                           : "Not available"}
    //                       </p>
    //                       <p className="text-gray-600 max-sm:text-sm">
    //                         Check-In Time: {reservation.check_in_time
    //                           ? new Date(reservation.check_in_time).toLocaleString()
    //                           : "Not yet checked in"}
    //                       </p>
    //                       <p className="text-gray-600 max-sm:text-sm">
    //                         Late Patient: {reservation.late_patient ? "Yes" : "No"}
    //                       </p>
    //                     </div>
    //                   </div>
    //                   <div className="text-gray-500 max-sm:text-sm">
    //                     <p>Username: {reservation.user_info?.username || "N/A"}</p>
    //                     <p>Email: {reservation.user_info?.email || "N/A"}</p>
    //                     <p>Phone Number: {reservation.user_info?.phone_number || "N/A"}</p>
    //                   </div>
    //                 </li>
    //               );
    //             })}
    //           </ul>
    //         ) : (
    //           <p className="text-gray-600 max-sm:text-sm">No reservations</p>
    //         )}
    //       </div>
    //     </div>
    //   </div>

      {/* Centered Button */}
      // <div className="w-full flex justify-center mt-4">
      //   <button
      //     onClick={handleClick}
      //     className="max-w-xs w-full md:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
      //   >
      //     Edit Information
      //   </button>
      // </div>
    // </div>
