/***************** SUPABASE CONFIG *****************/
const supabaseUrl = "https://eiqpvuciihwmuznbsyob.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcXB2dWNpaWh3bXV6bmJzeW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MDY1MDcsImV4cCI6MjA4MTE4MjUwN30.fY2QZkNa1nUB1UQxmV8r97WTpB32ocIiVXaHo1coB-c";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

/***************** GLOBAL STATE *****************/
let currentBlogId = null;

/***************** URL PARAM *****************/
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

/***************** DOM *****************/
const titleEl = document.getElementById("blog-title");
const imageEl = document.getElementById("blog-image");
const contentEl = document.getElementById("blog-content");

/***************** INIT *****************/
document.addEventListener("DOMContentLoaded", () => {
  loadBlog();
  loadCategories();
  loadRecentPosts();
  loadTags();
});

/***************** BLOG LOAD *****************/
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

  // Render blog
  titleEl.innerText = data.title;
  imageEl.src = data.image_url || "img/blog-1.jpg";
  imageEl.alt = data.title;
  contentEl.innerHTML = data.content;

  // SEO
  document.title = data.meta_title || data.title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", data.meta_description || data.excerpt || "");

  // Save blog id
  currentBlogId = data.id;

  // Views + comments
  updateViews(data.id, data.views || 0);
  loadComments(data.id);
}

/***************** VIEWS *****************/
async function updateViews(blogId, currentViews) {
  const newViews = currentViews + 1;

  await supabaseClient
    .from("blogs")
    .update({ views: newViews })
    .eq("id", blogId);

  document.getElementById("view-count").innerText = newViews;
}

/***************** COMMENTS (APPROVED ONLY) *****************/
async function loadComments(blogId) {
  const { data, error } = await supabaseClient
    .from("comments")
    .select("*")
    .eq("blog_id", blogId)
.eq("is_approved", true)


    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Load comments error:", error);
    return;
  }

  const list = document.getElementById("comment-list");
  const heading = document.getElementById("comment-heading");

  list.innerHTML = "";
  heading.innerText = `${data.length} Comments`;

  data.forEach(c => {
    const div = document.createElement("div");
    div.className = "d-flex mb-4";

    div.innerHTML = `
      <img src="img/user.jpg"
           class="img-fluid rounded-circle"
           style="width:45px;height:45px;">
      <div class="ps-3">
        <h6>${c.name}
          <small><i>${new Date(c.created_at).toDateString()}</i></small>
        </h6>
        <p>${c.message}</p>
      </div>
    `;

    list.appendChild(div);
  });

  document.getElementById("comment-count").innerText = data.length;
}

/***************** COMMENT SUBMIT *****************/
document
  .getElementById("comment-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!currentBlogId) {
      alert("Blog not loaded");
      return;
    }

    const name = document.getElementById("comment-name").value;
    const email = document.getElementById("comment-email").value;
    const website = document.getElementById("comment-website").value;
    const message = document.getElementById("comment-message").value;

    const { error } = await supabaseClient
      .from("comments")
      .insert({
        blog_id: currentBlogId,
        name,
        email,
        website,
        message,
        status: "pending"
      });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Comment submitted for approval 🚀");
    e.target.reset();
  });

/***************** CATEGORIES *****************/
async function loadCategories() {
  const { data } = await supabaseClient
    .from("blogs")
    .select("category")
    .eq("status", "published");

  const container = document.getElementById("category-list");
  container.innerHTML = "";

  [...new Set(data.map(b => b.category))].forEach(category => {
    const a = document.createElement("a");
    a.className = "h5 bg-light rounded py-2 px-3 mb-2";
    a.href = `/blog?category=${encodeURIComponent(category)}`;
    a.innerHTML = `<i class="fa fa-angle-right me-2"></i>${category}`;
    container.appendChild(a);
  });
}

/***************** RECENT POSTS *****************/
async function loadRecentPosts() {
  const { data } = await supabaseClient
    .from("blogs")
    .select("title, slug, image_url")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(5);

  const container = document.getElementById("recent-posts");
  container.innerHTML = "";

  data.forEach(post => {
    container.innerHTML += `
      <div class="d-flex rounded overflow-hidden mb-3">
        <img src="${post.image_url || 'img/blog-1.jpg'}"
             style="width:100px;height:100px;object-fit:cover">
        <a href="blog-detail.html?slug=${post.slug}"
           class="h5 d-flex align-items-center bg-light px-3 mb-0">
          ${post.title}
        </a>
      </div>
    `;
  });
}

/***************** TAG CLOUD *****************/
async function loadTags() {
  const { data } = await supabaseClient
    .from("blogs")
    .select("tags")
    .eq("status", "published");

  const tags = [...new Set(data.flatMap(b => b.tags || []))];
  const container = document.getElementById("tag-cloud");
  if (!container) return;

  container.innerHTML = tags.map(tag => `
    <a href="/blog?tag=${encodeURIComponent(tag)}"
       class="btn btn-primary m-1">${tag}</a>
  `).join("");
}
