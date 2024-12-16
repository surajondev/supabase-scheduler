import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Ensure these are set in your environment variables
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const DEVTO_ACCESS_TOKEN = Deno.env.get("DEVTO_ACCESS_TOKEN") || ""; 

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

// Function to post a new article to Dev.to
async function postToDevTo(title: string, content: string) {
  const url = "https://dev.to/api/articles";
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": DEVTO_ACCESS_TOKEN,
      },
      body: JSON.stringify({ article: { title, body_markdown: content, published: true } })
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Article posted successfully:", result);
      return {
        success: true,
        articleId: result.id,
      };
    } else {
      const errorBody = await response.text();
      console.error("Dev.to API Error:", errorBody);
      return {
        success: false,
        error: errorBody,
      };
    }
  } catch (error) {
    console.error("Error posting to Dev.to:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Serve an HTTP endpoint for testing
serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // Get the current timestamp rounded to the nearest minute
      const currentDate = new Date();
const currentHour = currentDate.getHours();
const currentMinute = currentDate.getMinutes();
const currentDay = currentDate.getDate();
const currentMonth = currentDate.getMonth() + 1; 
const currentYear = currentDate.getFullYear();

const currentDateTimeString = `${currentYear}-${currentMonth}-${currentDay} ${currentHour}:${currentMinute - 1}`;
const nextDateTimeString = `${currentYear}-${currentMonth}-${currentDay} ${currentHour}:${currentMinute + 1}`;


    // Fetch articles scheduled for the current time from Supabase
    const { data: articles, error: fetchError } = await supabase
      .from("scheduled_posts")
      .select()
      .gt("scheduled_time", currentDateTimeString)
      .lt("scheduled_time", nextDateTimeString) // Check within the next minute

    if (fetchError) {
      console.error("Error fetching scheduled articles:", fetchError);
      return new Response(JSON.stringify({ message: "Error fetching scheduled articles" }), { status: 500 });
    }

    if (!articles || articles.length === 0) {
      return new Response(JSON.stringify({ message: "No articles scheduled for posting." }), { status: 404 });
    }

    // Post each article to Dev.to and update its status in Supabase
    for (const article of articles) {
      const result = await postToDevTo(article.title, article.content);

      if (result.success) {
        // Update the article status in Supabase
        const { error } = await supabase
          .from("scheduled_posts")
          .update({
            status: "posted",
            devto_article_id: result.articleId,
            posted_at: new Date().toISOString(),
          })
          .eq("id", article.id);

        if (error) {
          console.error("Failed to update article status in Supabase", error);
          return new Response(
            JSON.stringify({ message: "Failed to update article status", error: error.message }),
            { status: 500 }
          );
        }
        
        console.log(`Article ${article.id} posted successfully on Dev.to.`);
      } else {
        console.error(`Failed to post article ${article.id}:`, result.error);
        return new Response(
          JSON.stringify({ message: `Failed to post article ${article.id}`, error: result.error }),
          { status: 500 }
        );
      }
    }

    return new Response(
      JSON.stringify({ message: "All scheduled articles posted successfully." }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
});
