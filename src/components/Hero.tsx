
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 px-4 md:px-8 lg:py-28">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-slate-900">
              Unlock the Power of <span className="text-blue-600">AI Skills</span> in Just 6 Weeks!
            </h1>
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              The world is being transformed by AI—are you keeping up? Whether you want to land a remote job, start a business, or work smarter, AI Essentials gives you the skills you need to thrive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 h-auto" size="lg" onClick={() => navigate("/auth")}>
                Get Started Today! <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="text-lg px-8 py-6 h-auto border-slate-300" size="lg">
                Learn More
              </Button>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-lg p-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 opacity-10 rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500 opacity-10 rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">🚀 The Ultimate AI Skills Course for Beginners</h2>
              <p className="text-slate-700 mb-4">
                This mobile-friendly, self-paced course is designed for absolute beginners, making it easy, practical, and fun to learn AI tools that will transform your career.
              </p>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Limited spots available</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full w-[75%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
