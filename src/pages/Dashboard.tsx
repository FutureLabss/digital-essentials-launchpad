import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Lock, CheckCircle, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  short_description: string;
  price: number;
  currency: string;
  image_url: string;
}

interface Enrollment {
  course_id: string;
  payment_status: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [coursesRes, enrollmentsRes, profileRes] = await Promise.all([
        supabase.from("courses").select("*").eq("is_published", true),
        supabase.from("enrollments").select("course_id, payment_status"),
        supabase.from("profiles").select("*").eq("user_id", user!.id).single(),
      ]);

      if (coursesRes.data) setCourses(coursesRes.data as Course[]);
      if (enrollmentsRes.data) setEnrollments(enrollmentsRes.data as Enrollment[]);
      if (profileRes.data) setProfile(profileRes.data);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const isEnrolled = (courseId: string) =>
    enrollments.some((e) => e.course_id === courseId && e.payment_status === "completed");

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const profileCompletion = () => {
    if (!profile) return 0;
    let score = 0;
    if (profile.full_name) score += 33;
    if (profile.email) score += 33;
    if (profile.phone) score += 34;
    return score;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">AI Essentials</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {profile?.full_name || user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {profile?.full_name || "Student"}! 👋
          </h2>
          <p className="text-muted-foreground">Continue your AI learning journey.</p>
        </div>

        {/* Profile Completion */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" /> Profile Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={profileCompletion()} className="mb-2" />
            <p className="text-sm text-muted-foreground">{profileCompletion()}% complete</p>
          </CardContent>
        </Card>

        {/* Courses */}
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Available Courses</h3>
        {courses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No courses available yet. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const enrolled = isEnrolled(course.id);
              return (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {course.image_url && (
                    <img src={course.image_url} alt={course.title} className="w-full h-48 object-cover" />
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.short_description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {enrolled ? (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => navigate(`/course/${course.id}`)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" /> Continue Learning
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate(`/course/${course.id}/enroll`)}
                      >
                        <Lock className="mr-2 h-4 w-4" /> Enroll – {course.currency} {course.price}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
