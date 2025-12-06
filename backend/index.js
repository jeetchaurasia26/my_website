import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// SUPABASE CONNECTION
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// API ENDPOINT
app.post("/submit-form", async (req, res) => {
  const { name, number, country_code, email, service } = req.body;

  if (!name || !number || !email || !service) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const { error } = await supabase
    .from("contact_form")
    .insert([{ name, number, country_code, email, service }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ success: true });
});

// RUN BACKEND
app.listen(3000, () => console.log("Backend running on port 3000"));