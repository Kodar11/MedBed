import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import {Navigate, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const navigate = useNavigate()

  const handleNav = () => {
    setNav(!nav);
  };

  const navItems = [
    { id: 1, text: 'Home' },
    { id: 4, text: 'About' },
    { id: 5, text: 'Contact' },
  ];

  const handleSubmit = () => {
    navigate("/hospital-login")
  }

  return (
    <div className='bg-[#0069d9] flex justify-between items-center h-20 max-w-screen mx-auto px-4 text-white'>
      {/* Logo */}
      <h1 className='w-full text-3xl font-bold text-[#ffffff]'>MedBed</h1>

      {/* Desktop Navigation */}
      <ul className='hidden md:flex'>
        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 hover:bg-[#fdfdff] rounded-3xl m-2 cursor-pointer duration-300 hover:text-black '
          >
            {item.text}
          </li>
        ))}
      </ul>
      <button className='p-4 hover:bg-[#fdfdff] rounded-3xl m-2 cursor-pointer duration-300 hover:text-black' onClick={handleSubmit}>Login</button>
      <div>
        <input type="text" className="h-12 m-4 max-sm:w-3/4 max-md:w-2/3 rounded-lg p-2 text-black" placeholder="Search Hospitals" />
      </div>
      

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className='block md:hidden'>
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-blue-500 ease-in-out duration-500'
            : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
        }
      >
        {/* Mobile Logo */}
        <h1 className='w-full text-3xl font-bold text-[#ffffff] m-4'>REACT.</h1>

        {/* Mobile Navigation Items */}
        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 border-b rounded-xl hover:bg-[#354a9271] duration-300 hover:text-black cursor-pointer border-gray-600'
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;