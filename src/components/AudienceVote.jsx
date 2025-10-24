import React, { useState, useEffect } from 'react';
import pb from '../lib/pocketbase';

export default function AudienceVote() {
  const [regNo, setRegNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  const [pollActive, setPollActive] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentOptions, setCurrentOptions] = useState([
    { id: 'A', label: 'Option A' },
    { id: 'B', label: 'Option B' },
    { id: 'C', label: 'Option C' },
    { id: 'D', label: 'Option D' },
  ]);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState(null);

  // Load quiz questions from database
  useEffect(() => {
    async function loadQuestions() {
      try {
        const records = await pb.collection('quiz_questions').getFullList({
          sort: 'questionIndex',
          requestKey: null
        });
        
        const loadedQuestions = records.map(r => ({
          question: r.questionText || r.question,
          options: [
            { id: 'A', label: r.optionA || 'Option A' },
            { id: 'B', label: r.optionB || 'Option B' },
            { id: 'C', label: r.optionC || 'Option C' },
            { id: 'D', label: r.optionD || 'Option D' }
          ]
        }));
        
        setQuizQuestions(loadedQuestions);
      } catch (error) {
        console.error('Failed to load quiz questions:', error);
      }
    }
    
    loadQuestions();
  }, []);

  // Update current options when question changes
  useEffect(() => {
    if (currentQuestionIndex >= 0 && quizQuestions[currentQuestionIndex]) {
      setCurrentOptions(quizQuestions[currentQuestionIndex].options);
    }
    // Reset voting state when question changes
    setHasVoted(false);
    setUserVote(null);
    setMessage(null);
  }, [currentQuestionIndex, quizQuestions]);

  // Check if user has already voted for current question
  useEffect(() => {
    async function checkExistingVote() {
      if (!regNo || currentQuestionIndex < 0) {
        setHasVoted(false);
        setUserVote(null);
        return;
      }

      try {
        const existing = await pb.collection('poll_system').getList(1, 1, { 
          filter: `type=\"vote\" && regNo=\"${regNo}\" && questionIndex=${currentQuestionIndex}`,
          requestKey: null 
        });
        
        if (existing.items && existing.items.length > 0) {
          setHasVoted(true);
          setUserVote(existing.items[0].option);
          setMessage({ type: 'success', text: `You have already voted ${existing.items[0].option} for this question.` });
        } else {
          setHasVoted(false);
          setUserVote(null);
        }
      } catch (error) {
        console.error('Error checking existing vote:', error);
        setHasVoted(false);
        setUserVote(null);
      }
    }

    checkExistingVote();
  }, [regNo, currentQuestionIndex]);

  // Realtime subscription to poll updates
  useEffect(() => {
    let mounted = true;

    async function loadPollState() {
      try {
        const poll = await pb.collection('poll_system').getFirstListItem(`type=\"config\"`);
        if (!mounted) return;
        setPollActive(!!poll.active);
        const qIndex = typeof poll.questionIndex === 'number' ? poll.questionIndex : (poll.questionIndex ? Number(poll.questionIndex) : -1);
        setCurrentQuestionIndex(qIndex);
        setCurrentQuestionText(poll.question || '');
        
        // Timer sync - only start timer if poll is active AND timer is actually active
        if (poll.active && poll.timerActive) {
          setTimer(15);
          setTimerActive(true);
        } else {
          setTimer(0);
          setTimerActive(false);
        }
      } catch (err) {
        if (!mounted) return;
        setPollActive(false);
        setCurrentQuestionIndex(-1);
        setCurrentQuestionText('');
        setTimer(0);
        setTimerActive(false);
      }
    }

    // Initial load
    loadPollState();

    // Subscribe to poll_system changes (only config records)
    const pollSub = pb.collection('poll_system').subscribe('*', (e) => {
      if (e.record?.type === 'config') {
        loadPollState();
      }
    });

    return () => {
      mounted = false;
      try { pb.collection('poll_system').unsubscribe(pollSub); } catch (e) {}
    };
  }, []);

  // Timer countdown effect
  useEffect(() => {
    let timerInterval;
    
    if (timerActive && timer > 0) {
      timerInterval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerActive, timer]);

  // Assumptions:
  // - registrations are stored in collection 'iecReg' and the registration number field is 'regNo'
  // - votes are stored in collection 'poll_votes' with fields: regNo (string), option (string), poll (string)
  // - poll id used here is 'main'
  // This component now reads the current poll question index from the 'polls' collection and writes votes with questionIndex so each question's votes are separate.

  async function handleVote(option) {
    setMessage(null);
    if (!regNo || regNo.trim().length === 0) {
      setMessage({ type: 'error', text: 'Please enter your registration number.' });
      return;
    }

    setLoading(true);
    try {
      // Check poll active state from current state
      if (!pollActive) {
        setMessage({ type: 'error', text: 'Poll is not active right now. Please try later.' });
        setLoading(false);
        return;
      }

      if (currentQuestionIndex < 0) {
        setMessage({ type: 'error', text: 'No active question. Please wait for the quiz to start.' });
        setLoading(false);
        return;
      }

      // Auto-register the regNo if it doesn't exist in iecReg
      try {
        await pb.collection('iecReg').getFirstListItem(`regNo="${regNo}"`);
      } catch (err) {
        // Registration doesn't exist, create it
        try {
          await pb.collection('iecReg').create({ regNo });
          console.log('Auto-registered:', regNo);
        } catch (createErr) {
          console.error('Failed to auto-register:', createErr);
          // Continue anyway - allow voting even if registration creation fails
        }
      }

      // Check for existing vote for this registration and current question
      const existing = await pb.collection('poll_system').getList(1, 1, { 
        filter: `type=\"vote\" && regNo=\"${regNo}\" && questionIndex=${currentQuestionIndex}`,
        requestKey: null 
      });
      if (existing.items && existing.items.length > 0) {
        // update
        await pb.collection('poll_system').update(existing.items[0].id, { 
          type: 'vote', option, regNo, questionIndex: currentQuestionIndex 
        }, { requestKey: null });
        setMessage({ type: 'success', text: `Vote updated to ${option}. Thank you!` });
        setHasVoted(true);
        setUserVote(option);
      } else {
        // create
        await pb.collection('poll_system').create({ 
          type: 'vote', option, regNo, questionIndex: currentQuestionIndex 
        }, { requestKey: null });
        setMessage({ type: 'success', text: `Voted ${option}. Thank you!` });
        setHasVoted(true);
        setUserVote(option);
      }
    } catch (err) {
      console.error('Vote error:', err);
      console.error('Error details:', err.response);
      console.error('Error data:', err.data);
      
      let errorMsg = 'Failed to register vote. Please try again.';
      if (err.data?.message) {
        errorMsg = err.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
      {/* Center-top branding (in flow to avoid overlap) */}
      <div className="flex justify-center mb-6">
        <div className="text-white text-3xl font-extrabold tracking-tight">IEC - Technical</div>
      </div>

      <div className="max-w-md mx-auto w-full flex-1 flex items-center justify-center">
        <div className="bg-black/90 border border-blue-400/30 rounded-2xl p-6 shadow-xl w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Audience Voting</h2>
            <div className="flex flex-col items-end gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${pollActive ? 'bg-green-600/20 text-green-400 border border-green-400/30' : 'bg-red-600/20 text-red-400 border border-red-400/30'}`}>
                {pollActive ? 'LIVE' : 'STOPPED'}
              </div>
              {timerActive && (
                <div className={`px-3 py-1 rounded-full text-sm font-bold border ${timer <= 5 ? 'bg-red-600/20 text-red-400 border-red-400/30 animate-pulse' : timer <= 10 ? 'bg-yellow-600/20 text-yellow-400 border-yellow-400/30' : 'bg-green-600/20 text-green-400 border-green-400/30'}`}>
                  {timer}s
                </div>
              )}
            </div>
          </div>
          
          {currentQuestionText && (
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
              <p className="text-base font-medium text-blue-200">{currentQuestionText}</p>
            </div>
          )}
          
          {!currentQuestionText && (
            <p className="text-sm text-blue-200 mb-4">Waiting for question...</p>
          )}
          
          <p className="text-sm text-blue-200 mb-4">
            {hasVoted 
              ? `You have voted ${userVote}. Waiting for next question...` 
              : 'Enter your registration number and choose an option.'
            }
          </p>

          <label className="block text-sm font-medium text-white mb-2">Registration Number</label>
          <input
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white text-black mb-4 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Reg/Application No."
          />

          <div className="grid grid-cols-1 gap-3">
            {currentOptions.map((opt) => {
              const isSelected = userVote === opt.id;
              const isDisabled = loading || !pollActive || hasVoted;
              
              return (
                <button
                  key={opt.id}
                  onClick={() => handleVote(opt.id)}
                  disabled={isDisabled}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isSelected
                      ? 'bg-green-600 border-2 border-green-400 text-white' // Highlight selected option
                      : hasVoted
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' // Disabled after voting
                      : isDisabled
                      ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] opacity-50 cursor-not-allowed text-white'
                      : 'bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] text-white hover:scale-[1.02] transform'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    isSelected ? 'bg-green-200 text-green-800' : 'bg-white/20'
                  }`}>
                    {opt.id}
                    {isSelected && <span className="ml-1">✓</span>}
                  </div>
                  <span className="text-left flex-1">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded ${message.type === 'error' ? 'bg-red-600/80' : 'bg-green-600/80'}`}>
              <div className="text-sm">{message.text}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
