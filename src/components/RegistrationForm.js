import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import pb from "../lib/pocketbase";
import logo from "./logo.png";


const RegistrationForm = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [showSuccess, setShowSuccess] = useState(false);

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

  const onSubmit = async (data) => {
    try {
      // If file is present, send as multipart
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "idCard" && value && value[0]) {
          formData.append(key, value[0]);
        } else {
          formData.append(key, value);
        }
      });
      await pb.collection('Reg').create(formData);

      // Send email using Node.js backend (nodemailer)
      try {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        await fetch(`${backendUrl}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: data.email, name: data.name })
        });
      } catch (emailErr) {
        console.error("Email error:", emailErr);
      }

      setShowSuccess(true);
      reset();
    } catch (err) {
      alert("Error submitting registration: " + err.message);
    }
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-[999] min-h-screen font-sans overflow-y-auto flex flex-col items-center justify-center px-2 sm:px-4 py-4 bg-black" style={{backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)'}}>
        {/* Blue radial balls in corners, matching Contact page */}
        <svg className="absolute top-4 left-4 w-[28vw] h-[28vw] min-w-[260px] min-h-[260px] max-w-[420px] max-h-[420px] opacity-40 z-0 pointer-events-none select-none" style={{inset: '1.5rem auto auto 1.5rem'}} viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="150" fill="url(#paint0_radial_contact)" />
          <defs>
            <radialGradient id="paint0_radial_contact" cx="0" cy="0" r="1" gradientTransform="translate(150 150) scale(150)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7F5AF0" stopOpacity="0.7" />
              <stop offset="1" stopColor="#232946" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <svg className="absolute bottom-0 right-0 w-[52vw] h-[38vw] min-w-[480px] min-h-[320px] max-w-[800px] max-h-[600px] opacity-30 z-0 pointer-events-none select-none" style={{inset: 'auto 0 0 auto'}} viewBox="0 0 330 260" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="165" cy="130" rx="165" ry="120" fill="url(#paint1_radial_contact)" />
          <defs>
            <radialGradient id="paint1_radial_contact" cx="0" cy="0" r="1" gradientTransform="translate(165 130) scale(165 120)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7F5AF0" stopOpacity="0.5" />
              <stop offset="1" stopColor="#232946" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <button
          className="fixed top-6 right-8 text-white hover:text-blue-200 text-4xl font-bold z-[1000] transition-colors duration-200"
          onClick={onClose}
          aria-label="Close"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
        >
          &times;
        </button>
        <div className="w-full max-w-md sm:max-w-4xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center mt-4 sm:mt-16 mb-4 sm:mb-8 z-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] bg-clip-text text-transparent tracking-tight mb-6 sm:mb-8" style={{fontFamily: 'Montserrat, sans-serif'}}>Join Us</h2>
          <form className="space-y-4 sm:space-y-6 w-full flex flex-col items-center" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-md sm:max-w-2xl mx-auto">
              {/* Name */}
              <div className="flex flex-col w-full">
                <label className="block font-semibold mb-1 text-white w-full text-left px-4 sm:px-0">Name</label>
                <input {...register("name", { required: true })} type="text" className="w-full max-w-xs sm:w-80 px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400  text-black placeholder:text-gray-400 shadow-md transition-all duration-200 mx-auto" placeholder="Your Name" />
                {errors.name && <span className="text-red-400 text-xs">Name is required</span>}
              </div>
              {/* Email */}
              <div className="flex flex-col w-full">
                <label className="block font-semibold mb-1 text-white w-full text-left px-4 sm:px-0">Email</label>
                <input {...register("email", { required: true })} type="email" className="w-full max-w-xs sm:w-80 px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400  text-black placeholder:text-gray-400 shadow-md transition-all duration-200 mx-auto" placeholder="Your Email" />
                {errors.email && <span className="text-red-400 text-xs">Email is required</span>}
              </div>
              {/* Course/Branch */}
              <div className="flex flex-col w-full">
                <label className="block font-semibold mb-1 text-white w-full text-left px-4 sm:px-0">Course/Branch</label>
                <input {...register("course", { required: true })} type="text" className="w-full max-w-xs sm:w-80 px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400  text-black placeholder:text-gray-400 shadow-md transition-all duration-200 mx-auto" placeholder="Course/Branch" />
                {errors.course && <span className="text-red-400 text-xs">Course/Branch is required</span>}
              </div>
              {/* Registration/Application Number */}
              <div className="flex flex-col w-full">
                <label className="block font-semibold mb-1 text-white w-full text-left px-4 sm:px-0">Registration/Application Number</label>
                <input {...register("regNo", { required: true })} type="text" className="w-full max-w-xs sm:w-80 px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400  text-black placeholder:text-gray-400 shadow-md transition-all duration-200 mx-auto" placeholder="Reg/Application No." />
                {errors.regNo && <span className="text-red-400 text-xs">Reg/Application No. is required</span>}
              </div>
              {/* Phone Number */}
              <div className="flex flex-col w-full">
                <label className="block font-semibold mb-1 text-white w-full text-left px-4 sm:px-0">Phone Number</label>
                <input {...register("phone", { required: true })} type="tel" className="w-full max-w-xs sm:w-80 px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400  text-black placeholder:text-gray-400 shadow-md transition-all duration-200 mx-auto" placeholder="Phone Number" />
                {errors.phone && <span className="text-red-400 text-xs">Phone Number is required</span>}
              </div>
              {/* Team Preference */}
              <div className="flex flex-col w-full">
                <label className="block font-semibold mb-1 text-white w-full text-left px-4 sm:px-0">Team Preference</label>
                <select {...register("team", { required: true })} className="w-full max-w-xs sm:w-80 px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400  text-gray-800 shadow-md transition-all duration-200 mx-auto">
                  <option value="">Select Team</option>
                  <option value="Tech">Tech</option>
                  <option value="Management">Management</option>
                  <option value="Design">Design</option>
                  <option value="Content">Content</option>
                  <option value="Other">Other</option>
                </select>
                {errors.team && <span className="text-red-400 text-xs">Team is required</span>}
              </div>
              {/* Campus */}
              <div className="flex flex-col w-full">
                <label className="block font-semibold mb-1 text-white w-full text-left px-4 sm:px-0">Campus</label>
                <input {...register("campus", { required: true })} type="text" className="w-full max-w-xs sm:w-80 px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400  text-black placeholder:text-gray-400 shadow-md transition-all duration-200 mx-auto" placeholder="Campus" />
                {errors.campus && <span className="text-red-400 text-xs">Campus is required</span>}
              </div>
              {/* File Upload */}
              <div className="flex flex-col w-full">
                <label className="block font-semibold mb-1 text-white w-full text-left px-4 sm:px-0">Upload Image/College ID</label>
                <div className="relative w-72 sm:w-80 mx-auto">
                  <input {...register("idCard", { required: true })}
                    type="file"
                    accept="image/*,.pdf"
                    className="w-full max-w-xs sm:w-80 px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400  text-white file:bg-black file:text-blue-400 file: file:border-0 file:rounded-xl file:font-semibold file:cursor-pointer shadow-md transition-all duration-200 mx-auto"
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="min-w-60 bg-blue-800 text-white py-3 sm:py-4 rounded-xl font-bold text-lg sm:text-xl shadow-lg border border-cyan-700 hover:bg-blue-900 hover:scale-105 transition mt-6 sm:mt-8">Register</button>
          </form>
        </div>
        {/* Success Popup Modal */}
        {showSuccess && (
          <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto text-center">
              <h3 className="text-2xl font-bold text-green-600 mb-4">Registration Successful!</h3>
              <p className="text-lg text-gray-800 mb-6">For further information, check your mail.</p>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition"
                onClick={() => { setShowSuccess(false); onClose(); }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>,
    document.body
  );

};

export default RegistrationForm;
