import bgimage from "./pexels-eberhardgross-1287142.png";
import "./all.css";
import logo from "./logo.png";
import React, { useState } from "react";
import Footer from "./footer.js";
import Sss from "./Assets/Team Image/Sanat.jpg"
import { AnimatedText } from "./animation/homeani.tsx"
import Kiran from "./Assets/Team Image/Kiran.jpg"
import Pd from "./Assets/Team Image/IMG_20241004_121433 - Pratikshya Dash.jpg"
import oblive from "./Assets/oblive.png"
import Exanova from "./Assets/exanova.png"


const agents = [
  { name: "Pratikshya Dash", role: "Vise-President", image: Pd },
  { name: "Sanat Sikhar Sinha", role: "Technical lead", image: Sss },
  { name: "Kiran Panigrahi", role: "President", image: Kiran},
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
    answer: "IEC is the Innovation and Entrepreneurship Cell of ITER SOA that fosters creativity and entrepreneurial spirit among students.",
  },
  {
    question: "How can IEC benefit me?",
    answer: "IEC offers mentorship, resources, and a platform to turn your ideas into real startups or impactful projects.",
  },
  {
    question: "Can students from any campus of SOA join IEC?",
    answer: "Yes, any students of SOA campus can join IEC.",
  },
  {
    question: "What kind of tasks can IEC perform?",
    answer: "IEC hosts events, hackathons, startup weekends, and facilitates networking with industry experts and alumni.",
  },
  {
    question: "How can I join IEC?",
    answer: "You can join IEC by applying through our official website or reaching out to one of the team members during recruitment drives.",
  },
];

export function AIAgentFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl faq-bg rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-gray-900">
          Got questions for us?
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Our team are crafted to think, act and optimize like experts—driving your success
        </p>
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`group border border-gray-200 rounded-2xl overflow-hidden bg-white cursor-pointer`}
                onClick={() => toggle(index)}
              >
                <div className="px-6 py-5 flex flex-col space-y-2">
                  <div className="flex flow-root justify-between items-center">
                    <span
                      className={`
                    font-medium duration-300
                    ${isOpen ? 'text-[#C392FA]' : 'text-gray-800'}
                  `}
                    >
                      {faq.question}
                    </span>
                    <svg class={`w-6 h-6 text-black float-end transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                    </svg>

                  </div>

                  <div
                    className={`
                  text-sm transition-all duration-300 ease-in-out overflow-hidden
                  ${isOpen ? 'max-h-40 opacity-100 text-black' : 'max-h-0 opacity-0 text-gray-600'}
                `}
                  >
                    Answer: {faq.answer}
                  </div>
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
    <div>
      <div className="bg">
        <div className="bgchild">
          <main className="">
            <div className="flex flex-col justify-center items-center h-screen">
              <AnimatedText text="Innovation and Entrepreneurship Cell" className="text-3xl sm:text-3xl md:text-4xl font-bold mb-4 break-words text-center"/>
              <div className="text-10">
                <section className="animation">
                  <div className="first text-2xl sm:text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500">
                    <div>Think Big, Start Small</div>
                  </div>
                </section>
              </div>



              <p className="text-lg sm:text-3xl md:text-4 mt-4 ml-50 font-bold mx-[6%] text-center">
                From Sparks to Stars: IEC Welcomes You
              </p>
            </div>

            <img
              className="w-[85%] mt-[-6%] h-[50vh] lg:h-auto lg:w-[70%] border-white border-2 block m-auto rounded-xl max-w-[1500px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-1000 ease-in-out tilt"
              style={{ transformStyle: "preserve-3d" }}
              src={bgimage}
            />

            <div className=" flex items-center flex-col text-wrap mt-[15%]">
              <p className="lg:w-[45%] md:w-4/5 text-wrap text-lg text-center">
                Powered by most advanced AI models. FreeOS integrates top AI
                models into a simple UX, saving you time on implementation.
              </p>

              <div className="w-[90%] h-fit flex overflow-hidden gap-12 cursor-pointer m-auto slider">
                <div className="flex flex-shrink-0 min-w-full justify-between items-center gap-12 slide-track">
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}
                    />
                  </div >
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}
                    />
                  </div>
                  <div className="w-[250px] h-[00px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}
                    />
                  </div>
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}
                    />
                  </div>
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}
                    />
                  </div>
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}>

                    </img>
                  </div>
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}
                    />
                  </div >
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}
                    />
                  </div>
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}
                    />
                  </div>
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}
                    />
                  </div>
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}
                    />
                  </div>
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}>

                    </img>
                  </div>
                </div>
                <div className="flex flex-shrink-0 min-w-full justify-between items-center gap-12 slide-track">
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}
                    />
                  </div >
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}
                    />
                  </div>
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}
                    />
                  </div>
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}
                    />
                  </div>
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}
                    />
                  </div>
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}>

                    </img>
                  </div>
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}
                    />
                  </div >
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}
                    />
                  </div>
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}
                    />
                  </div>
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}
                    />
                  </div>
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}
                    />
                  </div>
                  <div className="w-[250px] h-[200px] flex justify-center">
                    <img
                      className="w-full"
                      src={logo}>

                    </img>
                  </div>
                </div>
                
              </div>

            </div>
          </main>
        </div>
      </div>
      <main>
        <div className="px-6 py-12 max-w-7xl mx-auto text-center overflow-hidden">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 break-words">
            Supercharge Business <br/> Productivity with ECell SOA
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto mb-10">
            Our intelligent leads are crafted to think, act, and optimize like
            experts—driving your success
          </p>
        </div>

        <div className="grid w-[90%] md:w-[95%] lg:w-[85%] grid-cols-1 md:grid-cols-3 relative left-1/2 gap-12 -translate-x-1/2 h-full">

          {agents.map((agent, index) => (
            <div key={index} className="relative group rounded-3xl overflow-hidden h-[75vh] md:h-[65vh] shadow-lg border-gray-100 border-8">
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
          <p className="text-gray-600 max-w-xl mx-auto mb-10">
            Customizable AI automations that integrate seamlessly with your
            tools.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-2xl p-6 text-left hover:shadow-lg transition-shadow duration-300"
              >
                
                <div className="flex items-center gap-4 mb-4">
                  <img
                  src={tool.logo}
                  alt={`${tool.name} Logo`}
                  className="w-12 h-12 mb-4"
                />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                    <p className="text-gray-600 mb-4">{tool.year}</p>
                  </div>
                </div>
                <p className="text-gray-700">{tool.description}</p>
               
              </div>
            ))}
          </div>
        </div>
        <AIAgentFAQ />
        <div className="px-6 py-12 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            ALUMNI REVIEWS
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-10">
            Hear what our alumni has to say
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-2xl p-6 text-left hover:shadow-lg transition-shadow duration-300"
              >
                
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={tool.logo}
                    alt={`${tool.name} Logo`}
                    className="w-12 h-12 mb-4 border-4 border-gray-200 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                    <p className="text-gray-600 mb-4">{tool.year}</p>
                  </div>
                </div>
                <p className="text-gray-700">{tool.description}</p>
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
    </div>
  );
}
export default Home;
