
import { Flame, BookOpen, Lock, Unlock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

const supabase = createClient();

const Curriculum = () => {
  const { user } = useAuth();
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ["published-courses"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("id, title, description, short_description, image_url, price, currency, created_at")
          .eq("is_published", true)
          .order("created_at", { ascending: true });
        
        if (error) {
          console.error("Courses query error:", error);
          return []; // Return empty array instead of throwing
        }
        return data || [];
      } catch (err) {
        console.error("Courses fetch error:", err);
        return []; // Return empty array on any error
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2, // Reduced retry attempts
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Get user's enrollments and progress
  const { data: enrollments } = useQuery({
    queryKey: ["user-enrollments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      try {
        const { data, error } = await supabase
          .from("enrollments")
          .select("course_id, payment_status")
          .eq("user_id", user.id)
          .eq("payment_status", "completed");
        
        if (error) {
          console.error("Enrollments query error:", error);
          return [];
        }
        return data || [];
      } catch (err) {
        console.error("Enrollments fetch error:", err);
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Get user's lesson progress to check Week 1 completion
  const { data: lessonProgress } = useQuery({
    queryKey: ["lesson-progress", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      try {
        const { data, error } = await supabase
          .from("lesson_progress")
          .select("lesson_id, completed")
          .eq("user_id", user.id);
        
        if (error) {
          console.error("Lesson progress query error:", error);
          return [];
        }
        return data || [];
      } catch (err) {
        console.error("Lesson progress fetch error:", err);
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: lessons, error: lessonsError } = useQuery({
    queryKey: ["course-lessons"],
    queryFn: async () => {
      if (!courses || courses.length === 0) return [];
      
      try {
        const { data, error } = await supabase
          .from("lessons")
          .select("id, course_id, title, content, sort_order, lesson_type")
          .in("course_id", courses.map(c => c.id))
          .order("sort_order", { ascending: true });
        
        if (error) {
          console.error("Lessons query error:", error);
          return []; // Return empty array instead of throwing
        }
        return data || [];
      } catch (err) {
        console.error("Lessons fetch error:", err);
        return []; // Return empty array on any error
      }
    },
    enabled: !!courses && courses.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2, // Reduced retry attempts
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Group lessons by course/week with proper sequencing and access control
  const getWeeksFromData = () => {
    if (!courses || !lessons) return [];
    
    // Sort courses by created_at to ensure proper week ordering
    const sortedCourses = [...courses].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    // Get enrolled course IDs
    const enrolledCourseIds = enrollments ? enrollments.map(e => e.course_id) : [];
    
    // Check if Week 1 is completed to unlock Week 2
    const week1Course = sortedCourses.find(c => c.title?.includes("Week 1") || c.created_at === sortedCourses[0]?.created_at);
    const week1Lessons = lessons.filter(l => l.course_id === week1Course?.id);
    const week1Completed = week1Lessons.length > 0 && week1Lessons.every(lesson => 
      lessonProgress.some(progress => progress.lesson_id === lesson.id && progress.completed)
    );
    
    return sortedCourses.map((course, index) => {
      const courseLessons = lessons
        .filter(l => l.course_id === course.id)
        .sort((a, b) => a.sort_order - b.sort_order); // Sort lessons within each course
      
      const weekNumber = index + 1;
      const isEnrolled = enrolledCourseIds.includes(course.id);
      
      // Access logic: Week 1 always accessible, Week 2 accessible if Week 1 completed OR if free, others need enrollment
      let canAccess = weekNumber === 1 || isEnrolled;
      if (weekNumber === 2) {
        // Week 2 is accessible if enrolled OR if Week 1 is completed OR if it's a free course
        const week2Course = sortedCourses.find(c => c.title?.includes("Week 2") || c.created_at === sortedCourses[1]?.created_at);
        if (week2Course && week2Course.price === 0) {
          canAccess = true; // Free course - always accessible
        } else if (week1Completed) {
          canAccess = true; // Paid course but Week 1 completed - unlock
        }
      }
      
      return {
        week: weekNumber,
        title: course.title || `Week ${weekNumber}`,
        description: course.short_description || course.description || "",
        lessons: courseLessons,
        course_id: course.id,
        isLocked: !canAccess,
        isEnrolled
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

  // Handle case where no courses/lessons are found
  if (!weeks || weeks.length === 0) {
    return (
    <section id="curriculum" className="py-20 px-4 md:px-8 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">📚 What You'll Learn</h2>
          <p className="text-lg text-slate-700">
            No courses are available at the moment. Please check back later.
          </p>
        </div>
      </div>
    </section>
  );
  }

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
            className={`rounded-xl p-6 shadow-sm border transition-shadow ${
              week.isLocked 
                ? 'bg-gray-100 border-gray-200 opacity-75' 
                : 'bg-slate-50 border-slate-100 hover:shadow-md'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 p-4 rounded-lg flex items-center justify-center ${
                week.isLocked 
                  ? 'bg-gray-400 text-white' 
                  : 'bg-blue-600 text-white'
              }`}>
                {week.isLocked ? (
                  <Lock className="w-6 h-6 mr-2" />
                ) : (
                  <Unlock className="w-6 h-6 mr-2" />
                )}
                <span className="font-bold text-lg">Week {week.week}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{week.title}</h3>
                  {week.isLocked && !week.isEnrolled && (
                    <span className="text-sm text-orange-600 font-medium">
                      {week.week === 2 
                        ? "Complete Week 1 to unlock" 
                        : "Enroll in Week 1 to unlock"
                      }
                    </span>
                  )}
                </div>
                <p className="text-slate-700 mb-4">{week.description}</p>
                
                {week.lessons && week.lessons.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-slate-800 mb-2">
                      {week.isLocked ? 'Lessons (Locked)' : 'Lessons:'}
                    </h4>
                    <div className="grid gap-2">
                      {week.lessons.map((lesson) => (
                        <div key={lesson.id} className={`flex items-center gap-2 text-sm ${
                          week.isLocked ? 'text-gray-500' : 'text-slate-600'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            week.isLocked ? 'bg-gray-400' : 'bg-blue-400'
                          }`}></div>
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
    </section>
  );
}

export default Curriculum;
