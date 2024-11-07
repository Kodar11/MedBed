import React from 'react';
import { Link, useNavigate,useParams } from 'react-router-dom';
import axios from 'axios';

function NavBar() {
    const navigate = useNavigate();

    const {hospitalId} = useParams();

    const handleLogOut = async () => {
        try {
            await axios.post('https://medbed.onrender.com/api/v1/users/logout', {}, { withCredentials: true });
        } catch (error) {
            console.error('Error logging out:', error);
        }
        sessionStorage.clear();
        localStorage.clear();
        navigate("/");
    };

    const handleHome = () => {
        navigate(`/hospital-home/${hospitalId}`);
    };

    return (
        <nav className="w-full p-4 flex justify-between items-center bg-blue-500 text-white">
            <div className="text-2xl font-bold tracking-wide">MedBed</div>
            <div className="flex gap-6 font-medium cursor-pointer items-center">
                <div 
                    onClick={handleHome} 
                    className="transition duration-300 ease-in-out transform hover:scale-105 hover:text-blue-300"
                >
                    Home
                </div>
                
                <div 
                    onClick={handleLogOut} 
                    className="border border-blue-500 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md transform hover:scale-105"
                >
                    Logout
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
