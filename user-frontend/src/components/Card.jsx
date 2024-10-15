import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Assuming you're using react-router-dom for navigation
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie library
 
function Card() {
    const [screenSize, setScreenSize] = useState(window.innerWidth);
    const navigate = useNavigate();

    useEffect(() => {

        const accessToken = Cookies.get('accessToken'); // Use js-cookie to get the cookie
        console.log("Access Token from Cookies:", accessToken); // Log the access token

        // Function to update the screen size
        const handleResize = () => setScreenSize(window.innerWidth);

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Function to handle reserve bed click
    const handleReserveBedClick = async () => {
        try {

            // Check if the user is authenticated by calling your backend
            const response = await axios.get('/api/auth/verify');  // Adjust the endpoint as needed
            if (response.status === 200) {
                // User is authenticated, navigate to the reserve bed page
                navigate('/reserveBed');
            }
        } catch (error) {
            // If there's an error (401 Unauthorized), redirect to the login page
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                console.error("Error checking authentication", error);
            }
        }
    };

    return (
        <div className="bg-gradient-to-r from-blue-300 to-white rounded-lg p-6 max-w-4xl mx-auto my-4 shadow-lg flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex-2 text-center md:text-left ">
                <h2 className="text-xl md:text-2xl font-semibold mb-2 mr-4">
                    Ushahkal Abhinav Multisuperspeciality Hospital
                </h2>
                <p className="text-sm md:text-base mb-2">Dhamni Road, Sangli 416416, India</p>
                <p className="text-sm md:text-base mb-2"><strong>Phone:</strong> 7045757623</p>
                <p className="text-sm md:text-base mb-2"><strong>Hours:</strong> Open 24 hours</p>
                <p className="text-sm md:text-base mb-2">
                    <strong>4.8</strong> <span className="text-yellow-400">⭐</span> 1,660 Google reviews
                </p>
            </div>

            {/* For larger screens */}
            {screenSize > 600 &&
                (<div className="flex justify-between items-center space-x-4">

                    <div className="flex flex-col text-center items-center justify-center">
                        <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center text-lg mb-2">
                            <span>10</span>
                        </div>
                        <p className="text-sm">Available</p>
                        <p className="text-sm">Beds</p>
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
                </div>)
            }

            {/* For mobile view */}
            <div className="">
                {screenSize < 600 && (
                    <div className="rounded-lg shadow-lg">
                        <div className="flex justify-evenly gap-4">

                            <div className="flex flex-col text-center items-center justify-center">
                                <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center text-lg mb-2">
                                    <span>10</span>
                                </div>
                                <p className="text-sm">Available</p>
                                <p className="text-sm">Beds</p>
                            </div>


                            {/* Reserve Bed for mobile */}
                            <div
                                className="flex flex-col justify-center items-center"
                                onClick={handleReserveBedClick}  // Add click handler
                            >
                                <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center">
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
        </div>
    );
}

export default Card;
