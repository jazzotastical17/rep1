// FocusCraft Supabase Configuration
const SUPABASE_URL = "https://yvvtvzgheuirhdxzoihh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2dnR2emdoZXVpcmhkeHpvaWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNjE3ODQsImV4cCI6MjEwNjgzNzc4NH0.45XFLeKr2YhBDrpSHVCaeo1x0TsCx-uJNgXNMk7T0iM";

// Initialize Supabase Client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Automatically remove the yellow setup notice banner when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const banner = document.querySelector(".bg-amber-50");
  if (banner) {
    banner.remove();
  }
});