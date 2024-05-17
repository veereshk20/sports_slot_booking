document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/profile/data');
        if (response.ok) {
            const data = await response.json();
            document.getElementById('welcome-message').textContent = `Welcome, ${data.name}`;
            document.getElementById('profile-photo').src = data.photo;
            document.getElementById('profile-name').textContent = data.name;
            document.getElementById('profile-email').textContent = data.email;
            document.getElementById('profile-time').textContent = data.timing;
            
            if (data.name !== 'Guest') {
                document.getElementById('auth-btn').innerHTML = '<a href="/logout" class="signOut">Logout</a>';
            } else {
                document.getElementById('auth-btn').innerHTML = '<a href="/auth/google/" class="signIn">Sign In</a>';
            }
        } else {
            console.error('Failed to fetch profile data');
        }
    } catch (error) {
        console.error('Error fetching profile data:', error);
    }
});

function changePhNo(){
    
}
