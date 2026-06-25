import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landing-page/LandingPage';
import DesignStudio from './components/design-studio/DesignStudio';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/design" element={<DesignStudio />} />
      </Routes>
    </Router>
  );
}

export default App;
