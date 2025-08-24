import React, { useState } from "react";
import logo from "./logo.png";
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const menuHeight = '500px';

  return (
    <div>
  <div className="fixed bg-black bg-opacity-20 backdrop-blur-md rounded-3xl w-[80%] md:w-[90%] lg:w-[80%] top-6 left-1/2 -translate-x-1/2 h-[60px] md:h-[70px] lg:h-[80px] flex items-center z-50 box-border transition-none px-4 md:px-8 lg:px-12">
    {/* Logo */}
    <div className="flex items-center h-full flex-shrink-0">
      <img src={logo} alt="Logo" className="w-[90px] md:w-[120px] lg:w-[150px] max-h-[80px] md:max-h-[100px] lg:max-h-[120px] object-contain" />
    </div>

    {/* Menu Links (Tablet/Laptop/Big Screens) */}
    <div className="hidden md:flex items-center space-x-14 md:space-x-10 absolute left-1/2 -translate-x-1/2 top-1/2 text-white font-semibold -translate-y-1/2 z-20 h-[40px] ">
      <NavLink to="/" className={({ isActive }) => isActive ? 'text-[#ab49f6] underline underline-offset-8 font-bold' : ''} end>
        Home
      </NavLink>
      <NavLink to="/team" className={({ isActive }) => isActive ? 'text-[#ab49f6] underline underline-offset-8 font-bold' : ''}>
        Team
      </NavLink>
      <NavLink to="/gallery" className={({ isActive }) => isActive ? 'text-[#ab49f6] underline underline-offset-8 font-bold' : ''}>
        Gallery
      </NavLink>
      <NavLink to="/about" className={({ isActive }) => isActive ? 'text-[#ab49f6] underline underline-offset-8 font-bold' : ''}>
        About
      </NavLink>
      <NavLink to="/contact" className={({ isActive }) => isActive ? 'text-[#ab49f6] underline underline-offset-8 font-bold' : ''}>
        Contact
      </NavLink>
    </div>

    {/* Join Us Button (Tablet/Laptop/Big Screens) - right aligned */}
    <div className="hidden md:flex flex-shrink-0 items-center ml-auto">
      <Link
        to="/Join"
        className="bg-white h-[45px] w-[110px] md:w-[130px] lg:w-[150px] rounded-3xl text-black font-semibold text-center justify-center px-4 md:px-6 lg:px-8 items-center transition hover:bg-black hover:text-white hover:scale-105 border-white border-[1px] shadow-md focus:outline-none focus:ring-2 focus:ring-[#a259ff] flex"
        style={{fontSize:'1rem',letterSpacing:'0.02em',boxSizing:'border-box'}}
      >
        Resonance
      </Link>
    </div>

        {/* Hamburger/Cross Button */}
        <button
          id="menu-toggle"
          className="md:hidden focus:outline-none ml-auto text-black"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6 transition-opacity duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Navbar for Menu */}
      <nav
        className={`bg-white bg-opacity-20 backdrop-blur-md flex flex-col text-white fixed w-[80%] top-6 left-1/2 -translate-x-1/2 z-40 shadow-lg rounded-3xl md:h-[70px] md:pt-0 lg:h-[80px] lg:pt-0
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] 
          ${isMenuOpen ? `max-h-[${menuHeight}] pt-[60px]` : 'max-h-[60px] md:max-h-[70px] lg:max-h-[80px] pt-[60px]'}`}
      >
        {/* Menu Links */}
        <div
          className={`relative w-full md:w-auto transition-all 
            ${isMenuOpen 
              ? 'max-h-[400px] opacity-100 py-4 duration-300' 
              : 'max-h-0 opacity-0 duration-200'} 
            overflow-hidden md:max-h-none md:opacity-100 md:flex md:items-center md:space-x-6 md:justify-center md:py-0`}
        >
          <div
            className={`flex flex-col items-center text-black font-semibold space-y-4 ${isMenuOpen ? 'visible' : 'invisible'}`}
          >
            <NavLink
              to="/"
              onClick={toggleMenu}
              className={({ isActive }) => isActive ? 'text-[#ab49f6] underline underline-offset-8 font-bold' : ''}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/team"
              onClick={toggleMenu}
              className={({ isActive }) => isActive ? 'text-[#a259ff] underline underline-offset-8 font-bold' : ''}
            >
              Team
            </NavLink>
            <NavLink
              to="/gallery"
              onClick={toggleMenu}
              className={({ isActive }) => isActive ? 'text-[#a259ff] underline underline-offset-8 font-bold' : ''}
            >
              Gallery
            </NavLink>
            <NavLink
              to="/about"
              onClick={toggleMenu}
              className={({ isActive }) => isActive ? 'text-[#a259ff] underline underline-offset-8 font-bold' : ''}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              onClick={toggleMenu}
              className={({ isActive }) => isActive ? 'text-[#a259ff] underline underline-offset-8 font-bold' : ''}
            >
              Contact
            </NavLink>
            <Link
              to="/Join"
              className="bg-black text-white font-semibold py-2 px-6 rounded-3xl transition md:hidden w-full max-w-[220px] text-center shadow-md focus:outline-none focus:ring-2 focus:ring-[#a259ff]"
              style={{fontSize:'1rem',letterSpacing:'0.02em',marginTop:'8px'}}
              onClick={toggleMenu}
            >
              Resonance
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;