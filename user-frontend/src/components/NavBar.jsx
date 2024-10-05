import React, { useState, useEffect } from 'react';

function NavBar() {
    const [screenSize, setScreenSize] = useState(window.innerWidth);

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


    return (
        <>
            {screenSize > 600 && (
                <nav className="w-full p-4 flex justify-between bg-trust-color text-white">
                    <div className="flex justify-between gap-6 items-center">
                        <div className="text-xl font-semibold">MedBed</div>
                        <div className="flex gap-4 font-medium cursor-pointer">
                            <div>Home</div>
                            <div>Check Availability</div>
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

            {screenSize < 600 && (
                <div>
                    <nav className="w-full p-4 bg-trust-color text-white">
                        <div className="flex justify-between gap-6 items-center">
                            <div className="text-xl font-semibold">MedBed</div>
                            <div className="flex gap-4 font-medium cursor-pointer">
                                <div>Home</div>
                                <div>Check Availability</div>
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
