import React, { useState, useEffect } from "react";
import logo from "./logo.png";
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    // Removed unused variable 'lastScrollY'

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          
          // Only update state if we've passed the threshold or come back above it
          if ((scrollPosition > 300 && !scrolled) || (scrollPosition <= 300 && scrolled)) {
            setScrolled(scrollPosition > 300);
          }
          
          lastScrollY = scrollPosition;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const menuHeight = '500px';

  return (
    <div>
  <div className={`fixed transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] z-50 flex items-center box-border ${
    scrolled 
      ? 'bg-slate-950 backdrop-blur-lg rounded-none top-0 left-0 w-full h-20 px-4 md:px-8 lg:px-12' 
      : 'bg-black bg-opacity-20 backdrop-blur-md rounded-3xl w-[80%] md:w-[90%] lg:w-[80%] top-6 left-1/2 -translate-x-1/2 h-[60px] md:h-[70px] lg:h-[80px] px-4 md:px-8 lg:px-12'
  }`}>
    {/* Logo */}
      <div className="flex items-center h-full flex-shrink-0">
        <img src={logo} alt="Logo" className="w-[90px] md:w-[120px] lg:w-[150px] max-h-[80px] md:max-h-[100px] lg:max-h-[120px] object-contain" />
      </div>

      <div className="hidden md:flex items-center space-x-6 absolute left-1/2 -translate-x-1/2 top-1/2 text-white font-semibold -translate-y-1/2 z-20 h-[40px] ">
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
        <NavLink to="/workshop" className={({ isActive }) => isActive ? 'px-4 py-2 rounded-lg bg-[#00f5d4] text-black font-bold' : 'px-4 py-2 rounded-lg bg-[#00f5d4] text-black font-bold'}>
        Workshop
        </NavLink>
      </div>

      {/* Hamburger/Cross Button */}
        <button
          id="menu-toggle"
          className={`md:hidden focus:outline-none absolute z-20 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] right-[5%] top-1/2 -translate-y-1/2 text-white`}
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
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

  {/* Join Us Button removed */}
      </div>

      {/* Navbar for Menu */}
      <nav
        className={`flex flex-col text-white fixed z-40 shadow-lg transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] md:hidden ${
          scrolled
            ? 'bg-slate-950 backdrop-blur-lg w-full top-20 left-0 rounded-none overflow-hidden'
            : 'bg-black bg-opacity-20 backdrop-blur-md rounded-3xl w-[80%] top-6 left-1/2 -translate-x-1/2 overflow-hidden'
        }
        ${isMenuOpen ? `max-h-[${menuHeight}]` : scrolled ? 'max-h-20' : 'max-h-[60px]'} ${!scrolled ? 'pt-[60px]' : 'pt-0'}`}
      >
        {/* Menu Links */}
        <div
          className={`relative w-full md:w-auto transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${isMenuOpen 
              ? 'max-h-[400px] opacity-100 py-4 pointer-events-auto' 
              : 'max-h-0 opacity-0 py-0 pointer-events-none'} 
            overflow-hidden`}
        >
          <div
            className={`flex flex-col items-center font-semibold space-y-4 text-white`}
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
              className={({ isActive }) => isActive ? 'text-[#ab49f6] underline underline-offset-8 font-bold' : ''}
            >
              Team
            </NavLink>
            <NavLink
              to="/gallery"
              onClick={toggleMenu}
              className={({ isActive }) => isActive ? 'text-[#ab49f6] underline underline-offset-8 font-bold' : ''}
            >
              Gallery
            </NavLink>
            <NavLink
              to="/about"
              onClick={toggleMenu}
              className={({ isActive }) => isActive ? 'text-[#ab49f6] underline underline-offset-8 font-bold' : ''}
            >
              About
            </NavLink>
            <NavLink
              to="/workshop"
              onClick={toggleMenu}
              className={({ isActive }) => isActive ? 'text-[#00f5d4] underline underline-offset-8 font-bold' : ''}
            >
              Workshop
            </NavLink>
            <NavLink
              to="/contact"
              onClick={toggleMenu}
              className={({ isActive }) => isActive ? 'text-[#ab49f6] underline underline-offset-8 font-bold' : ''}
            >
              Contact
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;