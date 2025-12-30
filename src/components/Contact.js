import { useState } from "react";
import Footer from "./footer";

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            // You can integrate with backend email service or use a service like EmailJS
            // For now, showing success message
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            
            setStatus({ 
                type: 'success', 
                message: 'Thank you for your message! We will get back to you soon.' 
            });
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: 'Failed to send message. Please try again.' 
            });
        } finally {
            setLoading(false);
        }
    };

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
            
            <div className="bg-black">
                <div>
                    <main className="relative top-16 mb-20">
                        <div className="container mx-auto px-4 py-16">
                            <h1 className="font-bold text-4xl md:text-5xl text-center bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] bg-clip-text text-transparent p-2 mb-12">
                                Let's explore how we can<br /> work for you
                            </h1>
                            
                            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto relative z-10">
                                {/* Contact Form */}
                                <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800">
                                    <h2 className="text-2xl font-semibold text-white mb-6">Send us a message</h2>
                                    
                                    {status.message && (
                                        <div className={`p-4 rounded-lg mb-4 ${status.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500' : 'bg-red-500/20 text-red-400 border border-red-500'}`}>
                                            {status.message}
                                        </div>
                                    )}
                                    
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label className="text-white block text-left font-medium mb-2">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Your Name"
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-white block text-left font-medium mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="sample@email.com"
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-white block text-left font-medium mb-2">Message</label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Enter your message"
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                                rows="5"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Sending...' : 'Send Message'}
                                        </button>
                                    </form>
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-6">
                                    <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800">
                                        <h2 className="text-2xl font-semibold text-white mb-6">Contact Information</h2>
                                        
                                        <div className="space-y-6">
                                            {/* Email */}
                                            <div className="flex items-start gap-4">
                                                <div className="bg-blue-500/20 p-3 rounded-lg">
                                                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-semibold mb-1">Email</h3>
                                                    <a href="mailto:shikharsanat@gmail.com" className="text-gray-400 hover:text-blue-400 transition">shikharsanat@gmail.com</a>
                                                </div>
                                            </div>

                                            {/* Phone */}
                                            <div className="flex items-start gap-4">
                                                <div className="bg-purple-500/20 p-3 rounded-lg">
                                                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-semibold mb-1">Phone</h3>
                                                    <a href="tel:+918917616478" className="text-gray-400 hover:text-purple-400 transition">+91 7091318966</a>
                                                    <p className="text-gray-500 text-sm mt-1">Tech-Team of IEC</p>
                                                </div>
                                            </div>

                                            {/* Address */}
                                            <div className="flex items-start gap-4">
                                                <div className="bg-pink-500/20 p-3 rounded-lg">
                                                    <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-semibold mb-1">Address</h3>
                                                    <p className="text-gray-400">
                                                        Institute of Technical Education and Research (ITER)<br />
                                                        Siksha 'O' Anusandhan<br />
                                                        Bhubaneswar, Odisha 751030
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Social Media */}
                                    <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800">
                                        <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
                                        <div className="flex gap-4">
                                            <a href="https://www.linkedin.com/company/ecellsoau" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg transition">
                                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                                </svg>
                                            </a>
                                            <a href="https://www.instagram.com/ecellsoau/?hl=en" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-3 rounded-lg transition">
                                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
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
