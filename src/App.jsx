import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Footer from './components/Footer';
import Car from './components/Car';
import Contact from './components/Contact';


const App = () => {
  return (        
     <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/car" element={<Car />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      
    </Router>
    
  )
}

export default App;