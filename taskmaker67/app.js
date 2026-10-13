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

  const authScreen = document.getElementById('auth-screen');
  const appScreen = document.getElementById('app-screen');
  const navBar = document.getElementById('nav-bar');
  const signOutBtn = document.getElementById('sign-out-btn');
  const userDisplayName = document.getElementById('user-display-name');
  const userAvatar = document.getElementById('user-avatar');
  const userAvatarFallback = document.getElementById('user-avatar-fallback');
  const welcomeName = document.getElementById('welcome-name');
  const welcomeAvatar = document.getElementById('welcome-avatar');

  let isSignUp = false;

  // Toggle between Sign In and Sign Up modes
  if (authToggleBtn) {
    authToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isSignUp = !isSignUp;
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
          });
          if (error) throw error;
          // With email confirmation off, Supabase signs the new user in right away
          // and onAuthStateChange shows the app. Otherwise ask them to sign in.
          if (!data.session) {
            showAlert('Sign up successful! You can now sign in.', 'success');
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

  function showSignedIn(user) {
    const name = getDisplayName(user);
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
    navBar.classList.remove('hidden');
    appScreen.classList.remove('hidden');
  }

  function showSignedOut() {
    navBar.classList.add('hidden');
    appScreen.classList.add('hidden');
    authScreen.classList.remove('hidden');
    if (githubBtn) githubBtn.disabled = false;
  }

  // Show the right screen whenever sign-in state changes (also runs on page load / refresh)
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (session && session.user) {
      showSignedIn(session.user);
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
});