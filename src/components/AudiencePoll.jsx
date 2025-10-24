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

const defaultQuestions = [
  'Question 1: Which option is best?',
  'Question 2: Pick the correct answer',
  'Question 3: Final poll question'
];
export default function AudiencePoll({ wsUrl, question = 'Which option do you prefer?' }) {
  const [options] = useState(defaultOptions);
  const [votes, setVotes] = useState(() => options.map(() => 0));
  const [running, setRunning] = useState(true);
  const [pollActive, setPollActive] = useState(false);
  const [questions] = useState(defaultQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  const wsRef = useRef(null);
  const fetchingRef = useRef(false);

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
        return;
      }
      const all = await pb.collection('poll_system').getFullList({ filter: `type=\"vote\" && questionIndex=${qIndex}` });
      const counts = options.map(() => 0);
      all.forEach((r) => {
        const index = ['A','B','C','D'].indexOf(r.option);
        if (index >= 0) counts[index] += 1;
      });
      setVotes(counts);
    } catch (err) {
      console.error('Failed to fetch votes:', err);
    } finally {
      fetchingRef.current = false;
    }
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
      } else if (e.record?.type === 'vote' && !fetchingRef.current) {
        fetchVotesForCurrentQuestion(currentQuestionIndex);
      }
    });

    return () => {
      mounted = false;
      try { pb.collection('poll_system').unsubscribe(pollSystemSub); } catch (e) {}
    };
  }, [options]);

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
      setPollActive(true);
    } catch (err) {
      console.error('nextQuestion failed', err);
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
                onClick={startQuiz}
                className={`px-4 py-2 rounded text-white ${pollActive ? 'bg-green-600' : 'bg-blue-600 hover:brightness-110'}`}
              >
                Start Quiz
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