
import Footer from "./footer";
// ...existing code...


function Contact() {
    return (
        <div className="bg-black relative overflow-hidden">
            {/* Blue radial balls in corners */}
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
            {/* Aurora background removed */}
            <div className="bg-black">
                <div>
                    <main className="relative top-16 mb-20">
                        <div className="flex flex-col justify-center items-center h-screen gap-5">
                            <h1 className="font-bold text-5xl text-center bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] bg-clip-text text-transparent p-2"> Let's explore how we can<br /> work for you</h1>
                            <div className="w-full max-w-md grid gap-5">
                                <h2 className="text-2xl font-semibold text-center text-white">Send us a message</h2>
                                <form className="flex flex-col items-center justify-center lg:gap-5">
                                    <div className="w-[90%] bg-transparent">
                                        <label className=" text-white block text-left font-medium">Name</label>
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                    <div className="w-[90%]">
                                        <label className="text-white block text-left font-medium">Email</label>
                                        <input
                                            type="email"
                                            placeholder="sample@email.com"
                                            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                    <div className="w-[90%]">
                                        <label className="text-white block text-left font-medium">Message</label>
                                        <textarea
                                            placeholder="Enter your message"
                                            className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            rows="4"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <Footer/>
        </div>
    );
}
export default Contact;