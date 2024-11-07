import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faClock, faUser, faEnvelope, faPhone, faExclamationTriangle, faCopy, faShare, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const HospitalHome = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hospitalData, setHospitalData] = useState({});
  const [hospital, setHospital] = useState({});

  let bedCount = 0;
  const navigate = useNavigate();
  const { hospitalId } = useParams();

  useEffect(() => {
    const fetchHospitalReservationInfo = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:3000/api/v1/users/get-payment-info-hospital/${hospitalId}`);
        setReservations(data.data || []);
        setLoading(false);
      } catch (error) {
        setError("Error fetching reservation data");
        setLoading(false);
      }
    };

    fetchHospitalReservationInfo();
  }, [hospitalId]);

  useEffect(() => {
    const fetchAvailableBeds = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/users/getAvailbleBeds');
        setHospitalData(response.data);
      } catch (error) {
        console.error('Error fetching available beds:', error);
      }
    };

    fetchAvailableBeds();
    const interval = setInterval(fetchAvailableBeds, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/hospitals/getHospitalById?requestId=${hospitalId}`);
        setHospital(response.data.hospital);
        setLoading(false);
      } catch (error) {
        setError("Error fetching hospital details");
        setLoading(false);
      }
    };

    fetchHospitalDetails();
  }, [hospitalId]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error && reservations.length === 0) return <p className="text-center text-red-500 mt-4">{error}</p>;

  const handleClick = () => {
    navigate(`/hospital-form/${hospitalId}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto mt-6 flex flex-col items-center">
        <div className="bg-white w-full md:w-3/5 border border-gray-200 rounded-lg shadow-2xl p-6">
          <h3 className="text-2xl font-semibold text-indigo-700 bg-indigo-100 py-3 px-6 rounded-t-lg">
            <FontAwesomeIcon icon={faBed} className="mr-3" />
            Bed Reservations
          </h3>
          <div className="max-h-[20rem] overflow-y-auto p-4">
            {reservations.length > 0 ? (
              <ul className="space-y-4">
                {reservations.map((reservation, index) => {
                  if (!reservation) return null;

                  return (
                    <li key={reservation.reservation_id || index} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-lg text-blue-700 mb-2">
                            Payment ID: {reservation.payment_id || "Not available"}
                          </h4>
                          <p className="text-gray-600 flex items-center">
                            <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-500" />
                            Bed Reservation Time: {reservation.bed_reservation_time ? new Date(reservation.bed_reservation_time).toLocaleString() : "Not available"}
                          </p>
                          <p className="text-gray-600 flex items-center mt-1">
                            <FontAwesomeIcon icon={faClock} className="mr-2 text-green-500" />
                            Check-In Time: {reservation.check_in_time ? new Date(reservation.check_in_time).toLocaleString() : "Not yet checked in"}
                          </p>
                          {reservation.late_patient && (
                            <p className="text-yellow-600 flex items-center mt-1">
                              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2 text-yellow-500" />
                              Late Patient
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-600 transition-colors duration-300">
                            <FontAwesomeIcon icon={faCopy} />
                          </button>
                          <button className="text-green-500 hover:text-green-600 transition-colors duration-300">
                            <FontAwesomeIcon icon={faShare} />
                          </button>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-inner mt-4">
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
              <p className="text-gray-600 text-center py-8">No reservations made</p>
            )}
          </div>
          <div className="p-6 mt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow-md flex flex-col items-center">
              <h4 className="text-2xl font-bold mb-1">{hospitalData[hospitalId] || 0}</h4>
              <p className="text-lg font-semibold">Available Beds</p>
            </div>

            <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-md flex flex-col items-center">
              <h4 className="text-2xl font-bold mb-1">
                {hospital.BedInfos?.reduce((total, bedInfo) => total + bedInfo.total_beds, 0) - (hospitalData[hospitalId] || 0)}
              </h4>
              <p className="text-lg font-semibold">Beds Booked</p>
            </div>

            <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow-md flex flex-col items-center">
              <h4 className="text-2xl font-bold mb-1">
                {hospital.BedInfos?.reduce((total, bedInfo) => total + bedInfo.total_beds, 0)}
              </h4>
              <p className="text-lg font-semibold">Total Beds</p>
            </div>
          </div>

          <div className="w-full flex justify-center mt-8">
            <button
              onClick={handleClick}
              className="max-w-xs w-full md:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Edit Information
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalHome;
