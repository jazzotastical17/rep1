document.addEventListener('DOMContentLoaded', () => {
  // ============================================================
  // FOCUSCRAFT - STEP 4
  // Authentication, usernames, backgrounds, and task dashboard
  // ============================================================

  // ---------- Authentication elements ----------
  const authForm = document.getElementById('auth-form');
  const authEmail = document.getElementById('auth-email');
  const authPassword = document.getElementById('auth-password');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const authToggleBtn = document.getElementById('auth-toggle-btn');
  const authToggleText = document.getElementById('auth-toggle-text');
  const authTitle = document.getElementById('auth-title');
  const authAlert = document.getElementById('auth-alert');
  const githubBtn = document.getElementById('github-login-btn');
  const forgotBtn = document.getElementById('forgot-password-btn');

  // ---------- Password recovery elements ----------
  const resetScreen = document.getElementById('reset-screen');
  const resetForm = document.getElementById('reset-form');
  const resetPassword = document.getElementById('reset-password');
  const resetConfirm = document.getElementById('reset-confirm');
  const resetAlert = document.getElementById('reset-alert');
  const resetSubmit = document.getElementById('reset-submit-btn');

  // ---------- Screens and navigation ----------
  const authScreen = document.getElementById('auth-screen');
  const appScreen = document.getElementById('app-screen');
  const navBar = document.getElementById('nav-bar');
  const signOutBtn = document.getElementById('sign-out-btn');
  const userDisplayName = document.getElementById('user-display-name');
  const userAvatar = document.getElementById('user-avatar');
  const userAvatarFallback = document.getElementById('user-avatar-fallback');
  const welcomeName = document.getElementById('welcome-name');
  const welcomeAvatar = document.getElementById('welcome-avatar');

  // ---------- Username elements ----------
  const usernameScreen = document.getElementById('username-screen');
  const usernameForm = document.getElementById('username-form');
  const usernameInput = document.getElementById('username-input');
  const usernameBtn = document.getElementById('username-save-btn');
  const usernameAlert = document.getElementById('username-alert');
  const usernameSignOutBtn = document.getElementById('username-signout-btn');

  // ---------- Background elements ----------
  const addFileBtn = document.getElementById('bg-add-btn');
  const fileInput = document.getElementById('bg-file-input');
  const bgAlert = document.getElementById('bg-alert');
  const bgProgress = document.getElementById('bg-progress');
  const bgProgressBar = document.getElementById('bg-progress-bar');
  const bgProgressText = document.getElementById('bg-progress-text');
  const bgList = document.getElementById('bg-list');
  const bgRemoveBtn = document.getElementById('bg-remove-btn');

  // ---------- Dashboard elements ----------
  const taskAddBtn = document.getElementById('task-add-btn');
  const taskTotalCount = document.getElementById('task-total-count');
  const taskCompletedCount = document.getElementById('task-completed-count');
  const taskRemainingCount = document.getElementById('task-remaining-count');
  const taskProgressLabel = document.getElementById('task-progress-label');
  const taskProgressTrack = document.getElementById('task-progress-track');
  const taskProgressBar = document.getElementById('task-progress-bar');
  const taskFilter = document.getElementById('task-filter');
  const taskSort = document.getElementById('task-sort');
  // ---------- Step 5 organization elements ----------
const taskSearch = document.getElementById('task-search');
const taskPriorityFilter = document.getElementById('task-priority-filter');
const taskDeadlineFilter = document.getElementById('task-deadline-filter');
const taskClearFilters = document.getElementById('task-clear-filters');
const taskResultsCount = document.getElementById('task-results-count');
  const taskAlert = document.getElementById('task-alert');
  const taskLoading = document.getElementById('task-loading');
  const taskEmpty = document.getElementById('task-empty');
  const taskList = document.getElementById('task-list');
  // ---------- Step 6 archive elements ----------
const archiveScreen = document.getElementById('archive-screen');
const archiveList = document.getElementById('archive-list');
const archiveCount = document.getElementById('archive-count');
const archiveAlert = document.getElementById('archive-alert');
const archiveLoading = document.getElementById('archive-loading');
const archiveEmpty = document.getElementById('archive-empty');
const archiveBackBtn = document.getElementById('archive-back-btn');
const archiveEmptyBackBtn = document.getElementById('archive-empty-back-btn');

  // ---------- Task modal elements ----------
  const taskModal = document.getElementById('task-modal');
  const taskModalTitle = document.getElementById('task-modal-title');
  const taskModalClose = document.getElementById('task-modal-close');
  const taskCancelBtn = document.getElementById('task-cancel-btn');
  const taskForm = document.getElementById('task-form');
  const taskFormAlert = document.getElementById('task-form-alert');
  const taskEditId = document.getElementById('task-edit-id');
  const taskTitleInput = document.getElementById('task-title-input');
  const taskStartDate = document.getElementById('task-start-date');
  const taskDueDate = document.getElementById('task-due-date');
  const taskPriority = document.getElementById('task-priority');
  const taskPinned = document.getElementById('task-pinned');
  const taskSaveBtn = document.getElementById('task-save-btn');

  // ---------- Navigation buttons ----------
  const navDashboardBtn = document.getElementById('nav-dashboard-btn');
  const navDashboardLink = document.getElementById('nav-dashboard-btn-link');
  const navArchiveBtn = document.getElementById('nav-archive-btn');
  const navPasswordBtn = document.getElementById('nav-password-btn');

  // ---------- Constants ----------
  const BUCKET = 'decorations';
  const MAX_BYTES = 5 * 1024 * 1024;
  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif'
  ];

 const TASK_COLUMNS = [
  'id',
  'user_id',
  'title',
  'start_date',
  'due_date',
  'priority',
  'is_pinned',
  'is_completed',
  'completed_at',
  'created_at',
  'archived_at'
].join(',');

  // ---------- Application state ----------
  let isSignUp = false;
  let isPasswordRecovery = false;
  let currentUser = null;
  let currentBgPath = null;
  let tasks = [];
  let tasksLoading = false;
  let taskBusy = false;
  let currentTaskView = 'dashboard';
  let sessionVersion = 0;

  // ============================================================
  // GENERAL HELPERS
  // ============================================================

  function setAlert(element, message, type = 'success') {
    if (!element) return;

    if (!message) {
      element.textContent = '';
      element.className = 'alert hidden';
      return;
    }

    element.textContent = message;
    element.className =
      'alert ' +
      (type === 'error' ? 'alert-error' : 'alert-success');

    element.classList.remove('hidden');
  }

  function showAlert(message, type = 'success') {
    setAlert(authAlert, message, type);
  }

  function refreshIcons() {
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }

  function isCurrentSession(userId, version) {
    return (
      currentUser &&
      currentUser.id === userId &&
      sessionVersion === version
    );
  }

  function getDisplayName(user) {
    const meta = user.user_metadata || {};

    return (
      meta.user_name ||
      meta.preferred_username ||
      meta.name ||
      meta.full_name ||
      user.email ||
      'User'
    );
  }

  function getAvatarUrl(user) {
    const meta = user.user_metadata || {};
    return meta.avatar_url || meta.picture || '';
  }

  function cleanAuthUrl() {
    if (window.location.hash || window.location.search) {
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }
  }

 function hideAllScreens() {
  authScreen.classList.add('hidden');
  usernameScreen.classList.add('hidden');
  resetScreen.classList.add('hidden');
  appScreen.classList.add('hidden');

  if (archiveScreen) {
    archiveScreen.classList.add('hidden');
  }

  navBar.classList.add('hidden');
}

  // ============================================================
  // AUTHENTICATION
  // ============================================================

  if (authToggleBtn) {
    authToggleBtn.addEventListener('click', (event) => {
      event.preventDefault();

      isSignUp = !isSignUp;
      setAlert(authAlert, '');

      if (isSignUp) {
        authTitle.textContent = 'Create an Account';
        authSubmitBtn.textContent = 'Sign Up';
        authToggleText.textContent = 'Already have an account?';
        authToggleBtn.textContent = 'Sign In';
      } else {
        authTitle.textContent = 'Sign In to FocusCraft';
        authSubmitBtn.textContent = 'Sign In';
        authToggleText.textContent = "Don't have an account?";
        authToggleBtn.textContent = 'Sign Up';
      }
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = authEmail.value.trim();
      const password = authPassword.value;

      if (!email || !password) {
        showAlert('Please fill in all fields.', 'error');
        return;
      }

      authSubmitBtn.disabled = true;
      authSubmitBtn.textContent = 'Processing...';

      try {
        if (isSignUp) {
          const { data, error } =
            await supabaseClient.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo:
                  window.location.origin +
                  window.location.pathname
              }
            });

          if (error) throw error;

          if (!data.session) {
            showAlert(
              'Check your email for a confirmation link before signing in. ' +
              'If you already have an account, use Sign In or Forgot password.',
              'success'
            );
          }
        } else {
          const { error } =
            await supabaseClient.auth.signInWithPassword({
              email,
              password
            });

          if (error) throw error;
        }
      } catch (error) {
        showAlert(
          error.message || 'Authentication failed.',
          'error'
        );
      } finally {
        authSubmitBtn.disabled = false;
        authSubmitBtn.textContent =
          isSignUp ? 'Sign Up' : 'Sign In';
      }
    });
  }

  // ---------- Forgot password ----------
  if (forgotBtn) {
    forgotBtn.addEventListener('click', async () => {
      const email = authEmail.value.trim();

      if (!email) {
        showAlert(
          'Enter your email address above, then click Forgot password again.',
          'error'
        );
        authEmail.focus();
        return;
      }

      forgotBtn.disabled = true;

      try {
        const { error } =
          await supabaseClient.auth.resetPasswordForEmail(
            email,
            {
              redirectTo:
                window.location.origin +
                window.location.pathname
            }
          );

        if (error) throw error;

        showAlert(
          'If this email has an account, a password reset link ' +
          'will arrive shortly. Check your inbox and spam folder.',
          'success'
        );
      } catch (error) {
        showAlert(
          error.message || 'Could not request a password reset.',
          'error'
        );
      } finally {
        forgotBtn.disabled = false;
      }
    });
  }

  // ---------- Password reset ----------
  if (resetForm) {
    resetForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (resetPassword.value.length < 6) {
        setAlert(
          resetAlert,
          'Use a password with at least 6 characters.',
          'error'
        );
        return;
      }

      if (resetPassword.value !== resetConfirm.value) {
        setAlert(
          resetAlert,
          'Passwords do not match.',
          'error'
        );
        return;
      }

      resetSubmit.disabled = true;

      try {
        const { error } =
          await supabaseClient.auth.updateUser({
            password: resetPassword.value
          });

        if (error) throw error;

        isPasswordRecovery = false;
        resetForm.reset();

        const { error: signOutError } =
          await supabaseClient.auth.signOut();

        if (signOutError) throw signOutError;

        showSignedOut();

        showAlert(
          'Password updated! Sign in using your new password.',
          'success'
        );
      } catch (error) {
        setAlert(
          resetAlert,
          error.message || 'Could not update password.',
          'error'
        );
      } finally {
        resetSubmit.disabled = false;
      }
    });
  }

  // ---------- GitHub OAuth ----------
  if (githubBtn) {
    githubBtn.addEventListener('click', async () => {
      githubBtn.disabled = true;

      try {
        const { error } =
          await supabaseClient.auth.signInWithOAuth({
            provider: 'github',
            options: {
              redirectTo:
                window.location.origin +
                window.location.pathname
            }
          });

        if (error) throw error;
      } catch (error) {
        showAlert(
          error.message || 'GitHub sign-in failed.',
          'error'
        );
        githubBtn.disabled = false;
      }
    });
  }

  // ---------- Sign out ----------
  if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        setAlert(
          taskAlert,
          error.message || 'Sign out failed.',
          'error'
        );
      }
    });
  }

  function showSignedOut() {
    sessionVersion++;
    currentUser = null;
    currentBgPath = null;
    tasks = [];
    tasksLoading = false;
    taskBusy = false;
    currentTaskView = 'dashboard';

    document.body.style.backgroundImage = '';

    if (taskModal) closeTaskModal();

    hideAllScreens();
    authScreen.classList.remove('hidden');

    if (githubBtn) githubBtn.disabled = false;

    renderTasks();
  }

  function showSignedIn(user, username) {
    const name = username || getDisplayName(user);
    const avatar = getAvatarUrl(user);

    userDisplayName.textContent = name;
    welcomeName.textContent = name;

    if (avatar) {
      userAvatar.src = avatar;
      userAvatar.classList.remove('hidden');
      currentTaskView = 'dashboard';

if (archiveScreen) {
  archiveScreen.classList.add('hidden');
}
      userAvatarFallback.classList.add('hidden');

      welcomeAvatar.src = avatar;
      welcomeAvatar.classList.remove('hidden');
    } else {
      userAvatar.classList.add('hidden');
      userAvatarFallback.classList.remove('hidden');
      welcomeAvatar.classList.add('hidden');
    }

    hideAllScreens();

    navBar.classList.remove('hidden');
    appScreen.classList.remove('hidden');
    loadOrganizationPreferences();

    refreshIcons();
  }

  // ---------- Supabase auth events ----------
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      isPasswordRecovery = true;
    }

    if (isPasswordRecovery && session) {
      sessionVersion++;
      currentUser = session.user;
      tasks = [];

      hideAllScreens();
      resetScreen.classList.remove('hidden');

      cleanAuthUrl();
      return;
    }

    if (session && session.user) {
      if (
        !currentUser ||
        currentUser.id !== session.user.id
      ) {
        sessionVersion++;
        currentUser = session.user;

        const version = sessionVersion;

        setTimeout(() => {
          loadUser(session.user, version);
        }, 0);
      }

      // Let Supabase finish processing recovery redirects.
      if (event !== 'INITIAL_SESSION') {
        cleanAuthUrl();
      }
    } else {
      showSignedOut();
    }
  });

  // ---------- OAuth return errors ----------
  (function showReturnError() {
    const params = new URLSearchParams(
      window.location.search
    );

    const hashParams = new URLSearchParams(
      window.location.hash.replace(/^#/, '')
    );

    const message =
      params.get('error_description') ||
      hashParams.get('error_description');

    if (message) {
      showAlert(
        message.replace(/\+/g, ' '),
        'error'
      );
    }
  })();

  // ============================================================
  // USERNAME SETUP
  // ============================================================

  async function loadUser(user, version) {
    const { data: profile, error } =
      await supabaseClient
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle();

    if (!isCurrentSession(user.id, version)) return;
    if (isPasswordRecovery) return;

    if (error) {
      hideAllScreens();

      usernameScreen.classList.remove('hidden');
      usernameInput.disabled = true;
      usernameBtn.disabled = true;

      setAlert(
        usernameAlert,
        'Could not load your profile: ' +
        error.message +
        '. Please sign out and try again.',
        'error'
      );

      return;
    }

    usernameInput.disabled = false;
    usernameBtn.disabled = false;
    setAlert(usernameAlert, '');

    if (!profile) {
      hideAllScreens();

      usernameScreen.classList.remove('hidden');
      usernameInput.focus();
      return;
    }

    showSignedIn(user, profile.username);

    // Load independent features without one failure
    // preventing the others from starting.
    await Promise.allSettled([
      loadTasks(),
      applySavedBackground(),
      loadBackgrounds()
    ]);
  }

  if (usernameForm) {
    usernameForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!currentUser) return;

      const username = usernameInput.value.trim();

      if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) {
        setAlert(
          usernameAlert,
          'Use 3 to 20 characters: letters, numbers and underscores only.',
          'error'
        );
        return;
      }

      usernameBtn.disabled = true;
      usernameBtn.textContent = 'Saving...';

      const user = currentUser;
      const version = sessionVersion;

      const { error } = await supabaseClient
        .from('profiles')
        .insert({
          id: user.id,
          username
        });

      if (!isCurrentSession(user.id, version)) return;

      usernameBtn.disabled = false;
      usernameBtn.textContent = 'Save username';

      if (error) {
        if (error.code === '23505') {
          setAlert(
            usernameAlert,
            'That username is taken. Try another one.',
            'error'
          );
        } else {
          setAlert(
            usernameAlert,
            'Could not save your username: ' +
            error.message,
            'error'
          );
        }
        return;
      }

      setAlert(usernameAlert, '');
      showSignedIn(user, username);

      await Promise.allSettled([
        loadTasks(),
        applySavedBackground(),
        loadBackgrounds()
      ]);
    });
  }

  if (usernameSignOutBtn) {
    usernameSignOutBtn.addEventListener('click', async () => {
      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        setAlert(
          usernameAlert,
          error.message || 'Sign out failed.',
          'error'
        );
      }
    });
  }

  // ============================================================
  // TASK DASHBOARD
  // ============================================================

  function taskPriorityRank(priority) {
    const value = String(priority || '').toLowerCase();

    if (value === 'high') return 3;
    if (value === 'medium') return 2;
    if (value === 'low') return 1;

    return 0;
  }

  function normalizePriority(priority) {
    const value = String(priority || '').toLowerCase();

    if (value === 'high') return 'High';
    if (value === 'low') return 'Low';

    return 'Medium';
  }

  function formatTaskDate(value) {
    if (!value) return '';

    // Parse date-only strings locally to avoid timezone shifts.
    const parts = value.split('-').map(Number);

    if (parts.length !== 3) return value;

    const date = new Date(
      parts[0],
      parts[1] - 1,
      parts[2]
    );

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function localToday() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  function isOverdue(task) {
    return (
      !task.is_completed &&
      task.due_date &&
      task.due_date < localToday()
    );
  }

  
  // ============================================================
  // STEP 5 - TASK ORGANIZATION
  // ============================================================

  
  // ============================================================
  // STEP 5 - TASK ORGANIZATION
  // ============================================================

  function getFilteredTasks() {
    const status = taskFilter ? taskFilter.value : 'all';
    const sort = taskSort ? taskSort.value : 'newest';

    const search = taskSearch
      ? taskSearch.value.trim().toLowerCase()
      : '';

    const priorityFilter = taskPriorityFilter
      ? taskPriorityFilter.value
      : 'all';

    const deadlineFilter = taskDeadlineFilter
      ? taskDeadlineFilter.value
      : 'all';

    const today = localToday();

let result = tasks.filter((task) => {
  // Step 6: Archived tasks never appear on the dashboard.
  if (task.archived_at) return false;      // Search task titles
      if (
        search &&
        !String(task.title || '')
          .toLowerCase()
          .includes(search)
      ) {
        return false;
      }

      // Status filter
      if (status === 'active' && task.is_completed) {
        return false;
      }

      if (status === 'completed' && !task.is_completed) {
        return false;
      }

      if (status === 'pinned' && !task.is_pinned) {
        return false;
      }

      // Priority filter
      if (
        priorityFilter !== 'all' &&
        normalizePriority(task.priority) !== priorityFilter
      ) {
        return false;
      }

      // Deadline filter
      if (deadlineFilter === 'overdue') {
        if (
          task.is_completed ||
          !task.due_date ||
          task.due_date >= today
        ) {
          return false;
        }
      }

      if (deadlineFilter === 'today') {
        if (task.due_date !== today) {
          return false;
        }
      }

      if (deadlineFilter === 'upcoming') {
        if (
          !task.due_date ||
          task.due_date <= today
        ) {
          return false;
        }
      }

      if (deadlineFilter === 'none') {
        if (task.due_date) {
          return false;
        }
      }

      return true;
    });

    // Sort the filtered tasks
    result = [...result];

    result.sort((a, b) => {
      // Preserve Step 4 pinned-first behavior
      if (Boolean(a.is_pinned) !== Boolean(b.is_pinned)) {
        return a.is_pinned ? -1 : 1;
      }

      if (sort === 'priority') {
        const difference =
          taskPriorityRank(b.priority) -
          taskPriorityRank(a.priority);

        if (difference !== 0) return difference;
      }

      if (sort === 'due') {
        if (!a.due_date && b.due_date) return 1;
        if (a.due_date && !b.due_date) return -1;

        if (a.due_date && b.due_date) {
          const difference =
            a.due_date.localeCompare(b.due_date);

          if (difference !== 0) return difference;
        }
      }

      const aTime = new Date(a.created_at || 0).getTime();
      const bTime = new Date(b.created_at || 0).getTime();

      if (sort === 'oldest') {
        return aTime - bTime;
      }

      return bTime - aTime;
    });

    return result;
  }

  function updateTaskResultsCount(visibleCount) {
  if (!taskResultsCount) return;

  const total = tasks.filter(
    (task) => !task.archived_at
  ).length;

  taskResultsCount.textContent =
    `Showing ${visibleCount} of ${total} tasks`;
}


  function updateTaskStats() {
  const dashboardTasks = tasks.filter(
    (task) => !task.archived_at
  );

  const total = dashboardTasks.length;

  const completed = dashboardTasks.filter(
    (task) => task.is_completed
  ).length;

  const remaining = total - completed;

  const percentage = total
    ? Math.round((completed / total) * 100)
    : 0;

  taskTotalCount.textContent = total;
  taskCompletedCount.textContent = completed;
  taskRemainingCount.textContent = remaining;

  taskProgressLabel.textContent = percentage + '%';
  taskProgressBar.style.width = percentage + '%';

  taskProgressTrack.setAttribute(
    'aria-valuenow',
    String(percentage)
  );
}

  function createIcon(name, className = 'w-4 h-4') {
    const icon = document.createElement('i');

    icon.setAttribute('data-lucide', name);
    icon.className = className;

    return icon;
  }

  function createActionButton(label, iconName, onClick) {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'task-action-btn';
    button.title = label;
    button.setAttribute('aria-label', label);

    button.appendChild(createIcon(iconName));

    button.addEventListener('click', onClick);

    return button;
  }

  function createTaskCard(task) {
    const card = document.createElement('article');

    card.className =
      'task-card' +
      (task.is_completed ? ' task-card-completed' : '');

    const outer = document.createElement('div');
    outer.className = 'flex items-start gap-3';

    // ---------- Completion checkbox ----------
    const checkbox = document.createElement('input');

    checkbox.type = 'checkbox';
    checkbox.checked = Boolean(task.is_completed);
    checkbox.className =
      'mt-1 w-5 h-5 accent-indigo-600 cursor-pointer shrink-0';

    checkbox.setAttribute(
      'aria-label',
      'Mark ' + task.title +
      (task.is_completed ? ' incomplete' : ' completed')
    );

    checkbox.disabled = taskBusy;

    checkbox.addEventListener('change', async () => {
      await toggleTaskCompleted(task, checkbox.checked);
    });

    outer.appendChild(checkbox);

    // ---------- Main task content ----------
    const content = document.createElement('div');
    content.className = 'flex-1 min-w-0';

    const heading = document.createElement('div');
    heading.className =
      'flex flex-wrap items-center gap-2 mb-2';

    if (task.is_pinned) {
      const pin = createIcon(
        'pin',
        'w-4 h-4 text-amber-500 shrink-0'
      );

      pin.setAttribute('aria-label', 'Pinned task');
      heading.appendChild(pin);
    }

    const title = document.createElement('h4');

    title.className =
      'task-title text-sm sm:text-base font-bold text-slate-900 break-words';

    // textContent prevents task titles from injecting HTML.
    title.textContent = task.title;

    heading.appendChild(title);

    const priority = normalizePriority(task.priority);

    const badge = document.createElement('span');

    badge.className =
      'text-xs font-semibold px-2 py-1 rounded-full ' +
      'priority-' +
      priority.toLowerCase();

    badge.textContent = priority;

    heading.appendChild(badge);

    if (task.is_completed) {
      const done = document.createElement('span');

      done.className =
        'text-xs font-semibold px-2 py-1 rounded-full ' +
        'bg-green-100 text-green-700';

      done.textContent = 'Completed';

      heading.appendChild(done);
    }

    content.appendChild(heading);

    // ---------- Task dates ----------
    const dates = document.createElement('div');

    dates.className =
      'flex flex-wrap items-center gap-x-4 gap-y-1 ' +
      'text-xs text-slate-500';

    if (task.start_date) {
      const start = document.createElement('span');

      start.textContent =
        'Starts: ' + formatTaskDate(task.start_date);

      dates.appendChild(start);
    }

    if (task.due_date) {
      const due = document.createElement('span');

      due.textContent =
        'Due: ' + formatTaskDate(task.due_date);

      if (isOverdue(task)) {
        due.className = 'text-red-600 font-semibold';
        due.textContent += ' (Overdue)';
      }

      dates.appendChild(due);
    }

    if (dates.children.length) {
      content.appendChild(dates);
    }

    outer.appendChild(content);

    // ---------- Task action buttons ----------
    const actions = document.createElement('div');

    actions.className =
      'flex flex-wrap items-center gap-1 shrink-0';

    const pinButton = createActionButton(
      task.is_pinned ? 'Unpin task' : 'Pin task',
      task.is_pinned ? 'pin-off' : 'pin',
      () => toggleTaskPinned(task)
    );

    const editButton = createActionButton(
      'Edit task',
      'pencil',
      () => openEditTaskModal(task)
    );

    const deleteButton = createActionButton(
      'Delete task',
      'trash-2',
      () => deleteTask(task)
    );

    deleteButton.classList.add('hover:text-red-600');

pinButton.disabled = taskBusy;
editButton.disabled = taskBusy;
archiveButton.disabled = taskBusy;
deleteButton.disabled = taskBusy;

actions.append(
  pinButton,
  editButton,
  archiveButton,
  deleteButton
);

    outer.appendChild(actions);
    card.appendChild(outer);

    return card;
  }

  function renderTasks() {
    if (!taskList) return;

    updateTaskStats();

    taskLoading.classList.toggle(
      'hidden',
      !tasksLoading
    );

    taskList.replaceChildren();

    if (tasksLoading) {
      taskEmpty.classList.add('hidden');
      return;
    }

    const visibleTasks = getFilteredTasks();
    updateTaskResultsCount(visibleTasks.length);

    taskEmpty.classList.toggle(
      'hidden',
      visibleTasks.length > 0
    );

    visibleTasks.forEach((task) => {
      taskList.appendChild(createTaskCard(task));
    });

    refreshIcons();
  }

  async function loadTasks() {
    if (!currentUser) return;

    const userId = currentUser.id;
    const version = sessionVersion;

    tasksLoading = true;
    setAlert(taskAlert, '');
    renderTasks();

    try {
      const { data, error } = await supabaseClient
        .from('tasks')
        .select(TASK_COLUMNS)
        .eq('user_id', userId)
        .order('created_at', {
          ascending: false
        });

      if (!isCurrentSession(userId, version)) return;

      if (error) throw error;

      tasks = data || [];
    } catch (error) {
      if (!isCurrentSession(userId, version)) return;

      tasks = [];

      setAlert(
        taskAlert,
        'Could not load tasks: ' +
        (error.message || 'Unknown error'),
        'error'
      );
    } finally {
  if (isCurrentSession(userId, version)) {
    tasksLoading = false;
    renderTasks();
    renderArchive();
  }
}
  }

  // ---------- Task modal ----------
  function openTaskModal() {
    if (!currentUser || taskBusy) return;

    taskForm.reset();
    taskEditId.value = '';
    taskPriority.value = 'Medium';
    taskPinned.checked = false;

    taskModalTitle.textContent = 'Create a Task';
    taskSaveBtn.textContent = 'Save Task';

    setAlert(taskFormAlert, '');

    taskModal.classList.remove('hidden');

    taskTitleInput.focus();
  }

  function openEditTaskModal(task) {
    if (!currentUser || taskBusy) return;

    taskForm.reset();

    taskEditId.value = task.id;
    taskTitleInput.value = task.title || '';
    taskStartDate.value = task.start_date || '';
    taskDueDate.value = task.due_date || '';
    taskPriority.value = normalizePriority(task.priority);
    taskPinned.checked = Boolean(task.is_pinned);

    taskModalTitle.textContent = 'Edit Task';
    taskSaveBtn.textContent = 'Save Changes';

    setAlert(taskFormAlert, '');

    taskModal.classList.remove('hidden');

    taskTitleInput.focus();
  }

  function closeTaskModal() {
    if (!taskModal) return;

    taskModal.classList.add('hidden');

    if (taskForm) taskForm.reset();

    setAlert(taskFormAlert, '');
  }

  if (taskAddBtn) {
    taskAddBtn.addEventListener('click', openTaskModal);
  }

  if (taskModalClose) {
    taskModalClose.addEventListener(
      'click',
      closeTaskModal
    );
  }

  if (taskCancelBtn) {
    taskCancelBtn.addEventListener(
      'click',
      closeTaskModal
    );
  }

  if (taskModal) {
    taskModal.addEventListener('click', (event) => {
      if (event.target === taskModal && !taskBusy) {
        closeTaskModal();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      taskModal &&
      !taskModal.classList.contains('hidden') &&
      !taskBusy
    ) {
      closeTaskModal();
    }
  });

  // ---------- Create or edit task ----------
  if (taskForm) {
    taskForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!currentUser || taskBusy) return;

      const title = taskTitleInput.value.trim();
      const startDate = taskStartDate.value || null;
      const dueDate = taskDueDate.value || null;
      const priority = normalizePriority(
        taskPriority.value
      );
      const pinned = taskPinned.checked;
      const editId = taskEditId.value;

      if (!title) {
        setAlert(
          taskFormAlert,
          'Please enter a task title.',
          'error'
        );
        return;
      }

      if (title.length > 200) {
        setAlert(
          taskFormAlert,
          'Task titles must be 200 characters or less.',
          'error'
        );
        return;
      }

      if (
        startDate &&
        dueDate &&
        dueDate < startDate
      ) {
        setAlert(
          taskFormAlert,
          'Due date cannot be earlier than start date.',
          'error'
        );
        return;
      }

      const userId = currentUser.id;
      const version = sessionVersion;

      const payload = {
        title,
        start_date: startDate,
        due_date: dueDate,
        priority,
        is_pinned: pinned
      };

      taskBusy = true;
      taskSaveBtn.disabled = true;
      taskSaveBtn.textContent = 'Saving...';

      setAlert(taskFormAlert, '');

      try {
        let response;

        if (editId) {
          // Only update a task belonging to this user.
          response = await supabaseClient
            .from('tasks')
            .update(payload)
            .eq('id', editId)
            .eq('user_id', userId)
            .select('id');
        } else {
          response = await supabaseClient
            .from('tasks')
            .insert({
              ...payload,
              user_id: userId,
              is_completed: false
            })
            .select('id');
        }

        if (!isCurrentSession(userId, version)) return;

        if (response.error) throw response.error;

        if (!response.data || response.data.length !== 1) {
          throw new Error(
            'Task was not saved. Check your database permissions.'
          );
        }

        closeTaskModal();

        setAlert(
          taskAlert,
          editId
            ? 'Task updated successfully!'
            : 'Task created successfully!',
          'success'
        );

        await loadTasks();
      } catch (error) {
        if (!isCurrentSession(userId, version)) return;

        setAlert(
          taskFormAlert,
          error.message || 'Could not save task.',
          'error'
        );
      } finally {
        taskBusy = false;
        taskSaveBtn.disabled = false;
        taskSaveBtn.textContent =
          editId ? 'Save Changes' : 'Save Task';
      }
    });
  }

  // ---------- Complete / uncomplete task ----------
  async function toggleTaskCompleted(task, completed) {
    if (!currentUser || taskBusy) return;

    const userId = currentUser.id;
    const version = sessionVersion;

    taskBusy = true;

    try {
      const { data, error } = await supabaseClient
        .from('tasks')
        .update({
          is_completed: completed,
          completed_at: completed
            ? new Date().toISOString()
            : null
        })
        .eq('id', task.id)
        .eq('user_id', userId)
        .select('id');

      if (!isCurrentSession(userId, version)) return;

      if (error) throw error;

      if (!data || data.length !== 1) {
        throw new Error('Task could not be updated.');
      }

      await loadTasks();
    } catch (error) {
      if (!isCurrentSession(userId, version)) return;

      setAlert(
        taskAlert,
        error.message || 'Could not update task.',
        'error'
      );

      await loadTasks();
    } finally {
      taskBusy = false;
    }
  }

  // ---------- Pin / unpin task ----------
  async function toggleTaskPinned(task) {
    if (!currentUser || taskBusy) return;

    const userId = currentUser.id;
    const version = sessionVersion;

    taskBusy = true;

    try {
      const { data, error } = await supabaseClient
        .from('tasks')
        .update({
          is_pinned: !task.is_pinned
        })
        .eq('id', task.id)
        .eq('user_id', userId)
        .select('id');

      if (!isCurrentSession(userId, version)) return;

      if (error) throw error;

      if (!data || data.length !== 1) {
        throw new Error('Task could not be pinned.');
      }

      await loadTasks();
    } catch (error) {
      if (!isCurrentSession(userId, version)) return;

      setAlert(
        taskAlert,
        error.message || 'Could not pin task.',
        'error'
      );

      await loadTasks();
    } finally {
      taskBusy = false;
    }
  }
  
  // ---------- Delete task ----------
  async function deleteTask(task) {
    if (!currentUser || taskBusy) return;

    const confirmed = window.confirm(
      'Permanently delete "' + task.title + '"?\n\n' +
      'This cannot be undone.'
    );

    if (!confirmed) return;

    const userId = currentUser.id;
    const version = sessionVersion;
    const wasArchived = Boolean(task.archived_at);

    taskBusy = true;

    try {
      const { data, error } = await supabaseClient
        .from('tasks')
        .delete()
        .eq('id', task.id)
        .eq('user_id', userId)
        .select('id');

      if (!isCurrentSession(userId, version)) return;

      if (error) throw error;

      if (!data || data.length !== 1) {
        throw new Error('Task could not be deleted.');
      }

      await loadTasks();

      if (!isCurrentSession(userId, version)) return;

      setAlert(
        wasArchived ? archiveAlert : taskAlert,
        wasArchived
          ? 'Archived task permanently deleted.'
          : 'Task permanently deleted.',
        'success'
      );
    } catch (error) {
      if (!isCurrentSession(userId, version)) return;

      setAlert(
        wasArchived ? archiveAlert : taskAlert,
        error.message || 'Could not delete task.',
        'error'
      );
    } finally {
      taskBusy = false;

      if (isCurrentSession(userId, version)) {
        renderTasks();
        renderArchive();
      }
    }
  }

 
  // ============================================================
  // STEP 6 - TASK ARCHIVE
  // ============================================================

  function getArchivedTasks() {
    return tasks
      .filter((task) => Boolean(task.archived_at))
      .sort((a, b) =>
        new Date(b.archived_at).getTime() -
        new Date(a.archived_at).getTime()
      );
  }

  function showTaskView(view) {
    if (!currentUser || !archiveScreen) return;

    currentTaskView =
      view === 'archive' ? 'archive' : 'dashboard';

    const showingArchive = currentTaskView === 'archive';

    appScreen.classList.toggle('hidden', showingArchive);
    archiveScreen.classList.toggle('hidden', !showingArchive);

    if (navDashboardLink) {
      navDashboardLink.setAttribute(
        'aria-current',
        showingArchive ? 'false' : 'page'
      );
    }

    if (navArchiveBtn) {
      navArchiveBtn.setAttribute(
        'aria-current',
        showingArchive ? 'page' : 'false'
      );
    }

    if (showingArchive) {
      renderArchive();
    } else {
      renderTasks();
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function createArchivedTaskCard(task) {
    const card = document.createElement('article');
    card.className = 'archive-card';

    const layout = document.createElement('div');
    layout.className =
      'flex flex-col sm:flex-row sm:items-start ' +
      'sm:justify-between gap-4';

    const content = document.createElement('div');
    content.className = 'flex-1 min-w-0';

    const heading = document.createElement('div');
    heading.className =
      'flex flex-wrap items-center gap-2 mb-2';

    const title = document.createElement('h4');
    title.className =
      'text-sm sm:text-base font-bold text-slate-900 break-words';
    title.textContent = task.title;

    heading.appendChild(title);

    const priority = normalizePriority(task.priority);
    const priorityBadge = document.createElement('span');
    priorityBadge.className =
      'text-xs font-semibold px-2 py-1 rounded-full ' +
      'priority-' + priority.toLowerCase();
    priorityBadge.textContent = priority;

    heading.appendChild(priorityBadge);

    const statusBadge = document.createElement('span');
    statusBadge.className =
      'text-xs font-semibold px-2 py-1 rounded-full ' +
      (task.is_completed
        ? 'bg-green-100 text-green-700'
        : 'bg-slate-100 text-slate-600');

    statusBadge.textContent =
      task.is_completed ? 'Completed' : 'Not completed';

    heading.appendChild(statusBadge);
    content.appendChild(heading);

    const details = document.createElement('div');
    details.className =
      'flex flex-wrap items-center gap-x-4 gap-y-1 archive-meta';

    function addDetail(text) {
      const item = document.createElement('span');
      item.textContent = text;
      details.appendChild(item);
    }

    if (task.start_date) {
      addDetail('Starts: ' + formatTaskDate(task.start_date));
    }

    if (task.due_date) {
      addDetail('Due: ' + formatTaskDate(task.due_date));
    }

    if (task.archived_at) {
      addDetail(
        'Archived: ' +
        new Date(task.archived_at).toLocaleDateString()
      );
    }

    if (task.is_pinned) {
      addDetail('Previously pinned');
    }

    content.appendChild(details);

    const actions = document.createElement('div');
    actions.className =
      'flex flex-wrap items-center gap-2 shrink-0';

    const restoreButton = document.createElement('button');
    restoreButton.type = 'button';
    restoreButton.className = 'archive-action-btn';
    restoreButton.textContent = 'Restore';
    restoreButton.setAttribute(
      'aria-label',
      'Restore ' + task.title
    );
    restoreButton.disabled = taskBusy;

    restoreButton.addEventListener('click', () => {
      restoreTask(task);
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className =
      'archive-action-btn text-red-600 hover:text-red-700';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute(
      'aria-label',
      'Permanently delete ' + task.title
    );
    deleteButton.disabled = taskBusy;

    deleteButton.addEventListener('click', () => {
      deleteTask(task);
    });

    actions.append(restoreButton, deleteButton);
    layout.append(content, actions);
    card.appendChild(layout);

    return card;
  }

  function renderArchive() {
    if (!archiveList) return;

    const archivedTasks = getArchivedTasks();

    if (archiveCount) {
      archiveCount.textContent = String(archivedTasks.length);
    }

    if (archiveLoading) {
      archiveLoading.classList.toggle(
        'hidden',
        !tasksLoading
      );
    }

    archiveList.replaceChildren();

    if (tasksLoading) {
      if (archiveEmpty) archiveEmpty.classList.add('hidden');
      return;
    }

    if (archiveEmpty) {
      archiveEmpty.classList.toggle(
        'hidden',
        archivedTasks.length > 0
      );
    }

    archivedTasks.forEach((task) => {
      archiveList.appendChild(createArchivedTaskCard(task));
    });

    refreshIcons();
  }

  async function setTaskArchived(task, archived) {
    if (!currentUser || taskBusy) return;

    const userId = currentUser.id;
    const version = sessionVersion;

    taskBusy = true;

    try {
      const { data, error } = await supabaseClient
        .from('tasks')
        .update({
          archived_at: archived
            ? new Date().toISOString()
            : null
        })
        .eq('id', task.id)
        .eq('user_id', userId)
        .select('id');

      if (!isCurrentSession(userId, version)) return;

      if (error) throw error;

      if (!data || data.length !== 1) {
        throw new Error(
          archived
            ? 'Task could not be archived.'
            : 'Task could not be restored.'
        );
      }

      await loadTasks();

      if (!isCurrentSession(userId, version)) return;

      setAlert(
        archived ? taskAlert : archiveAlert,
        archived
          ? 'Task archived successfully!'
          : 'Task restored to your dashboard!',
        'success'
      );
    } catch (error) {
      if (!isCurrentSession(userId, version)) return;

      setAlert(
        archived ? taskAlert : archiveAlert,
        error.message ||
          (archived
            ? 'Could not archive task.'
            : 'Could not restore task.'),
        'error'
      );
    } finally {
      taskBusy = false;

      if (isCurrentSession(userId, version)) {
        renderTasks();
        renderArchive();
      }
    }
  }

  function archiveTask(task) {
    if (task.archived_at) return;
    return setTaskArchived(task, true);
  }

  function restoreTask(task) {
    if (!task.archived_at) return;
    return setTaskArchived(task, false);
  }

  // ============================================================
  // STEP 5 - ORGANIZATION CONTROLS
  // ============================================================

  const ORGANIZATION_DEFAULTS = {
    status: 'all',
    priority: 'all',
    deadline: 'all',
    sort: 'newest',
    search: ''
  };

  function organizationStorageKey() {
    if (!currentUser) return null;

    return `focuscraft-organization-${currentUser.id}`;
  }

  function saveOrganizationPreferences() {
    const key = organizationStorageKey();
    if (!key) return;

    const preferences = {
      status: taskFilter.value,
      priority: taskPriorityFilter
        ? taskPriorityFilter.value
        : 'all',
      deadline: taskDeadlineFilter
        ? taskDeadlineFilter.value
        : 'all',
      sort: taskSort.value,
      search: taskSearch ? taskSearch.value : ''
    };

    try {
      localStorage.setItem(
        key,
        JSON.stringify(preferences)
      );
    } catch (error) {
      // Filters still work if browser storage is unavailable.
    }
  }

  function setSelectValue(element, value, fallback) {
    if (!element) return;

    const valid = Array.from(element.options)
      .some((option) => option.value === value);

    element.value = valid ? value : fallback;
  }

  function loadOrganizationPreferences() {
    const key = organizationStorageKey();
    if (!key) return;

    let preferences = ORGANIZATION_DEFAULTS;

    try {
      const saved = localStorage.getItem(key);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (
          parsed &&
          typeof parsed === 'object' &&
          !Array.isArray(parsed)
        ) {
          preferences = {
            ...ORGANIZATION_DEFAULTS,
            ...parsed
          };
        }
      }
    } catch (error) {
      preferences = ORGANIZATION_DEFAULTS;
    }

    setSelectValue(
      taskFilter,
      preferences.status,
      'all'
    );

    setSelectValue(
      taskPriorityFilter,
      preferences.priority,
      'all'
    );

    setSelectValue(
      taskDeadlineFilter,
      preferences.deadline,
      'all'
    );

    setSelectValue(
      taskSort,
      preferences.sort,
      'newest'
    );

    if (taskSearch) {
      taskSearch.value =
        typeof preferences.search === 'string'
          ? preferences.search
          : '';
    }

    renderTasks();
  }

  function organizationChanged() {
    saveOrganizationPreferences();
    renderTasks();
  }

  if (taskFilter) {
    taskFilter.addEventListener(
      'change',
      organizationChanged
    );
  }

  if (taskSort) {
    taskSort.addEventListener(
      'change',
      organizationChanged
    );
  }

  if (taskPriorityFilter) {
    taskPriorityFilter.addEventListener(
      'change',
      organizationChanged
    );
  }

  if (taskDeadlineFilter) {
    taskDeadlineFilter.addEventListener(
      'change',
      organizationChanged
    );
  }

  if (taskSearch) {
    taskSearch.addEventListener(
      'input',
      organizationChanged
    );
  }

  if (taskClearFilters) {
    taskClearFilters.addEventListener('click', () => {
      if (taskSearch) taskSearch.value = '';
      if (taskFilter) taskFilter.value = 'all';
      if (taskPriorityFilter) {
        taskPriorityFilter.value = 'all';
      }
      if (taskDeadlineFilter) {
        taskDeadlineFilter.value = 'all';
      }
      if (taskSort) taskSort.value = 'newest';

      organizationChanged();
    });
  }


  // ============================================================
  // BACKGROUNDS
  // ============================================================

  function formatSize(bytes) {
    if (bytes === undefined || bytes === null) {
      return '';
    }

    if (bytes < 1024 * 1024) {
      return (
        Math.max(1, Math.round(bytes / 1024)) +
        ' KB'
      );
    }

    return (
      (bytes / 1024 / 1024).toFixed(1) +
      ' MB'
    );
  }

  async function getSignedUrl(path) {
    const { data, error } =
      await supabaseClient.storage
        .from(BUCKET)
        .createSignedUrl(path, 3600);

    return error ? null : data.signedUrl;
  }

  function setBackground(path, url) {
    currentBgPath = path;

    document.body.style.backgroundImage =
      `url("${url}")`;
  }

  function clearBackground() {
    currentBgPath = null;
    document.body.style.backgroundImage = '';
  }

  async function applySavedBackground() {
    if (!currentUser) return;

    const userId = currentUser.id;
    const version = sessionVersion;

    clearBackground();

    const { data, error } = await supabaseClient
      .from('user_settings')
      .select('background_image_url')
      .eq('user_id', userId)
      .limit(1);

    if (!isCurrentSession(userId, version)) return;

    if (error) {
      setAlert(
        bgAlert,
        'Could not load background settings: ' +
        error.message,
        'error'
      );
      return;
    }

    const path =
      data &&
      data[0] &&
      data[0].background_image_url;

    if (!path) return;

    const url = await getSignedUrl(path);

    if (!isCurrentSession(userId, version)) return;

    if (url) setBackground(path, url);
  }

  async function saveBackgroundSetting(path) {
    if (!currentUser) {
      return new Error('Please sign in again.');
    }

    const { data: rows, error: findError } =
      await supabaseClient
        .from('user_settings')
        .select('id')
        .eq('user_id', currentUser.id)
        .limit(1);

    if (findError) return findError;

    const request = rows && rows.length
      ? supabaseClient
          .from('user_settings')
          .update({
            background_image_url: path
          })
          .eq('id', rows[0].id)
      : supabaseClient
          .from('user_settings')
          .insert({
            id: crypto.randomUUID(),
            user_id: currentUser.id,
            background_image_url: path
          });

    const { error } = await request;

    return error;
  }

  async function useBackground(path) {
    if (!currentUser) return;

    const userId = currentUser.id;
    const version = sessionVersion;

    const url = await getSignedUrl(path);

    if (!isCurrentSession(userId, version)) return;

    if (!url) {
      setAlert(
        bgAlert,
        'Could not open that image. Try again.',
        'error'
      );
      return;
    }

    const error = await saveBackgroundSetting(path);

    if (!isCurrentSession(userId, version)) return;

    if (error) {
      setAlert(
        bgAlert,
        'Could not save your background: ' +
        error.message,
        'error'
      );
      return;
    }

    setBackground(path, url);

    setAlert(
      bgAlert,
      'Background updated.',
      'success'
    );

    await loadBackgrounds();
  }

  async function removeBackground() {
    if (!currentBgPath) {
      setAlert(
        bgAlert,
        'No background is set.',
        'error'
      );
      return;
    }

    const error = await saveBackgroundSetting(null);

    if (error) {
      setAlert(
        bgAlert,
        'Could not remove your background: ' +
        error.message,
        'error'
      );
      return;
    }

    clearBackground();

    setAlert(
      bgAlert,
      'Background removed.',
      'success'
    );

    await loadBackgrounds();
  }

  async function deleteBackground(path) {
    if (!window.confirm('Delete this image?')) return;

    const { data, error } =
      await supabaseClient.storage
        .from(BUCKET)
        .remove([path]);

    if (error || !data || !data.length) {
      setAlert(
        bgAlert,
        error
          ? 'Could not delete that image: ' +
            error.message
          : 'Could not delete that image. ' +
            'The delete rule may be missing.',
        'error'
      );

      return;
    }

    if (path === currentBgPath) {
      await saveBackgroundSetting(null);
      clearBackground();
    }

    setAlert(
      bgAlert,
      'Image deleted.',
      'success'
    );

    await loadBackgrounds();
  }

  async function loadBackgrounds() {
    if (!currentUser) return;

    const userId = currentUser.id;
    const version = sessionVersion;

    const { data, error } =
      await supabaseClient.storage
        .from(BUCKET)
        .list(userId, {
          limit: 100,
          sortBy: {
            column: 'created_at',
            order: 'desc'
          }
        });

    if (!isCurrentSession(userId, version)) return;

    if (error) {
      setAlert(
        bgAlert,
        'Could not load your images: ' +
        error.message,
        'error'
      );
      return;
    }

    const files = (data || []).filter(
      (file) => file.id
    );

    bgList.replaceChildren();

    if (!files.length) {
      const empty = document.createElement('p');

      empty.className =
        'text-sm text-slate-500';

      empty.textContent =
        'No images yet. Click Add file to upload one.';

      bgList.appendChild(empty);
      return;
    }

    const paths = files.map(
      (file) => `${userId}/${file.name}`
    );

    const { data: signed } =
      await supabaseClient.storage
        .from(BUCKET)
        .createSignedUrls(paths, 3600);

    if (!isCurrentSession(userId, version)) return;

    files.forEach((file, index) => {
      const path = paths[index];

      const row = document.createElement('div');

      row.className =
        'flex items-center gap-3 p-2 rounded-lg ' +
        'border border-slate-200 bg-white/70';

      const img = document.createElement('img');

      img.src =
        signed &&
        signed[index] &&
        signed[index].signedUrl
          ? signed[index].signedUrl
          : '';

      img.alt = '';

      img.className =
        'w-16 h-12 rounded object-cover ' +
        'bg-slate-200 shrink-0';

      const info = document.createElement('div');

      info.className = 'flex-1 min-w-0';

      const name = document.createElement('p');

      name.className =
        'text-sm font-semibold text-slate-800 truncate';

      name.textContent =
        file.name.replace(/^\d+-/, '');

      const meta = document.createElement('p');

      meta.className =
        'text-xs text-slate-500';

      meta.textContent =
        formatSize(file.metadata && file.metadata.size) +
        (path === currentBgPath ? ' (in use)' : '');

      info.append(name, meta);

      const useBtn = document.createElement('button');

      useBtn.type = 'button';

      useBtn.className =
        'btn-primary px-3 py-1.5 rounded-lg ' +
        'text-xs font-semibold';

      useBtn.textContent = 'Use as background';

      useBtn.addEventListener(
        'click',
        () => useBackground(path)
      );

      const delBtn = document.createElement('button');

      delBtn.type = 'button';

      delBtn.className =
        'px-3 py-1.5 rounded-lg text-xs ' +
        'font-semibold text-red-600 ' +
        'hover:bg-red-50 transition';

      delBtn.textContent = 'Delete';

      delBtn.addEventListener(
        'click',
        () => deleteBackground(path)
      );

      row.append(
        img,
        info,
        useBtn,
        delBtn
      );

      bgList.appendChild(row);
    });
  }

  function setProgress(percent) {
    bgProgress.classList.remove('hidden');
    bgProgressBar.style.width = percent + '%';
    bgProgressText.textContent = percent + '%';
  }

  function uploadErrorText(xhr) {
    let message = '';

    try {
      message =
        JSON.parse(xhr.responseText).message || '';
    } catch (error) {
      message = '';
    }

    if (
      xhr.status === 413 ||
      /exceeded the maximum/i.test(message)
    ) {
      return 'That file is too big. The limit is 5 MB.';
    }

    if (/mime type/i.test(message)) {
      return (
        'That file type is not allowed. ' +
        'Use a JPG, PNG or GIF.'
      );
    }

    if (
      /row-level security/i.test(message) ||
      xhr.status === 403
    ) {
      return (
        'Upload blocked: the upload rule ' +
        'for your folder is missing or wrong.'
      );
    }

    if (
      /bucket not found/i.test(message) ||
      xhr.status === 404
    ) {
      return (
        'Bucket not found. Its name must be ' +
        'exactly "decorations".'
      );
    }

    return (
      'Upload failed' +
      (message ? ': ' + message : '. Try again.')
    );
  }

  // XMLHttpRequest provides real upload progress.
  async function uploadWithProgress(file, path) {
    const { data } =
      await supabaseClient.auth.getSession();

    if (!data.session) {
      throw new Error(
        'You are signed out. Please sign in again.'
      );
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open(
        'POST',
        `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`
      );

      xhr.setRequestHeader(
        'Authorization',
        `Bearer ${data.session.access_token}`
      );

      xhr.setRequestHeader(
        'apikey',
        SUPABASE_ANON_KEY
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(
            Math.round(
              (event.loaded / event.total) * 100
            )
          );
        }
      };

      xhr.onload = () => {
        if (
          xhr.status >= 200 &&
          xhr.status < 300
        ) {
          resolve();
        } else {
          reject(
            new Error(uploadErrorText(xhr))
          );
        }
      };

      xhr.onerror = () => {
        reject(
          new Error(
            'Network problem. Check your internet and try again.'
          )
        );
      };

      const form = new FormData();

      form.append('cacheControl', '3600');
      form.append('', file);

      setProgress(0);
      xhr.send(form);
    });
  }

  if (addFileBtn) {
    addFileBtn.addEventListener('click', () => {
      fileInput.click();
    });
  }

  if (bgRemoveBtn) {
    bgRemoveBtn.addEventListener(
      'click',
      removeBackground
    );
  }

  if (fileInput) {
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files[0];

      fileInput.value = '';

      if (!file || !currentUser) return;

      setAlert(bgAlert, '');

      if (!ALLOWED_TYPES.includes(file.type)) {
        setAlert(
          bgAlert,
          'That file type is not allowed. ' +
          'Use a JPG, PNG or GIF.',
          'error'
        );
        return;
      }

      if (file.size > MAX_BYTES) {
        setAlert(
          bgAlert,
          `That file is ${formatSize(file.size)}. ` +
          'The limit is 5 MB.',
          'error'
        );
        return;
      }

      const userId = currentUser.id;
      const version = sessionVersion;

      const safeName = file.name.replace(
        /[^A-Za-z0-9._-]/g,
        '_'
      );

      const path =
        `${userId}/${Date.now()}-${safeName}`;

      addFileBtn.disabled = true;

      try {
        await uploadWithProgress(file, path);

        if (!isCurrentSession(userId, version)) return;

        setAlert(
          bgAlert,
          'Image uploaded.',
          'success'
        );

        await loadBackgrounds();
      } catch (error) {
        if (!isCurrentSession(userId, version)) return;

        setAlert(
          bgAlert,
          error.message,
          'error'
        );
      } finally {
        addFileBtn.disabled = false;
        bgProgress.classList.add('hidden');
      }
    });
  }

  // ============================================================
  // NAVIGATION
  // ============================================================

  function scrollToDashboard() {

  // ============================================================
  // STEP 6 - NAVIGATION
  // ============================================================

  function scrollToDashboard() {
    if (!currentUser) return;

    showTaskView('dashboard');
  }

  if (navDashboardBtn) {
    navDashboardBtn.addEventListener(
      'click',
      scrollToDashboard
    );
  }

  if (navDashboardLink) {
    navDashboardLink.addEventListener(
      'click',
      scrollToDashboard
    );
  }

  if (navArchiveBtn) {
    navArchiveBtn.addEventListener('click', () => {
      if (!currentUser) return;

      setAlert(archiveAlert, '');
      showTaskView('archive');
    });
  }

  if (archiveBackBtn) {
    archiveBackBtn.addEventListener(
      'click',
      scrollToDashboard
    );
  }

  if (archiveEmptyBackBtn) {
    archiveEmptyBackBtn.addEventListener(
      'click',
      scrollToDashboard
    );
  }

  // Security settings will be implemented in Step 7.
  if (navPasswordBtn) {
    navPasswordBtn.addEventListener('click', () => {
      if (!currentUser) return;

      showTaskView('dashboard');

      setAlert(
        taskAlert,
        'Account security settings are coming in a later FocusCraft step!',
        'success'
      );
    });
  }


  // ---------- Initial dashboard ----------
  renderTasks();
  refreshIcons();
});