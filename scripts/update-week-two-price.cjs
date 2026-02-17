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

async function updateWeek2Price() {
  try {
    console.log("Updating Week 2 course price to 10,000 NGN...");

    // Find Week 2 course
    const { data: course, error: fetchError } = await supabase
      .from("courses")
      .select("id, title, price, currency")
      .eq("title", "AI Tools & Content Generation")
      .single();

    if (fetchError) {
      console.error("Error fetching Week 2 course:", fetchError);
      return;
    }

    if (!course) {
      console.error("Week 2 course not found");
      return;
    }

    console.log("Found Week 2 course:", {
      id: course.id,
      title: course.title,
      current_price: course.price,
      current_currency: course.currency
    });

    // Update the price to 10,000 NGN
    const { data: updatedCourse, error: updateError } = await supabase
      .from("courses")
      .update({
        price: 10000,
        currency: "NGN"
      })
      .eq("id", course.id)
      .select("id, title, price, currency")
      .single();

    if (updateError) {
      console.error("Error updating Week 2 price:", updateError);
      return;
    }

    console.log("Successfully updated Week 2 course price:", {
      id: updatedCourse.id,
      title: updatedCourse.title,
      new_price: updatedCourse.price,
      new_currency: updatedCourse.currency
    });

    console.log("Week 2 course price updated successfully!");

  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

updateWeek2Price();
