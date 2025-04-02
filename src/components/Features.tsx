
import { Check, Award, Clock, Users, Laptop, Shield } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Check className="w-10 h-10 text-blue-600" />,
      title: "Beginner-Friendly",
      description: "No prior tech experience required!"
    },
    {
      icon: <Laptop className="w-10 h-10 text-blue-600" />,
      title: "100% Online & Mobile-Optimized",
      description: "Learn from anywhere, anytime."
    },
    {
      icon: <Shield className="w-10 h-10 text-blue-600" />,
      title: "Practical Hands-on Learning",
      description: "Real-world exercises and projects."
    },
    {
      icon: <Users className="w-10 h-10 text-blue-600" />,
      title: "Expert Guidance & Community Support",
      description: "You're never alone in your journey."
    },
    {
      icon: <Award className="w-10 h-10 text-blue-600" />,
      title: "Recognized Certification",
      description: "Boost your resume & stand out to employers."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 md:px-8 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">📌 What Makes Digital Essentials Different?</h2>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto">
            Our course stands out because we focus on practical skills that actually matter in today's digital workplace.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-slate-50 rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">{feature.title}</h3>
              <p className="text-slate-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
