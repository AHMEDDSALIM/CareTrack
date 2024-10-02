import { Link } from "react-router-dom";
import CFooter from "../../components/Footer";
import NavBar from "../../components/NavBar";
import HeroSection from "../../components/HeroSection";
import Services from "../../components/Services";
export default function Home() {
  return (
    <>
      <NavBar />
      <HeroSection />
      <Services />
      <CFooter />
    </>
  );
}
