
import { Briefcase, Lightbulb, Users, GraduationCap } from "lucide-react";

const Audience = () => {
  const audiences = [
    {
      icon: <Briefcase className="w-10 h-10 text-blue-600" />,
      title: "Job Seekers",
      description: "Improve your chances of landing an AI-powered job."
    },
    {
      icon: <Lightbulb className="w-10 h-10 text-blue-600" />,
      title: "Entrepreneurs & Business Owners",
      description: "Use AI tools to scale your business."
    },
    {
      icon: <Users className="w-10 h-10 text-blue-600" />,
      title: "Beginners & Non-Tech Professionals",
      description: "Develop confidence in using AI technology."
    },
    {
      icon: <GraduationCap className="w-10 h-10 text-blue-600" />,
      title: "Students & Career Changers",
      description: "Get ready for the AI-driven economy."
    }
  ];

  return (
    <section id="audience" className="py-20 px-4 md:px-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">🎯 Who Should Take This Course?</h2>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto">
            AI Essentials is perfect for anyone looking to gain practical AI skills, regardless of your background.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {audiences.map((audience, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-8 shadow-md border border-slate-100 flex items-start space-x-6"
            >
              <div className="bg-blue-50 p-4 rounded-lg">{audience.icon}</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">{audience.title}</h3>
                <p className="text-slate-700">{audience.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Audience;
