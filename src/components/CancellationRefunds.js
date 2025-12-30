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
              Registrations for E-Cell events can be cancelled at any time up to 14 days before the event date. Cancellations made less than 14 days before the event are not eligible for a refund. 
              <br />
              <strong>Non-Refundable Clause:</strong> Certain event registrations may be marked as non-refundable. In such cases, no refund will be provided upon cancellation. Please check event-specific terms before registering.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Refund Policy</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Refunds will be processed according to the following terms:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Full refund: Cancellations made 14 days or more before the event</li>
              <li>No refund: Cancellations made less than 14 days before the event</li>
              <li>No refund: For registrations marked as non-refundable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Refund Process</h2>
            <p className="text-gray-300 leading-relaxed">
              Approved refunds will be processed within 7-10 business days to the original payment method. 
              Please contact us at ecell@soa.ac.in for any refund requests.
                <br />
                Refunds, if approved, will be credited to the original payment source used during registration. The actual time taken for the refund to reflect may vary depending on your bank or payment provider.
                <br />
                All payments and refunds are processed securely through Razorpay or other authorized payment gateways. E-Cell SOA is not responsible for delays or issues arising from the payment gateway or banking channels.
            </p>
          </section>
                  <section>
                    <h2 className="text-2xl font-semibold mb-3">Governing Law & Jurisdiction</h2>
                    <p className="text-gray-300 leading-relaxed">
                      This Cancellation & Refund Policy shall be governed by and construed in accordance with the laws of India. Any disputes arising in relation to this policy shall be subject to the exclusive jurisdiction of the courts of Bhubaneswar, Odisha, India.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mb-3">Grievance Redressal</h2>
                    <p className="text-gray-300 leading-relaxed">
                      For any concerns or grievances related to refunds, cancellations, or payment processing, please contact our Grievance Officer:<br />
                      <strong>Name:</strong> Grievance Officer, E-Cell SOA<br />
                      <strong>Email:</strong> ecell@soa.ac.in<br />
                      <strong>Address:</strong> E-Cell, Siksha 'O' Anusandhan (Deemed to be University), Bhubaneswar, Odisha, India
                    </p>
                  </section>
        </div>
      </div>
    </div>
  );
};

export default CancellationRefunds;
