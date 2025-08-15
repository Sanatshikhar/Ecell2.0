
import image from "./about.png";

import Footer from "./footer.js";
function About() {
    return (
        <div>
            <div className="bg-gradient-to-t from-[rgba(223,219,255,0)] to-[rgba(223,219,255,1)]">
                <div>
                    <main className="">
                        <div className="flex flex-col justify-center items-center h-screen mt-[-5%]">
                            <h1 className="font-bold text-5xl md:text-6xl bg-gradient-to-r from-[#008FF6] via-[#CD5BF4] to-[#F4520D] bg-clip-text text-transparent">Who we are</h1>
                            <p className="mt-4 w-[90%] text-wrap text-center">
                                Empowering businesses with cutting-edge AI solutions to streamline operations, enhance <br></br>productivity, and drive innovation for a smarter tomorrow.
                            </p>
                        </div>


                        <img className="mt-[-10%] w-[70%] block mx-auto rounded-[20px] border border-white border-[3px] max-w-[1500px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] " style={{ transformStyle: "preserve-3d" }} src={image} />

                        <p className="font-black text-center">

                            Powered by most advanced AI models. FreeOS integrates top AI models
                            into a simple UX, saving you time on implementation.
                        </p>

                        


                        <div className="text-center text-wrap grid gap-5 relative mb-20 top-10">
                            <h2 className="font-bold text-4xl text-black"> Investors  </h2>
                            <p className="w-[90%] md:w-[70%] max-w-[1500px] mx-auto text-lg"> We're proud to be backed by some of the most visionary investors in the industry. Our supporters include top-tier venture firms and world-class founders and product innovators who share our mission of transforming the future with AI-driven solutions.</p>
                        </div>



                        <div className="p-4 bg-gray-100 w-[70%] max-w-[1500px] hidden md:block mx-auto rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] mt-6">
                            <div className="mb-4">
                                <h2 className="text-xl font-bold mt-4">Values We Give</h2>
                                <p className="text-sm text-black-600">Building great big things starts with a decision</p>

                            </div>
                            <div className="bg-white p-4 mb-4 rounded-md"> <p className="font-bold" > Innovation</p>
                                <p> We are committed to pushing the boundaries of technology, empowering businesses with cutting-edge AI solutions that drive growth and efficiency.</p></div>
                            <div className="bg-white p-4 mb-4 rounded-md"> <p className="font-bold" > Empowerement </p>
                                <p>We believe in empowering teams by automating repetitive tasks, allowing humans to focus on creativity, strategy, and innovation. </p></div>
                            <div className="bg-white p-4 mb-4 rounded-md"> <p className="font-bold" > Integrity </p>
                                <p> Trust is the foundation of our work. We prioritize transparency, ethical AI practices, and data security to build lasting relationships with our clients</p></div>
                            <div className="bg-white p-4 mb-4 rounded-md"> <p className="font-bold" > Collaboration </p>
                                <p> Our AI agents are designed to work seamlessly with human teams, fostering collaboration that achieves remarkable results.</p></div>
                            <div className="bg-white p-4 rounded-md"> <p className="font-bold" > Sustainability </p>
                                <p>By optimizing resources and processes, we strive to contribute to a more sustainable and efficient digital ecosystem. </p> </div>
                        </div>

                        <div className="relative top-10 mb-20 justify-center grid   gap-5 text-center">
                            <h2 className="font-bold text-2xl text-black">  A Team Builds Tomorrow </h2>
                            <p className="text-sm w-[90%] text-center text-black-600"> At Aigents we working on creating a sustainable future using AI.</p>
                            <div className="w-[60%] mx-auto flex justify-center flex-col md:flex-row gap-8">
                                <div className=" bg-[#EDD7FB] rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex-1 flex flex-col items-center justify-center p-8"> <p className=" text-xl font-bold"> 50+ </p> <p className=" text-lg"> Customers </p></div>
                                <div className="bg-[#EDD7FB] rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex-1   flex flex-col items-center justify-center p-8"> <p className=" text-xl font-bold"> 20+ </p> <p className=" text-lg "> Members </p> </div>
                                <div className=" bg-[#EDD7FB] rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex-1 flex flex-col items-center justify-center p-8">
                                    <p className=" text-xl font-bold" > 8 </p> <p className=" text-lg"> Countries </p>
                                </div>

                            </div>
                        </div>

                        <div className="relative top-10 mb-20 justify-center grid   gap-5 text-center">
                        <h3 className="font-bold text-2xl text-black">  On a way towards AGI </h3>
                        <p className="w-[90%] md:w-[60%] max-w-[1500px] mx-auto text-[15px] text-black-600"> We're developing generative AI agents to help organizations automate repetitive tasks, enhance productivity, and empower teams to focus on what truly matters. </p>
                        <img className=" h-[400px] w-[90%] md:w-[60%] block mx-auto rounded-[20px] border-2 border-white max-w-[1500px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] " style={{ transformStyle: "preserve-3d" }} src={image} />
                        <p className="w-[90%] md:w-[60%] max-w-[1500px] mx-auto text-[15px] text-black-600"> We believe that even the smallest actions can create a ripple effect, leading to something truly impactful. That's why we've dedicated ourselves to building a platform that empowers visionaries, creators, and doers to streamline their efforts, maximize their potential, and turn ideas into reality—without unnecessary complexity.</p>
                        <p className="w-[90%] md:w-[60%] max-w-[1500px] mx-auto text-[15px] text-black-600"> Innovation thrives when barriers are removed, and efficiency meets creativity. Our mission is to equip builders, makers, and change-makers with the tools they need to focus on what truly matters—bringing bold ideas to life, accelerating progress, and making a lasting impact with minimal effort.</p>
                        </div>

                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
}
export default About;