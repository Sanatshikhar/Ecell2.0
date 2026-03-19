import React, { useState } from "react";
import Footer from "./footer";
// Import images from Gallery directory
// Explicitly import all images from the Gallery directory

import Img1 from "./Assets/Gallery/Copy of DSC00770.jpg";
import Img2 from "./Assets/Gallery/Copy of DSC04852.jpg";
import Img3 from "./Assets/Gallery/Copy of DSC04806.jpg";
import Img4 from "./Assets/Gallery/20250523_180254.jpg";


import Img7 from "./Assets/Gallery/171A7644.JPG";
import Img8 from "./Assets/Gallery/Copy of IMG_4094-Enhanced-NR.jpg";
import Img9 from "./Assets/Gallery/171A7637.JPG";
import Img10 from "./Assets/Gallery/Copy of IMG_6031.jpg";
import Img11 from "./Assets/Gallery/Copy of IMG_4101.jpg";
import Img12 from "./Assets/Gallery/171A7635.JPG";
import Img13 from "./Assets/Gallery/171A7625.JPG";
import Img14 from "./Assets/Gallery/DSC03982.JPG";
import Img15 from "./Assets/Gallery/171A7622.JPG";
import Img16 from "./Assets/Gallery/171A7614.JPG";
import Img17 from "./Assets/Gallery/171A7612.JPG";
import Img18 from "./Assets/Gallery/171A7601.JPG";
import Img19 from "./Assets/Gallery/171A7535.JPG";
import Img20 from "./Assets/Gallery/171A7533 (1).JPG";
import Img21 from "./Assets/Gallery/171A7500.JPG";
import Img22 from "./Assets/Gallery/DSC04063.JPG";
import Img23 from "./Assets/Gallery/DSC04007.JPG";
import Img24 from "./Assets/Gallery/171A7485.JPG";
import Img25 from "./Assets/Gallery/171A7462.JPG";
import Img26 from "./Assets/Gallery/171A7446.JPG";
import Img27 from "./Assets/Gallery/DSC04210.JPG";
import Img28 from "./Assets/Gallery/171A7443.JPG";
import Img29 from "./Assets/Gallery/171A7415.JPG";
import Img30 from "./Assets/Gallery/171A7409.JPG";
import Img31 from "./Assets/Gallery/IMG_7434.JPG";
import Img32 from "./Assets/Gallery/IMG_4111.jpg";
import Img33 from "./Assets/Gallery/IMG_4036.jpg";
import Img34 from "./Assets/Gallery/IMG_1807.jpg";
import Img35 from "./Assets/Gallery/IMG-20250529-WA0078.jpg";
import Img36 from "./Assets/Gallery/IMG-20250529-WA0069.jpg";
import Img37 from "./Assets/Gallery/IMG-20250529-WA0066.jpg";

import Img39 from "./Assets/Gallery/EDITTED  (96).JPG";
import Img40 from "./Assets/Gallery/DSC_0270.jpg";
import Img41 from "./Assets/Gallery/DSC_0122.jpg";
import Img42 from "./Assets/Gallery/DSC_0120.jpg";
import Img43 from "./Assets/Gallery/DSC_0060.jpg";
import Img44 from "./Assets/Gallery/DSC_0032.jpg";
import Img45 from "./Assets/Gallery/DSC04971.jpg";
import Img46 from "./Assets/Gallery/DSC04968.jpg";
import Img47 from "./Assets/Gallery/WhatsApp Image 2025-08-25 at 03.25.50_aae79243.jpg";
import RegistrationSlider from './RegistrationSlider/RegistrationSlider';

const allGalleryImages = [
  Img1, Img2, Img3, Img4, Img7, Img8, Img9, Img10,
  Img11, Img12, Img13, Img14, Img15, Img16, Img17, Img18, Img19, Img20,
  Img21, Img22, Img23, Img24, Img25, Img26, Img27, Img28, Img29, Img30,
  Img31, Img32, Img33, Img34, Img35, Img36, Img37, Img39, Img40,
  Img41, Img42, Img43, Img44, Img45, Img46, Img47
].map((img, idx) => ({ name: `Gallery ${idx + 1}`, image: img }));
// ...existing code...


// Removed unused galleryImages, carouselImages, getBoxClass, and landscapeImages
// Removed leftover lines from getBoxClass and landscapeImages

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function Gallery() {
  const [popupImg, setPopupImg] = useState(null);
  const [popupAlt, setPopupAlt] = useState("");
  const closePopup = () => setPopupImg(null);
  const [shuffledImages] = useState(() => shuffleArray(allGalleryImages));
  // Only use landscape images for highlights
  const shuffledHighlights = []; // landscapeImages removed
  return (
    <div>
      <section id="gallery" className="py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-[#3d81f6] to-[#b80bf0] bg-clip-text text-transparent uppercase tracking-wide">Our Collection</h2>
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
            {shuffledImages.map((img, idx) => (
              <img
                key={idx}
                src={img.image}
                alt={img.name}
                className="w-full mb-4 rounded-xl shadow-lg break-inside-avoid object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                style={{ display: 'block', width: '100%', borderRadius: '1rem', boxShadow: '0 4px 24px rgba(0,0,0,0.32)' }}
                loading="lazy"
                onClick={() => { setPopupImg(img.image); setPopupAlt(img.name); }}
              />
            ))}
          </div>
          {popupImg && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={closePopup}>
              <div className="relative max-w-3xl w-full mx-4" onClick={e => e.stopPropagation()}>
                <button onClick={closePopup} className="absolute top-2 right-2 text-white text-3xl font-bold bg-black/60 rounded-full px-3 py-1 hover:bg-black/90 transition-colors">&times;</button>
                <img src={popupImg} alt={popupAlt} className="w-full max-h-[80vh] object-contain rounded-xl border-4 border-white shadow-2xl bg-black" />
              </div>
            </div>
          )}
        </div>
      </section>
      
      <Footer />

    </div>
  );
}

export default React.memo(Gallery);
