supabase
  .from("blogs")
  .select("*")
  .eq("status", "published")
  .order("created_at", { ascending: false });

  