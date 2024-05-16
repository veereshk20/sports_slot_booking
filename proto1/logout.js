document.addEventListener('DOMContentLoaded', async () => {
    const authBtn = document.getElementById('auth-btn');
    try {
        const response = await fetch('/check-auth');
        const data = await response.json();
        if (data.isAuthenticated) {
            authBtn.innerHTML = '<a href="/logout" class="signIn">Logout</a>';
        } else {
            authBtn.innerHTML = '<a href="/auth/google/" class="signIn">Sign In</a>';
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
    }
});
