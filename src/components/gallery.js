import Footer from "./footer";
import Shubhangini from "./Assets/Team Image/1722692967587 - Shubhangini.jpeg";
import Somyashree from "./Assets/Team Image/1728224366006 - Somyashree Nayak.jpg";
import Nabhonil from "./Assets/Team Image/IMG-20241011-WA0082 - Nabhonil Sarkar.jpg";
import Pratikshya from "./Assets/Team Image/IMG_20241004_121433 - Pratikshya Dash.jpg";
import Kiran from "./Assets/Team Image/Kiran.jpg";
import Sanat from "./Assets/Team Image/Sanat.jpg";
import KK from "./Assets/Team Image/KK.jpg";
import Ms from "./Assets/Team Image/Ms.jpg";
import SK from "./Assets/Team Image/SK.jpg";
import SM from "./Assets/Team Image/SM.jpg";
import TD from "./Assets/Team Image/TD.jpg";
import AB from "./Assets/Team Image/AB.jpg";
import AS from "./Assets/Team Image/AS.jpg";

const galleryImages = [
  { name: "Shubhangini", image: Shubhangini },
  { name: "Somyashree Nayak", image: Somyashree },
  { name: "Nabhonil Sarkar", image: Nabhonil },
  { name: "Pratikshya Dash", image: Pratikshya },
  { name: "Kiran Panigrahi", image: Kiran },
  { name: "Sanat Sikhar Sinha", image: Sanat },
  { name: "KK", image: KK },
  { name: "Ms", image: Ms },
  { name: "SK", image: SK },
  { name: "SM", image: SM },
  { name: "TD", image: TD },
  { name: "AB", image: AB },
  { name: "AS", image: AS },
];

const carouselImages = [
  Shubhangini, Somyashree, Nabhonil, Pratikshya, Kiran, Sanat, KK, Ms, SK, SM, TD, AB, AS
];

function getBoxClass(idx) {
  // Ozeum-style collage: more variety, some vertical, some horizontal, some square
  const styles = [
    "aspect-square h-[340px] w-[340px]", // square
    "aspect-[4/5] h-[420px] w-[340px]", // portrait
    "aspect-[5/4] h-[340px] w-[420px]", // landscape
    "aspect-square h-[380px] w-[380px]", // big square
    "aspect-[3/2] h-[340px] w-[510px]", // wide
    "aspect-[2/3] h-[510px] w-[340px]", // tall
    "aspect-[5/6] h-[400px] w-[340px]", // vertical
    "aspect-[6/5] h-[340px] w-[400px]", // horizontal
  ];
  return styles[idx % styles.length];
}

function Gallery() {
  return (
    <div className="bg-[#f5f5f7] min-h-screen font-sans">
  {/* ...no custom header/topbar... */}

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 bg-gradient-to-r from-[#008FF6] via-[#CD5BF4] to-[#F4520D]">
        <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-6 tracking-tight text-center drop-shadow-lg uppercase mt-12">Gallery</h1>
        <p className="text-2xl md:text-3xl text-white/80 max-w-2xl text-center mb-8">A modern showcase of our best moments, events, and creative spirit.</p>
      </section>

      {/* Carousel Section */}
      <section id="carousel" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10 text-[#008FF6]">Gallery Highlights</h2>
          <div className="relative w-full overflow-hidden">
            <div className="flex gap-10 animate-carousel">
              {carouselImages.map((img, idx) => (
                <div key={idx} className="min-w-[400px] h-[260px] rounded-3xl overflow-hidden shadow-xl">
                  <img src={img} alt="Highlight" className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`
          @keyframes carousel {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-carousel {
            animation: carousel 30s linear infinite;
          }
        `}</style>
      </section>

      {/* Masonry Gallery Section */}
      <section id="gallery" className="py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-12 text-[#CD5BF4] uppercase tracking-wide">Our Collection</h2>
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-10 space-y-10">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                className={`gallery-photo-box break-inside-avoid bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 group relative overflow-hidden`}
                style={{ marginBottom: '2rem', display: 'inline-block' }}
              >
                <img
                  src={img.image}
                  alt={img.name}
                  className={`object-cover w-full rounded-2xl transition-transform duration-500 group-hover:scale-105 ${getBoxClass(idx)}`}
                  style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <span className="text-white text-2xl font-bold drop-shadow-lg mb-2">{img.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-r from-[#CD5BF4] via-[#008FF6] to-[#F4520D] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 uppercase tracking-wide">About IEC Gallery</h2>
          <p className="text-2xl mb-8">IEC Gallery is a celebration of creativity, innovation, and memories. Our collection features highlights from events, team moments, and the vibrant spirit of our community.</p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Gallery;