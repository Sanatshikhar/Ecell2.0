import "./App.css";
import Header from "./components/Header";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Gallery from "./components/gallery";
import Team from "./components/Team";
import TechTeam from "./components/TechTeam";
import Members from "./components/Join";
import Join from "./components/TechXperience";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Header /> 
      <Routes>
  <Route path="/TechTeam" element={<TechTeam />} />
  <Route path="/Members" element={<Members />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/team" element={<Team />} />
  <Route path="/join" element={<Join />} />
      </Routes>
    </Router>
  );
}

export default App;
