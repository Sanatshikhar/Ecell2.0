
import Footer from "./footer";
import React, { useState } from "react";
import RegistrationForm from "./RegistrationForm";
function Join() {
    const [showForm, setShowForm] = useState(false);
    return (
        <div>
            <div className="team-section-container" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: 'black' }}>
                {/* SVG blue ball background - responsive */}
                <svg className="absolute top-0 left-0 w-[70vw] h-[70vw] sm:w-[60vw] sm:h-[60vw] lg:w-[50vw] lg:h-[50vw] max-w-[900px] max-h-[900px] opacity-50 z-0 pointer-events-none" viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="450" cy="450" r="450" fill="url(#paint0_radial)" />
                    <defs>
                        <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(450 450) scale(450)" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#2c2d78" stopOpacity="0.8" />
                            <stop offset="1" stopColor="#232946" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>
                {/* Bottom right SVG blue ball - responsive */}
                <svg className="absolute bottom-0 right-0 w-[70vw] h-[70vw] sm:w-[60vw] sm:h-[60vw] lg:w-[50vw] lg:h-[50vw] max-w-[900px] max-h-[900px] opacity-50 z-0 pointer-events-none" viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="450" cy="450" r="450" fill="url(#paint1_radial)" />
                    <defs>
                        <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientTransform="translate(450 450) scale(450)" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#2c2d78" stopOpacity="0.8" />
                            <stop offset="1" stopColor="#232946" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>
                {/* Responsive blurred blue balls */}
                <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[60vh] sm:w-[70vw] sm:h-[70vh] lg:w-[60vw] lg:h-[70vh] bg-blue-700/30 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] opacity-80 pointer-events-none z-0"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[80vw] h-[60vh] sm:w-[70vw] sm:h-[70vh] lg:w-[60vw] lg:h-[70vh] bg-blue-700/30 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] opacity-80 pointer-events-none z-0"></div>
                <div className="relative z-10" >
                    <main>
                        <div className="flex flex-col justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                            <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] bg-clip-text text-transparent p-2 mb-6 sm:mb-8 lg:mb-12 leading-tight">
                                Ready to join the team?
                            </h1>
                            <button
                                type="button"
                                className="bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-4 rounded-full font-bold text-lg sm:text-xl lg:text-2xl shadow-lg hover:scale-105 active:scale-95 transition duration-300 transform"
                                onClick={() => setShowForm(true)}
                            >
                                Join Us
                            </button>
                            {/* Registration popup always above everything */}
                            <RegistrationForm isOpen={showForm} onClose={() => setShowForm(false)} />
                        </div>
                    </main>
                </div>
            </div>
            <Footer />
            {/* Ensure footer is above animation */}
            <style>{`
                            footer { position: relative; z-index: 20; }
                        `}</style>
        </div>
    );
}
export default Join;