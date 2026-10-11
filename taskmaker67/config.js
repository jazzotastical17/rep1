const SUPABASE_URL = "https://yvvtvzgheuirhdxzoihh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2dnR2emdoZXVpcmhkeHpvaWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNjE3ODQsImV4cCI6MjEwNjgzNzc4NH0.45XFLeKr2YhBDrpSHVCaeo1x0TsCx-uJNgXNMk7T0iM"

// Initialize Supabase Client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Hide banner automatically when valid keys are loaded
document.addEventListener("DOMContentLoaded", () => {
  const banner = document.querySelector(".bg-amber-50");
  if (banner && SUPABASE_URL && !SUPABASE_URL.includes("YOUR_ACTUAL")) {
    banner.style.display = "none";
  }
});