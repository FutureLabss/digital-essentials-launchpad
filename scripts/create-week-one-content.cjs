// Week 1: AI & Machine Learning Fundamentals (Updated with new learning outcomes)
// This script creates "AI Essentials for Digital Success" course and its Week 1 lessons.

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const COURSE_TITLE = "AI Essentials for Digital Success";
const COURSE_DESCRIPTION =
  "A beginner-friendly introduction to AI and machine learning, designed for Nigerian learners. You’ll learn what AI really is, how modern AI systems work, and how to use AI tools effectively in daily life and work.";
const COURSE_SHORT_DESCRIPTION = "Learn AI fundamentals with practical examples and real-world applications.";
const COURSE_PRICE = 50000.00;
const COURSE_CURRENCY = "NGN";
const COURSE_IMAGE_URL = "https://images.unsplash.com/photo-1677444088334-5dcf4d8006e?w=800&auto=format&fit=crop";

// Week 1 lessons with new learning outcomes and real-world resources
const WEEK_ONE_LESSONS = [
  {
    title: "Lesson 1.1: What AI Really Is (And What It Is Not)",
    description:
      "Lesson goal: Remove fear, hype, and confusion around AI.\n\n" +
      "Artificial Intelligence (AI) refers to computer systems designed to perform tasks that normally require human intelligence. These tasks include understanding language, recognizing patterns, generating content, making predictions, and assisting with decisions.\n\n" +
      "AI does not think like a human.\nAI does not have consciousness, emotions, or intent.\nAI works by identifying patterns in large amounts of data and generating outputs based on probabilities.\n\n" +
      "Important clarification:\nAI is a tool, not a replacement for human judgment.\nThe quality of AI output depends heavily on:\n• data it was trained on\n• instructions (prompts) it receives\n• human reviewing the output\n\n" +
      "Common myths:\n• AI knows everything → false\n• AI is always correct → false\n• AI replaces all jobs → false\n• AI works without human input → false\n\n" +
      "Key takeaway:\nAI amplifies human capability. It does not replace human responsibility.",
    content:
      "Artificial Intelligence (AI) refers to computer systems designed to perform tasks that normally require human intelligence. These tasks include understanding language, recognizing patterns, generating content, making predictions, and assisting with decisions.\n\n" +
      "AI does not think like a human.\nAI does not have consciousness, emotions, or intent.\nAI works by identifying patterns in large amounts of data and generating outputs based on probabilities.\n\n" +
      "Important clarification:\nAI is a tool, not a replacement for human judgment.\nThe quality of AI output depends heavily on:\n• data it was trained on\n• instructions (prompts) it receives\n• human reviewing the output\n\n" +
      "Common myths:\n• AI knows everything → false\n• AI is always correct → false\n• AI replaces all jobs → false\n• AI works without human input → false\n\n" +
      "Key takeaway:\nAI amplifies human capability. It does not replace human responsibility.",
    video_url: "https://www.youtube.com/watch?v=O8IZR5529ao",
    download_url: "https://www.ibm.com/think/topics/artificial-intelligence/what-is-artificial-intelligence",
    lesson_type: "video",
    sort_order: 1,
  },
  {
    title: "Lesson 1.2: How Modern AI Systems Work (Simplified)",
    description:
      "Lesson goal: Explain AI accurately without math or code.\n\n" +
      "Modern AI systems are trained using large datasets. During training, the system learns patterns, relationships, and structures within data.\n\n" +
      "For example:\n• Language AI learns how words relate to each other\n• Image AI learns patterns of shapes, colors, and objects\n\n" +
      "When you ask an AI a question, it does not “search its memory” like a human.\nInstead, it predicts the most likely next response based on patterns it learned during training.\n\n" +
      "Key concept:\nAI predicts, it does not understand.\n\n" +
      "This is why:\n• AI can sound confident and still be wrong\n• AI can invent facts (this is called hallucination)\n\n" +
      "Key takeaway:\nAlways verify important AI-generated information.",
    content:
      "Modern AI systems are trained using large datasets. During training, the system learns patterns, relationships, and structures within data.\n\n" +
      "For example:\n• Language AI learns how words relate to each other\n• Image AI learns patterns of shapes, colors, and objects\n\n" +
      "When you ask an AI a question, it does not “search its memory” like a human.\nInstead, it predicts the most likely next response based on patterns it learned during training.\n\n" +
      "Key concept:\nAI predicts, it does not understand.\n\n" +
      "This is why:\n• AI can sound confident and still be wrong\n• AI can invent facts (this is called hallucination)\n\n" +
      "Key takeaway:\nAlways verify important AI-generated information.",
    video_url: "https://www.youtube.com/watch?v=6v0Mhz3ONn4",
    download_url: "https://www.ibm.com/think/topics/artificial-intelligence/how-modern-ai-systems-work",
    lesson_type: "video",
    sort_order: 2,
  },
  {
    title: "Lesson 1.3: Types of Generative AI",
    description:
      "Lesson goal: Help learners understand what AI can generate.\n\n" +
      "Generative AI creates new content rather than just analyzing existing data.\n\n" +
      "Main categories:\n- Text generation: writing emails, articles, summaries, code, scripts\n- Image generation: illustrations, posters, social media graphics, product mockups\n- Audio generation: voiceovers, narration, music\n- Video generation: short clips, explainer videos, animations\n- Code generation: website code, app logic, automation scripts\n\n" +
      "Important note:\nMost AI tools combine more than one of these capabilities.\n\n" +
      "Key takeaway:\nDifferent tasks require different types of AI tools.",
    content:
      "Generative AI creates new content rather than just analyzing existing data.\n\n" +
      "Main categories:\n- Text generation: writing emails, articles, summaries, code, scripts\n- Image generation: illustrations, posters, social media graphics, product mockups\n- Audio generation: voiceovers, narration, music\n- Video generation: short clips, explainer videos, animations\n- Code generation: website code, app logic, automation scripts\n\n" +
      "Important note:\nMost AI tools combine more than one of these capabilities.\n\n" +
      "Key takeaway:\nDifferent tasks require different types of AI tools.",
    video_url: "https://www.youtube.com/watch?v=qYNweeDHiyU",
    download_url: "https://www.futuretools.io/tools/text-to-image",
    lesson_type: "video",
    sort_order: 3,
  },
  {
    title: "Lesson 1.4: Models vs Tools (Very Important)",
    description:
      "Lesson goal: Prevent confusion between AI models and AI products.\n\n" +
      "An AI model is the underlying engine.\nAn AI tool is a product built on top of a model.\n\n" +
      "Example explanation (conceptual):\n• A model is like an engine\n• A tool is like a car, motorcycle, or generator using that engine\n\n" +
      "Different tools can use:\n- the same model\n- different models\n- customized versions of models\n\n" +
      "Why this matters:\n• Two tools may give different results for the same prompt\n• Pricing, limits, and features vary by tool\n• Skill comes from knowing which tool to use and how to prompt it\n\n" +
      "Key takeaway:\nYou don’t master AI by memorizing tools.\nYou master AI by understanding how to direct them.",
    content:
      "An AI model is the underlying engine.\nAn AI tool is a product built on top of a model.\n\n" +
      "Example explanation (conceptual):\n• A model is like an engine\n• A tool is like a car, motorcycle, or generator using that engine\n\n" +
      "Different tools can use:\n- the same model\n- different models\n- customized versions of models\n\n" +
      "Why this matters:\n• Two tools may give different results for the same prompt\n• Pricing, limits, and features vary by tool\n• Skill comes from knowing which tool to use and how to prompt it\n\n" +
      "Key takeaway:\nYou don’t master AI by memorizing tools.\nYou master AI by understanding how to direct them.",
    video_url: "https://www.youtube.com/watch?v=O8IZR5529ao",
    download_url: "https://www.futuretools.io/tools/text-to-image",
    lesson_type: "video",
    sort_order: 4,
  },
  {
    title: "Lesson 1.5: Introduction to Prompting",
    description:
      "Lesson goal: Teach learners how to communicate clearly with AI.\n\n" +
      "A prompt is an instruction given to an AI system.\n\n" +
      "Weak prompt example:\n“Write about business.”\n\n" +
      "Strong prompt example:\n“You are a business consultant. Write a 500-word article explaining how small businesses in Nigeria can use AI to improve productivity. Use simple language and real-world examples.”\n\n" +
      "Core prompt elements:\n- Role: Who AI should act as\n- Task: What you want AI to do\n- Context: Background information\n- Constraints: Rules or limits\n\n" +
      "Key takeaway:\nBetter instructions produce better outputs.",
    content:
      "A prompt is an instruction given to an AI system.\n\n" +
      "Weak prompt example:\n“Write about business.”\n\n" +
      "Strong prompt example:\n“You are a business consultant. Write a 500-word article explaining how small businesses in Nigeria can use AI to improve productivity. Use simple language and real-world examples.”\n\n" +
      "Core prompt elements:\n- Role: Who AI should act as\n- Task: What you want AI to do\n- Context: Background information\n- Constraints: Rules or limits\n\n" +
      "Key takeaway:\nBetter instructions produce better outputs.",
    video_url: "https://www.promptingguide.ai/",
    download_url: "https://www.canva.com/designschool/tutorials/how-to-write-effective-ai-prompts",
    lesson_type: "video",
    sort_order: 5,
  },
  {
    title: "Lesson 1.6: Prompt Iteration (Working with AI)",
    description:
      "Lesson goal: Teach learners how to improve results step by step.\n\n" +
      "You rarely get perfect results from the first prompt.\n\n" +
      "Prompting is a conversation, not a command.\n\n" +
      "Ways to improve outputs:\n• Ask for clarification\n• Ask for revisions\n• Narrow the scope\n• Change tone or format\n• Add missing context\n\n" +
      "Example improvement flow:\nInitial prompt → review output → refine instructions → repeat\n\n" +
      "Key takeaway:\nAI improves when you guide it, not when you blame it.",
    content:
      "You rarely get perfect results from the first prompt.\n\n" +
      "Prompting is a conversation, not a command.\n\n" +
      "Ways to improve outputs:\n• Ask for clarification\n• Ask for revisions\n• Narrow the scope\n• Change tone or format\n• Add missing context\n\n" +
      "Example improvement flow:\nInitial prompt → review output → refine instructions → repeat\n\n" +
      "Key takeaway:\nAI improves when you guide it, not when you blame it.",
    video_url: "https://latitude-blog.ghost.io/blog/iterative-prompt-refinement-step-by-step-guide/",
    download_url: "https://www.canva.com/designschool/tutorials/how-to-write-effective-ai-prompts",
    lesson_type: "video",
    sort_order: 6,
  },
  {
    title: "Lesson 1.7: Week 1 Hands-on: Prompt Improvement Exercise",
    description:
      "Task title: Prompt Improvement Exercise\n\n" +
      "Instructions:\nWrite a simple prompt for a real task you care about\n\n" +
      "Review: AI’s output\n\n" +
      "Improve: prompt using:\n• role\n• task\n• context\n• constraints\n\n" +
      "Generate: a second output\n\n" +
      "Compare: two results\n\n" +
      "Submission:\n• Original prompt\n• Improved prompt\n• Short explanation (3–5 sentences)",
    content:
      "Task title: Prompt Improvement Exercise\n\n" +
      "Instructions:\nWrite a simple prompt for a real task you care about\n\n" +
      "Review: AI’s output\n\n" +
      "Improve: prompt using:\n• role\n• task\n• context\n• constraints\n\n" +
      "Generate: a second output\n\n" +
      "Compare: two results\n\n" +
      "Submission:\n• Original prompt\n• Improved prompt\n• Short explanation (3–5 sentences)",
    video_url: "https://learnprompting.org/docs/basics/ai_prompt_tips",
    download_url: "https://www.canva.com/designschool/tutorials/how-to-write-effective-ai-prompts",
    lesson_type: "video",
    sort_order: 7,
  },
  {
    title: "Lesson 1.8: Week 1 Assessment (Quiz)",
    description:
      "AI systems primarily work by:\na) thinking like humans\nb) predicting patterns from data\nc) storing answers\nd) browsing the internet\n\n" +
      "Correct answer: b) predicting patterns from data\n\n" +
      "AI hallucination means:\na) AI refuses to answer\nb) AI generates fake or incorrect information\nc) AI becomes emotional\nd) AI stops working\n\n" +
      "Correct answer: b) AI generates fake or incorrect information\n\n" +
      "Which of the following improves AI output most?\na) Longer prompts\nb) Clear instructions\nc) Repeating the same prompt\nd) Using complex words\n\n" +
      "Correct answer: b) Clear instructions",
    content:
      "AI systems primarily work by:\na) thinking like humans\nb) predicting patterns from data\nc) storing answers\nd) browsing the internet\n\n" +
      "Correct answer: b) predicting patterns from data\n\n" +
      "AI hallucination means:\na) AI refuses to answer\nb) AI generates fake or incorrect information\nc) AI becomes emotional\nd) AI stops working\n\n" +
      "Correct answer: b) AI generates fake or incorrect information\n\n" +
      "Which of the following improves AI output most?\na) Longer prompts\nb) Clear instructions\nc) Repeating the same prompt\nd) Using complex words\n\n" +
      "Correct answer: b) Clear instructions",
    video_url: "https://learnprompting.org/docs/basics/ai_prompt_tips",
    download_url: "https://www.canva.com/designschool/tutorials/how-to-write-effective-ai-prompts",
    lesson_type: "video",
    sort_order: 8,
  },
  {
    title: "Lesson 1.9: Week 1 Completion Criteria",
    description:
      "Week 1 Completion Criteria:\n• All lessons viewed\n• Prompt exercise submitted\n• Quiz score ≥ 70%",
    content:
      "Week 1 Completion Criteria:\n• All lessons viewed\n• Prompt exercise submitted\n• Quiz score ≥ 70%",
    video_url: "https://learnprompting.org/docs/basics/ai_prompt_tips",
    download_url: "https://www.canva.com/designschool/tutorials/how-to-write-effective-ai-prompts",
    lesson_type: "video",
    sort_order: 9,
  },
];

async function createCourseAndLessons() {
  console.log("Creating course and lessons...");

  // Fetch course by title
  const { data: existingCourse, error: fetchError } = await supabase
    .from("courses")
    .select("*")
    .eq("title", COURSE_TITLE)
    .maybeSingle();

  if (fetchError) {
    console.error("Failed to fetch course:", fetchError);
    return;
  }

  let course;
  if (existingCourse) {
    course = existingCourse;
    console.log("Found existing course:", course);
  } else {
    // Insert new course
    const { data: newCourse, error: insertError } = await supabase
      .from("courses")
      .insert({
        title: COURSE_TITLE,
        description: COURSE_DESCRIPTION,
        short_description: COURSE_SHORT_DESCRIPTION,
        price: COURSE_PRICE,
        currency: COURSE_CURRENCY,
        image_url: COURSE_IMAGE_URL,
        is_published: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to create course:", insertError);
      return;
    }
    course = newCourse;
    console.log("Created new course:", course);
  }

  // Delete existing Week 1 lessons for this course to avoid duplicates
  const { error: deleteError } = await supabase
    .from("lessons")
    .delete()
    .eq("course_id", course.id)
    .gte("sort_order", 1)
    .lte("sort_order", 9);

  if (deleteError) {
    console.error("Failed to delete existing Week 1 lessons:", deleteError);
  }

  // Insert new lessons
  for (const lesson of WEEK_ONE_LESSONS) {
    const { data: lessonData, error: lessonError } = await supabase
      .from("lessons")
      .insert({
        course_id: course.id,
        title: lesson.title,
        description: lesson.description,
        content: lesson.content,
        video_url: lesson.video_url,
        download_url: lesson.download_url,
        lesson_type: lesson.lesson_type,
        sort_order: lesson.sort_order,
      })
      .select()
      .single();

    if (lessonError) {
      console.error(`Failed to create lesson "${lesson.title}":`, lessonError);
    } else {
      console.log(`Lesson created: "${lesson.title}"`);
    }
  }

  console.log("Week 1 course and lessons updated successfully.");
}

createCourseAndLessons().catch(console.error);
