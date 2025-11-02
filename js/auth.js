function checkAuth() {
    const admin = localStorage.getItem('adminUser');
    if (!admin) {
        window.location.href = '/index.html';
        return null;
    }
    
    const adminUser = JSON.parse(admin);
    document.getElementById('adminName').textContent = adminUser.username;
    return adminUser;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminUser');
        localStorage.removeItem('loginTime');
        window.location.href = '/index.html';
    }
}

// Check auth on page load
window.addEventListener('load', () => {
    if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
        checkAuth();
    }
});
