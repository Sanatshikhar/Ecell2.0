import React, { useEffect, useState } from 'react';
import pb from '../lib/pocketbase';

const AudiencePollPage = () => {
  const [polls, setPolls] = useState([]);
  const [activePoll, setActivePoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [voteStats, setVoteStats] = useState({});
  const [showResults, setShowResults] = useState(false);
  
  // Form state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registrationNumber: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [userRecord, setUserRecord] = useState(null);

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.registrationNumber.trim()) errors.registrationNumber = 'Registration number is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setUserRecord({
        ...formData,
        timestamp: new Date().toISOString(),
      });
      setFormSubmitted(true);
    }
  };
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        const records = await pb.collection('polls').getList(1, 50, {
          sort: '-created',
        });
        setPolls(records.items);
        if (records.items.length > 0) {
          setActivePoll(records.items[0]);
          fetchVoteStats(records.items[0].id);
        }
      } catch (error) {
        console.error('Error fetching polls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();

    // Set up real-time updates
    pb.collection('polls').subscribe('*', () => {
      fetchPolls();
    });

    return () => {
      pb.collection('polls').unsubscribe();
    };
  }, []);

  const fetchVoteStats = async (pollId) => {
    try {
      const votes = await pb.collection('votes').getList(1, 5000, {
        filter: `poll="${pollId}"`,
      });

      const stats = {};
      votes.items.forEach((vote) => {
        stats[vote.option] = (stats[vote.option] || 0) + 1;
      });
      setVoteStats(stats);
    } catch (error) {
      console.error('Error fetching vote stats:', error);
    }
  };

  const handleVote = async (optionId) => {
    if (!activePoll || !userRecord) return;

    try {
      setSelectedOption(optionId);
      
      // Create vote record with user info
      await pb.collection('votes').create({
        poll: activePoll.id,
        option: optionId,
        name: userRecord.name,
        email: userRecord.email,
        registrationNumber: userRecord.registrationNumber,
        submittedAt: userRecord.timestamp,
      });

      setShowResults(true);
      fetchVoteStats(activePoll.id);
    } catch (error) {
      console.error('Error recording vote:', error);
    }
  };

  const handlePollChange = (pollId) => {
    setActivePoll(polls.find((p) => p.id === pollId));
    setShowResults(false);
    setSelectedOption(null);
    fetchVoteStats(pollId);
  };

  const getTotalVotes = () => {
    return Object.values(voteStats).reduce((a, b) => a + b, 0);
  };

  const getPercentage = (optionId) => {
    const total = getTotalVotes();
    return total === 0 ? 0 : Math.round((voteStats[optionId] || 0 / total) * 100);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-6 z-50">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Rajdhani:wght@300;400;600;700&display=swap');
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .animate-spin { animation: spin 3s linear infinite; }
        `}</style>
        <div className="w-12 h-12 border-2 border-gray-700 border-t-lime-400 rounded-full animate-spin"></div>
        <p className="font-mono text-xs text-gray-500 tracking-widest">Loading polls...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Rajdhani:wght@300;400;600;700&display=swap');
        
        body { font-family: 'Rajdhani', sans-serif; }
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .font-spacemono { font-family: 'Space Mono', monospace; }
        
        @keyframes slideDownFade { 
          from { opacity: 0; transform: translateY(-24px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes slideUpFade { 
          from { opacity: 0; transform: translateY(24px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes shimmer { 
          0% { left: -100%; } 
          100% { left: 100%; } 
        }
        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }
        @keyframes slideRight { 
          from { transform: scaleX(0); transform-origin: left; } 
          to { transform: scaleX(1); transform-origin: left; } 
        }
        @keyframes optionIn { 
          from { opacity: 0; transform: translateY(12px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes barFill { 
          from { transform: scaleX(0); transform-origin: left; } 
          to { transform: scaleX(1); transform-origin: left; } 
        }
        @keyframes scaleCheck { 
          0% { transform: scale(0) rotate(-45deg); } 
          50% { transform: scale(1.2); } 
          100% { transform: scale(1) rotate(0); } 
        }
        
        .animate-slideDownFade { animation: slideDownFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; }
        .animate-slideUpFade { animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-shimmer { animation: shimmer 3s infinite 1s; }
        .animate-spin { animation: spin 3s linear infinite; }
        .animate-slideRight { animation: slideRight 1s ease-out forwards; }
        .animate-optionIn-1 { animation: optionIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards; }
        .animate-optionIn-2 { animation: optionIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s backwards; }
        .animate-optionIn-3 { animation: optionIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s backwards; }
        .animate-optionIn-4 { animation: optionIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s backwards; }
        .animate-barFill { animation: barFill 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-scaleCheck { animation: scaleCheck 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        
        .tag-clip { clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%); }
      `}</style>

      <div className="relative min-h-screen bg-black text-gray-200 overflow-x-hidden">
        {/* Background Grid */}
        <div 
          className="fixed inset-0 pointer-events-none z-0" 
          style={{
            backgroundImage: 'linear-gradient(rgba(200, 255, 0, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 255, 0, 0.025) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-5 py-16 lg:py-20">
          {/* Header Section */}
          <div className="mb-16 animate-slideDownFade">
            {/* Tag */}
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

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-black tracking-wider mb-4 font-bebas leading-none">
              Submit Your <span className="block text-lime-400">Response</span>
            </h1>

            {/* Subtitle */}
            <p className="font-spacemono text-xs text-gray-500 leading-relaxed tracking-wide border-l-2 border-lime-400 pl-4">
              Enter your details • Complete the form • Submit your vote to PocketBase
            </p>
          </div>

          {/* Registration Form - Show if not submitted */}
          {!formSubmitted && (
            <div className="mb-12 animate-slideUpFade" style={{ animationDelay: '0.3s' }}>
              <div className="bg-gray-900 border border-gray-800 relative p-8 md:p-10 shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-0.5 animate-slideRight" style={{ background: 'linear-gradient(90deg, #c8ff00, #ff6b00, transparent)' }} />
                
                <h2 className="text-2xl md:text-3xl font-black tracking-wide font-bebas mb-8">
                  Enter Your Details
                </h2>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {/* Name Field */}
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
                    {formErrors.name && <p className="text-red-500 font-spacemono text-xs mt-1">{formErrors.name}</p>}
                  </div>

                  {/* Email Field */}
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
                    {formErrors.email && <p className="text-red-500 font-spacemono text-xs mt-1">{formErrors.email}</p>}
                  </div>

                  {/* Registration Number Field */}
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
                    {formErrors.registrationNumber && <p className="text-red-500 font-spacemono text-xs mt-1">{formErrors.registrationNumber}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-lime-400 hover:bg-lime-500 text-black font-bold uppercase tracking-widest transition-all duration-300 transform hover:scale-105 active:scale-95"
                    style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  >
                    Submit & Continue
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Polls Selector */}
          {formSubmitted && polls.length > 1 && (
            <div className="mb-12 animate-slideUpFade" style={{ animationDelay: '0.3s' }}>
              <div className="font-spacemono text-xs text-lime-400 text-uppercase mb-4 pb-2 tracking-widest border-b border-lime-400 border-opacity-20">
                Available Polls
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scroll-smooth">
                {polls.map((poll) => (
                  <button
                    key={poll.id}
                    onClick={() => handlePollChange(poll.id)}
                    className={`flex items-center gap-2 px-5 py-3 whitespace-nowrap font-spacemono text-xs tracking-wide transition-all duration-300 border ${
                      activePoll?.id === poll.id
                        ? 'bg-lime-400 bg-opacity-10 border-lime-400 text-lime-400 shadow-lg'
                        : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-lime-400 hover:text-lime-400'
                    }`}
                    style={{ 
                      boxShadow: activePoll?.id === poll.id ? '0 0 20px rgba(200, 255, 0, 0.3)' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <span 
                      className={`w-2 h-2 rounded-full transition-all ${
                        activePoll?.id === poll.id 
                          ? 'bg-lime-400 shadow-md scale-130' 
                          : 'bg-gray-500'
                      }`}
                    />
                    {poll.question.substring(0, 30)}...
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Poll Container */}
          {formSubmitted && activePoll && (
            <div className="animate-slideUpFade" style={{ animationDelay: '0.5s' }}>
              {/* Poll Card */}
              <div className="bg-gray-900 border border-gray-800 relative p-10 md:p-12 shadow-2xl">
                {/* Top gradient line */}
                <div 
                  className="absolute top-0 left-0 right-0 h-0.5 animate-slideRight" 
                  style={{
                    background: 'linear-gradient(90deg, #c8ff00, #ff6b00, transparent)',
                  }}
                />

                {/* Corner accent */}
                <div 
                  className="absolute bottom-0 right-0 w-8 h-8" 
                  style={{
                    borderRight: '2px solid rgba(200, 255, 0, 0.3)',
                    borderBottom: '2px solid rgba(200, 255, 0, 0.3)',
                    animation: 'fadeIn 0.8s ease-out 0.3s forwards',
                    animationFillMode: 'both',
                  }}
                />

                {/* Header */}
                <div className="flex gap-4 mb-8 relative z-10">
                  <div className="w-10 h-10 flex-shrink-0 animate-spin">
                    <svg viewBox="0 0 24 24" className="w-full h-full stroke-lime-400 fill-none" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-wide font-bebas leading-tight">
                    {activePoll.question}
                  </h2>
                </div>

                {/* User Info Bar */}
                {userRecord && (
                  <div className="bg-lime-400 bg-opacity-5 border border-lime-400 border-opacity-20 p-4 mb-8 relative z-10">
                    <div className="grid grid-cols-3 gap-4 font-spacemono text-xs">
                      <div>
                        <span className="text-gray-400 uppercase tracking-wider">Name</span>
                        <p className="text-lime-400 font-bold">{userRecord.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 uppercase tracking-wider">Email</span>
                        <p className="text-lime-400 font-bold truncate">{userRecord.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 uppercase tracking-wider">Reg. No.</span>
                        <p className="text-lime-400 font-bold">{userRecord.registrationNumber}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {activePoll.options?.map((option, index) => {
                    const isSelected = selectedOption === option;
                    const voteCount = voteStats[option] || 0;
                    const percentage = getPercentage(option);

                    return (
                      <div
                        key={index}
                        onClick={() => !showResults && handleVote(option)}
                        className={`relative p-6 cursor-pointer transition-all duration-300 border ${
                          isSelected
                            ? 'bg-lime-400 bg-opacity-10 border-lime-400 shadow-xl'
                            : 'bg-gray-800 border-gray-700 hover:border-lime-400 hover:bg-opacity-50'
                        } ${!showResults && 'hover:-translate-y-1'} animate-optionIn-${index + 1}`}
                        style={{
                          boxShadow: isSelected ? '0 0 30px rgba(200, 255, 0, 0.3)' : 'none',
                        }}
                      >
                        <div className="relative z-20">
                          {/* Option Header */}
                          <div className="flex gap-3 mb-4">
                            <div 
                              className="flex items-center justify-center w-8 h-8 flex-shrink-0 text-xs font-bold text-black bg-lime-400 bg-opacity-10 border border-lime-400 tag-clip"
                            >
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className="text-base font-bold tracking-wide">{option}</span>
                          </div>

                          {/* Vote Bar */}
                          {showResults && (
                            <div className="w-full h-1 bg-lime-400 bg-opacity-10 mb-3 rounded">
                              <div
                                className="h-full animate-barFill rounded shadow-lg"
                                style={{
                                  width: `${percentage}%`,
                                  background: 'linear-gradient(90deg, #c8ff00, #ff6b00)',
                                }}
                              />
                            </div>
                          )}

                          {/* Stats */}
                          {showResults && (
                            <div className="flex justify-between font-spacemono text-xs text-gray-400">
                              <span>{voteCount} votes</span>
                              <span className="text-lime-400 font-bold">{percentage}%</span>
                            </div>
                          )}
                        </div>

                        {/* Glow */}
                        {isSelected && (
                          <div 
                            className="absolute inset-0" 
                            style={{
                              background: 'radial-gradient(circle at center, rgba(200, 255, 0, 0.1), transparent)',
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Vote Summary */}
                {showResults && (
                  <div 
                    className="flex justify-around p-6 bg-lime-400 bg-opacity-5 border border-lime-400 border-opacity-20 mb-6 animate-slideUpFade" 
                    style={{ animationDelay: '0.3s' }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="font-spacemono text-xs text-gray-400 uppercase tracking-wider">Total Votes</span>
                      <span className="font-black text-4xl text-lime-400 font-bebas">
                        {getTotalVotes()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action */}
                <div className={`p-5 text-center border ${
                  showResults
                    ? 'bg-lime-400 bg-opacity-10 border-lime-400 border-opacity-30'
                    : 'bg-lime-400 bg-opacity-5 border-lime-400 border-opacity-15'
                }`}>
                  {showResults ? (
                    <>
                      <div className="text-3xl mb-2 animate-scaleCheck">✓</div>
                      <p className="font-spacemono text-xs text-lime-400 tracking-wide">Vote recorded! Results updating in real-time</p>
                    </>
                  ) : (
                    <p className="font-spacemono text-xs text-gray-400 tracking-wide">← Select an option above to vote</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && formSubmitted && polls.length === 0 && (
            <div className="text-center py-20 animate-slideUpFade" style={{ animationDelay: '0.4s' }}>
              <div className="text-6xl text-lime-400 mb-6 animate-pulse">◉</div>
              <h3 className="text-3xl font-black mb-3 font-bebas">
                No Active Polls
              </h3>
              <p className="font-spacemono text-sm text-gray-500">Polls will appear here when they become available</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AudiencePollPage;
