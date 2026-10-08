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
  document.querySelectorAll("#nav-dashboard-btn").forEach(btn => btn.addEventListener("click", () => showScreen(dashboardScreen)));
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

  const filePath = `${currentUser.id}/${Date.now()}_${file.name}`;
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

  if (tasks.length === 0) {
    tasksContainer.innerHTML = `<div class="glass-card p-6 text-center text-slate-500 text-sm rounded-xl">No active tasks found. Create one to get started!</div>`;
    return;
  }

  tasksContainer.innerHTML = tasks.map(task => {
    const priorityColors = {
      High: "bg-red-100 text-red-700 border-red-200",
      Medium: "bg-amber-100 text-amber-700 border-amber-200",
      Low: "bg-green-100 text-green-700 border-green-200"
    };

    return `
      <div class="glass-card p-4 rounded-xl shadow-sm flex items-center justify-between gap-4 border-l-4 ${task.is_pinned ? "border-l-indigo-500 bg-indigo-50/30" : "border-l-transparent"}">
        <div class="flex items-start gap-3 flex-1 min-w-0">
          <button onclick="toggleCompleteTask('${task.id}')" class="mt-0.5 text-slate-400 hover:text-emerald-600 transition" title="Mark Complete">
            <i data-lucide="circle" class="w-5 h-5"></i>
          </button>
          <div class="space-y-1 min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="font-bold text-slate-900 text-sm truncate">${task.title}</h4>
              <span class="px-2 py-0.5 text-[10px] font-bold rounded-full border ${priorityColors[task.priority] || priorityColors.Medium}">${task.priority}</span>
              ${task.is_pinned ? `<span class="text-[10px] bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"><i data-lucide="pin" class="w-3 h-3"></i> Pinned</span>` : ""}
            </div>
            <div class="text-xs text-slate-500 flex items-center gap-3">
              <span>Start: ${task.start_date}</span>
              <span>Due: ${task.due_date}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-1">
          <button onclick="togglePinTask('${task.id}', ${task.is_pinned})" class="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition" title="${task.is_pinned ? "Unpin Task" : "Pin Task"}">
            <i data-lucide="pin" class="w-4 h-4 ${task.is_pinned ? "text-indigo-600 fill-indigo-600" : ""}"></i>
          </button>
          <button onclick="deleteTask('${task.id}')" class="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition" title="Delete Task">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  }).join("");

  if (window.lucide) lucide.createIcons();
}

// Task Pinning (Max 3 pinned tasks enforcement)
async function togglePinTask(taskId, currentPinned) {
  if (!currentPinned) {
    const pinnedCount = activeTasks.filter(t => t.is_pinned).length;
    if (pinnedCount >= 3) {
      alert("You can only pin up to 3 tasks at a time.");
      return;
    }
  }

  const { error } = await supabaseClient
    .from("tasks")
    .update({ is_pinned: !currentPinned })
    .eq("id", taskId);

  if (!error) loadTasks();
}

// Complete Task Action
async function toggleCompleteTask(taskId) {
  const { error } = await supabaseClient
    .from("tasks")
    .update({ is_completed: true, completed_at: new Date().toISOString() })
    .eq("id", taskId);

  if (!error) loadTasks();
}

// Delete Task Action
async function deleteTask(taskId) {
  const { error } = await supabaseClient
    .from("tasks")
    .delete()
    .eq("id", taskId);

  if (!error) loadTasks();
}

// Load Completed Tasks (Last 30 Days)
async function loadArchiveTasks() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data, error } = await supabaseClient
    .from("tasks")
    .select("*")
    .eq("user_id", currentUser.id)
    .eq("is_completed", true)
    .gte("completed_at", thirtyDaysAgo.toISOString());

  if (!error) {
    archivedTasks = data || [];
    renderArchiveTasks();
  }
}

function renderArchiveTasks() {
  if (archivedTasks.length === 0) {
    archiveContainer.innerHTML = `<div class="p-6 text-center text-slate-500 text-sm">No completed tasks in the last 30 days.</div>`;
    return;
  }

  archiveContainer.innerHTML = archivedTasks.map(task => `
    <div class="glass-card p-4 rounded-xl shadow-sm flex items-center justify-between gap-4">
      <div>
        <h4 class="font-semibold text-slate-700 text-sm line-through">${task.title}</h4>
        <p class="text-xs text-slate-400">Completed: ${new Date(task.completed_at).toLocaleDateString()}</p>
      </div>
      <button onclick="restoreTask('${task.id}')" class="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-xs rounded-lg transition flex items-center gap-1">
        <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
        <span>Restore</span>
      </button>
    </div>
  `).join("");

  if (window.lucide) lucide.createIcons();
}

// Restore Task from Archive
async function restoreTask(taskId) {
  const { error } = await supabaseClient
    .from("tasks")
    .update({ is_completed: false, completed_at: null })
    .eq("id", taskId);

  if (!error) {
    await loadArchiveTasks();
    await loadTasks();
  }
}