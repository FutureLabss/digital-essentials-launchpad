import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, ArrowLeft, Save, Video, FileText } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

interface Course {
  id: string;
  title: string;
  description: string;
}

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content: string;
  video_url: string;
  download_url: string;
  lesson_type: string;
  sort_order: number;
}

const AdminCourseLessons = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    video_url: "",
    download_url: "",
    lesson_type: "video",
    sort_order: 1,
  });

  const queryClient = useQueryClient();

  const { data: course } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, description")
        .eq("id", courseId)
        .single();
      
      if (error) throw error;
      return data as Course;
    },
    enabled: !!courseId,
  });

  const { data: lessons, isLoading } = useQuery({
    queryKey: ["course-lessons", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return data as Lesson[];
    },
    enabled: !!courseId,
  });

  const createLessonMutation = useMutation({
    mutationFn: async (lessonData: typeof formData) => {
      const { data, error } = await supabase
        .from("lessons")
        .insert({
          course_id: courseId!,
          title: lessonData.title,
          description: lessonData.description,
          content: lessonData.content,
          video_url: lessonData.video_url,
          download_url: lessonData.download_url,
          lesson_type: lessonData.lesson_type,
          sort_order: lessonData.sort_order,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-lessons", courseId] });
      setIsCreateDialogOpen(false);
      resetForm();
    },
  });

  const updateLessonMutation = useMutation({
    mutationFn: async ({ id, ...lessonData }: Lesson) => {
      const { data, error } = await supabase
        .from("lessons")
        .update({
          title: lessonData.title,
          description: lessonData.description,
          content: lessonData.content,
          video_url: lessonData.video_url,
          download_url: lessonData.download_url,
          lesson_type: lessonData.lesson_type,
          sort_order: lessonData.sort_order,
        })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-lessons", courseId] });
      setEditingLesson(null);
      resetForm();
    },
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      const { error } = await supabase
        .from("lessons")
        .delete()
        .eq("id", lessonId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-lessons", courseId] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      content: "",
      video_url: "",
      download_url: "",
      lesson_type: "video",
      sort_order: (lessons?.length || 0) + 1,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLesson) {
      updateLessonMutation.mutate({ ...editingLesson, ...formData });
    } else {
      createLessonMutation.mutate(formData);
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      video_url: lesson.video_url,
      download_url: lesson.download_url,
      lesson_type: lesson.lesson_type,
      sort_order: lesson.sort_order,
    });
    setIsCreateDialogOpen(true);
  };

  useEffect(() => {
    if (!isCreateDialogOpen) {
      setEditingLesson(null);
      resetForm();
    }
  }, [isCreateDialogOpen]);

  if (!course) {
    return <div className="p-8">Loading course...</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/courses")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600 mt-2">Manage lessons for this course</p>
            </div>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Lesson
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingLesson ? "Edit Lesson" : "Create New Lesson"}
                </DialogTitle>
                <DialogDescription>
                  {editingLesson 
                    ? "Update the lesson details below"
                    : "Add a new lesson to this course"
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Lesson Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Lesson Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="video_url">Video URL</Label>
                    <Input
                      id="video_url"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="download_url">Download URL</Label>
                    <Input
                      id="download_url"
                      value={formData.download_url}
                      onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
                      placeholder="https://example.com/resource.pdf"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="lesson_type">Lesson Type</Label>
                  <Select 
                    value={formData.lesson_type} 
                    onValueChange={(value) => setFormData({ ...formData, lesson_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createLessonMutation.isPending || updateLessonMutation.isPending}
                  >
                    {editingLesson ? (
                      updateLessonMutation.isPending ? "Updating..." : "Update Lesson"
                    ) : (
                      createLessonMutation.isPending ? "Creating..." : "Create Lesson"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Loading lessons...</div>
          ) : lessons?.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500 mb-4">No lessons yet for this course.</p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Lesson
                </Button>
              </CardContent>
            </Card>
          ) : (
            lessons?.map((lesson) => (
              <Card key={lesson.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">
                          Lesson {lesson.sort_order}
                        </span>
                        <CardTitle className="text-lg">{lesson.title}</CardTitle>
                        <Badge variant="outline">{lesson.lesson_type}</Badge>
                      </div>
                      <CardDescription className="mt-2">
                        {lesson.description}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(lesson)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLessonMutation.mutate(lesson.id)}
                        disabled={deleteLessonMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm text-gray-600">
                    {lesson.video_url && (
                      <div className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        <span>Video</span>
                      </div>
                    )}
                    {lesson.download_url && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>Download</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourseLessons;
