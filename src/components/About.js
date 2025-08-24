import { useState, useEffect, useRef } from 'react';
import Footer from './footer';

// Custom hook for scroll-triggered animations
function useScrollAnimation() {
    const [visibleElements, setVisibleElements] = useState(new Set());
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleElements(prev => new Set([...prev, entry.target.dataset.animateId]));
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );

        const elements = document.querySelectorAll('[data-animate-id]');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return visibleElements;
}

function About() {
    const visibleElements = useScrollAnimation();

    const isVisible = (id) => visibleElements.has(id);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-36 h-36 sm:w-54 sm:h-54 lg:w-72 lg:h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            <div className="relative z-10">
                <main className="text-white">
                    {/* Hero Section */}
                    <section className="flex flex-col justify-center items-center min-h-screen px-3 sm:px-4 md:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 lg:pt-32">
                        <div className="text-center max-w-7xl mx-auto w-full">
                            <h1 className="font-bold text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent mb-4 sm:mb-6 md:mb-8 animate-fade-in leading-tight">
                                Who we are
                            </h1>
                            <div className="relative max-w-5xl mx-auto">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-orange-500/20 blur-xl rounded-2xl"></div>
                                <p className="relative text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-300 bg-black/40 backdrop-blur-sm p-3 xs:p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl animate-slide-up">
                                    At E-Cell SOA, we are committed to nurturing the spirit of entrepreneurship by providing
                                    a platform where ideas transform into impactful ventures. Through interactive
                                    workshops, inspiring speaker sessions, competitive business plan contests, and year-
                                    round initiatives, we create an ecosystem that fosters innovation and growth. With the
                                    support of experienced mentors, access to essential funding opportunities, and a
                                    strong professional network, we stand as trusted partners in every entrepreneur's
                                    journey towards success.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Vision & Mission Section */}
                    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:grid-cols-2">
                                {/* Vision */}
                                <div 
                                    data-animate-id="vision"
                                    className={`w-full transition-all duration-1000 ease-out ${
                                        isVisible('vision') 
                                            ? 'opacity-100 translate-y-0' 
                                            : 'opacity-0 translate-y-10'
                                    }`}
                                >
                                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl h-full transition-all duration-300 hover:shadow-blue-500/20 hover:border-blue-500/30">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-3 sm:mb-4 md:mb-6">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-0 sm:mr-3 md:mr-4 flex-shrink-0 transition-transform duration-300 hover:scale-110">
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </div>
                                            <h2 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Our Vision</h2>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl">
                                            Entrepreneurs are visionary thinkers, innovators, and changemakers who shape society for a brighter future. At E-Cell SOA, our vision is to empower these changemakers by
                                            providing them with the right exposure, mentorship, network, funding avenues, and
                                            guidance—enabling them to transform their ideas into impactful enterprises.
                                        </p>
                                    </div>
                                </div>

                                {/* Mission */}
                                <div 
                                    data-animate-id="mission"
                                    className={`w-full transition-all duration-1000 ease-out delay-200 ${
                                        isVisible('mission') 
                                            ? 'opacity-100 translate-y-0' 
                                            : 'opacity-0 translate-y-10'
                                    }`}
                                >
                                    <div className="bg-gradient-to-br from-purple-500/10 to-orange-500/10 backdrop-blur-xl p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl h-full transition-all duration-300 hover:shadow-purple-500/20 hover:border-purple-500/30">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-3 sm:mb-4 md:mb-6">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-0 sm:mr-3 md:mr-4 flex-shrink-0 transition-transform duration-300 hover:scale-110">
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <h2 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">Our Mission</h2>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl">
                                            At E-Cell SOA, our mission is to cultivate an entrepreneurial mindset among students
                                            and professionals by providing them with opportunities to learn, innovate, and lead. We
                                            are committed to nurturing ideas through mentorship, networking, resources, and real-
                                            world exposure—empowering individuals to transform their vision into successful
                                            ventures that create lasting impact.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Core Values Section */}
                    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="max-w-7xl mx-auto">
                            <div 
                                data-animate-id="values-header"
                                className={`text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20 transition-all duration-1000 ease-out ${
                                    isVisible('values-header') 
                                        ? 'opacity-100 translate-y-0' 
                                        : 'opacity-0 translate-y-10'
                                }`}
                            >
                                <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent mb-3 sm:mb-4 md:mb-6">
                                    Our Core Values
                                </h2>
                                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400">Building great big things starts with a decision</p>
                            </div>

                            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                                {[
                                    {
                                        title: "Innovation",
                                        description: "We believe in fostering creativity and encouraging bold ideas that redefine possibilities.",
                                        icon: "💡",
                                        gradient: "from-blue-500 to-cyan-500"
                                    },
                                    {
                                        title: "Collaboration",
                                        description: "We value teamwork and partnerships, creating a supportive ecosystem where entrepreneurs can grow together.",
                                        icon: "🤝",
                                        gradient: "from-purple-500 to-pink-500"
                                    },
                                    {
                                        title: "Impact",
                                        description: "We aim to empower ventures that bring meaningful change to society and the economy.",
                                        icon: "🌍",
                                        gradient: "from-green-500 to-emerald-500"
                                    },
                                    {
                                        title: "Excellence",
                                        description: "We strive to maintain the highest standards in everything we do—be it events, mentorship, or support.",
                                        icon: "⭐",
                                        gradient: "from-yellow-500 to-orange-500"
                                    },
                                    {
                                        title: "Learning",
                                        description: "We promote continuous learning by exposing individuals to real-world challenges, insights, and opportunities.",
                                        icon: "📚",
                                        gradient: "from-indigo-500 to-purple-500"
                                    },
                                    {
                                        title: "Inclusivity",
                                        description: "We make entrepreneurship accessible to all, from curious beginners to dedicated founders.",
                                        icon: "🌈",
                                        gradient: "from-pink-500 to-rose-500"
                                    }
                                ].map((value, index) => (
                                    <div 
                                        key={index}
                                        data-animate-id={`value-${index}`}
                                        className={`w-full transition-all duration-1000 ease-out ${
                                            isVisible(`value-${index}`) 
                                                ? 'opacity-100 translate-y-0' 
                                                : 'opacity-0 translate-y-10'
                                        }`}
                                        style={{ transitionDelay: `${200 + index * 100}ms` }}
                                    >
                                        <div className="h-full bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-xl hover:border-white/20 hover:-translate-y-2">
                                            <div className="text-center mb-3 sm:mb-4 md:mb-6">
                                                <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${value.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 sm:mb-3 md:mb-4 mx-auto transition-transform duration-300 hover:scale-110`}>
                                                    {value.icon}
                                                </div>
                                                <h3 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-1 sm:mb-2 md:mb-3">{value.title}</h3>
                                            </div>
                                            <p className="text-gray-300 leading-relaxed text-center text-xs sm:text-sm md:text-base lg:text-lg">{value.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="max-w-6xl mx-auto text-center">
                            <div 
                                data-animate-id="stats-header"
                                className={`transition-all duration-1000 ease-out ${
                                    isVisible('stats-header') 
                                        ? 'opacity-100 translate-y-0' 
                                        : 'opacity-0 translate-y-10'
                                }`}
                            >
                                <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent mb-3 sm:mb-4 md:mb-6">
                                    A Team Builds Tomorrow
                                </h2>
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8 md:mb-12">At Aigents we are working on creating a sustainable future using AI.</p>
                            </div>
                            
                            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 xs:grid-cols-2 md:grid-cols-3">
                                {[
                                    { number: "50+", label: "Customers", gradient: "from-blue-500 to-cyan-500" },
                                    { number: "20+", label: "Members", gradient: "from-purple-500 to-pink-500" },
                                    { number: "8", label: "Countries", gradient: "from-orange-500 to-red-500" }
                                ].map((stat, index) => (
                                    <div 
                                        key={index}
                                        data-animate-id={`stat-${index}`}
                                        className={`w-full transition-all duration-1000 ease-out ${index === 2 && 'xs:col-span-2 md:col-span-1'} ${
                                            isVisible(`stat-${index}`) 
                                                ? 'opacity-100 translate-y-0' 
                                                : 'opacity-0 translate-y-10'
                                        }`}
                                        style={{ transitionDelay: `${300 + index * 150}ms` }}
                                    >
                                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-xl hover:border-white/20 hover:-translate-y-2">
                                            <div className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2 sm:mb-3 md:mb-4`}>
                                                {stat.number}
                                            </div>
                                            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300">{stat.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* AGI Section */}
                    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="max-w-6xl mx-auto text-center">
                            <div 
                                data-animate-id="agi-header"
                                className={`transition-all duration-1000 ease-out ${
                                    isVisible('agi-header') 
                                        ? 'opacity-100 translate-y-0' 
                                        : 'opacity-0 translate-y-10'
                                }`}
                            >
                                <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent mb-6 sm:mb-8 md:mb-12 lg:mb-16">
                                    On a way towards AGI
                                </h3>
                            </div>
                            
                            <div className="space-y-4 sm:space-y-6 md:space-y-8">
                                {[
                                    "We're developing generative AI agents to help organizations automate repetitive tasks, enhance productivity, and empower teams to focus on what truly matters.",
                                    "We believe that even the smallest actions can create a ripple effect, leading to something truly impactful. That's why we've dedicated ourselves to building a platform that empowers visionaries, creators, and doers to streamline their efforts, maximize their potential, and turn ideas into reality—without unnecessary complexity.",
                                    "Innovation thrives when barriers are removed, and efficiency meets creativity. Our mission is to equip builders, makers, and change-makers with the tools they need to focus on what truly matters—bringing bold ideas to life, accelerating progress, and making a lasting impact with minimal effort."
                                ].map((text, index) => (
                                    <div 
                                        key={index}
                                        data-animate-id={`agi-${index}`}
                                        className={`transition-all duration-1000 ease-out ${
                                            isVisible(`agi-${index}`) 
                                                ? 'opacity-100 translate-y-0' 
                                                : 'opacity-0 translate-y-10'
                                        }`}
                                        style={{ transitionDelay: `${200 + index * 200}ms` }}
                                    >
                                        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                                            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300 leading-relaxed">
                                                {text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            <Footer />
            
            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(50px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }
                
                .animate-slide-up {
                    animation: slide-up 1s ease-out 0.3s both;
                }
            `}</style>
        </div>
    );
}

export default About;