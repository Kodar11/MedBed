import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faDirections, faAmbulance } from '@fortawesome/free-solid-svg-icons';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMapMarkerAlt, faPhone, faGlobe, faEnvelope, faHospital, faCertificate, faMedkit, faUserMd, faBed, faStethoscope, faHandHoldingMedical, faShieldAlt, faHeartbeat } from '@fortawesome/free-solid-svg-icons';

const HospitalCard = ({ hospital }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [screenSize, setScreenSize] = useState(window.innerWidth);
    const [availableBeds, setAvailableBeds] = useState(0);
    const navigate = useNavigate(); 

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchAvailableBeds = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/hospitals/${hospital.hospital.id}/available-beds`);
                setAvailableBeds(response.data.availableBeds);
            } catch (error) {
                console.error("Error fetching available beds", error);
            }
        };

        fetchAvailableBeds();
    }, [hospital.hospital.id]);

    if (!hospital) {
        return <p>No hospital data available.</p>;
    }

    const handleReserveBedClick = async () => {
        try {
            const response = await axios.get('/api/auth/verify');
            if (response.status === 200) {
                navigate(`/reserveBed/${hospital.hospital.id}`);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                console.error("Error checking authentication", error);
            }
        }
    };

    const handleClick = () => {
        navigate(`/hospital-details/${hospital.hospital.id}`);
    };

    // const handleDirection = () => {
    //     navigate(`/hospital-directions/${hospital.hospital.id}`);
    // };

    const handleDirection = () => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hospital.hospital.name} ${hospital.hospital.address} ${hospital.hospital.city} ${hospital.hospital.state} ${hospital.hospital.zip_code}`)}`, '_blank');
    };
    

    return (
        <div className='w-full flex justify-center items-center'>
            <div 
                className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-6 shadow-lg flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 my-4"
                style={{
                    width: screenSize <= 600 ? '95%' : '90%',
                    maxWidth: screenSize > 600 ? '800px' : '100%',
                    height: 'auto',
                    maxHeight: screenSize > 600 ? '350px' : 'auto'
                }}
            >
                <div className="flex-2 text-center md:text-left">
                    <h2 onClick={handleClick} className="text-xl md:text-2xl font-semibold mb-2 mr-4 cursor-pointer">
                        {hospital.hospital.name}
                    </h2>
                    <p className="text-sm md:text-base mb-2">{hospital.hospital.address}</p>
                    <p className="text-sm md:text-base mb-2"><strong>Phone:</strong> {hospital.hospital.contact_number}</p>
                    <p className="text-sm md:text-base mb-2"><strong>Hours:</strong> {hospital.hours || 'Open 24 hours'}</p>
                    <p className="text-sm md:text-base mb-2">
                        <strong>{hospital.rating}</strong>
                        <span className="text-yellow-400">⭐</span> {hospital.reviews} Google reviews
                    </p>
                </div>

                {screenSize > 600 && (
                    <div className="flex justify-between items-center space-x-4">
                        <div className="flex flex-col text-center items-center justify-center">
                            <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center text-lg mb-2">
                                <span>{availableBeds || 'N/A'}</span>
                            </div>
                            <p className="text-sm">Available Beds</p>
                        </div>

                        <div className="flex flex-col justify-around items-center">
                            <div
                                className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center cursor-pointer"
                                onClick={handleReserveBedClick}
                            >
                                <FontAwesomeIcon icon={faBed} className="w-6 h-6 text-blue-500" />
                            </div>
                            <p className="text-sm text-center">Reserve</p>
                            <p className="text-sm text-center">Bed</p>
                        </div>

                        <div className="flex flex-col justify-around items-center">
                            <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faDirections} className="w-6 h-6 text-blue-500" onClick={handleDirection} />

                                {/* onClick={handleDirection} */}
                            </div>
                            <p className="text-sm text-center">Directions</p>
                            <p className="text-sm text-center">Navigation</p>
                        </div>

                        <div className="flex flex-col text-center items-center justify-center">
                            <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center text-lg mb-2">
                                <FontAwesomeIcon icon={faAmbulance} className="w-6 h-6 text-blue-500" />
                            </div>
                            <p className="text-sm">Call</p>
                            <p className="text-sm">Ambulance</p>
                        </div>
                    </div>
                )}

                {screenSize <= 600 && (
                    <div className="rounded-lg shadow-lg">
                        <div className="flex justify-evenly gap-4">
                            <div className="flex flex-col text-center items-center justify-center">
                                <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center text-lg mb-2">
                                    <span>{availableBeds || 'N/A'}</span>
                                </div>
                                <p className="text-sm">Available Beds</p>
                            </div>

                            <div className="flex flex-col justify-around items-center">
                                <div
                                    className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center cursor-pointer"
                                    onClick={handleReserveBedClick}
                                >
                                    <FontAwesomeIcon icon={faBed} className="w-6 h-6 text-blue-500" />
                                </div>
                                <p className="text-sm text-center">Reserve</p>
                                <p className="text-sm text-center">Bed</p>
                            </div>

                            <div className="flex flex-col justify-around items-center">
                                <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center">
                                    <FontAwesomeIcon icon={faDirections} className="w-6 h-6 text-blue-500" onClick={handleDirection} />
                                </div>
                                <p className="text-sm text-center">Directions</p>
                                <p className="text-sm text-center">Navigation</p>
                            </div>

                            <div className="flex flex-col text-center items-center justify-center">
                                <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center text-lg mb-2">
                                    <FontAwesomeIcon icon={faAmbulance} className="w-6 h-6 text-blue-500" />
                                </div>
                                <p className="text-sm">Call</p>
                                <p className="text-sm">Ambulance</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const InfoItem = ({ icon, text, link }) => (
    <div className="flex items-center space-x-3 text-gray-700">
      <FontAwesomeIcon icon={icon} className="text-teal-500 w-5 h-5 flex-shrink-0" />
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="hover:text-teal-600">
          {text}
        </a>
      ) : (
        <span>{text}</span>
      )}
    </div>
  );

export default HospitalCard;
