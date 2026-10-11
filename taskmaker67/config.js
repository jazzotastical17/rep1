// FocusCraft Supabase Configuration
const SUPABASE_URL = "https://yvvtvzgheuirhdxzoihh.supabase.co/rest/v1/"; // Paste Project URL here
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2dnR2emdoZXVpcmhkeHpvaWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNjE3ODQsImV4cCI6MjEwNjgzNzc4NH0.45XFLeKr2YhBDrpSHVCaeo1x0TsCx-uJNgXNMk7T0iM";      // Paste ANON public key here

let supabaseClient;

try {
  if (SUPABASE_URL && !SUPABASE_URL.includes("YOUR_SUPABASE_URL")) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    throw new Error("Placeholder Supabase URL detected.");
  }
} catch (err) {
  console.warn("FocusCraft: Running in preview mode. Update config.js with your real Supabase credentials.");
  supabaseClient = {
    auth: {
      onAuthStateChange: () => {},
      getSession: async () => ({ data: { session: null } }),
      signUp: async () => ({ error: { message: "Please add your real Supabase URL & Anon Key in config.js!" } }),
      signInWithPassword: async () => ({ error: { message: "Please add your real Supabase URL & Anon Key in config.js!" } }),
      signInWithOAuth: async () => ({ error: { message: "Please add your real Supabase URL & Anon Key in config.js!" } }),
      signOut: async () => {},
      updateUser: async () => ({ error: null })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: null }),
          eq: async () => ({ data: [], error: null }),
          gte: async () => ({ data: [], error: null })
        })
      }),
      upsert: async () => ({ error: null }),
      insert: async () => ({ error: null }),
      update: async () => ({ error: null }),
      delete: async () => ({ error: null })
    }),
    storage: {
      from: () => ({
        upload: async () => ({ error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  };
}