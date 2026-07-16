async function performLogout(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  try {
    // 1. Call the existing logout endpoint
    const response = await fetch('/auth/logout');
    if (!response.ok) {
      console.warn('Logout endpoint returned non-ok status:', response.status);
    }
  } catch (err) {
    console.error('Logout request failed:', err);
  }

  // 2. Clear all frontend authentication state
  localStorage.removeItem('is_logged_in');
  localStorage.removeItem('ev_wishlist_logged_in');
  sessionStorage.clear();

  // 3. Update the navbar immediately
  if (typeof window.updateAuthUI === 'function') {
    window.updateAuthUI(null);
  }

  // 4. Verify authentication status
  try {
    const meRes = await fetch('/api/auth/me');
    if (meRes.ok) {
      const meData = await meRes.json();
      if (meData.loggedIn && typeof window.updateAuthUI === 'function') {
        window.updateAuthUI(meData.user);
      } else if (typeof window.updateAuthUI === 'function') {
        window.updateAuthUI(null);
      }
    }
  } catch (e) {
    console.error('Auth check after logout failed:', e);
  }

  // 5. Redirect the user to the Home page
  window.location.href = '/';
}

window.performLogout = performLogout;
