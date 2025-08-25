import React from "react";
import { Link } from "react-router-dom";
import Footer from "./footer.js";
import Card3D from "./Card3D";
import Kiran from "./Assets/Team Image/Kiran.jpg";
import PD from "./Assets/Team Image/PD.jpg";
import NS from "./Assets/Team Image/NS.jpg";
import Sss from "./Assets/Team Image/Sanat.jpg";
import Sn from "./Assets/Team Image/SN.jpg";
import S from "./Assets/Team Image/S.jpeg";
import AP from "./Assets/Team Image/AB.jpg";
import TD from "./Assets/Team Image/TD.jpg";
import AS from "./Assets/Team Image/AS.jpg";
import KK from "./Assets/Team Image/KK.jpg";
import SK from "./Assets/Team Image/SK.jpg";
import SM from "./Assets/Team Image/SM.jpg";
import Ms from "./Assets/Team Image/Ms.jpg";
const agents = [
    { name: "Kiran Panigrahi", role: "President", link: "https://www.linkedin.com/in/kiran-panigrahi-996223202/", image: Kiran },
    { name: "Pratikshya Dash", role: "Vice-President", link: "https://www.linkedin.com/in/pratikshya-dash/", image: PD },
    { name: "Abhay Prakash", role: "Advisor", link: "https://www.linkedin.com/in/abhay-prakash-ab143a262/", image: AP },
    { name: "Mimansa Satpathy", role: "Treasurer", link: "https://www.linkedin.com/in/mimansa-satpathy/", image: Ms },
    { name: "Tiyash Das Gupta", role: "Manager", link: "https://www.linkedin.com/in/tiyash13/++", image: TD },
    { name: "Sanat Sikhar Sinha", role: "Technical Team", link: "/TechTeam", image: Sss },
    { name: "Arnab Sahoo", role: "Design Team", link: "#", image: AS },
    { name: "Nobhonil Sarkar", role: "Media Team", link: "#", image: NS },
    { name: "Samarth Kumar", role: "Event-Management Team", link: "#", image: SK },
    { name: "Stuti Mishra", role: "Content Team", link: "#", image: SM },
    { name: "Kumari Shubhangini", role: "Public-Relations Team", link: "#", image: S },
    { name: "Ketan Kumar", role: "Operations Team", link: "#", image: KK },
    { name: "Somyashree Nayak", role: "Marketing & Sponsorships Team", link: "#", image: Sn },
];

function Team() {
    return (
        <div>
            <div className="team-section-container" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: 'black' }}>
                {/* SVG blue ball background, matching Home hero section */}
                <svg className="absolute top-0 left-0 w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] opacity-50 z-0 pointer-events-none" viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="450" cy="450" r="450" fill="url(#paint0_radial)" />
                    <defs>
                        <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(450 450) scale(450)" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#2c2d78" stopOpacity="0.8" />
                            <stop offset="1" stopColor="#232946" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>
                {/* Bottom right SVG blue ball */}
                <svg className="absolute bottom-0 right-0 w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] opacity-50 z-0 pointer-events-none" viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="450" cy="450" r="450" fill="url(#paint1_radial)" />
                    <defs>
                        <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientTransform="translate(450 450) scale(450)" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#2c2d78" stopOpacity="0.8" />
                            <stop offset="1" stopColor="#232946" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>
                {/* Optionally keep blurred blue balls for extra depth */}
                <div className="absolute top-[-20%] left-[-20%] w-[70vw] h-[70vh] bg-blue-700/30 rounded-full blur-[100px] opacity-80 pointer-events-none z-0"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[70vw] h-[70vh] bg-blue-700/30 rounded-full blur-[100px] opacity-80 pointer-events-none z-0"></div>
                <div className="relative z-10" >
                    <main>
                        <div className="flex flex-col justify-center items-center lg:h-[100vh] max-sm:h-[70vh]  sm:h-[70vh] mt-[-5%]">
                            <h1 className="font-bold text-6xl max-sm:text-5xl bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] bg-clip-text text-transparent">{" "}
                                The Hall of Fame{" "}</h1>
                            <p className="mt-4 text-center text-white">
                                Meet the Legends of our Community
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-center items-center mt-[-15%] mb-20" style={{ display: 'grid', placeItems: 'center' }}>
                            {agents.map((agent, index) => (
                                <Card3D key={index} image={agent.image} title={agent.role}>
                                    <Link to={agent.link}>
                                        <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-40 text-white p-4 rounded-xl group-hover:text-white group-hover:bg-[#131313] transition-all w-full">
                                            <h3 className="text-lg font-semibold">{agent.role}</h3>
                                            <p className="text-sm">{agent.name}</p>
                                        </div>
                                    </Link>
                                </Card3D>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
            <Footer />
            {/* Ensure footer is above animation */}
            <style>{`
                            footer { position: relative; z-index: 20; }
                        `}</style>
        </div>
    );
}

export default Team;
