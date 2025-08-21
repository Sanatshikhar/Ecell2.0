
import Footer from "./footer";
import React, { useState } from "react";
import RegistrationForm from "./RegistrationForm";
import AuroraBackground from "./Assets/AuroraBackground";
function Join() {
    const [showForm, setShowForm] = useState(false);
    return (
        <div className="relative min-h-screen bg-black">
            {/* Aurora background animation */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
                <AuroraBackground />
            </div>
            {/* Main content and registration popup */}
            <div className="relative min-h-screen flex flex-col justify-center items-center z-10">
                <main className="relative top-16 mb-20 w-full flex flex-col items-center">
                    <h1 className="font-bold text-5xl text-center bg-gradient-to-r from-[#008FF6] via-[#CD5BF4] to-[#F4520D] bg-clip-text text-transparent p-2 mb-8">Ready to join the team?</h1>
                    <button
                        type="button"
                        className="bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 text-white px-10 py-4 rounded-full font-bold text-2xl shadow-lg hover:scale-105 transition duration-300"
                        onClick={() => setShowForm(true)}
                    >
                        Join Us
                    </button>
                    {/* Registration popup always above everything */}
                    <RegistrationForm isOpen={showForm} onClose={() => setShowForm(false)} />
                </main>
            </div>
            <Footer/>
        </div>
    );
}
export default Join;