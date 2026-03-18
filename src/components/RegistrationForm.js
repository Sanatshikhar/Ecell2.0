import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import pb from "../lib/pocketbase";
// Removed unused import 'logo'


const RegistrationForm = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm(); // Removed unused 'watch'
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState([]);

  const teamOptions = [
    "Technical Team",
    "Design Team", 
    "Media Team",
    "Event-Management Team",
    "Content Team",
    "Public-Relations Team",
    "Operations Team",
    "Marketing & Sponsorships Team"
  ];

  const handleTeamSelection = (team) => {
    const newSelectedTeams = selectedTeams.includes(team)
      ? selectedTeams.filter(t => t !== team)
      : [...selectedTeams, team];
    
    setSelectedTeams(newSelectedTeams);
    setValue('team', newSelectedTeams);
  };

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.team-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Ensure team data is properly set from selectedTeams state
      if (selectedTeams.length === 0) {
        alert("Please select at least one team.");
        setLoading(false);
        return;
      }
      data.team = selectedTeams;

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
        } else if (key === "team" && Array.isArray(value)) {
          // PocketBase select field handles arrays natively
          value.forEach(team => formData.append('team', team));
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
      alert("Error submitting registration: ");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-[999] min-h-screen font-sans overflow-y-auto flex flex-col items-center justify-start px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4 md:py-6 lg:py-8 bg-black" style={{backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)'}}>
        {/* Responsive Blue radial balls in corners */}
        <svg className="absolute top-1 left-1 sm:top-2 sm:left-2 md:top-4 md:left-4 w-[30vw] h-[30vw] sm:w-[28vw] sm:h-[28vw] md:w-[25vw] md:h-[25vw] lg:w-[25vw] lg:h-[25vw] min-w-[200px] min-h-[200px] max-w-[420px] max-h-[420px] opacity-40 z-0 pointer-events-none select-none" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="150" fill="url(#paint0_radial_contact)" />
          <defs>
            <radialGradient id="paint0_radial_contact" cx="0" cy="0" r="1" gradientTransform="translate(150 150) scale(150)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7F5AF0" stopOpacity="0.7" />
              <stop offset="1" stopColor="#232946" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <svg className="absolute bottom-0 right-0 w-[40vw] h-[28vw] sm:w-[45vw] sm:h-[32vw] md:w-[52vw] md:h-[38vw] lg:w-[45vw] lg:h-[35vw] min-w-[250px] min-h-[180px] max-w-[800px] max-h-[600px] opacity-30 z-0 pointer-events-none select-none" viewBox="0 0 330 260" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          className="fixed top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-8 text-white hover:text-blue-200 text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold z-[1000] transition-colors duration-200 touch-manipulation"
          onClick={onClose}
          aria-label="Close"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
        >
          &times;
        </button>
        {/* Responsive container */}
        <div className="w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto p-2 sm:p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center mt-6 sm:mt-10 md:mt-12 lg:mt-16 mb-4 sm:mb-6 md:mb-8 z-10">
          <h2 className="text-lg sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] bg-clip-text text-transparent tracking-tight mb-3 sm:mb-5 md:mb-6 lg:mb-8" style={{fontFamily: 'Montserrat, sans-serif'}}>Join Us</h2>
          <form className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6 w-full flex flex-col items-center" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto">
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
                <input {...register("phone", { 
                  required: "Phone number is required",
                  pattern: {
                    value: /^(\+91|91|0)?[6-9]\d{9}$/,
                    message: "Please enter a valid Indian phone number"
                  },
                  minLength: {
                    value: 10,
                    message: "Phone number must be at least 10 digits"
                  },
                  maxLength: {
                    value: 13,
                    message: "Phone number must not exceed 13 digits"
                  }
                })} type="tel" className="w-full px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 border border-blue-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder:text-gray-400 shadow-md transition-all duration-200 text-sm sm:text-base" placeholder="Phone Number (e.g., +91 9876543210)" />
                {errors.phone && <span className="text-red-400 text-xs sm:text-sm mt-1">{errors.phone.message}</span>}
              </div>
              {/* Team Preference - Multi-Select Dropdown */}
              <div className="flex flex-col w-full relative">
                <label className="block font-semibold mb-1 sm:mb-2 text-white w-full text-left text-sm sm:text-base">Select Teams</label>
                <input {...register("team", { required: "Please select at least one team" })} type="hidden" />
                
                {/* Custom Dropdown */}
                <div className="relative team-dropdown">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 border border-blue-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 shadow-md transition-all duration-200 text-sm sm:text-base text-left flex justify-between items-center"
                  >
                    <span className="truncate">
                      {selectedTeams.length === 0 
                        ? "Select Teams" 
                        : `${selectedTeams.length} team${selectedTeams.length > 1 ? 's' : ''} selected`
                      }
                    </span>
                    <svg className={`w-4 h-4 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Options */}
                  {isDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-blue-700 rounded-lg sm:rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {teamOptions.map((team) => (
                        <label
                          key={team}
                          className="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTeams.includes(team)}
                            onChange={() => handleTeamSelection(team)}
                            className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500 mr-3"
                          />
                          <span className="text-gray-800 text-sm sm:text-base flex-1">{team}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Teams Display */}
                {selectedTeams.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedTeams.map((team) => (
                      <span
                        key={team}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                      >
                        {team}
                        <button
                          type="button"
                          onClick={() => handleTeamSelection(team)}
                          className="ml-1 hover:bg-blue-200 rounded-full p-1"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {errors.team && <span className="text-red-400 text-xs sm:text-sm mt-1">{errors.team.message}</span>}
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
            <button type="submit" className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-blue-800 text-white py-2.5 sm:py-3 md:py-4 lg:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg lg:text-xl shadow-lg border border-cyan-700 hover:bg-blue-900 hover:scale-105 active:scale-95 transition transform mt-3 sm:mt-4 md:mt-6 lg:mt-8 touch-manipulation" disabled={loading}>{loading ? 'Submitting...' : 'Register'}</button>
          </form>
        </div>
        {/* Responsive Success Popup Modal */}
        {showSuccess && (
          <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black bg-opacity-60 p-3 sm:p-4 md:p-6">
            <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-xs sm:max-w-md md:max-w-lg w-full mx-auto text-center">
              <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-green-600 mb-2 sm:mb-3 md:mb-4">Registration Successful!</h3>
              <p className="text-xs sm:text-base md:text-lg lg:text-xl text-gray-800 mb-3 sm:mb-4 md:mb-6">For further information, check your mail.</p>
              <button
                className="bg-blue-600 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full font-bold hover:bg-blue-700 transition text-xs sm:text-sm md:text-base lg:text-lg touch-manipulation"
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
