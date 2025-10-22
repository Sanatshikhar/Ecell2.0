import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import pb from "../lib/pocketbase";
import logo from "./logo.png";


const RegistrationForm = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      // Check for duplicate email in PocketBase
      const existing = await pb.collection('joiningReg2025').getList(1, 1, { filter: `email="${data.email}"` });
      if (existing.items.length > 0) {
        alert("This email is already registered.");
        setLoading(false);
        return;
      }

      // If file is present, send as multipart
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "idProof" && value && value[0]) {
          formData.append(key, value[0]);
        } else {
          formData.append(key, value);
        }
      });
      formData.append('mailSent', 'false');

      const record = await pb.collection('joiningReg2025').create(formData);

      // Send email using Node.js backend (nodemailer)
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      let emailSuccess = false;
      try {
        const requestBody = { to: data.email, name: data.name };
        const res = await fetch(`${backendUrl}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        if (res.ok) {
          emailSuccess = true;
        }
      } catch (emailErr) {
        console.error("Email error:", emailErr);
      }

      // If email sent successfully, update mailSent to true
      if (emailSuccess && record && record.id) {
        await pb.collection('joiningReg2025').update(record.id, { mailSent: true });
      }

      setShowSuccess(true);
      reset();
    } catch (err) {
      alert("Error submitting registration: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-[999] min-h-screen font-sans overflow-y-auto flex flex-col items-center justify-start px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 bg-black" style={{backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)'}}>
        {/* Responsive Blue radial balls in corners */}
        <svg className="absolute top-2 left-2 sm:top-4 sm:left-4 w-[35vw] h-[35vw] sm:w-[28vw] sm:h-[28vw] lg:w-[25vw] lg:h-[25vw] min-w-[200px] min-h-[200px] max-w-[420px] max-h-[420px] opacity-40 z-0 pointer-events-none select-none" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="150" fill="url(#paint0_radial_contact)" />
          <defs>
            <radialGradient id="paint0_radial_contact" cx="0" cy="0" r="1" gradientTransform="translate(150 150) scale(150)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7F5AF0" stopOpacity="0.7" />
              <stop offset="1" stopColor="#232946" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <svg className="absolute bottom-0 right-0 w-[45vw] h-[30vw] sm:w-[52vw] sm:h-[38vw] lg:w-[45vw] lg:h-[35vw] min-w-[300px] min-h-[200px] max-w-[800px] max-h-[600px] opacity-30 z-0 pointer-events-none select-none" viewBox="0 0 330 260" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="165" cy="130" rx="165" ry="120" fill="url(#paint1_radial_contact)" />
          <defs>
            <radialGradient id="paint1_radial_contact" cx="0" cy="0" r="1" gradientTransform="translate(165 130) scale(165 120)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7F5AF0" stopOpacity="0.5" />
              <stop offset="1" stopColor="#232946" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        {/* Responsive close button */}
        <button
          className="fixed top-3 right-4 sm:top-6 sm:right-8 text-white hover:text-blue-200 text-3xl sm:text-4xl lg:text-4xl font-bold z-[1000] transition-colors duration-200 touch-manipulation"
          onClick={onClose}
          aria-label="Close"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
        >
          &times;
        </button>
        {/* Responsive container */}
        <div className="w-full max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto p-3 sm:p-6 lg:p-8 flex flex-col items-center justify-center mt-8 sm:mt-12 lg:mt-16 mb-4 sm:mb-8 z-10">
          <h2 className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-extrabold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] bg-clip-text text-transparent tracking-tight mb-4 sm:mb-6 lg:mb-8" style={{fontFamily: 'Montserrat, sans-serif'}}>Join Us</h2>
          <form className="space-y-3 sm:space-y-4 lg:space-y-6 w-full flex flex-col items-center" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 w-full max-w-sm sm:max-w-lg lg:max-w-4xl mx-auto">
              {/* Name */}
              <div className="flex flex-col w-full">
                <label className="block font-semibold mb-1 sm:mb-2 text-white w-full text-left text-sm sm:text-base">Name</label>
                <input {...register("name", { required: true })} type="text" className="w-full px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 border border-blue-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder:text-gray-400 shadow-md transition-all duration-200 text-sm sm:text-base" placeholder="Your Name" />
                {errors.name && <span className="text-red-400 text-xs sm:text-sm mt-1">Name is required</span>}
              </div>
              {/* Email */}
              <div className="flex flex-col w-full">
                <label className="block font-semibold mb-1 sm:mb-2 text-white w-full text-left text-sm sm:text-base">Email</label>
                <input {...register("email", { required: true })} type="email" className="w-full px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 border border-blue-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder:text-gray-400 shadow-md transition-all duration-200 text-sm sm:text-base" placeholder="Your Email" />
                {errors.email && <span className="text-red-400 text-xs sm:text-sm mt-1">Email is required</span>}
              </div>
              {/* Course/Branch */}
              <div className="flex flex-col w-full">
                <label className="block font-semibold mb-1 sm:mb-2 text-white w-full text-left text-sm sm:text-base">Course/Branch</label>
                <input {...register("course", { required: true })} type="text" className="w-full px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 border border-blue-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder:text-gray-400 shadow-md transition-all duration-200 text-sm sm:text-base" placeholder="Course/Branch" />
                {errors.course && <span className="text-red-400 text-xs sm:text-sm mt-1">Course/Branch is required</span>}
              </div>
              {/* Registration/Application Number */}
              <div className="flex flex-col w-full">
                <label className="block font-semibold mb-1 sm:mb-2 text-white w-full text-left text-sm sm:text-base">Registration/Application Number</label>
                <input {...register("regNo", { required: true })} type="text" className="w-full px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 border border-blue-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder:text-gray-400 shadow-md transition-all duration-200 text-sm sm:text-base" placeholder="Reg/Application No." />
                {errors.regNo && <span className="text-red-400 text-xs sm:text-sm mt-1">Reg/Application No. is required</span>}
              </div>
              {/* Phone Number */}
              <div className="flex flex-col w-full">
                <label className="block font-semibold mb-1 sm:mb-2 text-white w-full text-left text-sm sm:text-base">Phone Number</label>
                <input {...register("phone", { required: true })} type="tel" className="w-full px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 border border-blue-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder:text-gray-400 shadow-md transition-all duration-200 text-sm sm:text-base" placeholder="Phone Number" />
                {errors.phone && <span className="text-red-400 text-xs sm:text-sm mt-1">Phone Number is required</span>}
              </div>
              {/* Team Preference */}
              <div className="flex flex-col w-full">
                <label className="block font-semibold mb-1 sm:mb-2 text-white w-full text-left text-sm sm:text-base">Team Preference</label>
                <select {...register("team", { required: true })} className="w-full px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 border border-blue-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 shadow-md transition-all duration-200 text-sm sm:text-base">
                  <option value="">Select Team</option>
                  <option value="Technical Team">Technical Team</option>
                  <option value="Design Team">Design Team</option>
                  <option value="Media Team">Media Team</option>
                  <option value="Event-Management Team">Event-Management Team</option>
                  <option value="Content Team">Content Team</option>
                  <option value="Public-Relations Team">Public-Relations Team</option>
                  <option value="Operations Team">Operations Team</option>
                  <option value="Marketing & Sponsorships Team">Marketing & Sponsorships Team</option>
                </select>
                {errors.team && <span className="text-red-400 text-xs sm:text-sm mt-1">Team is required</span>}
              </div>
              {/* Campus */}
              <div className="flex flex-col w-full">
                <label className="block font-semibold mb-1 sm:mb-2 text-white w-full text-left text-sm sm:text-base">Campus</label>
                <select {...register("campus", { required: true })} className="w-full px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 border border-blue-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 shadow-md transition-all duration-200 text-sm sm:text-base">
                  <option value="">Select Campus</option>
                  <option value="Campus 1">Campus 1</option>
                  <option value="Campus 2">Campus 2</option>
                  <option value="Campus 4">Campus 4</option>
                </select>
                {errors.campus && <span className="text-red-400 text-xs sm:text-sm mt-1">Campus is required</span>}
              </div>
              {/* File Upload - Full width on mobile */}
              <div className="flex flex-col w-full lg:col-span-2">
                <label className="block font-semibold mb-1 sm:mb-2 text-white w-full text-left text-sm sm:text-base">Upload Image/College ID</label>
                <div className="relative w-full max-w-md lg:max-w-lg mx-auto">
                  <input {...register("idProof", { required: true })}
                    type="file"
                    accept="image/*,.pdf"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 border border-blue-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-white file:bg-black file:text-blue-400 file:border-0 file:rounded-lg file:font-semibold file:cursor-pointer file:px-2 file:py-1 file:mr-2 shadow-md transition-all duration-200 text-sm sm:text-base"
                  />
                </div>
                {errors.idProof && <span className="text-red-400 text-xs sm:text-sm mt-1 text-center">Upload your ID/College Image</span>}
              </div>
            </div>
            <button type="submit" className="w-full max-w-xs sm:max-w-sm lg:max-w-md bg-blue-800 text-white py-3 sm:py-4 lg:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg lg:text-xl shadow-lg border border-cyan-700 hover:bg-blue-900 hover:scale-105 active:scale-95 transition transform mt-4 sm:mt-6 lg:mt-8 touch-manipulation" disabled={loading}>{loading ? 'Submitting...' : 'Register'}</button>
          </form>
        </div>
        {/* Responsive Success Popup Modal */}
        {showSuccess && (
          <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black bg-opacity-60 p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 max-w-xs sm:max-w-md lg:max-w-lg w-full mx-auto text-center">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-3 sm:mb-4">Registration Successful!</h3>
              <p className="text-base sm:text-lg lg:text-xl text-gray-800 mb-4 sm:mb-6">For further information, check your mail.</p>
              <button
                className="bg-blue-600 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full font-bold hover:bg-blue-700 transition text-sm sm:text-base lg:text-lg touch-manipulation"
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
