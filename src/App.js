import "./App.css";
import React from "react";
import Header from "./components/Header";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Gallery from "./components/gallery";
import Team from "./components/Team";
import TechTeam from "./components/TechTeam";
import Members from "./components/Join";
import Join from "./components/TechXperience";
import ComingSoon from "./components/ComingSoon";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AudiencePoll from './components/AudiencePoll';
import AudienceVote from './components/AudienceVote';
import Verify from './components/Verify';
import Login from './components/Login';
import JoiningRegSheet from './components/JoiningRegSheet';
import CancellationRefunds from './components/CancellationRefunds';
import TermsConditions from './components/TermsConditions';
import Shipping from './components/Shipping';
import Privacy from './components/Privacy';
import pb from './lib/pocketbase';
import RegistrationSlider from "./components/RegistrationSlider/RegistrationSlider";

function AppContent() {
  const [auth, setAuth] = React.useState(pb.authStore.isValid);
  const location = useLocation();

  React.useEffect(() => {
    if (location.pathname === '/registrations') {
      pb.authStore.clear();
      setAuth(false);
    }
    const unsubscribe = pb.authStore.onChange(() => {
      setAuth(pb.authStore.isValid);
    });
    return unsubscribe;
  }, [location.pathname]);

  const hideHeaderPaths = ['/registration-slider', '/registrations', '/verify', '/audience-poll', '/audience-vote', '/joining-registrations', '/cancellation-refunds', '/terms-conditions', '/shipping', '/privacy'];

  return (
    <>
      {!hideHeaderPaths.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/TechTeam" element={<TechTeam />} />
        <Route path="/Members" element={<Members />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/team" element={<Team />} />
        <Route path="/join" element={<Join />} />
        <Route path="/registration-slider" element={<RegistrationSlider />} />
        <Route path="/registrations" element={auth ? <Dashboard /> : <Login onLogin={() => setAuth(true)} />} />
        <Route path="/joining-registrations" element={auth ? <JoiningRegSheet /> : <Login onLogin={() => setAuth(true)} />} />
        <Route path="/verify" element={auth ? <Verify /> : <Login onLogin={() => setAuth(true)} />} />
        <Route path="/comingsoon" element={<ComingSoon />} />
        <Route path="/audience-poll" element={auth ? <AudiencePoll /> : <Login onLogin={() => setAuth(true)} />} />
        <Route path="/audience-vote" element={<AudienceVote />} />
        <Route path="/cancellation-refunds" element={<CancellationRefunds />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
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
