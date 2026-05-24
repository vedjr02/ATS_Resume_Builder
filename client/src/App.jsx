import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Hero from './components/sections/Hero.jsx';
import HowItWorks from './components/sections/HowItWorks.jsx';
import Features from './components/sections/Features.jsx';
import Generator from './components/sections/Generator.jsx';

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-obsidian-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-30%,rgba(99,102,241,0.12),transparent)]" />
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Generator />
      </main>
      <Footer />
    </div>
  );
}
