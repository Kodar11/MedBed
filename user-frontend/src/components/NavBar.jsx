import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios'; // Import axios for API requests

function NavBar() {
    const [screenSize, setScreenSize] = useState(window.innerWidth);
    const navigate = useNavigate(); // Initialize navigate for redirection

    useEffect(() => {
        // Function to update the screen size
        const handleResize = () => setScreenSize(window.innerWidth);

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Handle log out functionality
    const handleLogOut = async () => {
        try {
            // Send a logout request to the server
            await axios.post('http://localhost:3000/api/v1/users/logout', {}, { withCredentials: true });
        } catch (error) {
            console.error('Error logging out:', error);
        }

        // Clear session and local storage
        sessionStorage.clear();
        localStorage.clear();

        // Manage browser history to prevent going back to protected pages
    
        // window.onpopstate = function () {
        //     history.go(1);
        // };

        // Redirect user to the login page
        navigate("/login");
    };

    return (
        <>
            {screenSize > 600 && (
                <nav className="w-full p-4 flex justify-between bg-trust-color text-white">
                    <div className="flex justify-between gap-6 items-center">
                        <div className="text-xl font-semibold">MedBed</div>
                        <div className="flex gap-4 font-medium cursor-pointer">
                            <Link to="/reservations">Reservations</Link>
                            <div onClick={handleLogOut} className="cursor-pointer">Logout</div> {/* Trigger logout on click */}
                        </div>
                    </div>
                    <div>
                        <form className="flex items-center gap-2">
                            <div className='w-full'>
                                <input
                                    type="text"
                                    className="px-2 py-1 text-black bg-white rounded-sm "
                                    placeholder="Search..."
                                />
                            </div>
                            <div>
                                <button type="submit">
                                    <svg
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </nav>
            )}

            {screenSize <= 600 && (
                <div>
                    <nav className="w-full p-4 bg-trust-color text-white">
                        <div className="flex justify-between gap-6 items-center">
                            <div className="text-xl font-semibold">MedBed</div>
                            <div className="flex gap-4 font-medium cursor-pointer">
                                <Link to="/reservations">Reservations</Link>
                                <div onClick={handleLogOut} className="cursor-pointer">Logout</div> {/* Trigger logout on click */}
                            </div>
                        </div>
                    </nav>
                    <div className="p-4"> 
                        <form className="flex items-center gap-4 w-full">
                            <input
                                type="text"
                                className="flex-grow px-2 py-1 text-black bg-white rounded-sm outline outline-sky-500"
                                placeholder="Search..."
                            />
                            <button type="submit" className="flex-shrink-0">
                                <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default NavBar;
