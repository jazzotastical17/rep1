// State Management
let currentUser = null;
let currentProfile = null;
let activeTasks = [];
let archivedTasks = [];
let userSettings = null;
let isSignUpMode = false;

// DOM Elements
const authScreen = document.getElementById("auth-screen");
const usernameScreen = document.getElementById("username-screen");
const passwordScreen = document.getElementById("password-screen");
const dashboardScreen = document.getElementById("dashboard-screen");
const archiveScreen = document.getElementById("archive-screen");
const navBar = document.getElementById("nav-bar");

const authForm = document.getElementById("auth-form");
const authEmail = document.getElementById("auth-email");
const authPassword = document.getElementById("auth-password");
const authTitle = document.getElementById("auth-title");
const authSubmitBtn = document.getElementById("auth-submit-btn");
const authToggleBtn = document.getElementById("auth-toggle-btn");
const authToggleText = document.getElementById("auth-toggle-text");
const authAlert = document.getElementById("auth-alert");
const githubLoginBtn = document.getElementById("github-login-btn");

const usernameForm = document.getElementById("username-form");
const usernameInput = document.getElementById("username-input");
const usernameAlert = document.getElementById("username-alert");

const passwordForm = document.getElementById("password-form");
const newPasswordInput = document.getElementById("new-password");
const passwordAlert = document.getElementById("password-alert");

const userDisplayName = document.getElementById("user-display-name");
const taskForm = document.getElementById("task-form");
const taskTitle = document.getElementById("task-title");
const taskStart = document.getElementById("task-start");
const taskDue = document.getElementById("task-due");
const taskPriority = document.getElementById("task-priority");
const taskAlert = document.getElementById("task-alert");
const tasksContainer = document.getElementById("tasks-container");
const archiveContainer = document.getElementById("archive-container");

const filterPriority = document.getElementById("filter-priority");
const sortBy = document.getElementById("sort-by");
const themeSelect = document.getElementById("theme-select");
const fontSelect = document.getElementById("font-select");
const bgImageUpload = document.getElementById("bg-image-upload");

// Initialization
document.addEventListener("DOMContentLoaded", async () => {
  setupEventListeners();
  checkSession();
});

// Auth Session Listener
supabaseClient.auth.onAuthStateChange(async (event, session) => {
  if (session) {
    currentUser = session.user;
    await handleUserPostLogin();
  } else {
    currentUser = null;
    currentProfile = null;
    showScreen(authScreen);
    navBar.classList.add("hidden");
  }
});

async function checkSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    currentUser = session.user;
    await handleUserPostLogin();
  }
}

// Navigation & Screen Control
function showScreen(screen) {
  [authScreen, usernameScreen, passwordScreen, dashboardScreen, archiveScreen].forEach(s => s.classList.add("hidden"));
  screen.classList.remove("hidden");
}

function showAlert(element, message, type = "error") {
  element.textContent = message;
  element.className = `alert alert-${type}`;
  element.classList.remove("hidden");
}

function hideAlert(element) {
  element.classList.add("hidden");
}

// Password Validation Rule Enforcement
function validatePassword(password) {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!minLength) return "Password must be at least 8 characters long.";
  if (!hasUpper) return "Password must contain at least one uppercase letter.";
  if (!hasLower) return "Password must contain at least one lowercase letter.";
  if (!hasNumber) return "Password must contain at least one number.";
  return null;
}

// Event Listeners Setup
function setupEventListeners() {
  // Auth Form Toggle
  authToggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isSignUpMode = !isSignUpMode;
    hideAlert(authAlert);
    if (isSignUpMode) {
      authTitle.textContent = "Sign Up for FocusCraft";
      authSubmitBtn.textContent = "Sign Up";
      authToggleText.textContent = "Already have an account?";
      authToggleBtn.textContent = "Sign In";
    } else {
      authTitle.textContent = "Sign In to FocusCraft";
      authSubmitBtn.textContent = "Sign In";
      authToggleText.textContent = "Don't have an account?";
      authToggleBtn.textContent = "Sign Up";
    }
  });

  // Auth Submit
  authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert(authAlert);
    const email = authEmail.value;
    const password = authPassword.value;

    if (isSignUpMode) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        showAlert(authAlert, passwordError);
        return;
      }
      const { error } = await supabaseClient.auth.signUp({ email, password });
      if (error) showAlert(authAlert, error.message);
      else showAlert(authAlert, "Registration successful! Check your email or sign in.", "success");
    } else {
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) showAlert(authAlert, error.message);
    }
  });

  // GitHub Login
  githubLoginBtn.addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signInWithOAuth({ provider: "github" });
    if (error) showAlert(authAlert, error.message);
  });

  // Navigation Bar Actions
  document.getElementById("sign-out-btn").addEventListener("click", () => supabaseClient.auth.signOut());
  document.getElementById("nav-dashboard-btn").addEventListener("click", () => showScreen(dashboardScreen));
  document.getElementById("nav-archive-btn").addEventListener("click", () => {
    loadArchiveTasks();
    showScreen(archiveScreen);
  });
  document.getElementById("nav-password-btn").addEventListener("click", () => showScreen(passwordScreen));

  // Username Setup
  usernameForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert(usernameAlert);
    const username = usernameInput.value.trim();

    // Check unique username
    const { data: existing } = await supabaseClient
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (existing) {
      showAlert(usernameAlert, "Username is already taken. Choose another.");
      return;
    }

    const { error } = await supabaseClient
      .from("profiles")
      .upsert({ id: currentUser.id, username });

    if (error) {
      showAlert(usernameAlert, error.message);
    } else {
      currentProfile = { id: currentUser.id, username };
      userDisplayName.textContent = username;
      await initializeDashboard();
    }
  });

  // Change Password
  passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert(passwordAlert);
    const newPassword = newPasswordInput.value;
    const passwordError = validatePassword(newPassword);

    if (passwordError) {
      showAlert(passwordAlert, passwordError);
      return;
    }

    const { error } = await supabaseClient.auth.updateUser({ password: newPassword });
    if (error) showAlert(passwordAlert, error.message);
    else {
      showAlert(passwordAlert, "Password updated successfully!", "success");
      newPasswordInput.value = "";
    }
  });

  // Task Creation
  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert(taskAlert);

    const newTask = {
      user_id: currentUser.id,
      title: taskTitle.value,
      start_date: taskStart.value,
      due_date: taskDue.value,
      priority: taskPriority.value,
      is_pinned: false,
      is_completed: false
    };

    const { error } = await supabaseClient.from("tasks").insert([newTask]);
    if (error) showAlert(taskAlert, error.message);
    else {
      taskForm.reset();
      loadTasks();
    }
  });

  // Filters and Settings
  filterPriority.addEventListener("change", renderTasks);
  sortBy.addEventListener("change", renderTasks);
  themeSelect.addEventListener("change", saveSettings);
  fontSelect.addEventListener("change", saveSettings);
  bgImageUpload.addEventListener("change", handleBackgroundUpload);
}

// User Post-Login Handling
async function handleUserPostLogin() {
  navBar.classList.remove("hidden");

  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", currentUser.id)
    .maybeSingle();

  if (!profile || !profile.username) {
    showScreen(usernameScreen);
  } else {
    currentProfile = profile;
    userDisplayName.textContent = profile.username;
    await initializeDashboard();
  }
}

async function initializeDashboard() {
  await loadUserSettings();
  await loadTasks();
  showScreen(dashboardScreen);
}

// Settings & Background Uploads
async function loadUserSettings() {
  const { data } = await supabaseClient
    .from("user_settings")
    .select("*")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  if (data) {
    userSettings = data;
    themeSelect.value = data.selected_theme || "default";
    fontSelect.value = data.selected_font || "Segoe UI";
    applySettings();
  }
}

async function saveSettings() {
  const updatedSettings = {
    user_id: currentUser.id,
    selected_theme: themeSelect.value,
    selected_font: fontSelect.value,
    background_image_url: userSettings?.background_image_url || null
  };

  const { error } = await supabaseClient
    .from("user_settings")
    .upsert(updatedSettings, { onConflict: "user_id" });

  if (!error) {
    userSettings = updatedSettings;
    applySettings();
  }
}

function applySettings() {
  if (!userSettings) return;
  document.body.style.fontFamily = userSettings.selected_font || "Segoe UI";
  if (userSettings.background_image_url) {
    document.body.style.backgroundImage = `url('${userSettings.background_image_url}')`;
  }
  
  // Theme styling
  const themes = {
    default: "#4f46e5",
    emerald: "#059669",
    sunset: "#ea580c",
    purple: "#7c3aed"
  };
  document.documentElement.style.setProperty("--primary-color", themes[userSettings.selected_theme] || themes.default);
}

async function handleBackgroundUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    alert("File size exceeds 5MB limit.");
    return;
  }

  const filePath = `\({currentUser.id}/\){Date.now()}_${file.name}`;
  const { error: uploadError } = await supabaseClient.storage
    .from("decorations")
    .upload(filePath, file);

  if (uploadError) {
    alert("Upload failed: " + uploadError.message);
    return;
  }

  const { data: { publicUrl } } = supabaseClient.storage
    .from("decorations")
    .getPublicUrl(filePath);

  userSettings = { ...(userSettings || {}), background_image_url: publicUrl };
  await saveSettings();
}

// Tasks Data Operations
async function loadTasks() {
  const { data, error } = await supabaseClient
    .from("tasks")
    .select("*")
    .eq("user_id", currentUser.id)
    .eq("is_completed", false);

  if (!error) {
    activeTasks = data || [];
    renderTasks();
  }
}

function renderTasks() {
  let tasks = [...activeTasks];

  // Apply Priority Filter
  const priorityVal = filterPriority.value;
  if (priorityVal !== "all") {
    tasks = tasks.filter(t => t.priority === priorityVal);
  }

  // Apply Sorting
  const sortVal = sortBy.value;
  tasks.sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return b.is_pinned - a.is_pinned; // Pinned first
    if (sortVal === "due_asc") return new Date(a.due_date) - new Date(b.due_date);
    if (sortVal === "due_desc") return new Date(b.due_date) - new Date(a.due_date);
    if (sortVal === "priority") {
      const priorityWeights = { High: 3, Medium: 2, Low: 1 };
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    }
    return 0;
  });

  tasksContainer.innerHTML = tasks.length === 0 ? "