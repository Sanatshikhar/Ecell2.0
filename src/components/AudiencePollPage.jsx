import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import pb from '../lib/pocketbase';

const PRODUCT_LIMIT = 25;

const escapeFilterValue = (value) => String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const AudiencePollPage = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const [currentVoter, setCurrentVoter] = useState(null);
  const [voteLocked, setVoteLocked] = useState(false);
  const [votedProductId, setVotedProductId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('info');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registrationNumber: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const hasLoadedProductsRef = useRef(false);
  const [isTransitioningToVote, setIsTransitioningToVote] = useState(false);
  const [otpStepActive, setOtpStepActive] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(0);
  const [otpError, setOtpError] = useState('');
  const [otpMessage, setOtpMessage] = useState('');

  const backendUrl = useMemo(
    () => (process.env.REACT_APP_BACKEND_URL || '').replace(/\/$/, ''),
    []
  );

  const productCards = useMemo(() => products.slice(0, PRODUCT_LIMIT), [products]);

  const setStatus = useCallback((message, type = 'info') => {
    setStatusMessage(message);
    setStatusType(type);
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.registrationNumber.trim()) errors.registrationNumber = 'Registration number is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (!otpExpiresAt) {
      setOtpSecondsLeft(0);
      return;
    }

    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((otpExpiresAt - Date.now()) / 1000));
      setOtpSecondsLeft(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [otpExpiresAt]);

  const formatOtpTime = useCallback((seconds) => {
    const safe = Math.max(0, Number(seconds || 0));
    const mm = String(Math.floor(safe / 60)).padStart(2, '0');
    const ss = String(safe % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const records = await pb.collection('products').getFullList(100, {
        sort: 'name',
        requestKey: null,
      });

      const normalized = records
        .map((record) => ({
          ...record,
          count: Number(record.count || 0),
        }))
        .sort((a, b) => {
          const aNumber = Number(String(a.name || '').match(/\d+/)?.[0] || 0);
          const bNumber = Number(String(b.name || '').match(/\d+/)?.[0] || 0);
          return aNumber - bNumber;
        });

      setProducts(normalized);

      if (!normalized.length) {
        setStatus('No products found in PocketBase. Seed the products collection first.', 'error');
      }
    } catch (error) {
      const isAutoCancelled =
        error?.name === 'AbortError' ||
        String(error?.message || '').toLowerCase().includes('autocancel') ||
        String(error?.message || '').toLowerCase().includes('aborted');

      if (isAutoCancelled) {
        return;
      }

      console.error('Error fetching products:', error);
      setStatus(`Error loading products: ${error.message}`, 'error');
    } finally {
      setLoadingProducts(false);
      setIsTransitioningToVote(false);
    }
  }, [setStatus]);

  useEffect(() => {
    if (!formSubmitted || voteLocked || hasLoadedProductsRef.current) {
      if (voteLocked) setIsTransitioningToVote(false);
      return;
    }

    hasLoadedProductsRef.current = true;
    fetchProducts();
  }, [formSubmitted, voteLocked, fetchProducts]);

  const findVoterByRegistrationAndEmail = async (registrationNumber, email) => {
    const result = await pb.collection('voters').getList(1, 1, {
      filter: `registrationNumber="${escapeFilterValue(registrationNumber)}" && email="${escapeFilterValue(email)}"`,
    });

    return result.items[0] || null;
  };

  const findVoterByRegistrationOrEmail = async (registrationNumber, email) => {
    const result = await pb.collection('voters').getList(1, 50, {
      filter: `registrationNumber="${escapeFilterValue(registrationNumber)}" || email="${escapeFilterValue(email)}"`,
    });

    return result.items[0] || null;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((previous) => ({ ...previous, [name]: '' }));
    }

    if (otpStepActive && ['name', 'email', 'registrationNumber'].includes(name)) {
      setOtpStepActive(false);
      setOtpInput('');
      setOtpError('');
      setOtpMessage('Details changed. Send OTP again to continue.');
      setOtpExpiresAt(null);
    }
  };

  const sendOtp = async () => {
    if (!backendUrl) {
      setOtpError('REACT_APP_BACKEND_URL is not configured.');
      return false;
    }

    const normalizedEmail = formData.email.trim().toLowerCase();
    const normalizedName = formData.name.trim();

    setOtpSending(true);
    setOtpError('');
    setOtpMessage('');

    try {
      const response = await fetch(`${backendUrl}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          name: normalizedName,
          purpose: 'Audience Poll',
        }),
      });

      const responseBody = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(responseBody.error || 'Unable to send OTP right now.');
      }

      const expiresInSeconds = Number(responseBody.expiresInSeconds || 300);
      setOtpExpiresAt(Date.now() + expiresInSeconds * 1000);
      setOtpInput('');
      setOtpStepActive(true);
      setOtpMessage('OTP sent. Verify your email to continue to voting.');
      return true;
    } catch (error) {
      setOtpError(error.message || 'Failed to send OTP.');
      return false;
    } finally {
      setOtpSending(false);
    }
  };

  const proceedToVotingAfterVerification = async () => {
    setIsSubmittingForm(true);
    setIsTransitioningToVote(true);
    setStatusMessage('');

    const normalizedRegistrationNumber = formData.registrationNumber.trim();
    const normalizedName = formData.name.trim();
    const normalizedEmail = formData.email.trim().toLowerCase();

    try {
      const existingVoter = await findVoterByRegistrationAndEmail(
        normalizedRegistrationNumber,
        normalizedEmail
      );

      if (existingVoter) {
        setCurrentVoter(existingVoter);
        setFormSubmitted(true);

        if (existingVoter.selectedProductId) {
          setVoteLocked(true);
          setVotedProductId(existingVoter.selectedProductId || null);
          setIsTransitioningToVote(false);
          setStatus('This registration number has already voted.', 'error');
        } else {
          setVoteLocked(false);
          setStatus('Email verified. You can vote once now.', 'success');
        }

        return;
      }

      const possibleMismatchVoter = await findVoterByRegistrationOrEmail(
        normalizedRegistrationNumber,
        normalizedEmail
      );

      if (possibleMismatchVoter) {
        setIsTransitioningToVote(false);
        setStatus(
          'This email and registration number do not match our records. Please use the same details used during your first submission.',
          'error'
        );
        return;
      }

      const createdVoter = await pb.collection('voters').create({
        name: normalizedName,
        email: normalizedEmail,
        registrationNumber: normalizedRegistrationNumber,
        selectedProductId: '',
        selectedProductName: '',
      });

      setCurrentVoter(createdVoter);
      setFormSubmitted(true);
      setVoteLocked(false);
      setStatus('Email verified. Choose one product to vote.', 'success');
    } catch (error) {
      console.error('Error saving voter details:', error);

      try {
        const existingVoter = await findVoterByRegistrationAndEmail(
          normalizedRegistrationNumber,
          normalizedEmail
        );
        if (existingVoter) {
          setCurrentVoter(existingVoter);
          setFormSubmitted(true);
          setVoteLocked(Boolean(existingVoter.selectedProductId));
          setVotedProductId(existingVoter.selectedProductId || null);
          if (existingVoter.selectedProductId) {
            setIsTransitioningToVote(false);
          }
          setStatus(
            existingVoter.selectedProductId
              ? 'This registration number has already voted.'
              : 'Email verified. You can vote once now.',
            existingVoter.selectedProductId ? 'error' : 'success'
          );
          return;
        }
      } catch (fallbackError) {
        console.error('Fallback voter lookup failed:', fallbackError);
      }

      setIsTransitioningToVote(false);
      setStatus(`Unable to save voter details: ${error.message}`, 'error');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const sent = await sendOtp();
    if (sent) {
      setStatus('OTP sent to your email. Verify it to continue.', 'info');
    }
  };

  const handleVerifyOtpAndContinue = async () => {
    if (!backendUrl) {
      setOtpError('REACT_APP_BACKEND_URL is not configured.');
      return;
    }

    const normalizedOtp = otpInput.trim();
    if (!normalizedOtp || normalizedOtp.length !== 6) {
      setOtpError('Enter the 6-digit OTP.');
      return;
    }

    if (otpSecondsLeft <= 0) {
      setOtpError('OTP expired. Please request a new one.');
      return;
    }

    setOtpVerifying(true);
    setOtpError('');
    setOtpMessage('');

    try {
      const response = await fetch(`${backendUrl}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          otp: normalizedOtp,
        }),
      });

      const responseBody = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(responseBody.error || 'OTP verification failed.');
      }

      setOtpMessage('Email verified successfully. Redirecting to voting...');
      await proceedToVotingAfterVerification();
    } catch (error) {
      setOtpError(error.message || 'OTP verification failed.');
    } finally {
      setOtpVerifying(false);
    }
  };

  const incrementProductCount = async (product) => {
    const currentCount = Number(product.count || 0);
    const nextCount = currentCount + 1;

    await pb.collection('products').update(product.id, {
      count: nextCount,
    });

    return nextCount;
  };

  const handleVote = async (product) => {
    if (!currentVoter || voteLocked || isSubmittingVote) return;

    setIsSubmittingVote(true);
    setStatusMessage('');

    try {
      const nextCount = await incrementProductCount(product);

      try {
        const updatedVoter = await pb.collection('voters').update(currentVoter.id, {
          selectedProductId: product.id,
          selectedProductName: product.name,
        });

        setProducts((previousProducts) =>
          previousProducts.map((item) =>
            item.id === product.id ? { ...item, count: nextCount } : item
          )
        );
        setCurrentVoter(updatedVoter);
        setVoteLocked(true);
        setVotedProductId(product.id);
        setStatus(`Vote recorded for ${product.name}. You cannot vote again.`, 'success');
      } catch (voterUpdateError) {
        await pb.collection('products').update(product.id, {
          count: Number(product.count || 0),
        });
        throw voterUpdateError;
      }
    } catch (error) {
      console.error('Error recording vote:', error);
      setStatus(`Vote failed: ${error.message}`, 'error');
    } finally {
      setIsSubmittingVote(false);
    }
  };

  const statusClassName =
    statusType === 'error'
      ? 'bg-red-900 bg-opacity-20 border-red-500 border-opacity-30 text-red-300'
      : statusType === 'success'
        ? 'bg-lime-400 bg-opacity-10 border-lime-400 border-opacity-25 text-lime-300'
        : 'bg-gray-800 border-gray-700 text-gray-300';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Rajdhani:wght@300;400;600;700&display=swap');
        body { font-family: 'Rajdhani', sans-serif; }
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .font-spacemono { font-family: 'Space Mono', monospace; }
        @keyframes slideDownFade { from { opacity: 0; transform: translateY(-24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { left: -100%; } 100% { left: 100%; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideRight { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }
        @keyframes cardIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideDownFade { animation: slideDownFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; }
        .animate-slideUpFade { animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; }
        .animate-shimmer { animation: shimmer 3s infinite 1s; }
        .animate-spin { animation: spin 3s linear infinite; }
        .animate-slideRight { animation: slideRight 1s ease-out forwards; }
        .tag-clip { clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%); }
        .card-anim { animation: cardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>

      <div className="relative min-h-screen bg-black text-gray-200 overflow-x-hidden">
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(200, 255, 0, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 255, 0, 0.025) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 py-16 lg:py-20">
          <div className="mb-12 animate-slideDownFade">
            <div className="inline-block mb-5 relative overflow-hidden tag-clip bg-lime-400 bg-opacity-8 border border-lime-400 border-opacity-30 px-4 py-2">
              <span className="block font-spacemono text-xs text-lime-400 tracking-widest uppercase">
                Poll Entry Form
              </span>
              <div
                className="absolute top-0 left-0 w-full h-full animate-shimmer"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(200, 255, 0, 0.2), transparent)',
                }}
              />
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-wider mb-4 font-bebas leading-none">
              Submit Your <span className="block text-lime-400">Response</span>
            </h1>

            <p className="font-spacemono text-xs text-gray-500 leading-relaxed tracking-wide border-l-2 border-lime-400 pl-4">
              Enter your details first, then vote for one product. One person can only vote once.
            </p>
          </div>

          {statusMessage && (
            <div className={`mb-6 border px-4 py-3 font-spacemono text-xs ${statusClassName}`}>
              {statusMessage}
            </div>
          )}

          {!formSubmitted && (
            <div className="mb-10 animate-slideUpFade">
              <div className="bg-gray-900 border border-gray-800 relative p-8 md:p-10 shadow-2xl">
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 animate-slideRight"
                  style={{ background: 'linear-gradient(90deg, #c8ff00, #ff6b00, transparent)' }}
                />

                <h2 className="text-2xl md:text-3xl font-black tracking-wide font-bebas mb-8">
                  Enter Your Details
                </h2>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div>
                    <label className="block font-spacemono text-xs text-gray-400 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-3 bg-gray-800 border rounded text-gray-200 placeholder-gray-600 font-spacemono text-sm outline-none transition-all ${
                        formErrors.name ? 'border-red-500' : 'border-gray-700 focus:border-lime-400'
                      }`}
                    />
                    {formErrors.name && <p className="text-red-400 font-spacemono text-xs mt-1">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block font-spacemono text-xs text-gray-400 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="Enter your email"
                      className={`w-full px-4 py-3 bg-gray-800 border rounded text-gray-200 placeholder-gray-600 font-spacemono text-sm outline-none transition-all ${
                        formErrors.email ? 'border-red-500' : 'border-gray-700 focus:border-lime-400'
                      }`}
                    />
                    {formErrors.email && <p className="text-red-400 font-spacemono text-xs mt-1">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block font-spacemono text-xs text-gray-400 uppercase tracking-wider mb-2">
                      Registration Number *
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleFormChange}
                      placeholder="Enter your registration number"
                      className={`w-full px-4 py-3 bg-gray-800 border rounded text-gray-200 placeholder-gray-600 font-spacemono text-sm outline-none transition-all ${
                        formErrors.registrationNumber ? 'border-red-500' : 'border-gray-700 focus:border-lime-400'
                      }`}
                    />
                    {formErrors.registrationNumber && (
                      <p className="text-red-400 font-spacemono text-xs mt-1">{formErrors.registrationNumber}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingForm || otpSending || otpVerifying}
                    className="w-full py-3 px-6 bg-lime-400 hover:bg-lime-500 disabled:bg-gray-700 disabled:text-gray-400 text-black font-bold uppercase tracking-widest transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:transform-none"
                  >
                    {otpSending ? 'Sending OTP...' : 'Continue to Vote'}
                  </button>

                  {otpStepActive && (
                    <div className="mt-6 border border-lime-400 border-opacity-25 bg-lime-400 bg-opacity-5 p-4">
                      <p className="font-spacemono text-xs uppercase tracking-[0.2em] text-lime-300 mb-3">
                        Step 2: Verify Email OTP
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3 mb-3">
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={otpInput}
                          onChange={(event) => setOtpInput(event.target.value.replace(/\D/g, ''))}
                          placeholder="Enter 6-digit OTP"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-gray-200 placeholder-gray-600 font-spacemono text-sm outline-none transition-all focus:border-lime-400"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtpAndContinue}
                          disabled={otpVerifying || isSubmittingForm || otpSecondsLeft <= 0}
                          className="sm:w-auto w-full px-5 py-3 border border-lime-400 text-lime-300 font-spacemono text-xs uppercase tracking-[0.2em] hover:bg-lime-400 hover:text-black transition-all disabled:bg-gray-700 disabled:text-gray-500 disabled:border-gray-600"
                        >
                          {otpVerifying || isSubmittingForm ? 'Verifying...' : 'Verify OTP'}
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={sendOtp}
                          disabled={otpSending || otpVerifying}
                          className="px-4 py-2 border border-gray-700 text-gray-300 font-spacemono text-[11px] uppercase tracking-[0.2em] hover:border-lime-400 hover:text-lime-300 transition-all disabled:opacity-50"
                        >
                          {otpSending ? 'Sending...' : 'Resend OTP'}
                        </button>
                        {otpSecondsLeft > 0 && (
                          <p className="font-spacemono text-[11px] text-gray-400">
                            Expires in {formatOtpTime(otpSecondsLeft)}
                          </p>
                        )}
                      </div>

                      {otpMessage && <p className="mt-3 font-spacemono text-xs text-lime-300">{otpMessage}</p>}
                      {otpError && <p className="mt-2 font-spacemono text-xs text-red-400">{otpError}</p>}
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {formSubmitted && currentVoter && !voteLocked && (
            <div className="mb-10 bg-gray-900 border border-gray-800 p-4 md:p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-spacemono text-xs">
                <div>
                  <span className="text-gray-400 uppercase tracking-wider">Name</span>
                  <p className="text-lime-400 font-bold">{currentVoter.name}</p>
                </div>
                <div>
                  <span className="text-gray-400 uppercase tracking-wider">Email</span>
                  <p className="text-lime-400 font-bold truncate">{currentVoter.email}</p>
                </div>
                <div>
                  <span className="text-gray-400 uppercase tracking-wider">Reg. No.</span>
                  <p className="text-lime-400 font-bold">{currentVoter.registrationNumber}</p>
                </div>
              </div>
            </div>
          )}

          {formSubmitted && voteLocked && currentVoter && (
            <div className="mb-10 bg-lime-400 bg-opacity-10 border border-lime-400 border-opacity-25 p-5 md:p-6">
              <p className="font-spacemono text-sm text-lime-300">
                You have already voted. Your selection was{' '}
                <span className="font-bold text-lime-400">{currentVoter.selectedProductName || 'saved'}</span>.
              </p>
            </div>
          )}

          {formSubmitted && !voteLocked && (
            <div className="animate-slideUpFade">
              {isTransitioningToVote && (
                <div className="mb-5 bg-gray-900 border border-gray-800 p-4">
                  <div className="flex items-center gap-3 text-lime-400 mb-3">
                    <div className="w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
                    <span className="font-spacemono text-xs uppercase tracking-[0.2em]">
                      Preparing voting section...
                    </span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 overflow-hidden">
                    <div className="h-full w-1/3 bg-lime-400 animate-slideRight" />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-black font-bebas tracking-wide">Choose One Product</h2>
                <p className="font-spacemono text-xs text-gray-500 uppercase tracking-[0.3em]">One vote only</p>
              </div>

              {loadingProducts ? (
                <div className="bg-gray-900 border border-gray-800 p-10 text-center">
                  <div className="inline-flex items-center gap-3 text-lime-400">
                    <div className="w-5 h-5 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
                    <span className="font-spacemono text-sm">Loading products from PocketBase...</span>
                  </div>
                </div>
              ) : productCards.length === 0 ? (
                <div className="bg-gray-900 border border-gray-800 p-10 text-center font-spacemono text-sm text-gray-400">
                  No products found in PocketBase.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {productCards.map((product, index) => {
                    const isSelected = votedProductId === product.id;
                    const isVotingThis = isSubmittingVote && votedProductId !== product.id;

                    return (
                      <div
                        key={product.id}
                        className={`relative min-h-[240px] border transition-all duration-300 overflow-hidden card-anim ${
                          isSelected
                            ? 'bg-lime-400 bg-opacity-10 border-lime-400 shadow-[0_0_25px_rgba(200,255,0,0.18)]'
                            : 'bg-gray-800 border-gray-700 hover:border-lime-400 hover:-translate-y-1'
                        } ${index < 10 ? '' : ''}`}
                        style={{ animationDelay: `${Math.min(index, 12) * 0.03}s` }}
                      >
                        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(200,255,0,0.08),transparent)]" />

                        <div className="relative z-10 h-full flex flex-col p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 flex items-center justify-center border border-lime-400 text-lime-400 font-spacemono text-xs font-bold tag-clip bg-lime-400 bg-opacity-10">
                              {index + 1}
                            </div>
                            <div className="text-right font-spacemono text-[10px] text-gray-500 uppercase tracking-widest">
                              Product
                            </div>
                          </div>

                          <div className="flex-1 flex flex-col justify-center">
                            <h3 className="font-bebas text-3xl tracking-wide mb-2 text-gray-100">
                              {product.name}
                            </h3>
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-700">
                            <button
                              type="button"
                              disabled={voteLocked || isSubmittingVote || isVotingThis}
                              onClick={() => handleVote(product)}
                              className={`w-full py-2 text-xs font-spacemono uppercase tracking-[0.3em] border transition-all duration-300 ${
                                voteLocked || isSubmittingVote || isVotingThis
                                  ? 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed'
                                  : 'bg-black text-lime-400 border-gray-700 hover:border-lime-400 hover:bg-lime-400 hover:text-black'
                              }`}
                            >
                              Vote
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {formSubmitted && voteLocked && currentVoter && (
            <div className="mt-8 bg-gray-900 border border-gray-800 p-5">
              <p className="font-spacemono text-xs text-gray-400">
                No more votes are allowed from this registration number.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AudiencePollPage;
