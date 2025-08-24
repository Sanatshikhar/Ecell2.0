
import Footer from "./footer";
import React, { useState } from "react";
import RegistrationForm from "./RegistrationForm";
// ...existing code...
function Join() {
    const [showForm, setShowForm] = useState(false);
    return (
        <div>
            <div className="team-section-container" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: 'black' }}>
                {/* SVG blue ball background, matching Team/TechTeam */}
                <svg className="absolute top-0 left-0 w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] opacity-50 z-0 pointer-events-none" viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="450" cy="450" r="450" fill="url(#paint0_radial)" />
                    <defs>
                        <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(450 450) scale(450)" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#2c2d78" stopOpacity="0.8" />
                            <stop offset="1" stopColor="#232946" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>
                {/* Bottom right SVG blue ball */}
                <svg className="absolute bottom-0 right-0 w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] opacity-50 z-0 pointer-events-none" viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="450" cy="450" r="450" fill="url(#paint1_radial)" />
                    <defs>
                        <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientTransform="translate(450 450) scale(450)" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#2c2d78" stopOpacity="0.8" />
                            <stop offset="1" stopColor="#232946" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>
                {/* Optionally keep blurred blue balls for extra depth */}
                <div className="absolute top-[-20%] left-[-20%] w-[70vw] h-[70vh] bg-blue-700/30 rounded-full blur-[100px] opacity-80 pointer-events-none z-0"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[70vw] h-[70vh] bg-blue-700/30 rounded-full blur-[100px] opacity-80 pointer-events-none z-0"></div>
                <div className="relative z-10" >
                    <main>
                        <div className="flex flex-col justify-center items-center lg:h-[100vh] max-sm:h-[70vh]  sm:h-[70vh] mt-[-5%]">
                            <h1 className="font-bold text-5xl text-center bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] bg-clip-text text-transparent p-2 mb-8">Ready to join the team?</h1>
                            <button
                                type="button"
                                className="bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] text-white px-10 py-4 rounded-full font-bold text-2xl shadow-lg hover:scale-105 transition duration-300"
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