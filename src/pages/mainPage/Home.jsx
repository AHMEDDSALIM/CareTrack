import NavBar from '../../components/NavBar';
import HeroSection from '../../components/HeroSection';
export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <HeroSection />
    </div>
  );
}
