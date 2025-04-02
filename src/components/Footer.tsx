
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Digital Essentials</h2>
            <p className="text-slate-300 mb-6 max-w-md">
              Empowering beginners with essential digital skills to thrive in today's digital world. Learn at your own pace, from anywhere.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#audience" className="hover:text-blue-400 transition-colors">Who It's For</a></li>
              <li><a href="#curriculum" className="hover:text-blue-400 transition-colors">Curriculum</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-slate-300">
              <li>Email: hello@digitalessentials.com</li>
              <li>Phone: (123) 456-7890</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Digital Essentials. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm flex items-center mt-4 md:mt-0">
            Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> by Digital Essentials Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
