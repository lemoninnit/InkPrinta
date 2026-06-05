import HeroOverlay from './components/sections/HeroOverlay';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <main className="min-h-screen w-full bg-white font-sans flex flex-col relative overflow-hidden selection:bg-cyan-100">
      <Navbar />
      <HeroOverlay />
    </main>
  );
}

export default App;