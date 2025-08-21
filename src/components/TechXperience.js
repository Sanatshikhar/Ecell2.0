import React, { useState } from 'react';
import logo from './logo.png';
import sampleEvent from '../components/Assets/Resonance.png';
import styles from './TechXperience.module.css';

import ResonanceForm from './ResonanceForm';
import Danza from '../components/Assets/logo/Danza.png';
import Aic from '../components/Assets/logo/aic.png';
import Vs from '../components/Assets/logo/VS.png';
import Spc from '../components/Assets/logo/SPC.png';
import Smc from '../components/Assets/logo/smc.png';

const sponsors = [
  { src: Danza, alt: 'Danza' },
  { src: Aic, alt: 'Aic' },
  { src: Vs, alt: 'Vs' },
  { src: Spc, alt: 'Spc' },
  { src: Smc, alt: 'Smc' },

];

const TechXperience = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#f8f6ff] to-[#f3e6ff] text-[#222] ${styles.techxFont}`}> 
      <div>
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-center gap-2 px-8 py-16 md:py-20 max-w-7xl mx-auto ">
          {/* Left: Event Image */}
          <div className=" mt-20 relative w-full md:w-1/2 flex justify-center">
            <img src={sampleEvent} alt="Event" className="rounded-2xl shadow-xl w-full max-w-[480px] h-auto object-cover border-4 border-white" />
            {/* Decorative elements */}
            <span className="absolute -top-6 -left-6 text-[#a259ff] text-3xl select-none">✦</span>
            <span className="absolute -bottom-6 -right-6 text-[#a259ff] text-3xl select-none">✦</span>
          </div>
          {/* Right: Event Details */}
          <div className="mt-20 ml-[-4%] w-full md:w-1/2 flex flex-col gap-4 md:pl-8">
            <span className="text-[#a259ff] font-semibold text-lg md:text-xl">Resonance 2025</span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-2">
              Mega <span className="text-[#a259ff]">Orientation</span><br />Session
            </h1>
            <p className="text-base md:text-lg text-[#444] mb-2">
              Discover breakthrough ideas, connect with experts, and unlock the future of technology.
            </p>
            <div className="bg-gradient-to-r from-[#e7d6ff] to-[#f3e6ff] rounded-xl p-6 flex flex-col md:flex-row items-center gap-4 shadow-md mt-4">
              <div className="flex-1 text-left">
                <div className="font-bold text-lg md:text-xl text-[#4b2aad] mb-1">Unleashing the Power of Change</div>
                <div className="flex items-center gap-2 text-sm text-[#a259ff]">
                  <span>📅 August 25, 2025</span>
                  <span>•</span>
                  <span>SOA Campus 2</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#a259ff]">
                  <span>📅 August 30, 2025</span>
                  <span>•</span>
                  <span>SOA Campus 4</span>
                </div>
              </div>
              <button className="bg-[#222] text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-[#a259ff] transition-colors" onClick={() => setShowForm(true)}>REGISTER</button>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-8">
          <h3 className="text-center text-lg md:text-xl font-semibold text-[#a259ff] mb-6">Our Collaborations</h3>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 px-4">
            {sponsors.map((s, i) => (
              <div key={i} className="bg-[#1f1f21] rounded-xl shadow flex items-center justify-center px-8 py-4 min-w-[120px] min-h-[60px]">
                <img src={s.src} alt={s.alt} className="h-12 object-contain" />
              </div>
            ))}
          </div>
        </section>
      </div>
      {showForm && <ResonanceForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default TechXperience;