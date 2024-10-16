import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Assuming you're using axios for API calls

const HospitalCard = ({ hospital }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [screenSize, setScreenSize] = useState(window.innerWidth);
    const navigate = useNavigate(); 

    useEffect(() => {
        // Function to update the screen size on window resize
        const handleResize = () => setScreenSize(window.innerWidth);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (!hospital) {
        return <p>No hospital data available.</p>; // Handle case where no hospital data is passed
    }

    // Function to handle bed reservation click
    const handleReserveBedClick = async () => {
        try {
            const response = await axios.get('/api/auth/verify');
            if (response.status === 200) {
                navigate('/reserveBed');
            }
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                console.error("Error checking authentication", error);
            }
        }
    };

    // Function to handle navigation to hospital details
    const handleClick = () => {
        navigate(`/hospital-details/${hospital.hospital.id}`);
    };

    return (
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
            {screenSize > 600 && (
                <div className="flex justify-between items-center space-x-4">
                    <div className="flex flex-col text-center items-center justify-center">
                        <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center text-lg mb-2">
                            <span>{hospital.beds?.length || 'N/A'}</span>
                        </div>
                        <p className="text-sm">Available Beds</p>
                    </div>

                    {/* Reserve Bed Icon */}
                    <div className="flex flex-col justify-around items-center">
                        <div
                            className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center cursor-pointer"
                            onClick={handleReserveBedClick}  // Add click handler
                        >
                            <svg
                                version="1.1"
                                id="Layer_1"
                                xmlns="http://www.w3.org/2000/svg"
                                x="0"
                                y="0"
                                viewBox="0 0 64 64"
                                style={{ enableBackground: 'new 0 0 64 64' }}
                                xmlSpace="preserve"
                                className="w-8 h-8"
                            >
                                {/* SVG content for reserve bed */}
                            </svg>
                        </div>
                        <p className="text-sm text-center">Reserve</p>
                        <p className="text-sm text-center">Bed</p>
                    </div>

                    <div className="flex flex-col justify-around items-center">
                        <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 32 32"
                                className="w-8 h-8"
                                style={{ fill: "#262628" }}
                            >
                                <path d="M28.91 4.417l-11 24a1 1 0 0 1-1.907-.334l-.93-11.157-11.156-.93a1 1 0 0 1-.334-1.906l24-11a1 1 0 0 1 1.326 1.326z" />
                            </svg>
                        </div>
                        <p className="text-sm text-center">Directions</p>
                        <p className="text-sm text-center">Navigation</p>
                    </div>

                    <div className="flex flex-col text-center items-center justify-center">
                        <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center text-lg mb-2">
                            <span role="img" aria-label="ambulance">🚑</span>
                        </div>
                        <p className="text-sm">Call</p>
                        <p className="text-sm">Ambulance</p>
                    </div>
                </div>
            )}

            {/* For mobile view */}
            {screenSize <= 600 && (
                <div className="rounded-lg shadow-lg">
                    <div className="flex justify-evenly gap-4">
                        <div className="flex flex-col text-center items-center justify-center">
                            <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center text-lg mb-2">
                                <span>{hospital.beds?.length || 'N/A'}</span>
                            </div>
                            <p className="text-sm">Available Beds</p>
                        </div>

                        {/* Reserve Bed for mobile */}
                        <div className="flex flex-col justify-around items-center">
                        <div
                            className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center cursor-pointer"
                            onClick={handleReserveBedClick}  // Add click handler
                        >
                            <svg
                                version="1.1"
                                id="Layer_1"
                                xmlns="http://www.w3.org/2000/svg"
                                x="0"
                                y="0"
                                viewBox="0 0 64 64"
                                style={{ enableBackground: 'new 0 0 64 64' }}
                                xmlSpace="preserve"
                                className="w-8 h-8"
                            >
                                {/* SVG content for reserve bed */}
                            </svg>
                        </div>
                        <p className="text-sm text-center">Reserve</p>
                        <p className="text-sm text-center">Bed</p>
                    </div>

                    <div className="flex flex-col justify-around items-center">
                        <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 32 32"
                                className="w-8 h-8"
                                style={{ fill: "#262628" }}
                            >
                                <path d="M28.91 4.417l-11 24a1 1 0 0 1-1.907-.334l-.93-11.157-11.156-.93a1 1 0 0 1-.334-1.906l24-11a1 1 0 0 1 1.326 1.326z" />
                            </svg>
                        </div>
                        <p className="text-sm text-center">Directions</p>
                        <p className="text-sm text-center">Navigation</p>
                    </div>

                    <div className="flex flex-col text-center items-center justify-center">
                        <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center text-lg mb-2">
                            <span role="img" aria-label="ambulance">🚑</span>
                        </div>
                        <p className="text-sm">Call</p>
                        <p className="text-sm">Ambulance</p>
                    </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HospitalCard;
