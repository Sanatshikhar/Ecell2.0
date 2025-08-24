import React, { useState, useRef, useEffect } from 'react';
import pb from '../lib/pocketbase';
import QrScanner from 'qr-scanner';

const Verify = () => {
  const [status, setStatus] = useState(null); // 'verified', 'already', 'invalid'
  const [loading, setLoading] = useState(false);
  const [icon, setIcon] = useState(null);
  const [message, setMessage] = useState('');
  const [scannerActive, setScannerActive] = useState(false);
  const [verifiedName, setVerifiedName] = useState('');
  const [inputDevices, setInputDevices] = useState([]);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  // Detect all input devices (video, audio, and HID/keyboard)
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        // Only keep devices that are likely to be handheld scanners (no label, kind is not 'videoinput', 'audioinput', or 'audiooutput')
        const scannerDevices = devices.filter(device =>
          (device.kind !== 'videoinput' && device.kind !== 'audioinput' && device.kind !== 'audiooutput') &&
          (!device.label || /scanner|barcode|hid|usb/i.test(device.label))
        );
        setInputDevices(scannerDevices);
      });
    }
  }, []);

  // Professional scanner animation overlay
  useEffect(() => {
    if (scannerActive && videoRef.current) {
      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.pointerEvents = 'none';
      overlay.style.display = 'flex';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.innerHTML = `
        <div style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;">
          <div style="position:absolute;left:0;width:100%;height:2px;background:linear-gradient(90deg,#00c3ff,#ffff1c,#00c3ff);border-radius:1px;animation:scanBar 1.2s infinite alternate;"></div>
        </div>
        <style>
          @keyframes scanBar {
            0% { top: 10%; opacity: 0.7; }
            100% { top: 90%; opacity: 1; }
          }
        </style>
      `;
      videoRef.current.parentElement.appendChild(overlay);
      scannerRef.current = new QrScanner(videoRef.current, result => {
        if (result && result.data) {
          handleScan(result.data);
        }
      }, { returnDetailedScanResult: true });
      scannerRef.current.start();
      return () => {
        scannerRef.current?.stop();
        overlay.remove();
      };
    }
  }, [scannerActive]);

  // Auto-reopen scanner after verified, Next button for others
  useEffect(() => {
    if (status === 'verified') {
      const timer = setTimeout(() => {
        setStatus(null);
        setMessage('');
        setIcon(null);
        setVerifiedName('');
        setScannerActive(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Listen for physical scanner (keyboard) input for laptops
  useEffect(() => {
    if (!scannerActive) return;
    const handleKeyInput = (e) => {
      // Most physical scanners send the token and then Enter
      if (e.key === 'Enter' && e.target.value) {
        handleScan(e.target.value);
      }
    };
    window.addEventListener('keydown', handleKeyInput);
    return () => window.removeEventListener('keydown', handleKeyInput);
  }, [scannerActive]);

  // Handle QR scan
  const handleScan = async (rawToken) => {
    // Pause scanner while popup is open
    setScannerActive(false);
    setLoading(true);
    setStatus(null);
    setMessage('');
    setIcon(null);
    setVerifiedName('');
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
      setLoading(false);
      return;
    }
    const safeToken = token.replace(/"/g, '\"');
    try {
      const result = await pb.collection('iecReg').getFirstListItem(`qr_token="${safeToken}"`);
      if (!result) {
        setStatus('invalid');
        setMessage('Invalid QR Token');
        setIcon('invalid');
      } else if (result.verified) {
        setStatus('already');
        setMessage('Already Verified');
        setIcon('already');
        setVerifiedName(result.name || '');
      } else {
        await pb.collection('iecReg').update(result.id, { verified: true });
        setStatus('verified');
        setMessage('Verified Successfully');
        setIcon('verified');
        setVerifiedName(result.name || '');
      }
    } catch (err) {
      setStatus('invalid');
      setMessage('Invalid QR Token');
      setIcon('invalid');
    }
    setLoading(false);
  };

  // Start scanner (mobile/tablet/laptop)
  const startScanner = () => {
    setScannerActive(true);
  };

  // Icon rendering
  const renderIcon = () => {
    if (icon === 'verified') {
      return (
        <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#2aad4b" /><path d="M7 13l3 3 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
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

  // Helper to detect if device is a laptop (not mobile/tablet)
  const isLaptop = () => {
    return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const handleNext = () => {
  setStatus(null);
  setMessage('');
  setIcon(null);
  setVerifiedName('');
  setScannerActive(true); // Resume scanner only after user clicks Next
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#181a20] px-2 sm:px-4 py-4">
      <div className="bg-[#23263a] rounded-2xl shadow-2xl p-0 sm:p-0 w-full max-w-xs sm:max-w-md md:max-w-lg flex flex-col items-center relative" style={{boxShadow:'0 8px 32px #0008'}}>
        <h2 className="text-base sm:text-lg md:text-2xl font-bold text-[#00c3ff] text-center mt-6 mb-2 tracking-wide" style={{letterSpacing:'0.04em'}}>Scan Registration QR</h2>
        <div className="text-xs sm:text-sm md:text-base text-[#b0b3c6] text-center mb-4 px-2 sm:px-4">Please align the QR code within the frame below. Hold steady for instant verification.</div>
        {!scannerActive && (
          <button
            className="bg-gradient-to-r from-[#00c3ff] to-[#ffff1c] text-[#23263a] font-bold py-2 px-4 sm:py-3 sm:px-8 rounded-xl shadow hover:from-[#00bfff] hover:to-[#ffe600] transition w-auto mt-4 mb-8 text-sm sm:text-lg md:text-xl"
            onClick={startScanner}
            style={{minWidth:'90px',maxWidth:'100%',wordBreak:'keep-all'}}
          >
            Start Scanner
          </button>
        )}
        {scannerActive && (
          <div 
            className="relative w-full aspect-video max-w-xs sm:max-w-md md:max-w-lg mx-auto flex items-center justify-center"
            style={{
              minHeight: '320px', // default for mobile
              height: 'auto',
              ...(window.innerWidth >= 640 ? { minHeight: '400px' } : {}), // sm and up (tablet)
              ...(window.innerWidth >= 768 ? { minHeight: '320px' } : {}), // md and up (desktop)
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none border-4 border-[#00c3ff] rounded-2xl box-border" style={{borderStyle:'solid',borderColor:'#00c3ff',borderWidth:'4px',boxShadow:'0 0 0 2px #ffff1c'}}></div>
            <video ref={videoRef} className="w-full h-full object-cover rounded-2xl shadow-lg bg-[#181a20]" />
            {/* Scanning animation is handled in useEffect */}
          </div>
        )}
        {loading && <div className="text-[#00c3ff] text-center font-semibold mt-6 text-sm sm:text-base md:text-lg">Verifying...</div>}
        {/* Popup for every scan message */}
        {status && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
            <div className="bg-[#23263a] rounded-2xl shadow-2xl p-6 flex flex-col items-center max-w-xs w-full">
              {icon && renderIcon()}
              <span className="text-base sm:text-lg md:text-xl font-bold text-[#ffff1c] mt-2 mb-2">{message}</span>
              {verifiedName && (
                <span className="text-sm sm:text-lg md:text-xl font-semibold text-green-400 mb-4">{verifiedName}</span>
              )}
              <button
                className="mt-2 bg-gradient-to-r from-[#00c3ff] to-[#ffff1c] text-[#23263a] font-bold py-2 px-6 rounded-xl shadow hover:from-[#00bfff] hover:to-[#ffe600] transition text-base sm:text-lg md:text-xl"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
