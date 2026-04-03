import React, { useState, useEffect } from 'react';
import pb from '../lib/pocketbase';
import BarcodeScanner from './BarcodeScanner';
import {
  buildWorkshopConfirmationMailPayload,
  buildFoundationSeriesTimeChangeMailPayload,
} from '../lib/emailTemplates';

const Verify = () => {
  const [status, setStatus] = useState(null); // 'found', 'arrived', 'already', 'invalid'
  const [loading, setLoading] = useState(false);
  const [icon, setIcon] = useState(null);
  const [message, setMessage] = useState('');
  const [verifiedName, setVerifiedName] = useState('');
  const [scannedRegistration, setScannedRegistration] = useState(null);
  const [matchedRegistrationField, setMatchedRegistrationField] = useState('');
  const [manualRegNo, setManualRegNo] = useState('');
  const [showBulkMailPopup, setShowBulkMailPopup] = useState(false);
  const [bulkMailStatus, setBulkMailStatus] = useState({ step: 'idle', count: 0, sent: 0 });
  const [showTimeChangePopup, setShowTimeChangePopup] = useState(false);
  const [timeChangeMailStatus, setTimeChangeMailStatus] = useState({ step: 'idle', count: 0, sent: 0, failed: 0 });

  const resetVerificationState = () => {
    setStatus(null);
    setMessage('');
    setIcon(null);
    setVerifiedName('');
    setScannedRegistration(null);
    setMatchedRegistrationField('');
  };

  const findRegistrationByField = async (field, safeToken) => {
    try {
      return await pb.collection('scratchlabsRegistrations').getFirstListItem(`${field}="${safeToken}"`);
    } catch (err) {
      if (err?.status === 404 || err?.status === 400) {
        return null;
      }
      throw err;
    }
  };

  const verifyByRegNo = async (rawRegNo) => {
    setLoading(true);
    resetVerificationState();

    const regNo = (rawRegNo || '').trim();
    if (!regNo) {
      setStatus('invalid');
      setMessage('Please enter a valid Reg No');
      setIcon('invalid');
      setLoading(false);
      return;
    }

    const safeToken = regNo.replace(/"/g, '\\"');
    try {
      let result = await findRegistrationByField('regNum', safeToken);
      let matchedField = 'regNum';
      if (!result) {
        result = await findRegistrationByField('teammateRegNo', safeToken);
        matchedField = 'teammateRegNo';
      }
      if (!result) {
        result = await findRegistrationByField('teammateRegNum', safeToken);
        matchedField = 'teammateRegNum';
      }
      if (!result) {
        setStatus('invalid');
        setMessage('Registration not found for this Reg No / Teammate Reg No');
        setIcon('invalid');
      } else if ((matchedField === 'regNum' && result.arrived) || (matchedField !== 'regNum' && result.teammateArrived)) {
        setStatus('already');
        setMessage('Already Marked Arrived');
        setIcon('already');
        setVerifiedName(result.name || '');
      } else {
        setStatus('found');
        setMessage('Registration Found');
        setIcon('found');
        setVerifiedName(result.name || '');
        setScannedRegistration(result);
        setMatchedRegistrationField(matchedField);
      }
    } catch (err) {
      if (err?.status === 404) {
        setStatus('invalid');
        setMessage('Registration not found for this Reg No / Teammate Reg No');
        setIcon('invalid');
      } else {
        setStatus('invalid');
        setMessage('Something went wrong while verifying. Please try again.');
        setIcon('invalid');
      }
    }

    setLoading(false);
  };

  // Auto-clear success state after a brief delay.
  useEffect(() => {
    if (status === 'arrived') {
      const timer = setTimeout(() => {
        setStatus(null);
        setMessage('');
        setIcon(null);
        setVerifiedName('');
        setScannedRegistration(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Handle QR/barcode scan
  const handleScan = async (rawToken) => {
    let token = rawToken;
    if (typeof token === 'string' && token.includes('?token=')) {
      token = token.split('?token=')[1];
    }
    if (typeof token === 'string' && token.includes('/')) {
      token = token.split('/').pop();
    }
    if (typeof token !== 'string' || !token) {
      setStatus('invalid');
      setMessage('No valid QR token found');
      setIcon('invalid');
      return;
    }
    await verifyByRegNo(token);
  };

  const handleManualSearch = async (e) => {
    e.preventDefault();
    await verifyByRegNo(manualRegNo);
  };

  const handleMarkArrived = async () => {
    if (!scannedRegistration?.id) return;
    setLoading(true);
    try {
      await pb.collection('scratchlabsRegistrations').update(scannedRegistration.id, {
        ...(matchedRegistrationField === 'regNum' ? { arrived: true } : { teammateArrived: true }),
      });
      setStatus('arrived');
      setMessage('Marked Arrived Successfully');
      setIcon('verified');
      setVerifiedName(scannedRegistration.name || '');
      setScannedRegistration(null);
      setMatchedRegistrationField('');
      setManualRegNo('');
    } catch (error) {
      setStatus('invalid');
      setMessage('Failed to mark arrived. Please try again.');
      setIcon('invalid');
    }
    setLoading(false);
  };

  // Icon rendering
  const renderIcon = () => {
    if (icon === 'verified') {
      return (
        <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#2aad4b" /><path d="M7 13l3 3 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      );
    } else if (icon === 'found') {
      return (
        <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#2563eb" /><path d="M9 12h6M12 9v6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      );
    } else if (icon === 'already') {
      return (
        <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#fbbf24" /><path d="M12 8v4l3 3" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      );
    } else if (icon === 'invalid') {
      return (
        <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#b22a2a" /><path d="M15 9l-6 6M9 9l6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      );
    }
    return null;
  };

  const handleNext = () => {
    resetVerificationState();
  };

  // Bulk email function
  const sendBulkEmails = async () => {
    setBulkMailStatus({ step: 'fetching', count: 0, sent: 0 });
    // Fetch workshop registrations and find records that haven't received confirmation email.
    const registrations = await pb.collection('scratchlabsRegistrations').getFullList();
    const unsent = registrations.filter(r => !r.mailSent);
    if (unsent.length === 0) {
      setBulkMailStatus({ step: 'none', count: 0, sent: 0 });
      return;
    }
    setBulkMailStatus({ step: 'found', count: unsent.length, sent: 0 });
    await new Promise(res => setTimeout(res, 1000));
    setBulkMailStatus({ step: 'sending', count: unsent.length, sent: 0 });
    let sentCount = 0;
    // Use REACT_APP_BACKEND_URL from environment variables
    const backendUrl = (process.env.REACT_APP_BACKEND_URL || '').replace(/\/$/, '');
    if (!backendUrl) {
      setBulkMailStatus({ step: 'error', count: 0, sent: 0 });
      return;
    }
    for (const user of unsent) {
      try {
        const mailPayload = buildWorkshopConfirmationMailPayload({
          to: user.email,
          details: {
            name: user.name,
            workshopTitle: user.workshopTitle || 'E-Cell SOA Workshop',
            subtitle: user.subtitle,
            tag: user.tag,
            date: user.date,
            time: user.time,
          },
        });
        const response = await fetch(`${backendUrl}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mailPayload)
        });
        if (!response.ok) {
          continue;
        }

        await pb.collection('scratchlabsRegistrations').update(user.id, { mailSent: true });
        sentCount++;
        setBulkMailStatus({ step: 'sending', count: unsent.length, sent: sentCount });
      } catch (err) {
        // Optionally handle error
      }
    }
    setBulkMailStatus({ step: 'done', count: unsent.length, sent: sentCount });
  };

  const sendTimeChangeBulkEmails = async () => {
    setTimeChangeMailStatus({ step: 'fetching', count: 0, sent: 0, failed: 0 });

    const isEligibleForTimeChangeMail = (record) => {
      return record?.changeMail === false || record?.changeMail === 0 || record?.changeMail === 'false' || record?.changeMail === '0' || !record?.changeMail;
    };

    const registrations = await pb.collection('scratchlabsRegistrations').getFullList();
    const recipients = registrations.filter((record) => isEligibleForTimeChangeMail(record) && record.email);

    if (recipients.length === 0) {
      setTimeChangeMailStatus({ step: 'none', count: 0, sent: 0, failed: 0 });
      return;
    }

    setTimeChangeMailStatus({ step: 'found', count: recipients.length, sent: 0, failed: 0 });
    await new Promise((res) => setTimeout(res, 600));
    setTimeChangeMailStatus({ step: 'sending', count: recipients.length, sent: 0, failed: 0 });

    const backendUrl = (process.env.REACT_APP_BACKEND_URL || '').replace(/\/$/, '');
    if (!backendUrl) {
      setTimeChangeMailStatus({ step: 'error', count: 0, sent: 0, failed: 0 });
      return;
    }

    let sentCount = 0;
    let failedCount = 0;

    for (const user of recipients) {
      try {
        const mailPayload = buildFoundationSeriesTimeChangeMailPayload({
          to: user.email,
          details: { name: user.name },
        });

        const response = await fetch(`${backendUrl}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mailPayload),
        });

        if (!response.ok) {
          failedCount++;
          setTimeChangeMailStatus({ step: 'sending', count: recipients.length, sent: sentCount, failed: failedCount });
          continue;
        }

        await pb.collection('scratchlabsRegistrations').update(user.id, { changeMail: true });
        sentCount++;
        setTimeChangeMailStatus({ step: 'sending', count: recipients.length, sent: sentCount, failed: failedCount });
      } catch (err) {
        failedCount++;
        setTimeChangeMailStatus({ step: 'sending', count: recipients.length, sent: sentCount, failed: failedCount });
      }
    }

    setTimeChangeMailStatus({ step: 'done', count: recipients.length, sent: sentCount, failed: failedCount });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#181a20] px-2 sm:px-4 py-4">
      <div className="bg-[#23263a] rounded-2xl shadow-2xl p-0 sm:p-0 w-full max-w-xs sm:max-w-md md:max-w-lg flex flex-col items-center relative" style={{boxShadow:'0 8px 32px #0008'}}>
        <h2 className="text-base sm:text-lg md:text-2xl font-bold text-[#00c3ff] text-center mt-6 mb-2 tracking-wide" style={{letterSpacing:'0.04em'}}>Scan Registration QR</h2>
        <div className="text-xs sm:text-sm md:text-base text-[#b0b3c6] text-center mb-4 px-2 sm:px-4">Please align the QR code within the frame below or search manually by Reg No.</div>
        <div className="w-full px-3 pb-4">
          <BarcodeScanner onScan={handleScan} loading={loading} />
        </div>
        <form onSubmit={handleManualSearch} className="w-full px-3 pb-4">
          <label htmlFor="manual-regno" className="block text-xs sm:text-sm font-semibold text-[#b0b3c6] mb-2">
            Search by Reg No / Teammate Reg No
          </label>
          <div className="flex gap-2">
            <input
              id="manual-regno"
              type="text"
              value={manualRegNo}
              onChange={(e) => setManualRegNo(e.target.value)}
              placeholder="Enter Reg No / Teammate Reg No"
              className="flex-1 rounded-lg bg-[#161925] border border-[#2f3652] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#00c3ff] to-[#0ea5e9] text-[#0a1022] font-bold px-4 py-2 rounded-lg disabled:opacity-60"
            >
              Search
            </button>
          </div>
        </form>
        {loading && <div className="text-[#00c3ff] text-center font-semibold mt-2 mb-4 text-sm sm:text-base md:text-lg">Processing...</div>}
        {/* Popup for every scan message */}
        {status && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
            <div className="bg-[#23263a] rounded-2xl shadow-2xl p-6 flex flex-col items-center max-w-xs w-full">
              {icon && renderIcon()}
              <span className="text-base sm:text-lg md:text-xl font-bold text-[#ffff1c] mt-2 mb-2">{message}</span>
              {verifiedName && (
                <span className="text-sm sm:text-lg md:text-xl font-semibold text-green-400 mb-4">{verifiedName}</span>
              )}
              {status === 'found' ? (
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-2 px-4 rounded-xl shadow transition text-base"
                    onClick={handleMarkArrived}
                    disabled={loading}
                  >
                    Mark Arrived
                  </button>
                  <button
                    className="bg-gray-600 text-white font-bold py-2 px-4 rounded-xl shadow hover:bg-gray-800 transition text-base"
                    onClick={handleNext}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="mt-2 bg-gradient-to-r from-[#00c3ff] to-[#ffff1c] text-[#23263a] font-bold py-2 px-6 rounded-xl shadow hover:from-[#00bfff] hover:to-[#ffe600] transition text-base sm:text-lg md:text-xl"
                  onClick={handleNext}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setShowBulkMailPopup(true)}
          className="bg-yellow-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-yellow-800 transition"
        >
          Email not received?
        </button>
        <button
          onClick={() => setShowTimeChangePopup(true)}
          className="bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-blue-900 transition"
        >
          Send Bulk Time Change Mail
        </button>
      </div>
      {showBulkMailPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
          <div className="bg-[#23263a] rounded-2xl shadow-2xl p-6 flex flex-col items-center max-w-xs w-full">
            {bulkMailStatus.step === 'idle' && (
              <span className="text-base sm:text-lg md:text-xl font-bold text-[#ffff1c] mt-2 mb-4">Send workshop confirmation emails to everyone who has not received one?</span>
            )}
            {bulkMailStatus.step === 'fetching' && (
              <span className="text-base sm:text-lg md:text-xl font-bold text-[#ffff1c] mt-2 mb-4">Checking for unmailed workshop registrations...</span>
            )}
            {bulkMailStatus.step === 'none' && (
              <span className="text-base sm:text-lg md:text-xl font-bold text-green-400 mt-2 mb-4">No unmailed workshop registration found.</span>
            )}
            {bulkMailStatus.step === 'error' && (
              <span className="text-base sm:text-lg md:text-xl font-bold text-red-400 mt-2 mb-4">Backend URL is missing. Set REACT_APP_BACKEND_URL first.</span>
            )}
            {bulkMailStatus.step === 'found' && (
              <span className="text-base sm:text-lg md:text-xl font-bold text-yellow-400 mt-2 mb-4">{bulkMailStatus.count} unmailed workshop registration{bulkMailStatus.count > 1 ? 's' : ''} found.</span>
            )}
            {bulkMailStatus.step === 'sending' && (
              <>
                <span className="text-base sm:text-lg md:text-xl font-bold text-[#ffff1c] mt-2 mb-4">Sending {bulkMailStatus.count} emails...</span>
                <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                  <div className="bg-violet-700 h-4 rounded-full transition-all duration-300" style={{ width: `${(bulkMailStatus.sent / bulkMailStatus.count) * 100}%` }}></div>
                </div>
                <span className="text-sm text-white">{bulkMailStatus.sent} / {bulkMailStatus.count} sent</span>
              </>
            )}
            {bulkMailStatus.step === 'done' && (
              <span className="text-base sm:text-lg md:text-xl font-bold text-green-400 mt-2 mb-4">{bulkMailStatus.sent} emails sent successfully!</span>
            )}
            {bulkMailStatus.step === 'idle' && (
              <button
                onClick={sendBulkEmails}
                className="bg-violet-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg mt-2 hover:bg-violet-900 transition"
              >
                Send Bulk Emails
              </button>
            )}
            <button
              onClick={() => { setShowBulkMailPopup(false); setBulkMailStatus({ step: 'idle', count: 0, sent: 0 }); }}
              className="bg-gray-600 text-white font-bold px-6 py-2 rounded-xl shadow-lg mt-4 hover:bg-gray-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showTimeChangePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
          <div className="bg-[#23263a] rounded-2xl shadow-2xl p-6 flex flex-col items-center max-w-xs w-full">
            {timeChangeMailStatus.step === 'idle' && (
              <span className="text-base sm:text-lg md:text-xl font-bold text-[#bfdbfe] mt-2 mb-4 text-center">
                Send the Foundation Series time-change email to all participants with changeMail disabled in PocketBase?
              </span>
            )}
            {timeChangeMailStatus.step === 'fetching' && (
              <span className="text-base sm:text-lg md:text-xl font-bold text-[#bfdbfe] mt-2 mb-4 text-center">
                Checking participants eligible for time-change update...
              </span>
            )}
            {timeChangeMailStatus.step === 'none' && (
              <span className="text-base sm:text-lg md:text-xl font-bold text-green-400 mt-2 mb-4 text-center">
                No participant found with changeMail disabled.
              </span>
            )}
            {timeChangeMailStatus.step === 'error' && (
              <span className="text-base sm:text-lg md:text-xl font-bold text-red-400 mt-2 mb-4 text-center">
                Backend URL is missing. Set REACT_APP_BACKEND_URL first.
              </span>
            )}
            {timeChangeMailStatus.step === 'found' && (
              <span className="text-base sm:text-lg md:text-xl font-bold text-blue-300 mt-2 mb-4 text-center">
                {timeChangeMailStatus.count} eligible participant{timeChangeMailStatus.count > 1 ? 's' : ''} found.
              </span>
            )}
            {timeChangeMailStatus.step === 'sending' && (
              <>
                <span className="text-base sm:text-lg md:text-xl font-bold text-[#bfdbfe] mt-2 mb-4 text-center">
                  Sending update emails...
                </span>
                <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${((timeChangeMailStatus.sent + timeChangeMailStatus.failed) / timeChangeMailStatus.count) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-white">Sent: {timeChangeMailStatus.sent} | Failed: {timeChangeMailStatus.failed} | Total: {timeChangeMailStatus.count}</span>
              </>
            )}
            {timeChangeMailStatus.step === 'done' && (
              <span className="text-base sm:text-lg md:text-xl font-bold text-green-400 mt-2 mb-4 text-center">
                Time-change mail completed. Sent: {timeChangeMailStatus.sent}, Failed: {timeChangeMailStatus.failed}
              </span>
            )}

            {timeChangeMailStatus.step === 'idle' && (
              <button
                onClick={sendTimeChangeBulkEmails}
                className="bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg mt-2 hover:bg-blue-900 transition"
              >
                Send Time Change Mails
              </button>
            )}

            <button
              onClick={() => {
                setShowTimeChangePopup(false);
                setTimeChangeMailStatus({ step: 'idle', count: 0, sent: 0, failed: 0 });
              }}
              className="bg-gray-600 text-white font-bold px-6 py-2 rounded-xl shadow-lg mt-4 hover:bg-gray-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verify;
