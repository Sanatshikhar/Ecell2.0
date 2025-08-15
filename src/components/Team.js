import React from "react";
import { Link } from "react-router-dom";
import Footer from "./footer.js";
import Kiran from "./Assets/Team Image/Kiran.jpg"
import Pd from "./Assets/Team Image/IMG_20241004_121433 - Pratikshya Dash.jpg"
import Ns from "./Assets/Team Image/IMG-20241011-WA0082 - Nabhonil Sarkar.jpg"
import Sss from "./Assets/Team Image/Sanat.jpg"
import Sn from "./Assets/Team Image/1728224366006 - Somyashree Nayak.jpg"
import S from "./Assets/Team Image/1722692967587 - Shubhangini.jpeg"
import AP from "./Assets/Team Image/AB.jpg"
import TD from "./Assets/Team Image/TD.jpg"
import AS from "./Assets/Team Image/AS.jpg"
import KK from "./Assets/Team Image/KK.jpg"
import SK from "./Assets/Team Image/SK.jpg"
import SM from "./Assets/Team Image/SM.jpg"
import Ms from "./Assets/Team Image/Ms.jpg"
const agents = [
    { name: "Kiran Panigrahi", role: "President", link: "https://www.linkedin.com/in/kiran-panigrahi-996223202/", image: Kiran },
    { name: "Pratikshya Dash", role: "Vice-President", link: "https://www.linkedin.com/in/pratikshya-dash/", image: Pd },
    { name: "Abhay Prakash", role: "Advisor", link: "https://www.linkedin.com/in/abhay-prakash-ab143a262/", image: AP },
    { name: "Mimansa Satpathy", role: "Treasurer", link: "https://www.linkedin.com/in/mimansa-satpathy/", image: Ms },
    { name: "Tiyash Das Gupta", role: "Manager", link: "https://www.linkedin.com/in/tiyash13/++", image: TD },
    { name: "Sanat Sikhar Sinha", role: "Technical Team", link: "/TechTeam", image: Sss },
    { name: "Arnab Sahoo", role: "Design Team", link: "#", image: AS },
    { name: "Nobhonil Sarkar", role: "Media Team", link: "#", image: Ns },
    { name: "Samarth Kumar", role: "Event-Management Team", link: "#", image: SK },
    { name: "Stuti Mishra", role: "Content Team", link: "#", image: SM },
    { name: "Kumari Shubhangini", role: "Public-Relations Team", link: "#", image: S },
    { name: "Ketan Kumar", role: "Operations Team", link: "#", image: KK },
    { name: "Somyashree Nayak", role: "Marketing & Sponsorships Team", link: "#", image: Sn },
];

function Team() {
    return (
        <div>
            <div className="bg-gradient-to-t from-[rgba(223,219,255,0)] to-[rgba(223,219,255,1)]">
                <div>
                    <main className="">
                        <div className="flex flex-col justify-center items-center h-screen mt-[-5%]">
                            <h1 className="font-bold text-6xl bg-gradient-to-r from-[#008FF6] via-[#CD5BF4] to-[#F4520D] bg-clip-text text-transparent">{" "}
                                The Hall of Fame{" "}</h1>
                            <p className="mt-4 text-center">
                                Meet the Legends of our Community
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 mx-7 w-3/4 mt-[-15%] relative left-1/2 -translate-x-1/2 w-[83%] h-full ml-[-0.2%] mb-20">
                            {agents.map((agent, index) => (
                                <div key={index} className="relative cursor-pointer group rounded-2xl overflow-hidden shadow-lg border-4 border-gray-400">
                                    <Link to={agent.link}>
                                        <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
                                        <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-40 text-white p-4 rounded-xl group-hover:text-black group-hover:bg-white transition-all">
                                            <h3 className="text-lg font-semibold">{agent.role}</h3>
                                            <p className="text-sm">{agent.name}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Team;
