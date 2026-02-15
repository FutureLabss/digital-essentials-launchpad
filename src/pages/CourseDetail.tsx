import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, PlayCircle, FileText, Download, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  content: string;
  video_url: string;
  download_url: string;
  lesson_type: string;
  sort_order: number;
}

interface LessonProgress {
  lesson_id: string;
  completed: boolean;
}

const CourseDetail = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      const [courseRes, lessonsRes, progressRes] = await Promise.all([
        supabase.from("courses").select("*").eq("id", courseId!).single(),
        supabase.from("lessons").select("*").eq("course_id", courseId!).order("sort_order"),
        supabase.from("lesson_progress").select("lesson_id, completed").eq("user_id", user!.id),
      ]);

      if (courseRes.data) setCourse(courseRes.data);
      if (lessonsRes.data) {
        const l = lessonsRes.data as Lesson[];
        setLessons(l);
        if (l.length > 0) setActiveLesson(l[0]);
      }
      if (progressRes.data) setProgress(progressRes.data as LessonProgress[]);
      setLoading(false);
    };

    fetchCourse();
  }, [courseId, user]);

  const isCompleted = (lessonId: string) =>
    progress.some((p) => p.lesson_id === lessonId && p.completed);

  const completionPercent = lessons.length
    ? Math.round((progress.filter((p) => p.completed).length / lessons.length) * 100)
    : 0;

  const markComplete = async (lessonId: string) => {
    const { error } = await supabase.from("lesson_progress").upsert(
      { user_id: user!.id, lesson_id: lessonId, completed: true, completed_at: new Date().toISOString() },
      { onConflict: "user_id,lesson_id" }
    );
    if (error) {
      toast.error("Failed to mark lesson complete");
    } else {
      setProgress((prev) => {
        const existing = prev.find((p) => p.lesson_id === lessonId);
        if (existing) return prev.map((p) => (p.lesson_id === lessonId ? { ...p, completed: true } : p));
        return [...prev, { lesson_id: lessonId, completed: true }];
      });
      toast.success("Lesson marked as complete!");
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Course not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Dashboard
          </Button>
          <h1 className="text-lg font-bold text-slate-900 truncate">{course.title}</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Course Progress</span>
              <span className="text-sm text-muted-foreground">{completionPercent}%</span>
            </div>
            <Progress value={completionPercent} />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar - Lesson List */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-900 mb-3">Lessons</h3>
            {lessons.map((lesson, i) => (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                  activeLesson?.id === lesson.id
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-white border border-slate-100 hover:bg-slate-50"
                }`}
              >
                {isCompleted(lesson.id) ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-300 flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium">{i + 1}. {lesson.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{lesson.lesson_type}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div>
            {activeLesson ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {activeLesson.lesson_type === "video" && <PlayCircle className="h-5 w-5 text-blue-600" />}
                    {activeLesson.lesson_type === "text" && <FileText className="h-5 w-5 text-blue-600" />}
                    {activeLesson.lesson_type === "download" && <Download className="h-5 w-5 text-blue-600" />}
                    {activeLesson.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Video */}
                  {activeLesson.video_url && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-black">
                      <iframe
                        src={getYouTubeEmbedUrl(activeLesson.video_url)}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  )}

                  {/* Text Content */}
                  {activeLesson.content && (
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{activeLesson.content}</p>
                    </div>
                  )}

                  {/* Download */}
                  {activeLesson.download_url && (
                    <a
                      href={activeLesson.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <Download className="h-4 w-4" /> Download Resource
                    </a>
                  )}

                  {/* Mark Complete */}
                  {!isCompleted(activeLesson.id) ? (
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => markComplete(activeLesson.id)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Mark as Complete
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <CheckCircle className="h-5 w-5" /> Completed
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Select a lesson to begin.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
