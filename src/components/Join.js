
import Footer from "./footer";
import React, { useState } from "react";
import RegistrationForm from "./RegistrationForm";
function Join() {
    const [showForm, setShowForm] = useState(false);
    return (
        <div>
            <div className="bg-gradient-to-t from-[rgba(223,219,255,0)] to-[rgba(223,219,255,1)] min-h-screen flex flex-col justify-center items-center">
                <main className="relative top-16 mb-20 w-full flex flex-col items-center">
                    <h1 className="font-bold text-5xl text-center bg-gradient-to-r from-[#008FF6] via-[#CD5BF4] to-[#F4520D] bg-clip-text text-transparent p-2 mb-8">Ready to join the team?</h1>
                    <button
                        type="button"
                        className="bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 text-white px-10 py-4 rounded-full font-bold text-2xl shadow-lg hover:scale-105 transition duration-300"
                        onClick={() => setShowForm(true)}
                    >
                        Join Us
                    </button>
                    <RegistrationForm isOpen={showForm} onClose={() => setShowForm(false)} />
                </main>
            </div>
            <Footer/>
        </div>
    );
}
export default Join;