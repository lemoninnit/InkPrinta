import Navbar from './Navbar.jsx';
import HeroSection from './HeroSection.jsx';

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full bg-white font-sans flex flex-col relative overflow-hidden selection:bg-cyan-100">
      <Navbar />
      <HeroSection />
    </main>
  );
}
