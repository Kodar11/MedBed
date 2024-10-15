import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HospitalDetails from '../../pages/Hospital_Info/HospitalDetails';
import { useNavigate } from 'react-router-dom';

const HospitalCard = ({ hospital }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedHospitalId, setSelectedHospitalId] = useState(null);

    const navigate = useNavigate(); 

    if (!hospital) {
        return <p>No hospital data available.</p>; // Handle case where no hospital data is passed
    }

    const handleClick = () => {
        // Use navigate to go to the HospitalDetails page and pass the hospital ID as a URL parameter
        navigate(`/hospital-details/${hospital.hospital.id}`);
    };

    return (
      <div>
        {!selectedHospitalId && (
        <div onClick={handleClick} className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-6 max-w-4xl mx-auto my-4 shadow-lg flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex-2 text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-semibold mb-2 mr-4">
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

            {/* For larger screens */}
            <div className="hidden md:flex flex-1 justify-between items-center space-x-4">
                <div className="flex flex-col text-center items-center justify-center">
                    <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center text-lg mb-2">
                        <span>{hospital.beds?.length || 'N/A'}</span>
                    </div>
                    <p className="text-sm">Available Beds</p>
                </div>
                <div className="flex flex-col text-center items-center justify-center">
                    <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center mb-2">
                        <img
                            className="w-8 h-8"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2JN2kb7prRHCCV0w3f94ImUNCxynGCeOYiQ&s"
                            alt="Reserve Bed"
                        />
                    </div>
                    <p className="text-sm">Reserve Bed</p>
                </div>
                <div className="flex flex-col text-center items-center justify-center">
                    <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center mb-2">
                        <img
                            className="w-8 h-8"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiEki7AnktD9BYXtKqziv3msZEVk_kOBlK8A&s"
                            alt="Directions"
                        />
                    </div>
                    <p className="text-sm">Directions & Navigation</p>
                </div>
                <div className="flex flex-col text-center items-center justify-center">
                    <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center text-lg mb-2">
                        <span role="img" aria-label="ambulance">🚑</span>
                    </div>
                    <p className="text-sm">Call Ambulance</p>
                </div>
            </div>

            {/* For mobile view */}
            <div className="md:hidden">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg"
                >
                    ☰
                </button>

                {menuOpen && (
                    <div className="absolute bg-white rounded-lg shadow-lg mt-2 p-4 space-y-4 w-40 right-4 top-16">
                        <div className="flex flex-col text-center items-center justify-center">
                            <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center text-lg mb-2">
                                <span>{hospital.beds?.length || 'N/A'}</span>
                            </div>
                            <p className="text-sm">Available Beds</p>
                        </div>
                        <div className="flex flex-col text-center items-center justify-center">
                            <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center mb-2">
                                <img
                                    className="w-8 h-8"
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2JN2kb7prRHCCV0w3f94ImUNCxynGCeOYiQ&s"
                                    alt="Reserve Bed"
                                />
                            </div>
                            <p className="text-sm">Reserve Bed</p>
                        </div>
                        <div className="flex flex-col text-center items-center justify-center">
                            <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center mb-2">
                                <img
                                    className="w-8 h-8"
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiEki7AnktD9BYXtKqziv3msZEVk_kOBlK8A&s"
                                    alt="Directions"
                                />
                            </div>
                            <p className="text-sm">Directions & Navigation</p>
                        </div>
                        <div className="flex flex-col text-center items-center justify-center">
                            <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center text-lg mb-2">
                                <span role="img" aria-label="ambulance">🚑</span>
                            </div>
                            <p className="text-sm">Call Ambulance</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
        )}
        
          {selectedHospitalId && (
                <HospitalDetails id={hospital.hospital.id} />
            )}
        </div>
        
    );
};

export default HospitalCard;
