import React from "react";
import { Link } from "react-router-dom";
import Footer from "./footer.js";
import Card3D from "./Card3D";

//Team 2025
import Kiran from "./Assets/Team Image/Kiran.jpg";
import PD from "./Assets/Team Image/PD2.jpg";
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

//Team 2026
import Sanat from "./Assets/Team 2026/Sanat.jpg";
import Bibhu from "./Assets/Team 2026/Bibhu.jpeg";
import Eshan from "./Assets/Team 2026/Eshan.jpeg";
import Abhinav from "./Assets/Team 2026/Abhinav.png";
import Chinmayee from "./Assets/Team 2026/Chinmayee.jpeg";
import Anurag from "./Assets/Team 2026/Anurag.jpg";
import Sujay from "./Assets/Team 2026/Sujay.jpeg";
import Rohit from "./Assets/Team 2026/Rohit.png";
import Saloni from "./Assets/Team 2026/Saloni.jpg";
import Miraa from "./Assets/Team 2026/Miraa.png";
import Digant from "./Assets/Team 2026/Digant.png";
import Varshit from "./Assets/Team 2026/Varshit.jpg";
import Subham from "./Assets/Team 2026/Subham.jpeg";
import Subhakanta from "./Assets/Team 2026/Subhakanta.jpeg";
import Tanim from "./Assets/Team 2026/Tanim.jpeg";
import Sadiya from "./Assets/Team 2026/Sadiya.jpg";
import Shweta from "./Assets/Team 2026/Shweta.jpg";


const agents = [
    { name: "Sanat Sikhar Sinha", role: "President", link: "https://www.linkedin.com/in/sanatsinhaa/", image: Sanat },
    { name: "Kumar Bibhudatta", role: "Vice-President", link: "https://www.linkedin.com/in/kumar-bibhudatta-22ba85308/", image: Bibhu },
    { name: "Eshab Mohanty", role: "Manager", link: "https://www.linkedin.com/in/eshan-mohanty-18b369366/", image: Eshan },
    { name: "Abhinav Singh", role: "Treasurer", link: "https://www.linkedin.com/in/abhinav-singh2609/", image: Abhinav },
    { name: "Sujay Jagat", role: "Technical Lead", link: "https://www.linkedin.com/in/sujay-jagat-7ab37b32a/", image: Sujay },
    { name: "Rohit Kumar", role: "Technical Co-Lead", link: "https://www.linkedin.com/in/rohit-kumar-238b26316/", image: Rohit },
    { name: "Digant Priyadarshi", role: "Design Lead", link: "https://www.linkedin.com/in/digant-priyadarshi/", image: Digant },
    { name: "Sai Varshit", role: "Design Co-Lead", link: "https://www.linkedin.com/in/sai-varshit-km-6231942b5/", image: Varshit },
    { name: "Chinmayee Patnaik", role: "Media Lead", link: "https://www.linkedin.com/in/chinmayee-patnaik-5581b4327/", image: Chinmayee },
    { name: "Anurag Singh", role: "Media Co-Lead", link: "https://www.linkedin.com/in/anuragsingh2102", image: Anurag },
    { name: "Subham Panda", role: "Event-Management Lead", link: "https://www.linkedin.com/in/subham-panda-764a69293/", image: Subham },
    { name: "Subhakanta Das", role: "Event-Management Co-Lead", link: "https://www.linkedin.com/in/subhakanta-das-53b989329/", image: Subhakanta },
    { name: "Saloni Kumari", role: "Content Lead", link: "https://www.linkedin.com/in/saloni2005/", image: Saloni },
    { name: "Miraa Nayak", role: "Content Co-Lead", link: "https://www.linkedin.com/in/mira-rani-nayak-973970309/", image: Miraa },
    { name: "Shaikh Minhazuddin ", role: "Public-Relations Lead", link: "https://www.linkedin.com/in/shaikh-minhazuddin-b1b904348/", image: Tanim },
    { name: "Sadiya Ahmed", role: "Public-Relations Co-Lead", link: "https://www.linkedin.com/in/sadiya-ahmed-09232a277/", image: Sadiya },
    {name: "ShwetaSingh", role: "Campus Representative", link: "https://www.linkedin.com/in/shweta-singh-527363352/", image: Shweta }
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
                                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-40 text-white p-4 rounded-xl group-hover:text-white group-hover:bg-[#131313] transition-all w-full" style={{maxWidth:'90%'}}>
                                            <h3 className="text-lg font-semibold">{agent.name}</h3>
                                            <p className="text-sm">{agent.role}</p>
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