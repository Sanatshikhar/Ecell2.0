import bgimage from "./Assets/HomePageImg.JPG";
import "./all.css";
import logo from "./logo.png";
import React, { useState } from "react";
import Footer from "./footer.js";
import Cs from "./Assets/comingSoon.webp";
import { AnimatedText } from "./animation/homeani.tsx"
import oblive from "./Assets/oblive.png"
import Exanova from "./Assets/exanova.png"
import Animation from "./Assets/AuroraBackground.js"
const agents = [
  { name: "To Be Announced", role: "Speaker", image: Cs },
  { name: "To Be Announced", role: "Speaker", image: Cs },
  { name: "To Be Announced", role: "Speaker", image: Cs },
];


document.addEventListener('scroll', () => {
    document.documentElement.dataset.scroll = window.scrollY;
});











const tools = [
  {
    name: "ESummit-2024",
    
    description:
      "The SOA E-Summit 2024 was a powerful convergence of innovation and entrepreneurship, designed to inspire and equip future leaders. From the Startup EXPO showcasing disruptive ideas to the 24-hour Hackathon turning concepts into prototypes, every session offered actionable insights.",
    logo: oblive,
    learnMore: "https://www.hubspot.com/",
  },
 {
    name: "Symposium",
    
    description:
      "The SOA E-Summit 2024 was a powerful convergence of innovation and entrepreneurship, designed to inspire and equip future leaders. From the Startup EXPO showcasing disruptive ideas to the 24-hour Hackathon turning concepts into prototypes, every session offered actionable insights.",
    logo: Exanova,
    learnMore: "https://www.hubspot.com/",
  },
   {
    name: "Genovation 8.0",
    
    description:
      "The SOA E-Summit 2024 was a powerful convergence of innovation and entrepreneurship, designed to inspire and equip future leaders. From the Startup EXPO showcasing disruptive ideas to the 24-hour Hackathon turning concepts into prototypes, every session offered actionable insights.",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGKQNpE5KbwgQjYkdxK6sLoEyhPeacS7RKgw&s",
    learnMore: "https://www.hubspot.com/",
  },
  {
    name: "Startup Yatra",
    year: "2022 passout",
    description: "Optimize Social Engagement & Ads with AI",
    logo: "https://cdn.pixabay.com/photo/2021/06/15/12/14/instagram-6338393_1280.png",
    learnMore: "https://www.instagram.com/ecellsoau?igsh=MWx5dXRxaTZva2o5cw==",
  },
  {
    name: "Coffee break saturdys",
    year: "2022 passout",
    description: "see us on linkedin",
    logo: "https://yt3.googleusercontent.com/i6KNxiy3gME-BulL4WnuGkTGqHuSYF8jl1WRn0rXftcJdSYK7dHKcJ3gLAaPc-KfhmLSYPwf824=s900-c-k-c0x00ffffff-no-rj",
    learnMore: "https://www.linkedin.com/company/iecsoa/",
  },
  {
    name: "SOA Internship fair",
    year: "2022 passout",
    description: "Streamline Workflows with AI-Powered Data Management",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqpGgFGW9P4mxFxsH1j-ezX2gn6hnTsYo1fg&s",
    learnMore: "https://www.airtable.com/company/trademark-guidelines",
  },
];

const faqs = [
  {
    question: "What is IEC?",
    answer: `The Innovation and Entrepreneurship Cell (IEC) is a student-driven initiative at our university aimed at fostering entrepreneurial spirit, innovation, and leadership among students. It serves as a platform for aspiring entrepreneurs to explore their ideas, build on them, and learn real-world business and creative skills through hands-on events and mentorship.`,
  },
  {
    question: "Why should students choose IEC?",
    answer: `Students should choose IEC for several reasons:
             <ul style="margin-top:8px;margin-bottom:8px;padding-left:20px;list-style-type:disc;">
              <li>Personality Development</li>
              <li>Increased Communication and Networking Opportunities</li>
              <li>Skill Development</li>
              <li>More Educational and Technical Opportunities</li>
              <li>Incubation and other methodologies aiding in startup development.</li>
              <li>Leadership roles and Team experiences that build you up for the future</li>
             </ul>`,
  },
  {
    question: "How does IEC benefit you?",
    answer: "Any student of the SOA campus can join IEC.",
  },
  {
    question: "What kind of tasks can IEC perform?",
    answer: "IEC helps you develop real skills in teamwork, communication, leadership, and critical thinking. You also get opportunities to organize impactful events, learn from professionals, and connect with like-minded peers—all of which enhances your confidence and clarity about your future goals.",
  },
  {
    question: "How to join IEC and what skills do you need?",
    answer: "Joining IEC is straightforward. Just attend our interview and answer honestly, showing your dedication, passion, and discipline towards the community. <\/ul><br/>Skills:<ul style=\"margin-top:8px;margin-bottom:8px;padding-left:20px;list-style-type:disc;\"><li>Communication<\/li><li>Teamwork<\/li><li>Creativity<\/li><li>Problem solving<\/li><\/ul>",
  },
  {
    question: "What events has IEC conducted and how has it added value to the students?",
    answer: `IEC has conducted several impactful events, significantly benefiting students. These include:
             <ul style="margin-top:8px;margin-bottom:8px;padding-left:20px;list-style-type:disc;">
              <li><b>Genovation</b>: Fosters innovation and creative problem-solving skills.</li>
              <li><b>E-Summit</b>: Enhances entrepreneurial mindset and provides networking opportunities.</li>
              <li><b>Exa Nova</b>: Develops technical skills and encourages practical application of knowledge.</li>
             </ul>
             <p style="margin-top:8px;">Through these hands-on workshops and events, students learn to approach real-world challenges creatively and strategically. Over the years, IEC has also organized pitch competitions, speaker sessions, and case study events, building a vibrant entrepreneurial culture.</p>`,
  },
];

export function AIAgentFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      
      <div
        className="w-full max-w-6xl faq-bg rounded-2xl p-8"
        style={{
          background: 'rgba(0, 41, 59, 0.25)', // slate-800 with opacity
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-white">
          Got questions for us?
        </h1>
        <p className="text-center text-white mb-8">
          Our team are crafted to think, act and optimize like experts—driving your success
        </p>
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
              key={index}
              className={`group rounded-2xl overflow-hidden cursor-pointer`}
              onClick={() => toggle(index)}
              style={{
                background: 'rgba(0, 41, 59, 0.35)', // slate-800 with opacity
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
              >
              <div className="px-6 py-5 flex flex-col space-y-2">
                <div className="flex flow-root justify-between items-center">
                <span
                  className={`
                font-medium duration-300
                ${isOpen ? 'text-[#C392FA]' : 'text-white'}
                `}
                >
                  {faq.question}
                </span>
                <svg className={`w-6 h-6 text-white float-end transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                </svg>

                </div>

                <div
                className={`
                text-sm transition-all duration-300 ease-in-out
                ${isOpen ? 'max-h-40 opacity-100 text-white' : 'max-h-0 opacity-0 text-white'}
                ${isOpen ? 'overflow-y-auto' : 'overflow-hidden'}
              `}
                style={isOpen ? { maxHeight: '10rem' } : { maxHeight: 0 }}
                dangerouslySetInnerHTML={{ __html: `Answer: ${faq.answer}` }}
                />
              </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

  );
}

function Home() {
  return (
    
    <div className="overflow-x-hidden relative" style={{ minHeight: '100vh' }}>
      
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Animation />
      </div>
      <div className="bg-black text-white relative" style={{ zIndex: -1}}>
        <div className="bgchild">
          <main className="">
            <div className="flex flex-col justify-center items-center mt-[15vh] sm:mt-[25vh] min-h-[40vh] pt-2 sm:pt-8">
              <AnimatedText text="Innovation and Entrepreneurship Cell" className="text-xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-4 break-words text-center"/>
              <div className="text-10">
                <section className="animation">
                  <div className="first text-base sm:text-2xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 mb-1 sm:mb-2">
                    <div>Think Big, Start Small</div>
                  </div>
                </section>
              </div>
              <p className="text-sm sm:text-lg md:text-3xl mt-1 sm:mt-1 font-bold mx-2 sm:mx-[6%] text-center">
                From Sparks to Stars: IEC Welcomes You
              </p>
            </div>

            <img
              className="w-[95%] max-sm:w-[75%] sm:w-[80%] mt-2 sm:mt-[8%] h-[32vh] sm:h-[50vh] lg:h-auto lg:w-[70%] border-white border-2 block m-auto rounded-xl max-w-[1500px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-1000 ease-in-out tilt"
              style={{ transformStyle: "preserve-3d" }}
              src={bgimage}
            />

            <div className="flex items-center flex-col text-wrap mt-2 sm:mt-[4%] lg:mt-[8%] px-2 sm:px-4">
              <p className="w-full sm:w-4/5 lg:w-[45%] text-wrap text-sm sm:text-lg text-center mb-1 sm:mb-4">
                Powered by most advanced AI models. FreeOS integrates top AI
                models into a simple UX, saving you time on implementation.
              </p>

              <div className="w-[90%] h-fit flex overflow-hidden gap-6 md:gap-12 cursor-pointer m-auto slider py-4">
                <div className="flex flex-shrink-0 min-w-full justify-between items-center gap-6 md:gap-12 slide-track ">
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center ">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div >
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />

                  
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div >
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                </div>
                <div className=" flex flex-shrink-0 min-w-full justify-between items-center gap-6 md:gap-12 slide-track">
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div >
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />

                    
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div >
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />
                  </div>
                  <div className="w-[150px] h-[120px] md:w-[250px] md:h-[200px] flex justify-center">
                    <img
                      className="w-full object-contain"
                      src={logo}
                      alt="Logo"
                    />

                    
                  </div>
                </div>

              </div>

            </div>
          </main>
        </div>
      </div>
      <main className="bg-black text-white">
        <div className=" px-6 py-12 max-w-7xl mx-auto text-center overflow-hidden">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 break-words">
            Supercharge Business <br/> Productivity with ECell SOA
          </h1>
          <p className="text-white max-w-xl mx-auto mb-10">
            Our intelligent leads are crafted to think, act, and optimize like
            experts—driving your success
          </p>
        </div>

        <div className="grid w-[90%] md:w-[95%] lg:w-[85%] grid-cols-1 md:grid-cols-3 relative left-1/2 gap-6 md:gap-12 -translate-x-1/2 h-full">

          {agents.map((agent, index) => (
            <div key={index} className="relative group rounded-3xl overflow-hidden h-[50vh] md:h-[65vh] shadow-lg border-white border-4 md:border-8">
              <img src={agent.image} alt={agent.name} className="h-full w-full object-cover" />
              <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-40 text-white p-4 rounded-xl group-hover:bg-white group-hover:text-black transition-colors">
                <h3 className="text-xl font-bold">{agent.name}</h3>
                <p className="text-lg font-medium">{agent.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-12 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Past Events
          </h2>
          <p className="text-white max-w-xl mx-auto mb-10">
            Customizable AI automations that integrate seamlessly with your
            tools.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <div
                key={index}
                className=" bg-gray-900 border border-white rounded-2xl p-6 text-left hover:shadow-lg transition-shadow duration-300"
              >

                <div className="flex items-center gap-4 mb-4">
                  <img
                  src={tool.logo}
                  alt={`${tool.name} Logo`}
                  className="w-12 h-12 mb-4"
                />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                    <p className="text-white mb-4">{tool.year}</p>
                  </div>
                </div>
                <p className="text-white">{tool.description}</p>

              </div>
            ))}
          </div>
        </div>
        <AIAgentFAQ />
        <div className="px-6 py-12 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            ALUMNI REVIEWS
          </h2>
          <p className="text-white max-w-xl mx-auto mb-10">
            Hear what our alumni has to say
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-white rounded-2xl p-6 text-left hover:shadow-lg transition-shadow duration-300"
              >

                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={tool.logo}
                    alt={`${tool.name} Logo`}
                    className="w-12 h-12 mb-4 border-4 border-white rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                    <p className="text-white mb-4">{tool.year}</p>
                  </div>
                </div>
                <p className="text-white">{tool.description}</p>
                <a
                  href={tool.learnMore}
                  className="text-blue-500 hover:underline"
                >
                  Learn more &rarr;
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
                        {/* Ensure footer is above animation */}
                        <style>{`
                            footer { position: relative; z-index: 20; }
                        `}</style>
    </div>
  );
}
export default Home;
