import React, { useState, useEffect } from 'react';

function Card() {
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

    // return (
    //     <>  
    //         {screenSize > 600 && (
    //             <section id="Card" className='m-4'>
    //                 <div className='h-[150px] flex justify-between outline outline-gray-400'>
    //                     <div>Ushahkal Abhinav Multisuperspeciality Hospital
    //                         Dhamni Road, Sangli 416416, India
    //                         Phone: 7045757623
    //                         Hours: Open 24 hours
    //                         4.8                1,660 Google reviews
    //                     </div>
    //                     <div className='flex gap-4  '>
    //                         <div>
    //                             <div></div>
    //                             <div>Available Beds</div>
    //                         </div>
    //                         <div>
    //                             <div></div>
    //                             <div>Reserve Beds</div>
    //                         </div>
    //                         <div>
    //                             <div></div>
    //                             <div>Directions & Navigation</div>
    //                         </div>
    //                         <div>
    //                             <div></div>
    //                             <div>Call Ambulance</div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </section>
    //         )}
    //         {screenSize < 600 && (
    //             <section id="Card">
    //                 <div className='flex'>
    //                     <div>Hospital Info</div>
    //                     <div className='flex gap-4'>
    //                         <div>
    //                             <div></div>
    //                             <div>Available Beds</div>
    //                         </div>
    //                         <div>
    //                             <div></div>
    //                             <div>Reserve Beds</div>
    //                         </div>
    //                         <div>
    //                             <div></div>
    //                             <div>Directions & Navigation</div>
    //                         </div>
    //                         <div>
    //                             <div></div>
    //                             <div>Call Ambulance</div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </section>
    //         )}
    //     </>
    // );


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
            <div className="hidden md:flex flex-1 justify-between items-center space-x-4">
                <div className="flex flex-col text-center items-center justify-center">
                    <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center text-lg mb-2">
                        <span>10</span>
                    </div>
                    <p className="text-sm">Available Beds</p>
                </div>
                <div className="flex flex-col justify-around items-center">
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
                            <style>
                                {`
          .st12{fill:#fff}
          .st17{fill:none;stroke:#000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}
          .st18{opacity:.3}
        `}
                            </style>
                            <g id="Vector">
                                <path d="M57.62 40.94v10c-.23.05-.47.07-.72.07H8.26a3.8 3.8 0 0 1-2.17-.68v-8.78a3.8 3.8 0 0 1 2.17-.68h48.63c.26 0 .5.03.73.07z" style={{ fill: '#47c8f5' }} />
                                <path d="M19.54 36.96v2.69c0 .43-.06.84-.16 1.22H8.26c-.8 0-1.55.25-2.17.68v-9.34h8.72c2.6.01 4.73 2.13 4.73 4.75z" style={{ fill: '#ffc613' }} />
                                <path style={{ fill: '#c52026' }} d="M46.59 12.65v8.69h-9.28v9.28h-8.69v-9.28h-9.28v-8.69h9.28V3.38h8.69v9.27z" />
                            </g>
                            <g id="Line">
                                <path className="st17" d="M57.62 40.94v10c-.23.05-.47.07-.72.07H8.26a3.8 3.8 0 0 1-2.17-.68v-8.78a3.8 3.8 0 0 1 2.17-.68h48.63c.26 0 .5.03.73.07z" />
                                <path className="st17" d="M19.54 36.96v2.69c0 .43-.06.84-.16 1.22H8.26c-.8 0-1.55.25-2.17.68v-9.34h8.72c2.6.01 4.73 2.13 4.73 4.75zM5.65 22.88V58.6M57.62 34.45V58.6M46.59 12.65v8.69h-9.28v9.28h-8.69v-9.28h-9.28v-8.69h9.28V3.38h8.69v9.27z" />
                            </g>
                            <g className="st18" id="shadow">
                                <path d="M57.62 50.95v-10c-.23-.05-.47-.07-.72-.07H39.2v10.14h17.7c.25-.01.49-.03.72-.07zM39.19 12.65h7.4v8.69h-7.4z" />
                            </g>
                            <g className="st18" id="Highligth">
                                <path className="st12" d="M4.81 50.95v-10c.23-.05.47-.07.72-.07h17.7v10.14H5.53a5.49 5.49 0 0 1-.72-.07zM15.84 12.65h9.56v8.69h-9.56z" />
                            </g>
                        </svg>
                    </div>
                    <p className="text-sm text-center">Reserve Bed</p>
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

                                <p className="text-sm text-center">Directions & Navigation</p>
                            </div>

                
                <div className="flex flex-col text-center items-center justify-center">
                    <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center text-lg mb-2">
                        <span role="img" aria-label="ambulance">🚑</span>
                    </div>
                    <p className="text-sm">Call Ambulance</p>
                </div>
            </div>

            {/* For mobile view */}
            <div className="">


                {false && (
                    <div className="rounded-lg shadow-lg">
                        <div className="flex justify-evenly">
                            <div className="flex justify-around items-center">
                                <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center text-lg">
                                    <span>10</span>
                                </div>
                                <p className="text-sm text-center">Available Beds</p>
                            </div>

                            <div className="flex justify-around items-center">
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
                                        <style>
                                            {`
          .st12{fill:#fff}
          .st17{fill:none;stroke:#000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}
          .st18{opacity:.3}
        `}
                                        </style>
                                        <g id="Vector">
                                            <path d="M57.62 40.94v10c-.23.05-.47.07-.72.07H8.26a3.8 3.8 0 0 1-2.17-.68v-8.78a3.8 3.8 0 0 1 2.17-.68h48.63c.26 0 .5.03.73.07z" style={{ fill: '#47c8f5' }} />
                                            <path d="M19.54 36.96v2.69c0 .43-.06.84-.16 1.22H8.26c-.8 0-1.55.25-2.17.68v-9.34h8.72c2.6.01 4.73 2.13 4.73 4.75z" style={{ fill: '#ffc613' }} />
                                            <path style={{ fill: '#c52026' }} d="M46.59 12.65v8.69h-9.28v9.28h-8.69v-9.28h-9.28v-8.69h9.28V3.38h8.69v9.27z" />
                                        </g>
                                        <g id="Line">
                                            <path className="st17" d="M57.62 40.94v10c-.23.05-.47.07-.72.07H8.26a3.8 3.8 0 0 1-2.17-.68v-8.78a3.8 3.8 0 0 1 2.17-.68h48.63c.26 0 .5.03.73.07z" />
                                            <path className="st17" d="M19.54 36.96v2.69c0 .43-.06.84-.16 1.22H8.26c-.8 0-1.55.25-2.17.68v-9.34h8.72c2.6.01 4.73 2.13 4.73 4.75zM5.65 22.88V58.6M57.62 34.45V58.6M46.59 12.65v8.69h-9.28v9.28h-8.69v-9.28h-9.28v-8.69h9.28V3.38h8.69v9.27z" />
                                        </g>
                                        <g className="st18" id="shadow">
                                            <path d="M57.62 50.95v-10c-.23-.05-.47-.07-.72-.07H39.2v10.14h17.7c.25-.01.49-.03.72-.07zM39.19 12.65h7.4v8.69h-7.4z" />
                                        </g>
                                        <g className="st18" id="Highligth">
                                            <path className="st12" d="M4.81 50.95v-10c.23-.05.47-.07.72-.07h17.7v10.14H5.53a5.49 5.49 0 0 1-.72-.07zM15.84 12.65h9.56v8.69h-9.56z" />
                                        </g>
                                    </svg>
                                </div>
                                <p className="text-sm text-center">Reserve Bed</p>
                            </div>



                            <div className="flex justify-around items-center">
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

                                <p className="text-sm text-center">Directions & Navigation</p>
                            </div>

                            <div className="flex justify-around items-center">
                                <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center text-lg">
                                    <span role="img" aria-label="ambulance">🚑</span>
                                </div>
                                <p className="text-sm text-center">Call Ambulance</p>
                            </div>
                        </div>
                    </div>

                )}
            </div>
        </div>
    );

}

export default Card;
