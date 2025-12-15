import React from 'react';
import { useNavigate } from 'react-router-dom';

const CancellationRefunds = () => {
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
        <h1 className="text-4xl font-bold mb-6 text-[#4b2aad]">Cancellation & Refunds</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Cancellation Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              Registrations for E-Cell events can be cancelled up to 7 days before the event date. 
              Cancellations made within 7 days of the event will not be eligible for refunds.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Refund Policy</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Refunds will be processed according to the following terms:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Full refund: Cancellations made 14 days or more before the event</li>
              <li>50% refund: Cancellations made 7-13 days before the event</li>
              <li>No refund: Cancellations made less than 7 days before the event</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Refund Process</h2>
            <p className="text-gray-300 leading-relaxed">
              Approved refunds will be processed within 7-10 business days to the original payment method. 
              Please contact us at ecell@soa.ac.in for any refund requests.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CancellationRefunds;
