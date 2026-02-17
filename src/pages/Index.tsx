
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Code, BookOpen, Zap, Globe, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Toaster />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Start your tech career with
              <span className="text-blue-600 block"> FutureLabs</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Develop skills for the future. At FutureLabs we help young talents access global opportunities by empowering them with digital skills through our training programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Learning
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                View Programs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tagline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Where Futurists Work
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We Help Startups on a Budget Scale Fast and Smart with top notch innovative solutions speaking to user needs
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Software Training Programs */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Software Training Programs
              </h3>
              <p className="text-gray-600 mb-6">
                We offer a 9 months bootcamp designed to take you from zero to hero, you will learn new technologies, join a community of techies, build real world projects and collaborate with teammates in a cross functional environment
              </p>
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </div>

            {/* Custom Web and Mobile Solutions */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Code className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Custom Web and Mobile Solutions
              </h3>
              <p className="text-gray-600 mb-6">
                Our software solution is specially designed for startups looking to build minimum viable products for their ideas quickly
              </p>
              <Button variant="outline" className="w-full">
                Visit Studios
              </Button>
            </div>

            {/* Recorded Courses */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Recorded Courses
              </h3>
              <p className="text-gray-600 mb-6">
                Our pre-recorded courses are designed to take your career to the next level
              </p>
              <Button variant="outline" className="w-full">
                Browse Courses
              </Button>
            </div>

            {/* Talent Pool Access */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Talent Pool Access
              </h3>
              <p className="text-gray-600 mb-6">
                We take the best talents from our training programs and place them in international roles where they contribute and learn new skills. A win win.
              </p>
              <Button variant="outline" className="w-full">
                View Talent
              </Button>
            </div>

            {/* Project Genesis */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Project Genesis
              </h3>
              <p className="text-gray-600 mb-6">
                Learn the skills you need for the jobs of today
              </p>
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </div>

            {/* Minimum Viable Products */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Minimum Viable Products
              </h3>
              <p className="text-gray-600 mb-6">
                We have free and premium products developed to meet specific needs
              </p>
              <Button variant="outline" className="w-full">
                Explore Products
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Tech Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of learners who have transformed their careers with FutureLabs
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
