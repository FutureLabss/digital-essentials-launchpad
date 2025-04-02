
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Audience from "@/components/Audience";
import Curriculum from "@/components/Curriculum";
import CallToAction from "@/components/CallToAction";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <Navbar />
      <Hero />
      <Features />
      <Audience />
      <Curriculum />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
