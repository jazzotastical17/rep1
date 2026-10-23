document.addEventListener('DOMContentLoaded', () => {
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
  const resetScreen = document.getElementById('reset-screen');
  const resetForm = document.getElementById('reset-form');
  const resetPassword = document.getElementById('reset-password');
  const resetConfirm = document.getElementById('reset-confirm');
  const resetAlert = document.getElementById('reset-alert');
  const resetSubmit = document.getElementById('reset-submit-btn');

  const authScreen = document.getElementById('auth-screen');
  const appScreen = document.getElementById('app-screen');
  const navBar = document.getElementById('nav-bar');
  const signOutBtn = document.getElementById('sign-out-btn');
  const userDisplayName = document.getElementById('user-display-name');
  const userAvatar = document.getElementById('user-avatar');
  const userAvatarFallback = document.getElementById('user-avatar-fallback');
  const welcomeName = document.getElementById('welcome-name');
  const welcomeAvatar = document.getElementById('welcome-avatar');

  const usernameScreen = document.getElementById('username-screen');
  const usernameForm = document.getElementById('username-form');
  const usernameInput = document.getElementById('username-input');
  const usernameBtn = document.getElementById('username-save-btn');
  const usernameAlert = document.getElementById('username-alert');
  const usernameSignOutBtn = document.getElementById('username-signout-btn');
  const addFileBtn = document.getElementById('bg-add-btn');
  const fileInput = document.getElementById('bg-file-input');
  const bgAlert = document.getElementById('bg-alert');
  const bgProgress = document.getElementById('bg-progress');
  const bgProgressBar = document.getElementById('bg-progress-bar');
  const bgProgressText = document.getElementById('bg-progress-text');
  const bgList = document.getElementById('bg-list');
  const bgRemoveBtn = document.getElementById('bg-remove-btn');

  // Same limits as the Supabase bucket (Place 1 here, Place 2 in the bucket settings)
  const BUCKET = 'decorations';
  const MAX_BYTES = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

  let isSignUp = false;
  let isPasswordRecovery = false;
  let currentUser = null;
  let currentBgPath = null;

  // Toggle between Sign In and Sign Up modes
  if (authToggleBtn) {
    authToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isSignUp = !isSignUp;
      authAlert.classList.add('hidden');
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

  // Handle Email & Password Login / Signup
  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
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
          const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: { emailRedirectTo: window.location.origin + window.location.pathname },
          });
          if (error) throw error;
          // With email confirmation off, Supabase signs the new user in right away
          // and onAuthStateChange shows the app. Otherwise ask them to sign in.
          if (!data.session) {
            showAlert('Check your email for a confirmation link before signing in. If you already have an account, use Sign In or Forgot password.', 'success');
          }
        } else {
          const { error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
          });
          if (error) throw error;
          // onAuthStateChange takes it from here (no page reload needed)
        }
      } catch (err) {
        showAlert(err.message || 'Authentication failed.', 'error');
      } finally {
        authSubmitBtn.disabled = false;
        authSubmitBtn.textContent = isSignUp ? 'Sign Up' : 'Sign In';
      }
    });
  }

  // Send a recovery link without revealing whether the email exists.
  if (forgotBtn) {
    forgotBtn.addEventListener('click', async () => {
      const email = authEmail.value.trim();
      if (!email) {
        showAlert('Enter your email address above, then click Forgot password again.', 'error');
        authEmail.focus();
        return;
      }
      forgotBtn.disabled = true;
      try {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + window.location.pathname,
        });
        if (error) throw error;
        showAlert('If this email has an account, a password reset link will arrive shortly. Check your inbox and spam folder.', 'success');
      } catch (err) {
        showAlert(err.message || 'Could not request a password reset.', 'error');
      } finally {
        forgotBtn.disabled = false;
      }
    });
  }

  if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (resetPassword.value.length < 6) {
        setAlert(resetAlert, 'Use a password with at least 6 characters.', 'error');
        return;
      }
      if (resetPassword.value !== resetConfirm.value) {
        setAlert(resetAlert, 'Passwords do not match.', 'error');
        return;
      }
      resetSubmit.disabled = true;
      try {
        const { error } = await supabaseClient.auth.updateUser({ password: resetPassword.value });
        if (error) throw error;
        isPasswordRecovery = false;
        resetScreen.classList.add('hidden');
        resetForm.reset();
        await supabaseClient.auth.signOut();
        showAlert('Password updated! Sign in using your new password.', 'success');
      } catch (err) {
        setAlert(resetAlert, err.message || 'Could not update password.', 'error');
      } finally {
        resetSubmit.disabled = false;
      }
    });
  }

  // Handle GitHub OAuth Button
  if (githubBtn) {
    githubBtn.addEventListener('click', async () => {
      githubBtn.disabled = true;
      try {
        const { error } = await supabaseClient.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: window.location.origin + window.location.pathname,
          },
        });
        if (error) throw error;
        // The browser is sent to GitHub, then back here, signed in.
      } catch (err) {
        showAlert(err.message || 'GitHub sign-in failed.', 'error');
        githubBtn.disabled = false;
      }
    });
  }

  // Handle Sign Out
  if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        showAlert(error.message || 'Sign out failed.', 'error');
      }
    });
  }

  // Get the best display name for a user: GitHub nickname first, then email
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

  // Get profile picture (GitHub avatar) if the user has one
  function getAvatarUrl(user) {
    const meta = user.user_metadata || {};
    return meta.avatar_url || meta.picture || '';
  }

  function showSignedIn(user, username) {
    const name = username || getDisplayName(user);
    const avatar = getAvatarUrl(user);

    userDisplayName.textContent = name;
    welcomeName.textContent = name;

    if (avatar) {
      userAvatar.src = avatar;
      userAvatar.classList.remove('hidden');
      userAvatarFallback.classList.add('hidden');
      welcomeAvatar.src = avatar;
      welcomeAvatar.classList.remove('hidden');
    } else {
      userAvatar.classList.add('hidden');
      userAvatarFallback.classList.remove('hidden');
      welcomeAvatar.classList.add('hidden');
    }

    authScreen.classList.add('hidden');
    usernameScreen.classList.add('hidden');
    navBar.classList.remove('hidden');
    appScreen.classList.remove('hidden');
  }

  function showSignedOut() {
    currentUser = null;
    currentBgPath = null;
    document.body.style.backgroundImage = '';
    usernameScreen.classList.add('hidden');
    navBar.classList.add('hidden');
    appScreen.classList.add('hidden');
    authScreen.classList.remove('hidden');
    if (githubBtn) githubBtn.disabled = false;
  }

  // Show the right screen whenever sign-in state changes (also runs on page load / refresh)
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') isPasswordRecovery = true;
    if (isPasswordRecovery && session) {
      currentUser = session.user;
      authScreen.classList.add('hidden');
      usernameScreen.classList.add('hidden');
      appScreen.classList.add('hidden');
      navBar.classList.add('hidden');
      resetScreen.classList.remove('hidden');
      if (window.location.hash || window.location.search) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      return;
    }
    if (session && session.user) {
      // Load once per sign-in (token refreshes fire this event too)
      if (!currentUser || currentUser.id !== session.user.id) {
        currentUser = session.user;
        setTimeout(() => loadUser(session.user), 0);
      }
      // Clean the sign-in tokens/codes out of the address bar after returning from GitHub
      if (window.location.hash || window.location.search) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } else {
      showSignedOut();
    }
  });

  // If GitHub sent us back with an error, show it on the page
  (function showReturnError() {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const message =
      params.get('error_description') || hashParams.get('error_description');
    if (message) {
      showAlert(message.replace(/\+/g, ' '), 'error');
    }
  })();

  function showAlert(message, type) {
    if (!authAlert) return;
    authAlert.textContent = message;
    authAlert.className = `alert ${type === 'error' ? 'alert-error' : 'alert-success'}`;
    authAlert.classList.remove('hidden');
  }

  // ---------- Username setup ----------
  function setAlert(el, message, type) {
    if (!el) return;
    if (!message) {
      el.className = 'alert hidden';
      return;
    }
    el.textContent = message;
    el.className = `alert ${type === 'error' ? 'alert-error' : 'alert-success'}`;
  }

  async function loadUser(user) {
    const { data: profile, error } = await supabaseClient
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .maybeSingle();
    // Ignore results from an earlier session after sign-out or account switch.
    if (!currentUser || currentUser.id !== user.id) return;
    if (error) {
      // A failed profile lookup must not bypass username setup.
      authScreen.classList.add('hidden');
      appScreen.classList.add('hidden');
      navBar.classList.add('hidden');
      usernameScreen.classList.remove('hidden');
      usernameInput.disabled = true;
      usernameBtn.disabled = true;
      setAlert(usernameAlert, 'Could not load your profile: ' + error.message + '. Please sign out and try again.', 'error');
      return;
    }
    usernameInput.disabled = false;
    usernameBtn.disabled = false;
    setAlert(usernameAlert, '');
    if (!profile) {
      authScreen.classList.add('hidden');
      appScreen.classList.add('hidden');
      navBar.classList.add('hidden');
      usernameScreen.classList.remove('hidden');
      usernameInput.focus();
      return;
    }
    showSignedIn(user, profile.username);
    await applySavedBackground();
    await loadBackgrounds();
  }

  if (usernameForm) {
    usernameForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = usernameInput.value.trim();
      if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) {
        setAlert(usernameAlert, 'Use 3 to 20 characters: letters, numbers and underscores only.', 'error');
        return;
      }
      usernameBtn.disabled = true;
      usernameBtn.textContent = 'Saving...';
      const { error } = await supabaseClient
        .from('profiles')
        .insert({ id: currentUser.id, username: username });
      usernameBtn.disabled = false;
      usernameBtn.textContent = 'Save username';
      if (error) {
        if (error.code === '23505') {
          setAlert(usernameAlert, 'That username is taken. Try another one.', 'error');
        } else {
          setAlert(usernameAlert, 'Could not save your username: ' + error.message, 'error');
        }
        return;
      }
      setAlert(usernameAlert, '');
      showSignedIn(currentUser, username);
      await applySavedBackground();
      await loadBackgrounds();
    });
  }

  if (usernameSignOutBtn) {
    usernameSignOutBtn.addEventListener('click', () => supabaseClient.auth.signOut());
  }

  // ---------- Backgrounds (private bucket, signed URLs) ----------
  function formatSize(bytes) {
    if (bytes === undefined || bytes === null) return '';
    if (bytes < 1024 * 1024) return Math.max(1, Math.round(bytes / 1024)) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  }

  async function getSignedUrl(path) {
    const { data, error } = await supabaseClient.storage.from(BUCKET).createSignedUrl(path, 3600);
    return error ? null : data.signedUrl;
  }

  function setBackground(path, url) {
    currentBgPath = path;
    document.body.style.backgroundImage = `url("${url}")`;
  }

  function clearBackground() {
    currentBgPath = null;
    document.body.style.backgroundImage = '';
  }

  async function applySavedBackground() {
    clearBackground();
    const { data } = await supabaseClient
      .from('user_settings')
      .select('background_image_url')
      .eq('user_id', currentUser.id)
      .limit(1);
    const path = data && data[0] && data[0].background_image_url;
    if (!path) return;
    const url = await getSignedUrl(path);
    if (url) setBackground(path, url);
  }

  // Saves the image's storage path (not the expiring link) in user_settings
  async function saveBackgroundSetting(path) {
    const { data: rows, error: findError } = await supabaseClient
      .from('user_settings')
      .select('id')
      .eq('user_id', currentUser.id)
      .limit(1);
    if (findError) return findError;
    const request = rows && rows.length
      ? supabaseClient.from('user_settings').update({ background_image_url: path }).eq('id', rows[0].id)
      : supabaseClient.from('user_settings').insert({ id: crypto.randomUUID(), user_id: currentUser.id, background_image_url: path });
    const { error } = await request;
    return error;
  }

  async function useBackground(path) {
    const url = await getSignedUrl(path);
    if (!url) {
      setAlert(bgAlert, 'Could not open that image. Try again.', 'error');
      return;
    }
    const error = await saveBackgroundSetting(path);
    if (error) {
      setAlert(bgAlert, 'Could not save your background: ' + error.message, 'error');
      return;
    }
    setBackground(path, url);
    setAlert(bgAlert, 'Background updated.', 'success');
    await loadBackgrounds();
  }

  async function removeBackground() {
    if (!currentBgPath) {
      setAlert(bgAlert, 'No background is set.', 'error');
      return;
    }
    const error = await saveBackgroundSetting(null);
    if (error) {
      setAlert(bgAlert, 'Could not remove your background: ' + error.message, 'error');
      return;
    }
    clearBackground();
    setAlert(bgAlert, 'Background removed.', 'success');
    await loadBackgrounds();
  }

  async function deleteBackground(path) {
    if (!confirm('Delete this image?')) return;
    const { data, error } = await supabaseClient.storage.from(BUCKET).remove([path]);
    if (error || !data || !data.length) {
      setAlert(bgAlert, error ? 'Could not delete that image: ' + error.message : 'Could not delete that image. The delete rule may be missing.', 'error');
      return;
    }
    if (path === currentBgPath) {
      await saveBackgroundSetting(null);
      clearBackground();
    }
    setAlert(bgAlert, 'Image deleted.', 'success');
    await loadBackgrounds();
  }

  async function loadBackgrounds() {
    const { data, error } = await supabaseClient.storage
      .from(BUCKET)
      .list(currentUser.id, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
    if (error) {
      setAlert(bgAlert, 'Could not load your images: ' + error.message, 'error');
      return;
    }
    const files = (data || []).filter((f) => f.id);
    bgList.innerHTML = '';
    if (!files.length) {
      bgList.innerHTML = '<p class="text-sm text-slate-500">No images yet. Click Add file to upload one.</p>';
      return;
    }
    const paths = files.map((f) => `${currentUser.id}/${f.name}`);
    const { data: signed } = await supabaseClient.storage.from(BUCKET).createSignedUrls(paths, 3600);

    files.forEach((f, i) => {
      const path = paths[i];
      const row = document.createElement('div');
      row.className = 'flex items-center gap-3 p-2 rounded-lg border border-slate-200 bg-white/70';

      const img = document.createElement('img');
      img.src = signed && signed[i] && signed[i].signedUrl ? signed[i].signedUrl : '';
      img.alt = '';
      img.className = 'w-16 h-12 rounded object-cover bg-slate-200 shrink-0';

      const info = document.createElement('div');
      info.className = 'flex-1 min-w-0';
      const name = document.createElement('p');
      name.className = 'text-sm font-semibold text-slate-800 truncate';
      name.textContent = f.name.replace(/^\d+-/, '');
      const meta = document.createElement('p');
      meta.className = 'text-xs text-slate-500';
      meta.textContent = formatSize(f.metadata && f.metadata.size) + (path === currentBgPath ? ' (in use)' : '');
      info.append(name, meta);

      const useBtn = document.createElement('button');
      useBtn.type = 'button';
      useBtn.className = 'btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold';
      useBtn.textContent = 'Use as background';
      useBtn.addEventListener('click', () => useBackground(path));

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => deleteBackground(path));

      row.append(img, info, useBtn, delBtn);
      bgList.appendChild(row);
    });
  }

  function setProgress(percent) {
    bgProgress.classList.remove('hidden');
    bgProgressBar.style.width = percent + '%';
    bgProgressText.textContent = percent + '%';
  }

  function uploadErrorText(xhr) {
    let msg = '';
    try { msg = JSON.parse(xhr.responseText).message || ''; } catch (e) { msg = ''; }
    if (xhr.status === 413 || /exceeded the maximum/i.test(msg)) return 'That file is too big. The limit is 5 MB.';
    if (/mime type/i.test(msg)) return 'That file type is not allowed. Use a JPG, PNG or GIF.';
    if (/row-level security/i.test(msg) || xhr.status === 403) return 'Upload blocked: the upload rule for your folder is missing or wrong.';
    if (/bucket not found/i.test(msg) || xhr.status === 404) return 'Bucket not found. Its name must be exactly "decorations".';
    return 'Upload failed' + (msg ? ': ' + msg : '. Try again.');
  }

  // XMLHttpRequest is used because it reports real upload progress
  async function uploadWithProgress(file, path) {
    const { data } = await supabaseClient.auth.getSession();
    if (!data.session) throw new Error('You are signed out. Please sign in again.');
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`);
      xhr.setRequestHeader('Authorization', `Bearer ${data.session.access_token}`);
      xhr.setRequestHeader('apikey', SUPABASE_ANON_KEY);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error(uploadErrorText(xhr)));
      };
      xhr.onerror = () => reject(new Error('Network problem. Check your internet and try again.'));
      const form = new FormData();
      form.append('cacheControl', '3600');
      form.append('', file);
      setProgress(0);
      xhr.send(form);
    });
  }

  if (addFileBtn) addFileBtn.addEventListener('click', () => fileInput.click());
  if (bgRemoveBtn) bgRemoveBtn.addEventListener('click', removeBackground);

  if (fileInput) {
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files[0];
      fileInput.value = '';
      if (!file) return;
      setAlert(bgAlert, '');
      if (!ALLOWED_TYPES.includes(file.type)) {
        setAlert(bgAlert, 'That file type is not allowed. Use a JPG, PNG or GIF.', 'error');
        return;
      }
      if (file.size > MAX_BYTES) {
        setAlert(bgAlert, `That file is ${formatSize(file.size)}. The limit is 5 MB.`, 'error');
        return;
      }
      const safeName = file.name.replace(/[^A-Za-z0-9._-]/g, '_');
      const path = `${currentUser.id}/${Date.now()}-${safeName}`;
      addFileBtn.disabled = true;
      try {
        await uploadWithProgress(file, path);
        setAlert(bgAlert, 'Image uploaded.', 'success');
        await loadBackgrounds();
      } catch (err) {
        setAlert(bgAlert, err.message, 'error');
      } finally {
        addFileBtn.disabled = false;
        bgProgress.classList.add('hidden');
      }
    });
  }
});