
import image from "./about.png";
import Animation from "./Assets/AuroraBackground.js"
import Footer from "./footer.js";
function About() {
    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Animation />
      </div>
            <div className=" relative z-10">
                <div>
                    <main className="text-white">
                        <div className="flex flex-col justify-center items-center lg:h-[100vh] max-sm:h-[70vh] sm:h-[70vh] mt-[-5%]">
                            <h1 className="font-bold text-5xl md:text-6xl bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">Who we are</h1>
                            <p className="mt-4 w-[90%] text-wrap text-center text-white/80">
                                Empowering businesses with cutting-edge AI solutions to streamline operations, enhance <br/>productivity, and drive innovation for a smarter tomorrow.
                            </p>
                        </div>

                        <img className="lg:mt-[-10%] sm:mt-[-20%] max-sm:mt-[-30%] w-[70%] block mx-auto rounded-[20px] border-white border-2 max-w-[1500px] mb-10" style={{ transformStyle: "preserve-3d" }} src={image} />

                        <p className="font-black text-center text-white">
                            Powered by most advanced AI models. FreeOS integrates top AI models
                            into a simple UX, saving you time on implementation.
                        </p>


                        <div className="text-center text-wrap grid gap-5 relative mb-20 top-10">
                            <h2 className="font-bold text-4xl bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">Investors</h2>
                            <p className="w-[90%] md:w-[70%] max-w-[1500px] mx-auto text-lg text-white/80"> We're proud to be backed by some of the most visionary investors in the industry. Our supporters include top-tier venture firms and world-class founders and product innovators who share our mission of transforming the future with AI-driven solutions.</p>
                        </div>


                        <div className="p-4 bg-white/10 backdrop-blur-md w-[70%] max-w-[1500px] hidden md:block mx-auto rounded-3xl mt-6 border border-white/20">
                            <div className="mb-4">
                                <h2 className="text-xl font-bold mt-4 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">Values We Give</h2>
                                <p className="text-sm text-white/80">Building great big things starts with a decision</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-4 mb-4 rounded-xl border border-white/20">
                                <p className="font-bold text-white">Innovation</p>
                                <p className="text-white/80"> We are committed to pushing the boundaries of technology, empowering businesses with cutting-edge AI solutions that drive growth and efficiency.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-4 mb-4 rounded-xl border border-white/20">
                                <p className="font-bold text-white">Empowerment</p>
                                <p className="text-white/80">We believe in empowering teams by automating repetitive tasks, allowing humans to focus on creativity, strategy, and innovation. </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-4 mb-4 rounded-xl border border-white/20">
                                <p className="font-bold text-white">Integrity</p>
                                <p className="text-white/80"> Trust is the foundation of our work. We prioritize transparency, ethical AI practices, and data security to build lasting relationships with our clients</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-4 mb-4 rounded-xl border border-white/20">
                                <p className="font-bold text-white">Collaboration</p>
                                <p className="text-white/80"> Our AI agents are designed to work seamlessly with human teams, fostering collaboration that achieves remarkable results.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                                <p className="font-bold text-white">Sustainability</p>
                                <p className="text-white/80">By optimizing resources and processes, we strive to contribute to a more sustainable and efficient digital ecosystem. </p>
                            </div>
                        </div>

                        <div className="relative top-10 mb-20 justify-center grid gap-5 text-center">
                            <h2 className="font-bold text-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">A Team Builds Tomorrow</h2>
                            <p className="text-sm w-[90%] text-center text-white/80">At Aigents we are working on creating a sustainable future using AI.</p>
                            <div className="w-[60%] mx-auto flex justify-center flex-col md:flex-row gap-8">
                                <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 flex-1 flex flex-col items-center justify-center p-8">
                                    <p className="text-xl font-bold text-white">50+</p>
                                    <p className="text-lg text-white/80">Customers</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 flex-1 flex flex-col items-center justify-center p-8">
                                    <p className="text-xl font-bold text-white">20+</p>
                                    <p className="text-lg text-white/80">Members</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 flex-1 flex flex-col items-center justify-center p-8">
                                    <p className="text-xl font-bold text-white">8</p>
                                    <p className="text-lg text-white/80">Countries</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative top-10 mb-20 justify-center grid gap-5 text-center">
                            <h3 className="font-bold text-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">On a way towards AGI</h3>
                            <p className="w-[90%] md:w-[60%] max-w-[1500px] mx-auto text-[15px] text-white/80">We're developing generative AI agents to help organizations automate repetitive tasks, enhance productivity, and empower teams to focus on what truly matters.</p>
                            <img className="h-[400px] w-[90%] md:w-[60%] block mx-auto rounded-[20px] border-2 border-white max-w-[1500px]" style={{ transformStyle: "preserve-3d" }} src={image} />
                            <p className="w-[90%] md:w-[60%] max-w-[1500px] mx-auto text-[15px] text-white/80">We believe that even the smallest actions can create a ripple effect, leading to something truly impactful. That's why we've dedicated ourselves to building a platform that empowers visionaries, creators, and doers to streamline their efforts, maximize their potential, and turn ideas into reality—without unnecessary complexity.</p>
                            <p className="w-[90%] md:w-[60%] max-w-[1500px] mx-auto text-[15px] text-white/80">Innovation thrives when barriers are removed, and efficiency meets creativity. Our mission is to equip builders, makers, and change-makers with the tools they need to focus on what truly matters—bringing bold ideas to life, accelerating progress, and making a lasting impact with minimal effort.</p>
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
export default About;