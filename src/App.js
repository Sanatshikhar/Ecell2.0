import "./App.css";
import Header from "./components/Header";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Gallery from "./components/gallery";
import Team from "./components/Team";
import TechTeam from "./components/TechTeam";
import TechXperience from "./components/TechXperience";
import Join from "./components/Join";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Header /> 
      <Routes>
  <Route path="/TechTeam" element={<TechTeam />} />
  <Route path="/TechXperience" element={<TechXperience />} />
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
