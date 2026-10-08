// FocusCraft Supabase Configuration
const SUPABASE_URL = "https://yvvtvzgheuirhdxzoihh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_KJD1_7c4r8eF3MvIT5h5Dw_UUeqdNEE";

let supabaseClient;

try {
  if (SUPABASE_URL && !SUPABASE_URL.includes("YOUR_SUPABASE_URL")) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    throw new Error("Placeholder Supabase URL detected.");
  }
} catch (err) {
  console.warn("FocusCraft: Running in preview mode. Update config.js with your real Supabase credentials.");
  // Fallback mock object so the UI renders smoothly without crashing
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
          eq: async () => ({ data: [], error: null })
        })
      }),
      upsert: async () => ({ error: null }),
      insert: async () => ({ error: null })
    }),
    storage: {
      from: () => ({
        upload: async () => ({ error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  };
}