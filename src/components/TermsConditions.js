import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsConditions = () => {
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
        <h1 className="text-4xl font-bold mb-6 text-[#4b2aad]">Terms and Conditions</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By registering for any E-Cell SOA event, you agree to comply with and be bound by these terms and conditions. 
              Please review them carefully before proceeding with registration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Registration Requirements</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>All information provided during registration must be accurate and complete</li>
              <li>Participants must carry valid ID proof at the event</li>
              <li>Registration is non-transferable without prior approval</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Event Guidelines</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Participants are expected to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Follow all event rules and regulations</li>
              <li>Respect fellow participants and organizers</li>
              <li>Not engage in any unlawful or disruptive behavior</li>
              <li>Take responsibility for their personal belongings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              E-Cell SOA is not responsible for any loss, injury, or damage to persons or property during the event. 
              Participants attend at their own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Changes to Events</h2>
            <p className="text-gray-300 leading-relaxed">
              E-Cell SOA reserves the right to modify, postpone, or cancel events due to unforeseen circumstances. 
              Participants will be notified of any significant changes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
