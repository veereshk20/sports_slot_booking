document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/profile/data');
        if (response.ok) {
            const data = await response.json();
            document.getElementById('welcome-message').textContent = `Welcome, ${data.name}`;
            document.getElementById('profile-photo').src = data.photo;
            document.getElementById('profile-name').textContent = data.name;
            document.getElementById('profile-email').textContent = data.email;
            
            const tableBody = document.getElementById('subscriptions-table').querySelector('tbody');
            const info=data.info
            info.forEach(sub => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${sub.gname}</td>
                    <td>${sub.timing}</td>
                    <td>${sub.tname}</td>
                    <td>${sub.s_date}</td>
                    <td>${sub.e_date}</td>
                `;
                tableBody.appendChild(row);
            });


            
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
