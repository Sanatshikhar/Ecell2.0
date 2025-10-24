import React, { useEffect, useState, useRef } from 'react';
import styles from './AudiencePoll.module.css';
import pb from '../lib/pocketbase';

// Simple realtime audience poll component
// - Uses Tailwind for layout
// - Simulates realtime votes if no websocket is provided
// - Shows animated percentage bars and floating 'bubbles' for visual effect

const defaultOptions = [
  { id: 'A', label: 'Option A' },
  { id: 'B', label: 'Option B' },
  { id: 'C', label: 'Option C' },
  { id: 'D', label: 'Option D' },
];

export default function AudiencePoll({ wsUrl, question = 'Which option do you prefer?' }) {
  const [options, setOptions] = useState(defaultOptions);
  const [votes, setVotes] = useState(() => defaultOptions.map(() => 0));
  const [running, setRunning] = useState(true);
  const [pollActive, setPollActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  const [fastestVoters, setFastestVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(15);
  const [timerActive, setTimerActive] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const wsRef = useRef(null);
  const fetchingRef = useRef(false);
  const leaderboardTimerRef = useRef(null);
  const pollTimerRef = useRef(null);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      if (!pb.authStore.isValid) {
        // Redirect to login or show unauthorized message
        window.location.href = '/audience-poll'; // This will trigger the route protection
        return;
      }
      setIsAuthenticated(true);
    };

    checkAuth();

    // Listen for auth state changes
    const unsubscribe = pb.authStore.onChange(() => {
      checkAuth();
    });

    return unsubscribe;
  }, []);

  // Load questions from PocketBase on component mount
  useEffect(() => {
    async function loadQuestionsFromDB() {
      try {
        setLoading(true);
        // Fetch all quiz questions from PocketBase
        const records = await pb.collection('quiz_questions').getFullList({
          sort: 'questionIndex',
          requestKey: null
        });

        if (records.length === 0) {
          alert('No questions found in database. Please add questions to the quiz_questions collection in PocketBase.');
          setLoading(false);
          return;
        }

        // Log the first record to see available fields
        if (records.length > 0) {
          console.log('First quiz question record fields:', Object.keys(records[0]));
          console.log('First record data:', records[0]);
        }

        // Transform database records to quiz format
        const loadedQuestions = records.map(r => {
          console.log('Processing record:', r);
          console.log('Available correct answer fields:', {
            correct: r.correct,
            correctAnswer: r.correctAnswer,
            answer: r.answer,
            correctOption: r.correctOption
          });
          
          return {
            question: r.questionText || r.question,
            options: [
              { id: 'A', label: r.optionA || 'Option A' },
              { id: 'B', label: r.optionB || 'Option B' },
              { id: 'C', label: r.optionC || 'Option C' },
              { id: 'D', label: r.optionD || 'Option D' }
            ],
            correct: r.correct || r.correctAnswer || r.answer || r.correctOption || 'A' // Check multiple field names
          };
        });

        setQuizQuestions(loadedQuestions);
        setQuestions(loadedQuestions.map(q => q.question));
        console.log('Loaded questions from database:', loadedQuestions);
      } catch (err) {
        console.error('Failed to load questions:', err);
        alert('Failed to load questions from database. Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadQuestionsFromDB();
    }
  }, [isAuthenticated]);

  // Timer effect - handles the 15-second countdown
  useEffect(() => {
    if (timerActive && timer > 0) {
      pollTimerRef.current = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timerActive && timer === 0) {
      // Timer reached zero, do exactly what the "Stop Quiz" button does
      console.log('Timer reached zero, stopping quiz...');
      console.log('Before stopping - pollActive:', pollActive, 'timerActive:', timerActive);
      setTimerActive(false);
      setPollActiveState(false); // Same as "Stop Quiz" button
      setTimer(15); // Reset timer for next question
      console.log('After stopping - timer reset to 15');
    }

    return () => {
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
      }
    };
  }, [timer, timerActive]);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
      }
    };
  }, []);

  // Connect to a WebSocket URL if provided (simple optional hook)
  useEffect(() => {
    if (!wsUrl) return;
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.onmessage = (ev) => {
        // expected payload: { optionIndex: number }
        try {
          const data = JSON.parse(ev.data);
          if (typeof data.optionIndex === 'number') {
            setVotes((prev) => prev.map((v, i) => (i === data.optionIndex ? v + 1 : v)));
          }
        } catch (e) {
          // ignore
        }
      };
      return () => {
        ws.close();
      };
    } catch (e) {
      // fail silently — simulation will still run
    }
  }, [wsUrl]);

  // Helper to fetch votes for a specific question from poll_system
  const fetchVotesForCurrentQuestion = async (qIndex) => {
    try {
      fetchingRef.current = true;
      if (qIndex == null || qIndex < 0) {
        setVotes(options.map(() => 0));
        setFastestVoters([]);
        return;
      }
      const all = await pb.collection('poll_system').getFullList({ 
        filter: `type=\"vote\" && questionIndex=${qIndex}`,
        sort: 'created',
        requestKey: null 
      });
      const counts = options.map(() => 0);
      all.forEach((r) => {
        const index = ['A','B','C','D'].indexOf(r.option);
        if (index >= 0) counts[index] += 1;
      });
      setVotes(counts);
      
      // Update leaderboard (debounced to prevent freezing)
      updateLeaderboard(qIndex);
    } catch (err) {
      console.error('Failed to fetch votes:', err);
    } finally {
      fetchingRef.current = false;
    }
  };

  // Debounced leaderboard update to prevent freezing
  const updateLeaderboard = (qIndex) => {
    if (leaderboardTimerRef.current) {
      clearTimeout(leaderboardTimerRef.current);
    }
    
    leaderboardTimerRef.current = setTimeout(async () => {
      try {
        const all = await pb.collection('poll_system').getFullList({ 
          filter: `type=\"vote\" && questionIndex=${qIndex}`,
          sort: 'created',
          requestKey: null,
          $autoCancel: false
        });
        
        const fastest = all.slice(0, 10).map((vote, index) => ({
          rank: index + 1,
          regNo: vote.regNo,
          option: vote.option,
          time: new Date(vote.created).toLocaleTimeString()
        }));
        console.log('Fastest voters:', fastest);
        setFastestVoters(fastest);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      }
    }, 1000); // Update leaderboard max once per second
  };

  // PocketBase: subscribe to polls and poll_votes updates
  useEffect(() => {
    let mounted = true;

    async function refreshPollState() {
      try {
        const p = await pb.collection('poll_system').getFirstListItem(`type=\"config\"`);
        if (!mounted) return;
        console.log('refreshPollState - database state:', { active: p.active, timerActive: p.timerActive, questionIndex: p.questionIndex });
        setPollActive(!!p.active);
        const qi = typeof p.questionIndex === 'number' ? p.questionIndex : (p.questionIndex ? Number(p.questionIndex) : -1);
        setCurrentQuestionIndex(qi ?? -1);
        setCurrentQuestionText(p.question || '');
      } catch (e) {
        if (!mounted) return;
        console.log('refreshPollState - no config found, setting inactive');
        setPollActive(false);
        setCurrentQuestionIndex(-1);
        setCurrentQuestionText('');
      }
    }

    // initial load
    (async () => {
      await refreshPollState();
    })();

    const pollSystemSub = pb.collection('poll_system').subscribe('*', async (e) => {
      console.log('PocketBase subscription event:', e);
      // Check if it's a config update or vote update
      if (e.record?.type === 'config') {
        console.log('Config update detected in subscription');
        await refreshPollState();
      } else if (e.record?.type === 'vote' && e.record.questionIndex === currentQuestionIndex) {
        // Incrementally update vote count instead of fetching all votes
        if (e.action === 'create') {
          const optionIndex = ['A','B','C','D'].indexOf(e.record.option);
          if (optionIndex >= 0) {
            setVotes((prev) => {
              const newVotes = [...prev];
              newVotes[optionIndex] = newVotes[optionIndex] + 1;
              return newVotes;
            });
          }
        } else if (e.action === 'delete') {
          const optionIndex = ['A','B','C','D'].indexOf(e.record.option);
          if (optionIndex >= 0) {
            setVotes((prev) => {
              const newVotes = [...prev];
              newVotes[optionIndex] = Math.max(0, newVotes[optionIndex] - 1);
              return newVotes;
            });
          }
        } else if (e.action === 'update') {
          // If option changed, refetch to be safe
          fetchVotesForCurrentQuestion(currentQuestionIndex);
        }
      }
    });

    return () => {
      mounted = false;
      try { pb.collection('poll_system').unsubscribe(pollSystemSub); } catch (e) {}
    };
  }, [currentQuestionIndex]);

  // Separate effect to fetch votes when questionIndex changes
  useEffect(() => {
    if (currentQuestionIndex >= 0) {
      fetchVotesForCurrentQuestion(currentQuestionIndex);
    } else {
      setVotes(options.map(() => 0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex]);

  // Simulation disabled - votes now come only from real PocketBase data
  // useEffect(() => {
  //   if (!running || wsUrl) return;
  //   let mounted = true;
  //   function tick() {
  //     if (!mounted) return;
  //     setVotes((prev) => {
  //       const idx = Math.floor(Math.random() * prev.length);
  //       const copy = prev.slice();
  //       copy[idx] = copy[idx] + 1;
  //       return copy;
  //     });
  //     // random next interval 300-1000ms
  //     const t = 300 + Math.random() * 700;
  //     timer = setTimeout(tick, t);
  //   }
  //   let timer = setTimeout(tick, 500);
  //   return () => {
  //     mounted = false;
  //     clearTimeout(timer);
  //   };
  // }, [running, wsUrl, options.length]);

  // Function to start the timer and update database
  async function startTimer() {
    try {
      setTimer(15);
      setTimerActive(true);
      
      // Update database to reflect timer state
      const rec = await pb.collection('poll_system').getFirstListItem(`type="config"`);
      if (rec && rec.id) {
        await pb.collection('poll_system').update(rec.id, { timerActive: true });
      }
    } catch (error) {
      console.error('Failed to start timer:', error);
    }
  }

  // Start/Stop poll control which updates PocketBase poll_system config record
  async function setPollActiveState(active) {
    try {
      // try to get existing config
      let rec;
      try {
        rec = await pb.collection('poll_system').getFirstListItem(`type="config"`);
      } catch (e) {
        rec = null;
      }
      if (rec && rec.id) {
        await pb.collection('poll_system').update(rec.id, { active, timerActive: false });
      } else {
        await pb.collection('poll_system').create({ type: 'config', active, timerActive: false });
      }
      setPollActive(active);
      // Stop timer when poll is deactivated
      if (!active) {
        setTimerActive(false);
        setTimer(15); // Reset timer
      }
    } catch (err) {
      console.error('Failed to update poll state', err);
    }
  }

  // start the quiz (from current question)
  async function startQuiz() {
    try {
      console.log('Starting quiz from question:', currentQuestionIndex);
      
      // If no question is selected, start from question 0
      const questionIndex = currentQuestionIndex >= 0 ? currentQuestionIndex : 0;
      
      let rec;
      try { 
        rec = await pb.collection('poll_system').getFirstListItem(`type=\"config\"`); 
        console.log('Found existing config:', rec);
      } catch (e) { 
        console.log('No existing config found, will create new one');
        rec = null; 
      }
      const payload = { 
        type: 'config', 
        active: true, 
        questionIndex: questionIndex, 
        question: questions[questionIndex],
        timerActive: true
      };
      console.log('Payload:', payload);
      
      if (rec && rec.id) {
        console.log('Updating existing config...');
        await pb.collection('poll_system').update(rec.id, payload);
      } else {
        console.log('Creating new config...');
        await pb.collection('poll_system').create(payload);
      }
      
      console.log('Quiz started successfully from question:', questionIndex);
      setPollActive(true);
      setCurrentQuestionIndex(questionIndex);
      setCurrentQuestionText(questions[questionIndex]);
      // Update options for current question
      setOptions(quizQuestions[questionIndex].options);
      setVotes(quizQuestions[questionIndex].options.map(() => 0));
      // Start the 15-second timer
      setTimer(15);
      setTimerActive(true);
      // ensure votes cleared for new question
      await clearVotes();
      // Hide correct answer when starting quiz
      setShowCorrectAnswer(false);
    } catch (err) {
      console.error('startQuiz failed:', err);
      alert('Failed to start quiz: ' + err.message + '\n\nCheck console for details.');
    }
  }

  // show correct answer for current question
  function showCorrectAnswerForQuestion() {
    if (currentQuestionIndex >= 0 && currentQuestionIndex < quizQuestions.length) {
      const currentQuestion = quizQuestions[currentQuestionIndex];
      console.log('Current question data:', currentQuestion);
      
      const correctOption = currentQuestion.correct;
      console.log('Correct option value:', correctOption);
      
      if (!correctOption || correctOption === 'undefined') {
        alert('Correct answer not found in database. Please check that your quiz_questions collection has a field named "correct", "correctAnswer", "answer", or "correctOption".');
        return;
      }
      
      // Find the full text of the correct option
      const correctOptionData = currentQuestion.options.find(opt => opt.id === correctOption);
      const correctOptionLabel = correctOptionData ? correctOptionData.label : `${correctOption}`;
      
      setCorrectAnswer(correctOptionLabel);
      setShowCorrectAnswer(true);
      
      console.log('Correct answer for question', currentQuestionIndex + 1, ':', correctOption, '-', correctOptionLabel);
    } else {
      alert('Please select a question first');
    }
  }

  // move to next question and clear votes so audience can vote again
  async function nextQuestion() {
    try {
      const next = currentQuestionIndex + 1;
      if (next >= questions.length) {
        // finished quiz -> stop poll
        await setPollActiveState(false);
        setCurrentQuestionIndex(-1);
        setCurrentQuestionText('');
        return;
      }
      // clear old votes
      await clearVotes();
      // update poll config record
      let rec;
      try { rec = await pb.collection('poll_system').getFirstListItem(`type=\"config\"`); } catch (e) { rec = null; }
      const payload = { type: 'config', active: false, questionIndex: next, question: questions[next], timerActive: false };
      if (rec && rec.id) await pb.collection('poll_system').update(rec.id, payload);
      else await pb.collection('poll_system').create(payload);
      setCurrentQuestionIndex(next);
      setCurrentQuestionText(questions[next]);
      // Update options for next question
      setOptions(quizQuestions[next].options);
      setVotes(quizQuestions[next].options.map(() => 0));
      // Hide correct answer when changing question
      setShowCorrectAnswer(false);
      // Don't set poll active - only navigation, not starting poll
      // setPollActive(true); // Removed this line
    } catch (err) {
      console.error('nextQuestion failed', err);
    }
  }

  // go back to previous question
  async function previousQuestion() {
    try {
      const prev = currentQuestionIndex - 1;
      if (prev < 0) {
        // Can't go before first question
        return;
      }
      // clear current votes
      await clearVotes();
      // update poll config record
      let rec;
      try { rec = await pb.collection('poll_system').getFirstListItem(`type=\"config\"`); } catch (e) { rec = null; }
      const payload = { type: 'config', active: false, questionIndex: prev, question: questions[prev], timerActive: false };
      if (rec && rec.id) await pb.collection('poll_system').update(rec.id, payload);
      else await pb.collection('poll_system').create(payload);
      setCurrentQuestionIndex(prev);
      setCurrentQuestionText(questions[prev]);
      // Update options for previous question
      setOptions(quizQuestions[prev].options);
      setVotes(quizQuestions[prev].options.map(() => 0));
      // Hide correct answer when changing question
      setShowCorrectAnswer(false);
      // Don't set poll active - only navigation, not starting poll
      // setPollActive(true); // Removed this line
    } catch (err) {
      console.error('previousQuestion failed', err);
    }
  }

  async function clearVotes() {
    try {
      const filter = `type=\"vote\"${currentQuestionIndex >= 0 ? ' && questionIndex=' + currentQuestionIndex : ''}`;
      const all = await pb.collection('poll_system').getFullList({ filter });
      await Promise.all(all.map(r => pb.collection('poll_system').delete(r.id)));
      setVotes(options.map(() => 0));
    } catch (err) {
      console.error('clear votes failed', err);
    }
  }

  const total = votes.reduce((s, v) => s + v, 0) || 1;

  // Check authentication first
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden flex flex-col items-center justify-center">
        <div className="text-white text-3xl font-extrabold tracking-tight mb-4">IEC - Technical</div>
        <div className="text-red-400 text-xl">Authenticating...</div>
      </div>
    );
  }

  // Show loading state while fetching questions
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden flex flex-col items-center justify-center">
        <div className="text-white text-3xl font-extrabold tracking-tight mb-4">IEC - Technical</div>
        <div className="text-blue-300 text-xl">Loading questions from database...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden flex flex-col">
      {/* Center-top branding (in flow to avoid overlap) */}
      <div className="flex justify-center mb-6">
        <div className="text-white text-3xl font-extrabold tracking-tight">IEC - Technical</div>
      </div>
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-start">
        <div className="bg-black/90 border border-blue-400/30 shadow-xl rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                {currentQuestionIndex >= 0 ? `Q${currentQuestionIndex + 1}: ${currentQuestionText}` : 'Live Audience Poll'}
              </h2>
              {showCorrectAnswer && (
                <div className="mt-3 p-3 bg-green-900/50 border border-green-400 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="text-green-400 font-semibold">✓ Correct Answer:</div>
                    <div className="text-green-300 font-medium">{correctAnswer}</div>
                    <button
                      onClick={() => setShowCorrectAnswer(false)}
                      className="ml-auto text-green-400 hover:text-green-300 text-sm underline"
                    >
                      Hide
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="text-right">
              {timerActive ? (
                <>
                  <div className="text-sm text-blue-300">Time Remaining</div>
                  <div className={`text-2xl font-bold ${timer <= 5 ? 'text-red-400 animate-pulse' : timer <= 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {timer}s
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm text-blue-300">Total votes</div>
                  <div className="text-lg font-medium text-white">{total}</div>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {options.map((opt, i) => {
              const pct = Math.round((votes[i] / total) * 100);
              return (
                <div key={opt.id} className="flex items-center space-x-4">
                  <div className="w-12 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-[#B909F0] flex items-center justify-center text-white font-bold">{opt.id}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="text-sm font-medium text-white">{opt.label}</div>
                      <div className="text-sm font-semibold text-white">{pct}%</div>
                    </div>
                    <div className="mt-2 h-3 bg-white/5 rounded overflow-hidden">
                      <div
                        className={`h-3 rounded ${styles.bar} bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0]`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={pollActive ? () => setPollActiveState(false) : startQuiz}
                className={`px-4 py-2 rounded text-white ${pollActive ? 'bg-red-600 hover:brightness-110' : 'bg-blue-600 hover:brightness-110'}`}
              >
                {pollActive ? 'Stop Quiz' : 'Start Quiz'}
              </button>
              <button
                onClick={previousQuestion}
                disabled={currentQuestionIndex <= 0}
                className={`px-4 py-2 rounded text-white ${
                  currentQuestionIndex <= 0 
                    ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                    : 'bg-orange-600 hover:brightness-110'
                }`}
              >
                Previous Question
              </button>
              <button
                onClick={nextQuestion}
                className="px-4 py-2 rounded bg-gradient-to-r from-blue-500 via-purple-500 to-[#B909F0] text-white"
              >
                Next Question
              </button>
              <button
                onClick={showCorrectAnswerForQuestion}
                disabled={currentQuestionIndex < 0}
                className={`px-4 py-2 rounded text-white ${
                  currentQuestionIndex < 0 
                    ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                    : 'bg-green-600 hover:brightness-110'
                }`}
              >
                Show Correct Answer
              </button>
            </div>

            <div className="text-sm text-blue-300">Poll is: <span className={`font-semibold ${pollActive ? 'text-green-400' : 'text-red-400'}`}>{pollActive ? 'LIVE' : 'STOPPED'}</span>
            </div>
          </div>
        </div>

        {/* Leaderboard - Fastest Voters */}
        {/* Debug: Show count */}
        <div className="text-white text-center mt-4">Fastest Voters Count: {fastestVoters.length}</div>
        
        {fastestVoters.length > 0 && (
          <div className="bg-black/90 border border-blue-400/30 shadow-xl rounded-2xl p-6 mt-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">🏆</span>
              Fastest Voters - Top 10
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-blue-400/30">
                    <th className="pb-2 text-sm font-semibold text-blue-300">Rank</th>
                    <th className="pb-2 text-sm font-semibold text-blue-300">Reg No.</th>
                    <th className="pb-2 text-sm font-semibold text-blue-300">Answer</th>
                    <th className="pb-2 text-sm font-semibold text-blue-300">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {fastestVoters.map((voter) => (
                    <tr key={voter.rank} className="border-b border-white/5">
                      <td className="py-2 text-white">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                          voter.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                          voter.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                          voter.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-blue-500/20 text-blue-300'
                        } font-bold text-sm`}>
                          {voter.rank}
                        </span>
                      </td>
                      <td className="py-2 text-white font-medium">{voter.regNo}</td>
                      <td className="py-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-[#B909F0] text-white font-bold">
                          {voter.option}
                        </span>
                      </td>
                      <td className="py-2 text-blue-200 text-sm">{voter.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="relative mt-8 h-40">
          {/* Decorative floating bubbles like WhatsApp/KBC vibe */}
          <div className={styles.bubbles} aria-hidden="true">
            <span className={styles.bubble} />
            <span className={styles.bubble} />
            <span className={styles.bubble} />
            <span className={styles.bubble} />
            <span className={styles.bubble} />
          </div>
        </div>
      </div>
    </div>
  );
}