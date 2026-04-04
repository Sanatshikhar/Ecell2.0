import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from "./components/Header";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
// import Gallery from "./components/gallery";
import Team from "./components/Team";
import TechTeam from "./components/TechTeam";
import Members from "./components/Join";
import Join from "./components/TechXperience";
import ComingSoon from "./components/ComingSoon";
import Dashboard from './components/Dashboard';
import AudiencePollPage from './components/AudiencePollPage';
import AudiencePollResultsPage from './components/AudiencePollResultsPage';
import Verify from './components/Verify';
import Login from './components/Login';
import JoiningRegSheet from './components/JoiningRegSheet';
import CancellationRefunds from './components/CancellationRefunds';
import TermsConditions from './components/TermsConditions';
import Shipping from './components/Shipping';
import Privacy from './components/Privacy';
import pb from './lib/pocketbase';
import ScratchLabsRegistration from "./components/ScratchLabsRegistration";
import ScratchLabsParticipantDashboard from "./components/ScratchLabsParticipantDashboard";
import AITribunalRegistration from "./components/AITribunalRegistration";

function AppContent() {
  const [auth, setAuth] = React.useState(pb.authStore.isValid);
  const location = useLocation();

  React.useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setAuth(pb.authStore.isValid);
    });

    return unsubscribe;
  }, []);

  const hideHeaderPaths = [
    '/scratchlabs',
    '/scratchlabs/participant-portal',
    '/ai-tribunal',
    '/registrations',
    '/verify',
    '/scratchlabs/audience-poll',
    '/scratchlabs/audience-poll/results',
    '/data-export',
    '/joining-registrations',
    '/cancellation-refunds',
    '/terms-conditions',
    '/shipping',
    '/privacy',
  ];

  const showQueryBar = hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {!hideHeaderPaths.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/audience-poll" element={<Navigate to="/scratchlabs/audience-poll" replace />} />
        <Route path="/TechTeam" element={<TechTeam />} />
        <Route path="/Members" element={<Members />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/gallery" element={<Gallery />} /> */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/team" element={<Team />} />
        <Route path="/join" element={<Join />} />
        <Route path="/scratchlabs" element={<ScratchLabsRegistration />} />
        <Route path="/scratchlabs/participant-portal" element={<ScratchLabsParticipantDashboard />} />
        <Route path="/ai-tribunal" element={<AITribunalRegistration />} />
        <Route path="/registrations" element={auth ? <Dashboard /> : <Login onLogin={() => setAuth(true)} />} />
        <Route path="/joining-registrations" element={auth ? <JoiningRegSheet /> : <Login onLogin={() => setAuth(true)} />} />
        <Route path="/verify" element={auth ? <Verify /> : <Login onLogin={() => setAuth(true)} />} />
        <Route path="/comingsoon" element={<ComingSoon />} />
        <Route path="/scratchlabs/audience-poll" element={<AudiencePollPage />} />
        <Route path="/scratchlabs/audience-poll/results" element={auth ? <AudiencePollResultsPage /> : <Login onLogin={() => setAuth(true)} />} />
        <Route path="/cancellation-refunds" element={<CancellationRefunds />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>

      {showQueryBar && (
        <div className="global-query-bar" role="contentinfo" aria-label="Query contact details">
          <span>For any queries or question contact </span>
          <span className="global-query-team-contact">
            <span className="global-query-label">@IEC Technical Team :</span>
            <a href="tel:+917091318966" className="global-query-phone">+91 70913 18966</a>
          </span>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;