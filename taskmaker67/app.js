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
          showAlert('Sign up successful! You can now sign in.', 'success');
        } else {
          const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
          });
          if (error) throw error;
          showAlert('Sign in successful!', 'success');
          location.reload();
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
      try {
        const { error } = await supabaseClient.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: window.location.href,
          },
        });
        if (error) throw error;
      } catch (err) {
        showAlert(err.message, 'error');
      }
    });
  }

  function showAlert(message, type) {
    if (!authAlert) return;
    authAlert.textContent = message;
    authAlert.className = `alert ${type === 'error' ? 'alert-error' : 'alert-success'}`;
    authAlert.classList.remove('hidden');
  }
});