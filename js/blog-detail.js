// 1️⃣ Supabase config
const SUPABASE_URL = "https://eiqpvuciihwmuznbsyob.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcXB2dWNpaWh3bXV6bmJzeW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MDY1MDcsImV4cCI6MjA4MTE4MjUwN30.fY2QZkNa1nUB1UQxmV8r97WTpB32ocIiVXaHo1coB-c";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// 2️⃣ Get slug from URL
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

// 3️⃣ Load blog
async function loadBlog() {
  if (!slug) {
    document.getElementById("blog-title").innerText = "Blog not found";
    return;
  }

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    document.getElementById("blog-title").innerText = "Blog not found";
    return;
  }

  // 4️⃣ Inject content
  document.getElementById("blog-title").innerText = data.title;
  document.getElementById("blog-author").innerText = data.author || "Air Medical 24X7";
  document.getElementById("blog-date").innerText =
    new Date(data.created_at).toDateString();

  document.getElementById("blog-content").innerHTML = data.content;

  // Image
  if (data.featured_image) {
    const img = document.getElementById("blog-image");
    img.src = data.featured_image;
    img.style.display = "block";
  }

  // SEO dynamic
  document.title = data.title + " | Air Medical 24X7";
}

// 5️⃣ Call function
loadBlog();
