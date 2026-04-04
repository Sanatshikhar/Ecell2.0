import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shuffle, Users, CheckCircle, ArrowRight, Zap } from 'lucide-react';
import pb from '../lib/pocketbase';

const TEAM_COLLECTION = 'scratchlabs_teams';
const PROBLEM_COLLECTION = process.env.REACT_APP_PB_PROBLEM_COLLECTION || 'problem_statements';
const PRODUCTS_COLLECTION = 'products';

function escapeFilterValue(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function getProblemText(record) {
  if (!record || typeof record !== 'object') return '';
  const keys = ['statement', 'problemStatement', 'problem_statement', 'problem', 'title', 'text', 'name', 'description'];
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function getAssignedCount(record) {
  const value = Number(record?.assigned);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

async function findTeamByEmail(email) {
  const safeEmail = escapeFilterValue(email.toLowerCase());
  const filters = [
    `m1_email ~ "${safeEmail}"`,
    `m2_email ~ "${safeEmail}"`,
  ];

  for (const filter of filters) {
    try {
      const team = await pb.collection(TEAM_COLLECTION).getFirstListItem(filter);
      if (team) return team;
    } catch (error) {
      if (error?.status !== 404) throw error;
    }
  }

  return null;
}

async function findExistingAssignment(teamName) {
  try {
    const safeTeam = escapeFilterValue(teamName);
    const team = await pb.collection(TEAM_COLLECTION).getFirstListItem(`team_name="${safeTeam}"`);
    
    // Check if team has a problem_statement already assigned
    if (team && team.problem_statement) {
      const problemId = team.problem_statement;
      const problem = await pb.collection(PROBLEM_COLLECTION).getOne(problemId);
      return {
        problem_id: problemId,
        ...problem
      };
    }
    return null;
  } catch (error) {
    if (error?.status !== 404) throw error;
    return null;
  }
}

export default function ScratchLabsParticipantDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [pendingTeam, setPendingTeam] = useState(null);
  const [pendingMemberKey, setPendingMemberKey] = useState('');
  const [assignedProblem, setAssignedProblem] = useState(null);
  const [assignedProblemId, setAssignedProblemId] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [problems, setProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [status, setStatus] = useState('');
  const [productName, setProductName] = useState('');
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [productSubmitted, setProductSubmitted] = useState(false);
  const [savedProductName, setSavedProductName] = useState('');

  const normalizeRegNo = (value) => String(value || '').trim().toUpperCase();

  // Store current user data in a way that persists across refreshes via PocketBase auth
  const sessionStorageKey = 'scratchlabs_user_data';

  const saveUserSession = (user) => {
    sessionStorage.setItem(sessionStorageKey, JSON.stringify(user));
  };

  const loadUserSession = () => {
    try {
      const session = sessionStorage.getItem(sessionStorageKey);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  };

  const clearUserSession = () => {
    sessionStorage.removeItem(sessionStorageKey);
  };

  useEffect(() => {
    let mounted = true;

    const loadProblems = async () => {
      setLoadingProblems(true);
      try {
        const rows = await pb.collection(PROBLEM_COLLECTION).getFullList({ sort: 'created' });
        const parsed = rows
          .map((row) => ({ id: row.id, text: getProblemText(row), assigned: getAssignedCount(row) }))
          .filter((row) => row.text);

        if (mounted) {
          setProblems(parsed);
          if (!parsed.length) {
            setError('No problem statements found in PocketBase collection problem_statements.');
          }
        }
      } catch (loadError) {
        if (mounted) {
          setError('Unable to load problem statements from PocketBase.');
        }
      } finally {
        if (mounted) setLoadingProblems(false);
      }
    };

    const restoreSession = async () => {
      const savedUser = loadUserSession();
      if (savedUser && mounted) {
        setUserData(savedUser);
        setIsLoggedIn(true);

        // Load existing assignment and product
        try {
          const teamRecord = await pb.collection(TEAM_COLLECTION).getFirstListItem(`team_name="${escapeFilterValue(savedUser.teamId)}"`);
          
          // Load problem statement
          if (teamRecord && teamRecord.problem_statement) {
            const problemId = teamRecord.problem_statement;
            const problem = await pb.collection(PROBLEM_COLLECTION).getOne(problemId);
            const problemText = getProblemText(problem);
            setAssignedProblem(problemText);
            setAssignedProblemId(problemId);
            setStatus('Problem already locked for your team.');
          }

          // Load product name
          if (teamRecord && teamRecord.product) {
            const productId = teamRecord.product;
            const product = await pb.collection(PRODUCTS_COLLECTION).getOne(productId);
            setSavedProductName(product.name);
            setProductSubmitted(true);
          }
        } catch {
          // Silently fail
        }
      }
    };

    loadProblems();
    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');

    try {
      if (!pendingTeam) {
        const normalizedEmail = loginEmail.trim().toLowerCase();

        if (!normalizedEmail) {
          setError('Email is required.');
          return;
        }

        const team = await findTeamByEmail(normalizedEmail);
        if (!team) {
          setError('Email not found. Please use the email you registered with.');
          return;
        }

        const isMemberOne = (team.m1_email || '').toLowerCase() === normalizedEmail;
        setPendingTeam(team);
        setPendingMemberKey(isMemberOne ? 'm1' : 'm2');
        setStatus('Email verified. Enter your registration number to continue.');
        return;
      }

      const inputRegNo = normalizeRegNo(registrationNumber);
      if (!inputRegNo) {
        setError('Registration number is required for verification.');
        return;
      }

      const expectedRegNo = normalizeRegNo(
        pendingMemberKey === 'm1' ? pendingTeam.m1_regNo : pendingTeam.m2_regNo
      );

      if (!expectedRegNo) {
        setError('Registration number is not available for your profile. Please contact support.');
        return;
      }

      if (inputRegNo !== expectedRegNo) {
        setError('Registration number did not match our records.');
        return;
      }

      const isMemberOne = pendingMemberKey === 'm1';
      const mappedUser = {
        email: loginEmail.trim().toLowerCase(),
        name: isMemberOne ? (pendingTeam.m1_name || 'Participant') : (pendingTeam.m2_name || 'Participant'),
        teamId: pendingTeam.team_name || 'TEAM',
        teammateName: isMemberOne ? (pendingTeam.m2_name || 'Teammate') : (pendingTeam.m1_name || 'Teammate'),
        teammateEmail: isMemberOne ? (pendingTeam.m2_email || '') : (pendingTeam.m1_email || ''),
      };

      setUserData(mappedUser);
      setIsLoggedIn(true);
      saveUserSession(mappedUser);

      const existing = await findExistingAssignment(mappedUser.teamId);
      if (existing) {
        setAssignedProblem(getProblemText(existing));
        setStatus('Problem already locked for your team.');
      } else {
        setAssignedProblem(null);
        setStatus('Logged in. Reveal your problem statement when ready.');
      }
    } catch (loginError) {
      setError('Unable to verify your login right now. Please try again.');
    }
  };

  const handleUseDifferentEmail = () => {
    setPendingTeam(null);
    setPendingMemberKey('');
    setRegistrationNumber('');
    setStatus('');
    setError('');
  };

  const handleDrawProblem = async () => {
    if (!userData?.teamId || isSpinning || !problems.length || assignedProblem) return;

    const eligibleProblems = problems.filter((problem) => (problem.assigned || 0) < 3);
    if (!eligibleProblems.length) {
      setError('All problem statements have reached the assignment limit.');
      return;
    }

    setIsSpinning(true);
    setError('');
    setStatus('');

    let spins = 0;
    const spinInterval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * eligibleProblems.length);
      setAssignedProblem(eligibleProblems[randomIdx].text);
      spins += 1;

      if (spins > 15) {
        clearInterval(spinInterval);
      }
    }, 100);

    await new Promise((resolve) => setTimeout(resolve, 1700));

    const finalIdx = Math.floor(Math.random() * eligibleProblems.length);
    const finalProblem = eligibleProblems[finalIdx];

    try {
      const existing = await findExistingAssignment(userData.teamId);
      if (existing) {
        setAssignedProblem(getProblemText(existing));
        setStatus('Problem already locked for your team.');
      } else {
        const latestProblem = await pb.collection(PROBLEM_COLLECTION).getOne(finalProblem.id);
        const latestAssigned = getAssignedCount(latestProblem);

        if (latestAssigned >= 3) {
          setError('Selected problem reached limit. Please reveal again.');
          setAssignedProblem(null);
          return;
        }

        await pb.collection(PROBLEM_COLLECTION).update(finalProblem.id, {
          assigned: latestAssigned + 1,
        });

        // Update the team record with the problem relation field to lock the assignment
        const teamRecord = await pb.collection(TEAM_COLLECTION).getFirstListItem(`team_name="${escapeFilterValue(userData.teamId)}"`);
        if (teamRecord) {
          await pb.collection(TEAM_COLLECTION).update(teamRecord.id, {
            problem_statement: finalProblem.id,
          });
        }

        setAssignedProblem(finalProblem.text);
        setAssignedProblemId(finalProblem.id);
        setProblems((prev) => prev.map((item) => (
          item.id === finalProblem.id
            ? { ...item, assigned: (item.assigned || 0) + 1 }
            : item
        )));
        setStatus('Problem statement locked in your team profile!');
      }
    } catch (assignError) {
      setError('Could not lock problem in PocketBase. Please try again.');
    } finally {
      clearInterval(spinInterval);
      setIsSpinning(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setLoginEmail('');
    setRegistrationNumber('');
    setPendingTeam(null);
    setPendingMemberKey('');
    setAssignedProblem(null);
    setAssignedProblemId(null);
    setStatus('');
    setError('');
    setProductName('');
    setSavedProductName('');
    setProductSubmitted(false);
    clearUserSession();
  };

  const handleSubmitProductName = async () => {
    if (!productName.trim()) {
      setError('Product name cannot be empty.');
      return;
    }

    setIsSubmittingProduct(true);
    setError('');
    setStatus('');

    try {
      // Check if product name already exists
      const trimmedName = productName.trim();
      const existingProduct = await pb.collection(PRODUCTS_COLLECTION).getFirstListItem(`name="${escapeFilterValue(trimmedName)}"`);
      
      if (existingProduct) {
        setError('This product name is already taken. Please choose a different name.');
        setIsSubmittingProduct(false);
        return;
      }
    } catch (checkError) {
      // 404 means product name doesn't exist (which is good), so continue
      if (checkError?.status !== 404) {
        setError('Error checking product name availability. Please try again.');
        setIsSubmittingProduct(false);
        return;
      }
    }

    try {
      const productPayload = {
        name: productName.trim(),
        count: 0,
      };

      // Add problem_statement relation if available
      if (assignedProblemId) {
        productPayload.problem_statement = assignedProblemId;
      }

      const createdProduct = await pb.collection(PRODUCTS_COLLECTION).create(productPayload);

      // Link product to team
      const teamRecord = await pb.collection(TEAM_COLLECTION).getFirstListItem(`team_name="${escapeFilterValue(userData.teamId)}"`);
      if (teamRecord) {
        await pb.collection(TEAM_COLLECTION).update(teamRecord.id, {
          product: createdProduct.id,
        });
      }

      setSavedProductName(productName.trim());
      setProductSubmitted(true);
      setStatus('Product name saved and linked to your team profile!');
      setProductName('');
    } catch (productError) {
      setError('Failed to save product name. Please try again.');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-[#111111] border border-[#2a2a2a] rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="bg-[#c8ff00] text-black w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white">SCRATCHLABS</h1>
            <p className="text-[#a1a1aa] mt-2">Participant Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#d4d4d8] mb-2">
                Registered Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#71717a]" />
                </div>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-[#2a2a2a] bg-[#1a1a1a] text-white rounded-lg focus:ring-[#c8ff00] focus:border-[#c8ff00]"
                  placeholder="e.g., yourmail@example.com"
                  disabled={!!pendingTeam}
                  required
                />
              </div>
            </div>

            {pendingTeam && (
              <div>
                <label className="block text-sm font-medium text-[#d4d4d8] mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="block w-full px-3 py-3 border border-[#2a2a2a] bg-[#1a1a1a] text-white rounded-lg focus:ring-[#c8ff00] focus:border-[#c8ff00]"
                  placeholder="Enter your registration number"
                  required
                />
                <button
                  type="button"
                  onClick={handleUseDifferentEmail}
                  className="mt-3 text-xs text-[#a1a1aa] hover:text-white underline"
                >
                  Use a different email
                </button>
              </div>
            )}

            {(error || status) && (
              <p className={`text-sm -mt-2 ${error ? 'text-red-400' : 'text-[#c8ff00]'}`}>
                {error || status}
              </p>
            )}

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-black bg-[#c8ff00] hover:bg-[#b7ea00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8ff00] transition-colors"
            >
              {pendingTeam ? 'Verify & Enter' : 'Continue'} <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="flex justify-between items-center bg-[#111111] border border-[#2a2a2a] p-4 rounded-xl shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-white">Welcome, {userData.name}</h1>
            <p className="text-[#a1a1aa] text-sm">ScratchLabs Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-[#a1a1aa] hover:text-white"
          >
            Logout
          </button>
        </div>

        {(status || error) && (
          <div className={`rounded-xl px-4 py-3 text-sm ${error ? 'bg-red-950/40 text-red-300 border border-red-800' : 'bg-[#1d2b08] text-[#d9ff66] border border-[#7a9b1a]'}`}>
            {error || status}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-[#111111] rounded-2xl shadow-sm p-6 border border-[#2a2a2a]">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-[#c8ff00]/15 p-2 rounded-lg text-[#c8ff00]">
                <Users size={24} />
              </div>
              <h2 className="text-lg font-semibold text-white">Your Team Info</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#a1a1aa]">Team Designation</p>
                <p className="text-xl font-bold text-[#c8ff00]">{userData.teamId}</p>
              </div>

              <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
                <p className="text-sm font-medium text-[#d4d4d8] mb-2">Your Teammate</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{userData.teammateName}</p>
                    <p className="text-sm text-[#a1a1aa]">{userData.teammateEmail || 'N/A'}</p>
                  </div>
                  {userData.teammateEmail ? (
                    <a
                      href={`mailto:${userData.teammateEmail}`}
                      className="text-sm bg-[#111111] border border-[#2f2f35] text-[#d4d4d8] px-3 py-1 rounded-md hover:bg-[#1f1f24] transition-colors"
                    >
                      Contact
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#111111] rounded-2xl shadow-sm p-6 border border-[#2a2a2a] flex flex-col">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-[#ff6b00]/15 p-2 rounded-lg text-[#ff6b00]">
                <Zap size={24} />
              </div>
              <h2 className="text-lg font-semibold text-white">Your Problem Statement</h2>
            </div>

            {!assignedProblem ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
                <p className="text-[#a1a1aa]">
                  Your team has not revealed a ScratchLabs problem statement yet. Ready to start building from scratch?
                </p>
                <button
                  onClick={handleDrawProblem}
                  disabled={isSpinning || loadingProblems || !problems.length}
                  className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-black bg-[#c8ff00] hover:bg-[#b7ea00] disabled:bg-[#7a8746] disabled:text-[#1a1a1a] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Shuffle className={`mr-2 h-6 w-6 ${isSpinning ? 'animate-spin' : ''}`} />
                  {isSpinning ? 'Randomizing...' : 'Reveal Problem Statement'}
                </button>
                <p className="text-xs text-[#71717a]">Note: This action is permanent for your team.</p>
              </div>
            ) : (
              <div className="flex-grow flex flex-col justify-between">
                <div className={`bg-gradient-to-br from-[#1d2b08] to-[#211507] p-6 rounded-xl border border-[#3a4a18] ${isSpinning ? 'animate-pulse' : ''}`}>
                  <div className="text-lg font-medium text-[#f3ffcc] leading-relaxed" dangerouslySetInnerHTML={{ __html: assignedProblem }} />
                </div>

                {!isSpinning && (
                  <div className="mt-6 flex flex-col space-y-4">
                    <div className="flex items-center text-[#c8ff00] text-sm font-medium">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Locked in for {userData.teamId}
                    </div>

                    {/* Product Naming Section */}
                    <div className="pt-4 border-t border-[#2a2a2a]">
                      <h3 className="text-sm font-semibold text-white mb-3">Name Your Startup / Product</h3>
                      {!productSubmitted ? (
                        <form onSubmit={(e) => { e.preventDefault(); handleSubmitProductName(); }} className="flex space-x-2">
                          <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="e.g., EcoBox"
                            className="flex-grow px-3 py-2 border border-[#2a2a2a] bg-[#1a1a1a] text-white rounded-lg focus:ring-[#c8ff00] focus:border-[#c8ff00] text-sm"
                            required
                          />
                          <button
                            type="submit"
                            disabled={isSubmittingProduct || !productName.trim()}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-[#c8ff00] hover:bg-[#b7ea00] disabled:bg-[#7a8746] disabled:text-[#3a3a2a] focus:outline-none transition-colors"
                          >
                            Save
                          </button>
                        </form>
                      ) : (
                        <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a] flex justify-between items-center">
                          <div>
                            <p className="text-xs text-[#71717a] mb-1">Registered Product Name</p>
                            <p className="text-lg font-bold text-[#c8ff00]">{savedProductName}</p>
                          </div>
                          <div className="bg-[#1d2b08] text-[#7a9b1a] p-2 rounded-full">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl shadow-lg p-6 text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="text-lg font-semibold">Next Steps</h2>
            <Link
              to="/scratchlabs/marketing-links"
              className="inline-flex items-center justify-center rounded-lg border border-transparent bg-[#c8ff00] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#b7ea00]"
            >
              Submit Marketing Post Links
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-lg">
              <div className="font-bold text-[#c8ff00] mb-1">1. Ideate</div>
              <p className="text-sm text-[#a1a1aa]">Connect with your teammate and shape this challenge into a clear startup concept.</p>
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-lg">
              <div className="font-bold text-[#ff6b00] mb-1">2. Build the Pitch</div>
              <p className="text-sm text-[#a1a1aa]">Create your product direction, branding, and a crisp 1-minute pitch.</p>
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-lg">
              <div className="font-bold text-[#c8ff00] mb-1">3. Submit & Showcase</div>
              <p className="text-sm text-[#a1a1aa]">Submit your final output and present your startup story to the ScratchLabs panel.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
