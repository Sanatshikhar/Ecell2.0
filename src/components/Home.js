import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { CardSpotlight } from "../ui/card-spotlight.jsx";
import logo from "./logo.png";
import Footer from "./footer.js";
import Cs from "./Assets/comingSoon.webp";
import { TypewriterEffectSmooth } from "./animation/homeani.tsx";
import Rposter from "./Assets/Resonance.png";
import resonance from "./Assets/Resonance Campus 2 (9 x 5 in) (4).png";
import Exanova from "./Assets/Exanova Results.png";
import PExanova from "./Assets/exanova.png";
import oblive from "./Assets/Register Poster.jpg";
import Boblive from "./Assets/gradient_1000_800.png";
// Speaker section background refinement

const Home = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [popupEvent, setPopupEvent] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      document.documentElement.dataset.scroll = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const tools = [
    {
      name: "Resonance-25",
      description: `Mega Orientation Session Discover breakthrough ideas, connect with experts, and unlock the future of technology.`,
      logo: Rposter,
      image: resonance,
      learnMore: "#",
    },
    {
      name: "ESummit",
      description: "The event featured a range of power-packed competitions and activities — from insightful Marketing Research challenges to impactful Pitch Presentations, where aspiring entrepreneurs showcased their groundbreaking ideas. The Ideathon sparked rapid brainstorming and problem-solving, while the highlight of the summit — a grueling 24-hour Mega Hackathon — tested endurance, collaboration, and technical prowess. Together, these events created an electrifying atmosphere of learning, innovation, and entrepreneurial spirit.",
      logo: oblive,
      image: Boblive,
      learnMore: "#",
    },
    {
      name: "Exanova",
      description: "The event featured dynamic brainstorming, real-world case study challenges, and creative marketing pitches, where participants collaborated, innovated, debated, and showcased skills—celebrating creativity, problem-solving, and entrepreneurial spirit with standout winners.",
      logo: PExanova,
      image: Exanova,
      learnMore: "#",
    },

  ];

  const faqs = [
    {
      question: "What is IEC?",
      answer: "The Innovation and Entrepreneurship Cell (IEC) is a student-driven initiative, dedicated to fostering entrepreneurial spirit, innovation, and leadership among students.",
    },
    {
      question: "Why should students choose IEC?",
      answer: "Students should choose IEC for several reasons including Personality Development, Communication and Networking Opportunities, Skill Development, and more.",
    },
    {
      question: "What kind of tasks can IEC perform?",
      answer: "IEC is not just a club where tasks are assigned and finished—it's a family that ideates together, works in teams, debates, quarrels, and from discussing problems to coming up with meaningful solutions.",
    },
    {
      question: "How to join IEC and what skills do you need?",
      answer: "If you are a student at SOA and have the dedication and the mind to create, you can join IEC. The process is simple—attend our interview and share your thoughts honestly.",
    },
  ];

  const alumni = [
    {
      name: "Sachin Kumar",
      role: "Assistant Manager at JSW Group",
      review: "As the Ex-Coordinator of IEC was an incredible journey that honed my event management and leadership skills. This role not only strengthened my organizational and decision-making abilities but also taught me the value of teamwork, adaptability, and leading with vision. Summing up it has been an \"OUT OF THE BOX \" Journey",
      avatar: "https://media.licdn.com/dms/image/v2/D4D03AQHA4KH4x66-AA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1681490671010?e=1758758400&v=beta&t=NPCw5SlTYTkNsAGbs4AJDPBAPlRmvBSltNGVdHGJ_0w"
    },
    {
      name: "Ayush Pattnaik",
      role: "Software Engineer at Comviva",
      review: "IEC gave me the platform to explore, learn, and grow beyond the classroom. The guidance, opportunities, and exposure I received here have truly shaped my journey and boosted my confidence. And the best part — I found a cool team for life.",
      avatar: "https://media.licdn.com/dms/image/v2/D5603AQH-Y_iMg-AHUg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1732265064518?e=1758758400&v=beta&t=Ly9e0rzinvLNhai1jOHxmwJdJOFdHuM07PBfAWTUtwo"
    },
    {
      name: "Sanskar Pani",
      role: "Founder and CEO at SCALE",
      review: "The Startup Awareness and Mentorship Program at IEC has been a true game-changer for me. Most importantly, it connected me with a passionate and like-minded team that feels like family for life.",
      avatar: "https://media.licdn.com/dms/image/v2/D4E03AQEXO6HuwO2RJw/profile-displayphoto-shrink_200_200/B4EZU4ekvhGgAg-/0/1740409294803?e=2147483647&v=beta&t=iQvTgQZwauemDFRrox8aZJaW54Ez2dc0tHXTiSt6WEs"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden text-[12px] sm:text-[14px] md:text-base">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen overflow-hidden bg-black pt-16 xs:pt-20 sm:pt-24 md:pt-32">
        {/* Decorative Vectors */}
        <svg className="absolute top-0 left-0 w-40 h-40 opacity-40 z-0" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="100" fill="url(#paint0_radial)" />
          <defs>
            <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(100 100) scale(100)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7F5AF0" stopDriving Ideas Towards ImpactOpacity="0.7" />
              <stop offset="1" stopColor="#232946" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <svg className="absolute bottom-0 right-0 w-56 h-56 opacity-30 z-0" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="110" cy="110" rx="110" ry="80" fill="url(#paint1_radial)" />
          <defs>
            <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientTransform="translate(110 110) scale(110 80)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FCA311" stopOpacity="0.5" />
              <stop offset="1" stopColor="#232946" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <svg className="absolute top-10 right-1/3 w-32 h-32 opacity-20 z-0" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="100" height="100" rx="30" fill="url(#paint2_radial)" />
          <defs>
            <radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientTransform="translate(60 60) scale(60)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00C9A7" stopOpacity="0.4" />
              <stop offset="1" stopColor="#232946" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        {/* Background elements */}
        <div className="absolute top-[-20%] left-[-20%] w-[70vw] h-[70vh] bg-blue-700/30 rounded-full blur-[100px] opacity-80"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[70vw] h-[70vh] bg-blue-700/30 rounded-full blur-[100px] opacity-80"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center mt-8 sm:mt-12 md:mt-20 px-2 sm:px-4 text-center gap-4 sm:gap-0 w-full max-w-full">
          <TypewriterEffectSmooth
            words={[
              { text: "Innovation", className: "text-blue-500" },
              { text: "and" },
              { text: "Entrepreneurship" },
              { text: "Cell", className: "text-blue-500" }
            ]}
            className="text-5xl xs:text-6xl sm:text-7xl md:text-5xl lg:text-6xl font-semibold mb-2 sm:mb-4 px-1 sm:px-0 text-white"
          />
          <div className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] bg-clip-text text-transparent mb-2 sm:mb-3 px-1 sm:px-0 pb-3">
            Driving Ideas Towards Impact
          </div>
          <p className="text-lg xs:text-xl sm:text-3xl md:text-4xl font-semibold mt-0 sm:mt-4 max-w-full sm:max-w-3xl px-1 sm:px-0">
            From Sparks to Stars: IEC Welcomes You
          </p>
          {/* CTA Button */}
          <Link
            to="/members"
            className="inline-block mt-4 sm:mt-8 px-4 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] text-white font-bold text-xs xs:text-sm sm:text-lg shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Join IEC Now
          </Link>
          <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm mt-6 sm:mt-10 max-w-full sm:max-w-2xl text-gray-400 px-1 sm:px-0">
            At IEC SOA, we are committed to fostering a culture of innovation, research, and entrepreneurship. By providing mentorship, resources, and opportunities, we empower students to transform ideas into impactful ventures.
          </p>

          {/* Logo slider */}
          <div className="w-full mt-6 sm:mt-12 md:mt-20 overflow-x-hidden overflow-y-hidden">
            <div className="flex flex-col items-center">
              <h2 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] bg-clip-text text-transparent  tracking-tight text-center uppercase">In Association With</h2>
              <div className="relative w-full overflow-hidden">
                <div className="flex items-center gap-8 animate-logo-ticker whitespace-nowrap min-w-max" style={{ animation: 'logo-ticker 20s linear infinite' }}>
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div key={i} className="w-12 xs:w-16 sm:w-24 h-10 xs:h-14 sm:h-20 md:w-40 md:h-32 flex-shrink-0">
                      <img
                        src={logo}
                        alt="Partner logo"
                        className="w-full h-full object-contain opacity-50 hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Past Events Section - Modern Dark Redesign */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        {/* Abstract shapes */}
        <svg className="absolute left-0 top-0 w-96 h-96 opacity-20 z-0" viewBox="0 0 400 400" fill="none"><circle cx="200" cy="200" r="200" fill="#60a5fa" fillOpacity="0.08" /></svg>
        <svg className="absolute right-0 bottom-0 w-96 h-96 opacity-10 z-0" viewBox="0 0 400 400" fill="none"><ellipse cx="200" cy="200" rx="200" ry="140" fill="#60a5fa" fillOpacity="0.06" /></svg>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] bg-clip-text text-transparent drop-shadow-lg">Past Event Speakers</h2>
          <p className="text-center text-gray-200 mb-12 max-w-xl mx-auto text-lg font-medium drop-shadow-lg">
            Meet the visionaries and leaders who inspire us at IEC events.
          </p>
          {/* Speaker slider/grid */}
          <div className="flex flex-nowrap gap-8 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-10 md:overflow-x-visible">
            {[{
              name: "Biraja Prasad Rout",
              role: "Founder, Biggies Burger",
              img: "https://media.licdn.com/dms/image/v2/D5603AQGrHRyevP3vKA/profile-displayphoto-shrink_400_400/B56ZVwzixiGsAk-/0/1741354316408?e=1758758400&v=beta&t=XLn9I5scZYXS2vQdFP0vQv_-7pg5hPJOu7scIx7Oq9I"
            }, {
              name: "Dr. Abhishek Gautam",
              role: "Founder, Ambula",
              img: "https://media.licdn.com/dms/image/v2/D5603AQHWw1uKJ4llfA/profile-displayphoto-scale_400_400/B56ZhCT_0GH0Ag-/0/1753459197026?e=1758758400&v=beta&t=ptmPYG811O2MXUoJQ36ndPmMyKY_u_VapdIUBS4I_Ow"
            }, {
              name: "Mr.Bibhu Bahalia",
              role: "Co-Founder, Assava",
              img: "https://media.licdn.com/dms/image/v2/C5603AQGoXkOXqrA_OQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1588930901707?e=1758758400&v=beta&t=PasaVRel-JoZTeRVyOBjbbBnz8Lx4DbnYsJQEiRRhYA"
            }].map((sp, i) => (
              <div key={i} className="group bg-black rounded-3xl shadow-xl min-w-[260px] max-w-xs mx-auto p-8 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl relative border border-blue-400/30">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-400 shadow-lg mb-4 bg-black">
                  <img src={sp.img} alt={sp.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-white transition-colors">{sp.name}</h3>
                <p className="text-white font-semibold mb-2">{sp.role}</p>
                <div className="absolute inset-0 pointer-events-none rounded-3xl group-hover:bg-blue-400/10 transition-all duration-300"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">

          </div>
        </div>
      </section>
      {/* Event Showcase - Modern Dark Feature Cards */}
      <section className="relative py-20 px-4 md:px-8 bg-black overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(96,165,250,0.10)_0%,_rgba(0,0,0,1)_80%)]"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] bg-clip-text text-transparent drop-shadow-lg">Event Showcase</h2>
          <p className="text-center text-gray-200 mb-12 max-w-xl mx-auto text-lg font-medium drop-shadow-lg">
            "Events That Inspire, Impacts That Last."
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.slice(0, 3).map((tool, index) => (
              <div
                key={index}
                className="relative group rounded-3xl overflow-hidden shadow-xl bg-black border border-blue-400/30 cursor-pointer min-h-[320px] flex flex-col justify-end transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  background: `linear-gradient(180deg,rgba(96,165,250,0.08) 0%,rgba(0,0,0,0.98) 100%), url('/src/assets/event-card-bg.png') center/cover, #000`
                }}
                onClick={() => setPopupEvent(tool)}
              >
                <div className="absolute inset-0 z-0">
                  <img src={tool.image} alt={tool.name} className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500" style={{ opacity: 0.7 }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-purple-500/10 to-transparent group-hover:from-blue-500/30 group-hover:via-purple-500/20 transition-all duration-500"></div>
                </div>
                <div className="relative z-10 p-6 flex flex-col items-center justify-center min-h-[220px]">
                  <div className="flex justify-center items-center w-full mb-4">
                    <img src={tool.logo} alt={tool.name} className="w-28 h-28 rounded-full object-contain shadow-lg border-4 border-blue-400/60 bg-black/60" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-400 text-center drop-shadow mb-2 group-hover:text-blue-300 transition-colors">{tool.name}</h3>
                </div>
              </div>
            ))}
          </div>
          {/* Popup for event description */}
          {popupEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setPopupEvent(null)}>
              <div className="relative max-w-lg w-full mx-4 bg-black rounded-2xl border-4 border-blue-400 shadow-2xl p-8 flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
                <button onClick={() => setPopupEvent(null)} className="absolute top-2 right-2 text-white text-3xl font-bold bg-black/60 rounded-full px-3 py-1 hover:bg-black/90 transition-colors">&times;</button>
                <div className="flex justify-center items-center w-full mb-6">
                  <img src={popupEvent.logo} alt={popupEvent.name} className="w-32 h-32 rounded-full object-contain shadow-lg border-4 border-blue-400/60 bg-black/60" />
                </div>
                <h3 className="text-2xl font-bold text-blue-400 text-center mb-4">{popupEvent.name}</h3>
                <p className="text-white/90 text-center text-base font-medium mb-2">{popupEvent.description}</p>
              </div>
            </div>
          )}
          <div className="flex justify-center mt-10">
            <button
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-300"
              onClick={() => navigate('/ComingSoon')}
            >
              Explore All Events &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section - Modern Dark Accordion */}
      <section className="py-16 px-4 md:px-8 bg-black">
        <div className="max-w-4xl mx-auto bg-black/90 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-blue-400/30 shadow-xl relative overflow-hidden">
          {/* Abstract wave */}
          <svg className="absolute left-0 bottom-0 w-64 h-32 opacity-10 z-0" viewBox="0 0 256 128" fill="none"><path d="M0 64C64 128 192 0 256 64V128H0V64Z" fill="url(#faqwave)" /><defs><linearGradient id="faqwave" x1="0" y1="0" x2="256" y2="128" gradientUnits="userSpaceOnUse"><stop stopColor="#7F5AF0" stopOpacity="0.12" /><stop offset="1" stopColor="#00C9A7" stopOpacity="0.10" /></linearGradient></defs></svg>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] bg-clip-text text-transparent">
            Got questions for us?
          </h2>
          <p className="text-center text-gray-200 mb-8">
            Our team are crafted to think, act and optimize like experts—driving your success
          </p>
          <div className="space-y-4 relative z-10">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 ${isOpen ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-black border-blue-500 shadow-lg' : 'bg-black/80 border-blue-400/30 shadow'
                    }`}
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex items-center px-6 py-5">
                    <span className="mr-4 text-purple-400">
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#7F5AF0" fillOpacity="0.12" /><path d="M12 8v4m0 4h.01" stroke="#7F5AF0" strokeWidth="2" strokeLinecap="round" /></svg>
                    </span>
                    <span className={`font-medium flex-1 text-lg ${isOpen ? 'text-white' : 'text-white'}`}>{faq.question}</span>
                    <svg className={`w-6 h-6 text-purple-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out px-6 ${isOpen ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                    <p className="text-blue-300 pb-4">{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Alumni Reviews - Elegant Dark Testimonials */}
      <section className="py-16 px-4 md:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] bg-clip-text text-transparent">ALUMNI REVIEWS</h2>
          <p className="text-center text-gray-200 mb-12 max-w-xl mx-auto">
            Hear what our alumni has to say
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {alumni.map((alum, index) => (
              <div
                key={index}
                className="relative bg-black border border-blue-400/30 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center min-h-[260px]"
              >
                {/* Decorative quote icon */}
                <svg className="absolute left-4 top-4 w-12 h-12 opacity-10 z-0" viewBox="0 0 48 48" fill="none"><path d="M16 20c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z" fill="#7F5AF0" /><path d="M12 28c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12S12 34.627 12 28z" fill="#7F5AF0" fillOpacity="0.2" /></svg>
                <img
                  src={alum.avatar}
                  alt={alum.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-400 shadow-lg mb-4 z-10"
                />
                <p className="italic text-white text-center mb-4 z-10">“{alum.review}”</p>
                <div className="text-center z-10">
                  <h3 className="font-bold text-lg text-blue-400">{alum.name}</h3>
                  <p className="text-blue-400 text-sm font-medium">{alum.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

// Add global style for logo-ticker animation
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes logo-ticker {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `;
  if (!document.head.querySelector('style[data-logo-ticker]')) {
    style.setAttribute('data-logo-ticker', 'true');
    document.head.appendChild(style);
  }
}