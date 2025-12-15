import React from 'react';
import { useNavigate } from 'react-router-dom';

const Shipping = () => {
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
        <h1 className="text-4xl font-bold mb-6 text-[#4b2aad]">Shipping & Delivery</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Event Materials</h2>
            <p className="text-gray-300 leading-relaxed">
              For events that include physical materials (merchandise, kits, certificates, etc.), 
              the following shipping and delivery terms apply:
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Delivery Methods</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong>Campus Collection:</strong> Materials can be collected from designated points on campus</li>
              <li><strong>Event Delivery:</strong> Items will be distributed at the event venue</li>
              <li><strong>Courier Service:</strong> Available for participants outside SOA campus (additional charges may apply)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Delivery Timeline</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Standard delivery timelines:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Campus collection: Available immediately after the event</li>
              <li>Local delivery (Bhubaneswar): 2-3 business days</li>
              <li>Domestic delivery: 5-7 business days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Shipping Charges</h2>
            <p className="text-gray-300 leading-relaxed">
              Shipping charges, if applicable, will be communicated during registration. 
              Free delivery is available for on-campus participants.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact for Shipping Queries</h2>
            <p className="text-gray-300 leading-relaxed">
              For any shipping-related queries, please contact us at ecell@soa.ac.in
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
