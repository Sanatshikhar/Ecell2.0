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
  const wsRef = useRef(null);
  const fetchingRef = useRef(false);
  const leaderboardTimerRef = useRef(null);

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

        // Transform database records to quiz format
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
        setQuestions(loadedQuestions.map(q => q.question));
        console.log('Loaded questions from database:', loadedQuestions);
      } catch (err) {
        console.error('Failed to load questions:', err);
        alert('Failed to load questions from database. Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    }

    loadQuestionsFromDB();
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
        setPollActive(!!p.active);
        const qi = typeof p.questionIndex === 'number' ? p.questionIndex : (p.questionIndex ? Number(p.questionIndex) : -1);
        setCurrentQuestionIndex(qi ?? -1);
        setCurrentQuestionText(p.question || '');
      } catch (e) {
        if (!mounted) return;
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
      // Check if it's a config update or vote update
      if (e.record?.type === 'config') {
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
        await pb.collection('poll_system').update(rec.id, { active });
      } else {
        await pb.collection('poll_system').create({ type: 'config', active });
      }
      setPollActive(active);
    } catch (err) {
      console.error('Failed to update poll state', err);
    }
  }

  // start the quiz (question 0)
  async function startQuiz() {
    try {
      console.log('Starting quiz...');
      let rec;
      try { 
        rec = await pb.collection('poll_system').getFirstListItem(`type=\"config\"`); 
        console.log('Found existing config:', rec);
      } catch (e) { 
        console.log('No existing config found, will create new one');
        rec = null; 
      }
      const payload = { type: 'config', active: true, questionIndex: 0, question: questions[0] };
      console.log('Payload:', payload);
      
      if (rec && rec.id) {
        console.log('Updating existing config...');
        await pb.collection('poll_system').update(rec.id, payload);
      } else {
        console.log('Creating new config...');
        await pb.collection('poll_system').create(payload);
      }
      
      console.log('Quiz started successfully!');
      setPollActive(true);
      setCurrentQuestionIndex(0);
      setCurrentQuestionText(questions[0]);
      // Update options for question 0
      setOptions(quizQuestions[0].options);
      setVotes(quizQuestions[0].options.map(() => 0));
      // ensure votes cleared for new question
      await clearVotes();
    } catch (err) {
      console.error('startQuiz failed:', err);
      alert('Failed to start quiz: ' + err.message + '\n\nCheck console for details.');
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
      const payload = { type: 'config', active: true, questionIndex: next, question: questions[next] };
      if (rec && rec.id) await pb.collection('poll_system').update(rec.id, payload);
      else await pb.collection('poll_system').create(payload);
      setCurrentQuestionIndex(next);
      setCurrentQuestionText(questions[next]);
      // Update options for next question
      setOptions(quizQuestions[next].options);
      setVotes(quizQuestions[next].options.map(() => 0));
      setPollActive(true);
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
      const payload = { type: 'config', active: true, questionIndex: prev, question: questions[prev] };
      if (rec && rec.id) await pb.collection('poll_system').update(rec.id, payload);
      else await pb.collection('poll_system').create(payload);
      setCurrentQuestionIndex(prev);
      setCurrentQuestionText(questions[prev]);
      // Update options for previous question
      setOptions(quizQuestions[prev].options);
      setVotes(quizQuestions[prev].options.map(() => 0));
      setPollActive(true);
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
              <h2 className="text-2xl font-semibold text-white">Live Audience Poll</h2>
              <p className="mt-1 text-sm text-blue-200">{question}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-300">Total votes</div>
              <div className="text-lg font-medium text-white">{total}</div>
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
            </div>

            <div className="text-sm text-blue-300">Poll is: <span className={`font-semibold ${pollActive ? 'text-green-400' : 'text-red-400'}`}>{pollActive ? 'LIVE' : 'STOPPED'}</span>
            {currentQuestionIndex >= 0 && <span className="ml-2 text-sm text-white">Q{currentQuestionIndex+1}: {currentQuestionText}</span>}
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