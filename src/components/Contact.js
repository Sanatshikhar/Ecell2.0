
import Footer from "./footer";



function Contact() {
    return (
        <div>
            <div className="bg-gradient-to-t from-[rgba(223,219,255,0)] to-[rgba(223,219,255,1)]">
                <div>
                    <main className="relative top-16 mb-20">
                        <div className="flex flex-col justify-center items-center h-screen gap-5">
                            <h1 className="font-bold text-5xl text-center bg-gradient-to-r from-[#008FF6] via-[#CD5BF4] to-[#F4520D] bg-clip-text text-transparent p-2"> Let's explore how we can<br /> work for you</h1>


                            <div className="w-full max-w-md grid gap-5">
                                <h2 className="text-2xl font-semibold text-center">Send us a message</h2>
                                <form className="flex flex-col items-center justify-center lg:gap-5">
                                    <div className="w-[90%]">
                                        <label className="block text-left font-medium">Name</label>
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                    <div className="w-[90%]">
                                        <label className="block text-left font-medium">Email</label>
                                        <input
                                            type="email"
                                            placeholder="sample@email.com"
                                            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                    <div className="w-[90%]">
                                        <label className="block text-left font-medium">Message</label>
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