
import React from 'react';
import { useNavigate } from 'react-router-dom';

// ...existing code...

          <section>
            <h2 className="text-2xl font-semibold mb-3">Refund & Cancellation Acknowledgement</h2>
            <p className="text-gray-300 leading-relaxed">
              By registering for any event, you acknowledge and agree that all refund and cancellation requests shall be governed strictly by the Cancellation & Refund Policy of E-Cell SOA. E-Cell SOA reserves the right to approve or reject refund requests in accordance with the terms specified in that policy.
            </p>
          </section>

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
              <br />
                <strong>Payment Processing Disclaimer:</strong> All payments for event registrations are processed securely through third-party payment gateways, including Razorpay. E-Cell SOA does not store your payment information and is not liable for any issues arising from payment processing by the payment gateway provider. Please refer to Razorpay’s terms and privacy policy for more details.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">Use of Payment Gateway</h2>
            <p className="text-gray-300 leading-relaxed">
              By registering for events and making payments on our platform, you agree to the use of Razorpay or other authorized payment gateways for processing your payments. You are subject to the terms and conditions and privacy policies of the respective payment gateway provider.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">Refunds & Cancellations</h2>
            <p className="text-gray-300 leading-relaxed">
              Please refer to our <a href="/cancellation-refunds" className="text-[#a259ff] underline">Cancellation & Refunds</a> policy for detailed information regarding eligibility, timelines, and process for refunds and cancellations.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">Governing Law & Jurisdiction</h2>
            <p className="text-gray-300 leading-relaxed">
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising in relation to these terms shall be subject to the exclusive jurisdiction of the courts of Bhubaneswar, Odisha, India.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">Grievance Redressal</h2>
            <p className="text-gray-300 leading-relaxed">
              For any concerns or grievances related to event registration, payments, or these terms, please contact our Grievance Officer:<br />
              <strong>Name:</strong> Grievance Officer, E-Cell SOA<br />
              <strong>Email:</strong> ecell@soa.ac.in<br />
              <strong>Address:</strong> E-Cell, Siksha 'O' Anusandhan (Deemed to be University), Bhubaneswar, Odisha, India
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
