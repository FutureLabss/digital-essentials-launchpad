
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate("/")}>AI Essentials</h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-slate-700 hover:text-blue-600 transition-colors">Features</a>
          <a href="#audience" className="text-slate-700 hover:text-blue-600 transition-colors">Who It's For</a>
          <a href="#curriculum" className="text-slate-700 hover:text-blue-600 transition-colors">Curriculum</a>
          {user ? (
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/dashboard")}>Dashboard</Button>
          ) : (
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/auth")}>Get Started</Button>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-slate-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a href="#features" className="text-slate-700 hover:text-blue-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#audience" className="text-slate-700 hover:text-blue-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Who It's For</a>
            <a href="#curriculum" className="text-slate-700 hover:text-blue-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Curriculum</a>
            {user ? (
              <Button className="bg-blue-600 hover:bg-blue-700 w-full" onClick={() => { setIsMenuOpen(false); navigate("/dashboard"); }}>Dashboard</Button>
            ) : (
              <Button className="bg-blue-600 hover:bg-blue-700 w-full" onClick={() => { setIsMenuOpen(false); navigate("/auth"); }}>Get Started</Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
