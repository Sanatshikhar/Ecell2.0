import React, { useState, useEffect } from "react";
import logo from "./logo.png";

const RegistrationForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    regNo: "",
    phone: "",
    team: "",
    campus: "",
    file: null,
  });


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert("Registration submitted!");
    onClose();
  };

  return (
  <div className="fixed inset-0 z-50 min-h-screen font-sans overflow-y-auto flex flex-col items-center justify-start px-2 sm:px-4 py-4 bg-gradient-to-br from-blue-800 via-purple-700 to-indigo-900 bg-fixed" style={{backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)'}}>
      <button
        className="fixed top-6 right-8 text-gray-500 hover:text-gray-700 text-4xl font-bold z-50"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>
  <div className="w-full max-w-md sm:max-w-4xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center mt-4 sm:mt-16 mb-4 sm:mb-8">
  <h2 className="text-2xl sm:text-4xl font-extrabold text-center text-blue-200 tracking-tight mb-6 sm:mb-8" style={{fontFamily: 'Montserrat, sans-serif'}}>Join Us Registration</h2>
        <form className="space-y-4 sm:space-y-6 w-full flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-md sm:max-w-2xl mx-auto">
            {/* Name */}
            <div className="flex flex-col w-full">
              <label className="block font-semibold mb-1 text-white w-full text-left px-4 sm:px-0">Name</label>
              <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full max-w-xs sm:w-80 px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-950 text-white placeholder:text-blue-400 shadow-md transition-all duration-200 mx-auto" placeholder="Your Name" required />
            </div>
            {/* Email */}
            <div className="flex flex-col w-full">
              <label className="block font-semibold mb-1 text-white w-full text-left px-4 sm:px-0">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full max-w-xs sm:w-80 px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-950 text-white placeholder:text-blue-400 shadow-md transition-all duration-200 mx-auto" placeholder="Your Email" required />
            </div>
            {/* Course/Branch */}
            <div className="flex flex-col w-full">
              <label className="block font-semibold mb-1 text-white w-full text-left px-4 sm:px-0">Course/Branch</label>
              <input name="course" type="text" value={formData.course} onChange={handleChange} className="w-full max-w-xs sm:w-80 px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-950 text-white placeholder:text-blue-400 shadow-md transition-all duration-200 mx-auto" placeholder="Course/Branch" required />
            </div>
            {/* Registration/Application Number */}
            <div className="flex flex-col w-full">
              <label className="block font-semibold mb-1 text-white w-full text-left px-4 sm:px-0">Registration/Application Number</label>
              <input name="regNo" type="text" value={formData.regNo} onChange={handleChange} className="w-full max-w-xs sm:w-80 px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-950 text-white placeholder:text-blue-400 shadow-md transition-all duration-200 mx-auto" placeholder="Reg/Application No." required />
            </div>
            {/* Phone Number */}
            <div className="flex flex-col w-full">
              <label className="block font-semibold mb-1 text-white w-full text-left px-4 sm:px-0">Phone Number</label>
              <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full max-w-xs sm:w-80 px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-950 text-white placeholder:text-blue-400 shadow-md transition-all duration-200 mx-auto" placeholder="Phone Number" required />
            </div>
            {/* Team Preference */}
            <div className="flex flex-col w-full">
              <label className="block font-semibold mb-1 text-white w-full text-left px-4 sm:px-0">Team Preference</label>
              <select name="team" value={formData.team} onChange={handleChange} className="w-full max-w-xs sm:w-80 px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-950 text-white shadow-md transition-all duration-200 mx-auto" required>
                <option value="">Select Team</option>
                <option value="Tech">Tech</option>
                <option value="Management">Management</option>
                <option value="Design">Design</option>
                <option value="Content">Content</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {/* Campus */}
            <div className="flex flex-col w-full">
              <label className="block font-semibold mb-1 text-white w-full text-left px-4 sm:px-0">Campus</label>
              <input name="campus" type="text" value={formData.campus} onChange={handleChange} className="w-full max-w-xs sm:w-80 px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-950 text-white placeholder:text-blue-400 shadow-md transition-all duration-200 mx-auto" placeholder="Campus" required />
            </div>
            {/* File Upload */}
            <div className="flex flex-col w-full">
              <label className="block font-semibold mb-1 text-white w-full text-left px-4 sm:px-0">Upload Image/College ID</label>
              <div className="relative w-72 sm:w-80 mx-auto">
                <input
                  name="file"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleChange}
                  className="w-full max-w-xs sm:w-80 px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-950 text-white file:text-blue-400 file:bg-blue-950 file:border-0 file:rounded-xl file:font-semibold file:cursor-pointer shadow-md transition-all duration-200 mx-auto"
                  required
                />
                {formData.file && (
                  <span className="block mt-2 text-xs text-blue-300">Selected: {formData.file.name}</span>
                )}
              </div>
            </div>
          </div>
          <button type="submit" className="w-full bg-cyan-500 text-white py-3 sm:py-4 rounded-xl font-bold text-lg sm:text-xl shadow-lg border border-cyan-700 hover:bg-cyan-700 hover:scale-105 transition mt-6 sm:mt-8">Register</button>
        </form>
      </div>
    </div>
  );

};

export default RegistrationForm;
