
import { Flame } from "lucide-react";

const Curriculum = () => {
  const weeks = [
    {
      week: 1,
      title: "Digital Literacy & Online Safety",
      description: "Learn the fundamentals of digital literacy and how to stay safe online."
    },
    {
      week: 2,
      title: "Basic Computer & Mobile Skills",
      description: "Master essential computer and mobile device skills for productivity."
    },
    {
      week: 3,
      title: "Internet Navigation & Productivity Tools",
      description: "Explore efficient internet use and popular productivity applications."
    },
    {
      week: 4,
      title: "Digital Communication & Remote Work",
      description: "Develop skills for effective digital communication and remote collaboration."
    },
    {
      week: 5,
      title: "Cloud Computing & Data Management",
      description: "Learn cloud services and basic data management techniques."
    },
    {
      week: 6,
      title: "Capstone Project & Practical Application",
      description: "Apply your new skills to complete a real-world digital project."
    }
  ];

  return (
    <section id="curriculum" className="py-20 px-4 md:px-8 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">📚 What You'll Learn (6-Week Breakdown)</h2>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto">
            Our comprehensive curriculum is designed to progressively build your digital skills from the ground up.
          </p>
        </div>
        
        <div className="space-y-6">
          {weeks.map((week) => (
            <div 
              key={week.week} 
              className="bg-slate-50 rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-blue-600 text-white p-4 rounded-lg flex items-center justify-center">
                  <Flame className="w-6 h-6 mr-2" />
                  <span className="font-bold text-lg">Week {week.week}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">{week.title}</h3>
                  <p className="text-slate-700">{week.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Curriculum;
