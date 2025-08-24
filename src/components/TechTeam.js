import React from "react";
import Footer from "./footer.js";
import Sss from "./Assets/Team Image/Sanat.jpg";
import { Link } from "react-router-dom";

const agents = [ 
  { 
    name: "Sanat Sikhar Sinha", 
    role: "Technical Team", 
    link: "https://in.linkedin.com/in/sanatsinhaa", 
    image: Sss 
  },
];

function TechTeam() {
  return (
    <div className="bg-gradient-to-t from-[rgba(223,219,255,0)] to-[rgba(223,219,255,1)] min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="flex flex-col justify-center items-center h-screen mt-[-5%]">
          <h1 className="font-bold text-6xl bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] bg-clip-text text-transparent">
            Teams
          </h1>
          <p className="mt-4 text-center max-w-xl">
            Empowering businesses with cutting-edge AI solutions to streamline operations,
            enhance productivity, and drive innovation for a smarter tomorrow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-5 max-w-6xl mx-auto mt-[-10%] mb-20">
          {agents.map((agent, index) => (
            <div key={index} className="relative cursor-pointer group rounded-2xl overflow-hidden shadow-lg border-4 border-gray-400">
              <Link href={agent.link} target="_blank" rel="noopener noreferrer" className="no-underline">
                <img src={agent.image} alt={agent.name} className="w-full h-80 object-cover" />
                <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-40 text-white p-4 rounded-xl group-hover:text-black group-hover:bg-white transition-all">
                  <h3 className="text-lg font-semibold">{agent.name}</h3>
                  <p className="text-sm">{agent.role}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default TechTeam;
