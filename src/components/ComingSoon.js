
import { SparklesCore } from "./SparklesCore";


const ComingSoon = () => (
  <div className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden px-2 sm:px-4">
    <SparklesCore className="absolute inset-0 w-full h-full z-0" particleColor="#B909F0" particleDensity={100} />
    <div className="relative z-10 flex flex-col items-center justify-center w-full">
      <h1
        className="text-3xl p-4 xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] bg-clip-text text-transparent text-center leading-tight"
        style={{ wordBreak: 'break-word', lineHeight: 1.1 }}
      >
        Coming Soon
      </h1>
      <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-2xl text-gray-300 mb-4 sm:mb-8 text-center max-w-xs sm:max-w-md md:max-w-xl" style={{ wordBreak: 'break-word' }}>
        We're working hard to bring you something amazing.<br className="hidden xs:block" />Stay tuned!
      </p>
    </div>
  </div>
);

export default ComingSoon;
