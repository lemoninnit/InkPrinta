import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroOverlay from './components/sections/HeroOverlay';
import Navbar from './components/layout/Navbar';
import DesignStudio from './components/design/DesignStudio';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <main className="min-h-screen w-full bg-white font-sans flex flex-col relative overflow-hidden selection:bg-cyan-100">
            <Navbar />
            <HeroOverlay />
          </main>
        } />
        <Route path="/design" element={<DesignStudio />} />
      </Routes>
    </Router>
  );
}

export default App;