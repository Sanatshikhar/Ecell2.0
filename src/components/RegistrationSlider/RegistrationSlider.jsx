import React, { useState } from 'react';
import pb from '../../lib/pocketbase';
import './registrationSlider.css';

const slides = [
  {
    title: 'Workshop Registration',
    subtitle: 'ANIMAL',
    description: 'Register for our exciting workshop. Learn, explore, and grow!',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  },
  {
    title: 'Workshop Registration',
    subtitle: 'ELEPHANT',
    description: 'Join us for a unique learning experience.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7fda0c',
  },
  {
    title: 'Workshop Registration',
    subtitle: 'JAGUAR',
    description: 'Don’t miss out on this opportunity!',
    image: 'https://images.unsplash.com/photo-1518717758525-3caefb9b7a9e',
  },
];

export default function RegistrationSlider() {
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [formStatus, setFormStatus] = useState('');

  const nextSlide = () => setCurrent((current + 1) % slides.length);
  const prevSlide = () => setCurrent((current - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      <img
        src={slides[current].image}
        alt={slides[current].subtitle}
        className="absolute inset-0 w-full h-full object-cover opacity-70 transition-all duration-700"
      />
      {/* Registration Details - top left corner */}
      <div className="absolute top-1/2 left-1/2 z-10 max-w-2xl p-8 bg-black bg-opacity-60 rounded-lg text-white shadow-xl transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 opacity-0 animate-registration-fade-in">
        <h1 className="text-4xl font-bold mb-2">{slides[current].title}</h1>
        <h2 className="text-3xl font-bold text-orange-500 mb-4">{slides[current].subtitle}</h2>
        <p className="mb-6">{slides[current].description}</p>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition">See More</button>
          <button className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition" onClick={() => setShowForm(true)}>Register</button>
        </div>
            {/* Registration Form Modal */}
            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setShowForm(false)}>
                <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative" onClick={e => e.stopPropagation()}>
                  <button className="absolute top-2 right-2 text-black text-2xl font-bold bg-gray-200 rounded-full px-3 py-1 hover:bg-gray-300 transition-colors" onClick={() => setShowForm(false)}>&times;</button>
                  <h2 className="text-2xl font-bold mb-4 text-center text-orange-500">Workshop Registration</h2>
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setFormStatus('');
                      try {
                        await pb.collection('workshop').create(formData);
                        setFormStatus('Registration successful!');
                        setFormData({ name: '', email: '', phone: '' });
                      } catch (err) {
                        setFormStatus('Registration failed. Please try again.');
                      }
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Name"
                      className="px-4 py-2 rounded border border-gray-300 focus:border-orange-500 focus:outline-none"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="px-4 py-2 rounded border border-gray-300 focus:border-orange-500 focus:outline-none"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      className="px-4 py-2 rounded border border-gray-300 focus:border-orange-500 focus:outline-none"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <button type="submit" className="mt-4 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">Submit</button>
                    {formStatus && <div className="mt-2 text-center text-sm text-green-600">{formStatus}</div>}
                  </form>
                </div>
              </div>
            )}
      </div>
      {/* Navigation Arrows */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
        <button onClick={prevSlide} className="w-10 h-10 bg-white bg-opacity-70 rounded-full flex items-center justify-center text-xl hover:bg-opacity-100 shadow-lg transition">&#8592;</button>
        <button onClick={nextSlide} className="w-10 h-10 bg-white bg-opacity-70 rounded-full flex items-center justify-center text-xl hover:bg-opacity-100 shadow-lg transition">&#8594;</button>
      </div>
      {/* Slider Cards - bottom right corner */}
      <div className="absolute bottom-10 right-10 flex gap-6 z-10">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`cursor-pointer w-36 h-48 bg-white bg-opacity-80 rounded-xl shadow-lg flex flex-col items-center justify-end p-4 transition-all duration-300 border-2 ${idx === current ? 'border-orange-500 scale-105' : 'border-transparent hover:scale-105 hover:border-orange-300'}`}
            style={{ backdropFilter: 'blur(4px)' }}
          >
            <img
              src={slide.image}
              alt={slide.subtitle}
              className="w-full h-28 object-cover rounded-lg mb-2"
            />
            <div className="text-center">
              <div className="font-bold text-lg text-gray-800">{slide.subtitle}</div>
              <div className="text-xs text-gray-600">{slide.description.slice(0, 30)}...</div>
            </div>
          </div>
        ))}
      </div>
      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === current ? 'bg-orange-500' : 'bg-white bg-opacity-50'}`}
          />
        ))}
      </div>
    </div>
  );
}
