
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Audience from "@/components/Audience";
import Curriculum from "@/components/Curriculum";
import CallToAction from "@/components/CallToAction";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Audience />
      <Curriculum />
      <CallToAction />
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
