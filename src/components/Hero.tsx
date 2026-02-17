
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 px-4 md:px-8 lg:py-28 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
            Start your tech career with
            <span className="text-blue-600 block"> FutureLabs</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Develop skills for the future. At FutureLabs we help young talents access global opportunities by empowering them with digital skills through our training programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 h-auto" size="lg" onClick={() => navigate("/auth")}>
              Start Learning <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="text-lg px-8 py-6 h-auto border-gray-300" size="lg">
              View Programs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
