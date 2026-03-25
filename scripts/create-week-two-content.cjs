const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

// Use service role key for admin operations
const adminSupabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const week2Content = {
  title: "AI Tools & Content Generation",
  description: "Master AI-powered content creation, from writing and marketing copy to image generation. Learn prompt engineering fundamentals and build practical AI workflows.",
  lessons: [
    {
      title: "AI for Writing (Core Concepts)",
      description: "Learn the fundamentals of generative AI for text and image creation. Understand how AI generates content and how prompts affect results.",
      lesson_type: "video",
      video_url: "https://www.youtube.com/watch?v=XMGR2JiSKbE&utm_source=chatgpt.com",
      download_url: "",
      sort_order: 1
    },
    {
      title: "Long-Form Content with AI",
      description: "Master effective prompting practices for writing high-quality long-form content with AI tools like ChatGPT. Learn to structure prompts for better outputs.",
      lesson_type: "video",
      video_url: "https://www.youtube.com/live/0Hp-zevaHdQ?utm_source=chatgpt.com",
      download_url: "",
      sort_order: 2
    },
    {
      title: "Short-Form & Marketing Content",
      description: "Learn prompt engineering techniques for creating concise, audience-focused marketing copy. Apply prompt structure across various content types.",
      lesson_type: "video",
      video_url: "https://www.youtube.com/live/5i2Hn8OG94o?utm_source=chatgpt.com",
      download_url: "",
      sort_order: 3
    },
    {
      title: "AI Image Generation Fundamentals",
      description: "Get started with AI image generation using Midjourney and similar tools. Learn how to create images from text prompts effectively.",
      lesson_type: "video",
      video_url: "https://www.classcentral.com/course/youtube-midjourney-tutorial-for-beginners-in-12-mins-full-guide-2026-492930?utm_source=chatgpt.com",
      download_url: "",
      sort_order: 4
    },
    {
      title: "Consistency & Quality Control",
      description: "Understand the importance of prompt iteration and refinement. Learn techniques to improve AI output quality and maintain consistency.",
      lesson_type: "video",
      video_url: "https://www.classcentral.com/course/youtube-introduction-to-prompt-engineering-how-prompts-work-what-is-prompt-engineering-generative-ai-488756?utm_source=chatgpt.com",
      download_url: "",
      sort_order: 5
    },
    {
      title: "Building AI Content Systems",
      description: "Learn to build comprehensive AI content workflows. Combine multiple AI tools and techniques for efficient content creation systems.",
      lesson_type: "video",
      video_url: "https://www.reddit.com/r/learnmachinelearning/comments/1mfqstn?utm_source=chatgpt.com",
      download_url: "",
      sort_order: 6
    }
  ]
};

async function createWeek2Content() {
  try {
    console.log("Creating Week 2 content...");

    // First, get or create the course
    const { data: course, error: courseError } = await adminSupabase
      .from("courses")
      .select("id")
      .eq("title", "AI Tools & Content Generation")
      .single();

    if (courseError && courseError.code !== 'PGRST116') {
      console.error("Error fetching course:", courseError);
      return;
    }

    let courseId;
    if (course) {
      courseId = course.id;
      console.log("Found existing course:", courseId);
    } else {
      // Create the course
      const { data: newCourse, error: createError } = await adminSupabase
        .from("courses")
        .insert({
          title: week2Content.title,
          description: week2Content.description,
          short_description: "Master AI-powered content creation and prompt engineering",
          is_published: true,
          price: 0,
          currency: "USD"
        })
        .select("id")
        .single();

      if (createError) {
        console.error("Error creating course:", createError);
        return;
      }

      courseId = newCourse.id;
      console.log("Created new course:", courseId);
    }

    // Delete existing lessons for this course
    const { error: deleteError } = await adminSupabase
      .from("lessons")
      .delete()
      .eq("course_id", courseId);

    if (deleteError) {
      console.error("Error deleting existing lessons:", deleteError);
    } else {
      console.log("Deleted existing lessons");
    }

    // Insert new lessons
    const lessonsToInsert = week2Content.lessons.map(lesson => ({
      ...lesson,
      course_id: courseId
    }));

    const { data: insertedLessons, error: insertError } = await adminSupabase
      .from("lessons")
      .insert(lessonsToInsert)
      .select();

    if (insertError) {
      console.error("Error inserting lessons:", insertError);
    } else {
      console.log(`Successfully created ${insertedLessons.length} lessons for Week 2`);
      console.log("Lesson IDs:", insertedLessons.map(l => l.id));
    }

    console.log("Week 2 content creation completed!");

  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

createWeek2Content();
