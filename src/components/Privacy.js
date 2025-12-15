import React from 'react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center gap-2 text-[#a259ff] hover:text-[#4b2aad] transition-colors font-semibold"
        >
          <span className="text-2xl">←</span> Back
        </button>
        <h1 className="text-4xl font-bold mb-6 text-[#4b2aad]">Privacy Policy</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Information Collection</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We collect information that you provide during registration, including:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Name, email address, and phone number</li>
              <li>Educational institution and course details</li>
              <li>College ID or identification documents</li>
              <li>Payment information (processed securely)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Use of Information</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Your information is used to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Process event registrations</li>
              <li>Send event-related communications and updates</li>
              <li>Verify participant identity at events</li>
              <li>Improve our services and event experiences</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Data Protection</h2>
            <p className="text-gray-300 leading-relaxed">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. Your data is stored securely 
              and accessed only by authorized personnel.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Information Sharing</h2>
            <p className="text-gray-300 leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. Information may be 
              shared with event partners and sponsors only with your explicit consent and as necessary for 
              event coordination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Access your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              For privacy-related concerns or requests, please contact us at ecell@soa.ac.in
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
