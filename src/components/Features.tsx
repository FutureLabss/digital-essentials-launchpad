
import { Check, Award, Clock, Users, Laptop, Shield, BookOpen, Code, Zap, Globe, TrendingUp } from "lucide-react";

const Features = () => {
  const services = [
    {
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      title: "Software Training Programs",
      description: "We offer a 9 months bootcamp designed to take you from zero to hero, you will learn new technologies, join a community of techies, build real world projects and collaborate with teammates in a cross functional environment"
    },
    {
      icon: <Code className="w-6 h-6 text-green-600" />,
      title: "Custom Web and Mobile Solutions",
      description: "Our software solution is specially designed for startups looking to build minimum viable products for their ideas quickly"
    },
    {
      icon: <Zap className="w-6 h-6 text-purple-600" />,
      title: "Recorded Courses",
      description: "Our pre-recorded courses are designed to take your career to the next level"
    },
    {
      icon: <Users className="w-6 h-6 text-orange-600" />,
      title: "Talent Pool Access",
      description: "We take the best talents from our training programs and place them in international roles where they contribute and learn new skills. A win win."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-red-600" />,
      title: "Project Genesis",
      description: "Learn the skills you need for the jobs of today"
    },
    {
      icon: <Globe className="w-6 h-6 text-indigo-600" />,
      title: "Minimum Viable Products",
      description: "We have free and premium products developed to meet specific needs"
    }
  ];

  return (
    <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Where Futurists Work
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We Help Startups on a Budget Scale Fast and Smart with top notch innovative solutions speaking to user needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {service.description}
              </p>
              <button className="text-blue-600 font-medium hover:text-blue-700">
                Learn More →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
