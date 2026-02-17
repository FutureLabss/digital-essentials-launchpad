
import { Flame, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

const Curriculum = () => {
  const { data: courses, isLoading } = useQuery({
    queryKey: ["published-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, description, short_description, image_url, price, currency")
        .eq("is_published", true)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: lessons } = useQuery({
    queryKey: ["course-lessons"],
    queryFn: async () => {
      if (!courses || courses.length === 0) return [];
      
      const { data, error } = await supabase
        .from("lessons")
        .select("id, course_id, title, content, sort_order, lesson_type")
        .in("course_id", courses.map(c => c.id))
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!courses && courses.length > 0,
  });

  // Group lessons by course/week
  const getWeeksFromData = () => {
    if (!courses || !lessons) return [];
    
    return courses.map((course, index) => {
      const courseLessons = lessons.filter(l => l.course_id === course.id);
      const weekNumber = index + 1;
      
      return {
        week: weekNumber,
        title: course.title || `Week ${weekNumber}`,
        description: course.short_description || course.description || "",
        lessons: courseLessons,
        course_id: course.id
      };
    });
  };

  const skills = [
    "AI fundamentals & machine learning basics",
    "Prompt engineering & AI tool mastery",
    "AI-powered content creation",
    "Automating workflows with AI",
    "AI for data analysis & insights",
    "AI in marketing & business strategy",
    "Responsible AI use & ethics",
    "Building AI-enhanced projects",
    "AI productivity workflows",
    "Future-proofing your career with AI"
  ];

  if (isLoading) {
    return (
      <section id="curriculum" className="py-20 px-4 md:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">📚 What You'll Learn</h2>
            <p className="text-lg text-slate-700">Loading curriculum...</p>
          </div>
        </div>
      </section>
    );
  }

  const weeks = getWeeksFromData();

  return (
    <section id="curriculum" className="py-20 px-4 md:px-8 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            📚 What You'll Learn ({weeks.length}-Week Breakdown)
          </h2>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto">
            Our comprehensive curriculum is designed to progressively build your AI skills from the ground up.
          </p>
        </div>
        
        {/* What You'll Learn Card */}
        <div className="mb-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 shadow-md border border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Skills You'll Master</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-green-500 text-white p-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-slate-700">{skill}</span>
              </div>
            ))}
          </div>
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
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-slate-900">{week.title}</h3>
                  <p className="text-slate-700 mb-4">{week.description}</p>
                  
                  {week.lessons && week.lessons.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-slate-800 mb-2">Lessons:</h4>
                      <div className="grid gap-2">
                        {week.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center gap-2 text-sm text-slate-600">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>{lesson.title}</span>
                            <span className="text-xs text-slate-400">({lesson.lesson_type})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
