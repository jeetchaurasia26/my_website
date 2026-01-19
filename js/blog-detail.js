// Supabase config
const supabaseUrl = "https://eiqpvuciihwmuznbsyob.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcXB2dWNpaWh3bXV6bmJzeW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MDY1MDcsImV4cCI6MjA4MTE4MjUwN30.fY2QZkNa1nUB1UQxmV8r97WTpB32ocIiVXaHo1coB-c";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Get slug from URL
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

// DOM elements
const titleEl = document.getElementById("blog-title");
const imageEl = document.getElementById("blog-image");
const contentEl = document.getElementById("blog-content");

async function loadBlog() {
  if (!slug) {
    titleEl.innerText = "Blog not found";
    return;
  }

  const { data, error } = await supabaseClient
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    console.error(error);
    titleEl.innerText = "Blog not found";
    return;
  }

  // Inject content
  titleEl.innerText = data.title;
  imageEl.src = data.image_url || "img/blog-1.jpg";
  imageEl.alt = data.title;
  contentEl.innerHTML = data.content;

  // SEO (dynamic)
  document.title = data.meta_title || data.title;
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", data.meta_description || data.excerpt || "");
}

document.addEventListener("DOMContentLoaded", () => {
  loadBlog();
  loadCategories();
});

async function loadCategories() {
  const { data, error } = await supabaseClient
    .from("blogs")
    .select("category")
    .eq("status", "published");

  if (error || !data) {
    console.error("Category error", error);
    return;
  }

  const uniqueCategories = [...new Set(data.map(item => item.category))];

  const container = document.getElementById("category-list");
  container.innerHTML = "";

  uniqueCategories.forEach(category => {
    const a = document.createElement("a");
    a.className = "h5 bg-light rounded py-2 px-3 mb-2";
    a.href = `/blog?category=${encodeURIComponent(category)}`;
    a.innerHTML = `<i class="fa fa-angle-right me-2"></i>${category}`;
    container.appendChild(a);
  });
}
