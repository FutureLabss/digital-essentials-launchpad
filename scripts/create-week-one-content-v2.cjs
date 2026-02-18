const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function createWeek1Content() {
  try {
    console.log("Creating Week 1 content...");

    // Find Week 1 course
    const { data: week1Course, error: courseError } = await supabase
      .from("courses")
      .select("id, title")
      .eq("title", "AI Essentials for Digital Success")
      .single();

    if (courseError) {
      console.error("Error finding Week 1 course:", courseError);
      return;
    }

    console.log("Found Week 1 course:", week1Course.id);

    // Delete any existing lessons for Week 1
    const { error: deleteError } = await supabase
      .from("lessons")
      .delete()
      .eq("course_id", week1Course.id);

    if (deleteError) {
      console.error("Error deleting existing lessons:", deleteError);
    }

    // Create Week 1 lessons
    const week1Lessons = [
      {
        title: "Introduction to Artificial Intelligence",
        description: "Learn what AI is, its history, and why it's important for your digital career.",
        lesson_type: "video",
        video_url: "https://www.youtube.com/watch?v=2ePf9rue1Ao",
        download_url: "",
        sort_order: 1
      },
      {
        title: "How AI Systems Learn and Think",
        description: "Understand machine learning basics, neural networks, and AI decision-making processes.",
        lesson_type: "video",
        video_url: "https://www.youtube.com/watch?v=aircAruvnKk",
        download_url: "",
        sort_order: 2
      },
      {
        title: "AI Ethics and Responsible Use",
        description: "Explore the ethical implications of AI and learn responsible AI practices.",
        lesson_type: "video",
        video_url: "https://www.youtube.com/watch?v=t4kyRyKyD4Q",
        download_url: "",
        sort_order: 3
      },
      {
        title: "AI in Everyday Life",
        description: "Discover how AI is already integrated into daily tools and services you use.",
        lesson_type: "video",
        video_url: "https://www.youtube.com/watch?v=8jFz2jv3n0w",
        download_url: "",
        sort_order: 4
      },
      {
        title: "Future of AI and Career Opportunities",
        description: "Learn about AI's future impact and how to prepare for AI-driven careers.",
        lesson_type: "video",
        video_url: "https://www.youtube.com/watch?v=4sdJ2jv3n0w",
        download_url: "",
        sort_order: 5
      },
      {
        title: "Getting Started with AI Tools",
        description: "Introduction to popular AI tools and platforms for beginners.",
        lesson_type: "video",
        video_url: "https://www.youtube.com/watch?v=0K0iGj2x1bE",
        download_url: "",
        sort_order: 6
      }
    ];

    // Insert lessons
    const lessonsToInsert = week1Lessons.map(lesson => ({
      ...lesson,
      course_id: week1Course.id
    }));

    const { data: insertedLessons, error: insertError } = await supabase
      .from("lessons")
      .insert(lessonsToInsert)
      .select();

    if (insertError) {
      console.error("Error inserting Week 1 lessons:", insertError);
    } else {
      console.log(`Successfully created ${insertedLessons.length} lessons for Week 1`);
      console.log("Lesson titles:");
      insertedLessons.forEach((lesson, index) => {
        console.log(`${index + 1}. ${lesson.title}`);
      });
    }

    console.log("Week 1 content creation completed!");

  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

createWeek1Content();
