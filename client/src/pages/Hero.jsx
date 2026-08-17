import Nav from '../components/landing/Nav';
import HeroSection from '../components/landing/HeroSection';
import About from '../components/landing/About';
import StackStrip from '../components/landing/StackStrip';
import Capabilities from '../components/landing/Capabilities';
import Workspace from '../components/landing/Workspace';
import Process from '../components/landing/Process';
import Audience from '../components/landing/Audience';
import Faq from '../components/landing/Faq';
import Footer from '../components/landing/Footer';

// `.landing-root` is what the scoped rules in index.css key off, so this page
// escapes the app shell's viewport-locked #root and its theme-driven body
// background.
export default function Hero() {
  return (
    <div className="landing-root min-h-screen bg-paper font-sans text-ink antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:font-mono focus:text-[13px] focus:text-paper"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <HeroSection />
        <About />
        <StackStrip />
        <Capabilities />
        <Workspace />
        <Process />
        <Audience />
        <Faq />
      </main>

      <Footer />
    </div>
  );
}
