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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Verify from './components/Verify';
import Login from './components/Login';
import pb from './lib/pocketbase';

function App() {
  const [auth, setAuth] = React.useState(pb.authStore.isValid);

  React.useEffect(() => {
    if (window.location.pathname === '/registrations') {
      pb.authStore.clear();
      setAuth(false);
    }
    const unsubscribe = pb.authStore.onChange(() => {
      setAuth(pb.authStore.isValid);
    });
    return unsubscribe;
  }, []);

  return (
    <Router>
      {!(window.location.pathname === '/registrations' || window.location.pathname === '/verify') && <Header />}
      <Routes>
        <Route path="/TechTeam" element={<TechTeam />} />
        <Route path="/Members" element={<Members />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/team" element={<Team />} />
        <Route path="/join" element={<Join />} />
        <Route path="/registrations" element={auth ? <Dashboard /> : <Login onLogin={() => setAuth(true)} />} />
        <Route path="/verify" element={auth ? <Verify /> : <Login onLogin={() => setAuth(true)} />} />
        <Route path="/comingsoon" element={<ComingSoon />} />
      </Routes>
    </Router>
  );
}

export default App;
