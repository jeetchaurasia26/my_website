// 1️⃣ Create Supabase client
const supabaseUrl = "https://eiqpvuciihwmuznbsyob.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcXB2dWNpaWh3bXV6bmJzeW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MDY1MDcsImV4cCI6MjA4MTE4MjUwN30.fY2QZkNa1nUB1UQxmV8r97WTpB32ocIiVXaHo1coB-c";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// 2️⃣ DOM target
const blogList = document.getElementById("blog-list");

// 3️⃣ Fetch blogs
async function loadBlogs() {
  const { data, error } = await supabaseClient
    .from("blogs")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error.message);
    return;
  }

  if (!data || data.length === 0) {
    blogList.innerHTML = "<p class='text-center'>No blogs found.</p>";
    return;
  }

  // 4️⃣ Render blogs
  data.forEach((blog) => {
    const blogCard = document.createElement("div");
    blogCard.className = "col-xl-4 col-lg-6";

    blogCard.innerHTML = `
      <div class="bg-light rounded overflow-hidden">
        <img class="img-fluid w-100" src="${blog.image_url || "img/blog-1.jpg"}" alt="${blog.title}">
        <div class="p-4">
          <a class="h3 d-block mb-3" href="/blog-detail.html?slug=${blog.slug}">
            ${blog.title}
          </a>
          <p class="m-0">
            ${blog.excerpt || ""}
          </p>
        </div>
        <div class="d-flex justify-content-between border-top p-4">
          <div class="d-flex align-items-center">
            <img class="rounded-circle me-2" src="img/user.jpg" width="25" height="25" alt="${blog.author}">
            <small>${blog.author || "Admin"}</small>
          </div>
          <div class="d-flex align-items-center">
            <small class="ms-3">
              <i class="far fa-calendar text-primary me-1"></i>
              ${new Date(blog.created_at).toLocaleDateString()}
            </small>
          </div>
        </div>
      </div>
    `;

    blogList.appendChild(blogCard);
  });
}

// 5️⃣ Run on page load
document.addEventListener("DOMContentLoaded", loadBlogs);
